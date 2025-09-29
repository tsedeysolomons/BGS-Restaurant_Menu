"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils/format"
import type { Category } from "@/lib/types"
import type { MenuFilters as MenuFiltersType } from "@/lib/menu-service"

interface MenuFiltersProps {
  categories: Category[]
  priceRange: { min: number; max: number }
  fastingItemsCount: number
  totalItems: number
  currentFilters: MenuFiltersType
  onFiltersChange: (filters: MenuFiltersType) => void
  resultsCount: number
}

export function MenuFiltersComponent({
  categories,
  priceRange,
  fastingItemsCount,
  totalItems,
  currentFilters,
  onFiltersChange,
  resultsCount,
}: MenuFiltersProps) {
  const [localFilters, setLocalFilters] = useState<MenuFiltersType>(currentFilters)
  const [priceValues, setPriceValues] = useState([
    currentFilters.minPrice ?? priceRange.min,
    currentFilters.maxPrice ?? priceRange.max,
  ])

  useEffect(() => {
    setLocalFilters(currentFilters)
    setPriceValues([currentFilters.minPrice ?? priceRange.min, currentFilters.maxPrice ?? priceRange.max])
  }, [currentFilters, priceRange])

  const handleFilterChange = (key: keyof MenuFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceValues(values)
    const newFilters = {
      ...localFilters,
      minPrice: values[0],
      maxPrice: values[1],
    }
    setLocalFilters(newFilters)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
  }

  const clearFilters = () => {
    const clearedFilters: MenuFiltersType = {}
    setLocalFilters(clearedFilters)
    setPriceValues([priceRange.min, priceRange.max])
    onFiltersChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.category) count++
    if (localFilters.isFasting !== undefined) count++
    if (localFilters.minPrice !== undefined || localFilters.maxPrice !== undefined) count++
    return count
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {resultsCount} of {totalItems} items
      </div>

      {/* Category Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Category</Label>
        <Select
          value={localFilters.category || "all"}
          onValueChange={(value) => handleFilterChange("category", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dietary Preferences */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Dietary Preferences</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fasting"
              checked={localFilters.isFasting === true}
              onCheckedChange={(checked) => handleFilterChange("isFasting", checked ? true : undefined)}
            />
            <Label htmlFor="fasting" className="text-sm">
              Fasting/Vegetarian ({fastingItemsCount} items)
            </Label>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Price Range: {formatPrice(priceValues[0])} - {formatPrice(priceValues[1])}
        </Label>
        <div className="px-2">
          <Slider
            value={priceValues}
            onValueChange={handlePriceChange}
            min={priceRange.min}
            max={priceRange.max}
            step={10}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatPrice(priceRange.min)}</span>
          <span>{formatPrice(priceRange.max)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={clearFilters} className="bg-transparent">
          Clear
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filter Menu Items</SheetTitle>
              <SheetDescription>Narrow down your search to find exactly what you're looking for.</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
