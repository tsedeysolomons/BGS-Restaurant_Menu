import { createClient } from "@/lib/supabase/server"
import type { Category, MenuItem, Extra } from "@/lib/types"

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("is_available", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching menu items:", error)
    return []
  }

  return data || []
}

export async function getMenuItemsByCategory(categorySlug: string): Promise<MenuItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("is_available", true)
    .eq("categories.slug", categorySlug)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching menu items by category:", error)
    return []
  }

  return data || []
}

export async function getFastingMenuItems(): Promise<MenuItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("is_available", true)
    .eq("is_fasting", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching fasting menu items:", error)
    return []
  }

  return data || []
}

export async function getExtras(): Promise<Extra[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("extras")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching extras:", error)
    return []
  }

  return data || []
}

export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("is_available", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error searching menu items:", error)
    return []
  }

  return data || []
}

export interface MenuFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  isFasting?: boolean
  isAvailable?: boolean
}

export async function getFilteredMenuItems(query?: string, filters?: MenuFilters): Promise<MenuItem[]> {
  const supabase = await createClient()

  let queryBuilder = supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("is_available", filters?.isAvailable ?? true)

  // Apply text search
  if (query && query.trim()) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  // Apply category filter
  if (filters?.category) {
    queryBuilder = queryBuilder.eq("categories.slug", filters.category)
  }

  // Apply fasting filter
  if (filters?.isFasting !== undefined) {
    queryBuilder = queryBuilder.eq("is_fasting", filters.isFasting)
  }

  // Apply price range filters
  if (filters?.minPrice !== undefined) {
    queryBuilder = queryBuilder.gte("price", filters.minPrice)
  }

  if (filters?.maxPrice !== undefined) {
    queryBuilder = queryBuilder.lte("price", filters.maxPrice)
  }

  queryBuilder = queryBuilder.order("sort_order", { ascending: true })

  const { data, error } = await queryBuilder

  if (error) {
    console.error("Error fetching filtered menu items:", error)
    return []
  }

  return data || []
}

export async function getMenuItemStats(): Promise<{
  totalItems: number
  priceRange: { min: number; max: number }
  fastingItemsCount: number
}> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("menu_items").select("price, is_fasting").eq("is_available", true)

  if (error || !data) {
    console.error("Error fetching menu stats:", error)
    return {
      totalItems: 0,
      priceRange: { min: 0, max: 1000 },
      fastingItemsCount: 0,
    }
  }

  const prices = data.map((item) => item.price)
  const fastingItems = data.filter((item) => item.is_fasting)

  return {
    totalItems: data.length,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    fastingItemsCount: fastingItems.length,
  }
}
