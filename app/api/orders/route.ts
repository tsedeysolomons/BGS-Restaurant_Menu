import { type NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/order-service"
import type { CreateOrderData } from "@/lib/order-service"

export async function POST(request: NextRequest) {
  try {
    const orderData: CreateOrderData = await request.json()

    // Validate required fields
    if (!orderData.orderType || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await createOrder(orderData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ order: result.order }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
