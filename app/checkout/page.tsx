"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Clock, MapPin, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/utils/format"
import type { CreateOrderData } from "@/lib/order-service"

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    orderType: "dine-in" as "dine-in" | "takeaway",
    notes: "",
  })

  const taxRate = 0.15 // 15% VAT
  const subtotal = state.total / (1 + taxRate)
  const taxAmount = state.total - subtotal

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData: CreateOrderData = {
        customerName: formData.customerName || undefined,
        customerPhone: formData.customerPhone || undefined,
        orderType: formData.orderType,
        items: state.items,
        notes: formData.notes || undefined,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const { order } = await response.json()

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/order-success?orderNumber=${order.order_number}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Redirect to cart if empty
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
              <Button asChild>
                <Link href="/menu">Browse Menu</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Type */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.orderType}
                      onValueChange={(value) => handleInputChange("orderType", value)}
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="dine-in" id="dine-in" />
                        <Label htmlFor="dine-in" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Utensils className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Dine-In</div>
                              <div className="text-sm text-muted-foreground">Enjoy your meal at our restaurant</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="takeaway" id="takeaway" />
                        <Label htmlFor="takeaway" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Takeaway</div>
                              <div className="text-sm text-muted-foreground">Pick up your order to go</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">Name (Optional)</Label>
                        <Input
                          id="customerName"
                          type="text"
                          placeholder="Your name"
                          value={formData.customerName}
                          onChange={(e) => handleInputChange("customerName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          placeholder="+251 911 123 456"
                          value={formData.customerPhone}
                          onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special requests or dietary requirements..."
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Restaurant Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Restaurant Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">BGS Restaurant</div>
                          <div className="text-sm text-muted-foreground">Addis Ababa, Ethiopia</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Opening Hours</div>
                          <div className="text-sm text-muted-foreground">Mon - Sun: 8:00 AM - 11:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {state.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex-shrink-0 overflow-hidden">
                            {item.menuItem.image_url ? (
                              <img
                                src={item.menuItem.image_url || "/placeholder.svg"}
                                alt={item.menuItem.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-lg">🍽️</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-sm leading-tight">{item.menuItem.name}</h4>
                                {item.menuItem.is_fasting && (
                                  <Badge variant="secondary" className="mt-1 text-xs bg-green-100 text-green-800">
                                    Fasting
                                  </Badge>
                                )}
                                {item.selectedExtras.length > 0 && (
                                  <div className="mt-1">
                                    {item.selectedExtras.map((extra, index) => (
                                      <div key={index} className="text-xs text-muted-foreground">
                                        + {extra.extra.name} x{extra.quantity}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{formatPrice(item.totalPrice)}</div>
                                <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>VAT (15%)</span>
                        <span>{formatPrice(taxAmount)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(state.total)}</span>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>{state.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                    </div>

                    {/* Place Order Button */}
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Placing Order..." : "Place Order"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By placing this order, you agree to our terms and conditions. All prices include 15% VAT.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
