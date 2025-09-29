import { type NextRequest, NextResponse } from "next/server"
import { getOrder } from "@/lib/order-service"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const order = await getOrder(id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error in GET /api/orders/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
