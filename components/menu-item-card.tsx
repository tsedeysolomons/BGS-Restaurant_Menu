"use client"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/utils/format"
import type { MenuItem, Extra, CartExtra } from "@/lib/types"

interface MenuItemCardProps {
  item: MenuItem
  extras?: Extra[]
}

export function MenuItemCard({ item, extras = [] }: MenuItemCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<CartExtra[]>([])
  const { addItem } = useCart()

  const handleExtraChange = (extra: Extra, checked: boolean) => {
    if (checked) {
      setSelectedExtras((prev) => [...prev, { extra, quantity: 1 }])
    } else {
      setSelectedExtras((prev) => prev.filter((e) => e.extra.id !== extra.id))
    }
  }

  const handleExtraQuantityChange = (extraId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedExtras((prev) => prev.filter((e) => e.extra.id !== extraId))
    } else {
      setSelectedExtras((prev) => prev.map((e) => (e.extra.id === extraId ? { ...e, quantity: newQuantity } : e)))
    }
  }

  const calculateTotal = () => {
    const itemTotal = item.price * quantity
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.extra.price * extra.quantity, 0)
    return itemTotal + extrasTotal
  }

  const handleAddToCart = () => {
    addItem(item, quantity, selectedExtras)
    setIsDialogOpen(false)
    setQuantity(1)
    setSelectedExtras([])
  }

  const quickAddToCart = () => {
    addItem(item, 1, [])
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-3 overflow-hidden">
            {item.image_url ? (
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl text-primary/40">🍽️</span>
              </div>
            )}
          </div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{item.name}</CardTitle>
              {item.description && (
                <CardDescription className="mt-1 text-sm line-clamp-2">{item.description}</CardDescription>
              )}
            </div>
            {item.is_fasting && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Fasting
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">{formatPrice(item.price)}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={quickAddToCart} className="bg-transparent">
                <Plus className="h-4 w-4" />
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Customize</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                    <DialogDescription>
                      {item.description && <span className="block mb-2">{item.description}</span>}
                      <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Quantity */}
                    <div>
                      <Label className="text-sm font-medium">Quantity</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Extras */}
                    {extras.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Add Extras</Label>
                        <div className="space-y-3 mt-2">
                          {extras.map((extra) => {
                            const selectedExtra = selectedExtras.find((e) => e.extra.id === extra.id)
                            const isSelected = !!selectedExtra

                            return (
                              <div key={extra.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={extra.id}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => handleExtraChange(extra, checked as boolean)}
                                  />
                                  <Label htmlFor={extra.id} className="text-sm">
                                    {extra.name} (+{formatPrice(extra.price)})
                                  </Label>
                                </div>
                                {isSelected && (
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleExtraQuantityChange(extra.id, (selectedExtra?.quantity || 1) - 1)
                                      }
                                      disabled={(selectedExtra?.quantity || 1) <= 1}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm">{selectedExtra?.quantity || 1}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleExtraQuantityChange(extra.id, (selectedExtra?.quantity || 1) + 1)
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Total and Add to Cart */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Total:</span>
                        <span className="text-xl font-bold text-primary">{formatPrice(calculateTotal())}</span>
                      </div>
                      <Button onClick={handleAddToCart} className="w-full">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
