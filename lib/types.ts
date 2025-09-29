export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  is_available: boolean
  is_fasting: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface Extra {
  id: string
  name: string
  price: number
  is_active: boolean
  created_at: string
}

export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  selectedExtras: CartExtra[]
  totalPrice: number
}

export interface CartExtra {
  extra: Extra
  quantity: number
}

export interface Order {
  id: string
  order_number: string
  customer_name?: string
  customer_phone?: string
  order_type: "dine-in" | "takeaway"
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  subtotal: number
  tax_amount: number
  total_amount: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  menu_item?: MenuItem
  extras?: OrderItemExtra[]
}

export interface OrderItemExtra {
  id: string
  order_item_id: string
  extra_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  extra?: Extra
}
