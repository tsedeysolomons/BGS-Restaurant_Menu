import { createClient } from "@/lib/supabase/client"
import { generateOrderNumber } from "@/lib/utils/format"
import type { CartItem, Order } from "@/lib/types"

export interface CreateOrderData {
  customerName?: string
  customerPhone?: string
  orderType: "dine-in" | "takeaway"
  items: CartItem[]
  notes?: string
}

export async function createOrder(
  orderData: CreateOrderData,
): Promise<{ order: Order; success: boolean; error?: string }> {
  const supabase = createClient()

  try {
    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => {
      const itemTotal = item.menuItem.price * item.quantity
      const extrasTotal = item.selectedExtras.reduce(
        (extraSum, extra) => extraSum + extra.extra.price * extra.quantity,
        0,
      )
      return sum + itemTotal + extrasTotal
    }, 0)

    const taxRate = 0.15 // 15% VAT
    const taxAmount = subtotal * taxRate
    const totalAmount = subtotal + taxAmount

    // Create order
    const orderNumber = generateOrderNumber()
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        order_type: orderData.orderType,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        notes: orderData.notes,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { order: {} as Order, success: false, error: "Failed to create order" }
    }

    // Create order items
    for (const cartItem of orderData.items) {
      const itemTotal = cartItem.menuItem.price * cartItem.quantity
      const { data: orderItem, error: orderItemError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          menu_item_id: cartItem.menuItem.id,
          quantity: cartItem.quantity,
          unit_price: cartItem.menuItem.price,
          total_price: itemTotal,
        })
        .select()
        .single()

      if (orderItemError) {
        console.error("Error creating order item:", orderItemError)
        continue
      }

      // Create order item extras
      for (const extra of cartItem.selectedExtras) {
        const extraTotal = extra.extra.price * extra.quantity
        const { error: extraError } = await supabase.from("order_item_extras").insert({
          order_item_id: orderItem.id,
          extra_id: extra.extra.id,
          quantity: extra.quantity,
          unit_price: extra.extra.price,
          total_price: extraTotal,
        })

        if (extraError) {
          console.error("Error creating order item extra:", extraError)
        }
      }
    }

    return { order, success: true }
  } catch (error) {
    console.error("Error in createOrder:", error)
    return { order: {} as Order, success: false, error: "An unexpected error occurred" }
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items:order_items(
        *,
        menu_item:menu_items(*),
        extras:order_item_extras(
          *,
          extra:extras(*)
        )
      )
    `)
    .eq("id", orderId)
    .single()

  if (error) {
    console.error("Error fetching order:", error)
    return null
  }

  return data
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items:order_items(
        *,
        menu_item:menu_items(*),
        extras:order_item_extras(
          *,
          extra:extras(*)
        )
      )
    `)
    .eq("order_number", orderNumber)
    .single()

  if (error) {
    console.error("Error fetching order by number:", error)
    return null
  }

  return data
}
