import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuItemCard } from "@/components/menu-item-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories, getMenuItemsByCategory, getExtras } from "@/lib/menu-service"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

async function CategoryContent({ categorySlug }: { categorySlug: string }) {
  const [categories, menuItems, extras] = await Promise.all([
    getCategories(),
    getMenuItemsByCategory(categorySlug),
    getExtras(),
  ])

  const category = categories.find((c) => c.slug === categorySlug)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">{category.description}</p>
        )}
        <Badge variant="outline">{menuItems.length} items available</Badge>
      </div>

      {menuItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No items available in this category at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} extras={extras} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-32 mx-auto" />
      </div>

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
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryContent categorySlug={category} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
