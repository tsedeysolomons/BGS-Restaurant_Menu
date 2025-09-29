"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuItemCard } from "@/components/menu-item-card"
import { MenuFilters } from "@/components/menu-filters"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories, getFilteredMenuItems, getExtras, getMenuItemStats } from "@/lib/menu-service"
import type { Category, MenuItem, Extra } from "@/lib/types"
import type { MenuFilters as MenuFiltersType } from "@/lib/menu-service"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [extras, setExtras] = useState<Extra[]>([])
  const [filters, setFilters] = useState<MenuFiltersType>({})
  const [stats, setStats] = useState({
    totalItems: 0,
    priceRange: { min: 0, max: 1000 },
    fastingItemsCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  const loadInitialData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [categoriesData, extrasData, statsData] = await Promise.all([
        getCategories(),
        getExtras(),
        getMenuItemStats(),
      ])

      setCategories(categoriesData)
      setExtras(extrasData)
      setStats(statsData)

      // Load initial search results
      const menuItemsData = await getFilteredMenuItems(initialQuery, filters)
      setMenuItems(menuItemsData)
    } catch (error) {
      console.error("Error loading initial data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [initialQuery, filters])

  const performSearch = useCallback(async (query: string, searchFilters: MenuFiltersType) => {
    setIsSearching(true)
    try {
      const menuItemsData = await getFilteredMenuItems(query, searchFilters)
      setMenuItems(menuItemsData)
    } catch (error) {
      console.error("Error performing search:", error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery, filters)
  }

  const handleFiltersChange = (newFilters: MenuFiltersType) => {
    setFilters(newFilters)
    performSearch(searchQuery, newFilters)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto mb-4" />
              <Skeleton className="h-10 w-full max-w-md mx-auto" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="border rounded-lg p-4">
                      <Skeleton className="h-48 w-full mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Search Menu</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Find your favorite dishes using our advanced search and filters
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-20"
                />
                <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  Search
                </Button>
              </div>
            </form>

            {/* Results Summary */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {searchQuery && <Badge variant="outline">Results for "{searchQuery}"</Badge>}
              <Badge variant="secondary">{isSearching ? "Searching..." : `${menuItems.length} items found`}</Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <MenuFilters
                categories={categories}
                priceRange={stats.priceRange}
                fastingItemsCount={stats.fastingItemsCount}
                totalItems={stats.totalItems}
                currentFilters={filters}
                onFiltersChange={handleFiltersChange}
                resultsCount={menuItems.length}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {isSearching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="border rounded-lg p-4">
                      <Skeleton className="h-48 w-full mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground mb-4">
                    {searchQuery || Object.keys(filters).length > 0
                      ? "No items found matching your search criteria."
                      : "Enter a search term or use filters to find menu items."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setFilters({})
                      performSearch("", {})
                    }}
                    className="bg-transparent"
                  >
                    Clear Search & Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} extras={extras} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
