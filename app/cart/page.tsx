"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/utils/format"

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = async () => {
    setIsClearing(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay for UX
    clearCart()
    setIsClearing(false)
  }

  const taxRate = 0.15 // 15% VAT
  const subtotal = state.total / (1 + taxRate) // Calculate subtotal before tax
  const taxAmount = state.total - subtotal

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">Add some delicious items from our menu to get started.</p>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <Button variant="outline" onClick={handleClearCart} disabled={isClearing} className="bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Clearing..." : "Clear Cart"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.menuItem.image_url ? (
                          <img
                            src={item.menuItem.image_url || "/placeholder.svg"}
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl">🍽️</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.menuItem.name}</h3>
                            {item.menuItem.description && (
                              <p className="text-sm text-muted-foreground mt-1">{item.menuItem.description}</p>
                            )}
                            {item.menuItem.is_fasting && (
                              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                                Fasting
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Extras */}
                        {item.selectedExtras.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Extras:</p>
                            <div className="space-y-1">
                              {item.selectedExtras.map((extra, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span>
                                    {extra.extra.name} x{extra.quantity}
                                  </span>
                                  <span>{formatPrice(extra.extra.price * extra.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatPrice(item.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (15%)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(state.total)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{state.items.reduce((sum, item) => sum + item.quantity, 0)} items in cart</p>
                  </div>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/menu">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
