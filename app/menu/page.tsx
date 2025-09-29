import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuItemCard } from "@/components/menu-item-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories, getMenuItems, getExtras } from "@/lib/menu-service"

async function MenuContent() {
  const [categories, menuItems, extras] = await Promise.all([getCategories(), getMenuItems(), getExtras()])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Complete Menu</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our full range of authentic Ethiopian and Middle Eastern dishes. All prices include 15% VAT.
        </p>
      </div>

      {categories.map((category) => {
        const categoryItems = menuItems.filter((item) => item.category_id === category.id)

        if (categoryItems.length === 0) return null

        return (
          <section key={category.id} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">{category.name}</h2>
              <Badge variant="outline">{categoryItems.length} items</Badge>
            </div>
            {category.description && <p className="text-muted-foreground mb-6 max-w-3xl">{category.description}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item) => (
                <MenuItemCard key={item.id} item={item} extras={extras} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function MenuSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {[1, 2, 3].map((section) => (
        <section key={section} className="mb-12">
          <Skeleton className="h-8 w-48 mb-6" />
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
        </section>
      ))}
    </div>
  )
}

export default function MenuPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<MenuSkeleton />}>
          <MenuContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
