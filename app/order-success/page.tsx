import { Suspense } from "react"
import Link from "next/link"
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getOrderByNumber } from "@/lib/order-service"
import { formatPrice } from "@/lib/utils/format"
import { Label } from "@/components/ui/label"

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>
}

async function OrderSuccessContent({ orderNumber }: { orderNumber: string }) {
  const order = await getOrderByNumber(orderNumber)

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find an order with that number.</p>
        <Button asChild>
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-lg text-muted-foreground">Thank you for your order. We're preparing it now.</p>
      </div>

      {/* Order Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {order.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Order Number</Label>
              <p className="font-mono text-lg font-bold">{order.order_number}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Order Type</Label>
              <p className="capitalize">{order.order_type}</p>
            </div>
            {order.customer_name && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                <p>{order.customer_name}</p>
              </div>
            )}
            {order.customer_phone && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                <p>{order.customer_phone}</p>
              </div>
            )}
          </div>

          {order.notes && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Special Instructions</Label>
              <p className="text-sm bg-muted p-3 rounded-lg mt-1">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items?.map((orderItem) => (
              <div key={orderItem.id} className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex-shrink-0 overflow-hidden">
                  {orderItem.menu_item?.image_url ? (
                    <img
                      src={orderItem.menu_item.image_url || "/placeholder.svg"}
                      alt={orderItem.menu_item.name}
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
                      <h4 className="font-medium">{orderItem.menu_item?.name}</h4>
                      {orderItem.menu_item?.description && (
                        <p className="text-sm text-muted-foreground mt-1">{orderItem.menu_item.description}</p>
                      )}
                      {orderItem.menu_item?.is_fasting && (
                        <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                          Fasting
                        </Badge>
                      )}
                      {orderItem.extras && orderItem.extras.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-muted-foreground">Extras:</p>
                          {orderItem.extras.map((extra) => (
                            <div key={extra.id} className="text-sm text-muted-foreground">
                              + {extra.extra?.name} x{extra.quantity} ({formatPrice(extra.total_price)})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(orderItem.total_price)}</p>
                      <p className="text-sm text-muted-foreground">Qty: {orderItem.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (15%)</span>
              <span>{formatPrice(order.tax_amount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_type === "dine-in" ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Visit Our Restaurant</h4>
                  <p className="text-sm text-muted-foreground">
                    Please come to BGS Restaurant and show your order number to our staff. Your table will be ready
                    shortly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Pickup Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order will be ready for pickup in approximately 15-20 minutes. Please bring your order number.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Contact Us</h4>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about your order, please call us at +251 911 123 456.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/menu">Order Again</Link>
        </Button>
        <Button variant="outline" asChild className="bg-transparent">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { orderNumber } = await searchParams

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {orderNumber ? (
            <Suspense
              fallback={
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading order details...</p>
                </div>
              }
            >
              <OrderSuccessContent orderNumber={orderNumber} />
            </Suspense>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Invalid Order</h2>
              <p className="text-muted-foreground mb-6">No order number provided.</p>
              <Button asChild>
                <Link href="/menu">Browse Menu</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
