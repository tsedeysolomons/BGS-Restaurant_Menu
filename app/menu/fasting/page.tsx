import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuItemCard } from "@/components/menu-item-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getFastingMenuItems, getExtras } from "@/lib/menu-service"

async function FastingMenuContent() {
  const [fastingItems, extras] = await Promise.all([getFastingMenuItems(), getExtras()])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
          Vegetarian & Vegan Options
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Fasting Menu</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          Delicious plant-based dishes perfect for fasting periods and vegetarian diets. All items are prepared without
          meat or dairy products.
        </p>
        <Badge variant="outline">{fastingItems.length} fasting items available</Badge>
      </div>

      {fastingItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No fasting menu items available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fastingItems.map((item) => (
            <MenuItemCard key={item.id} item={item} extras={extras} />
          ))}
        </div>
      )}
    </div>
  )
}

function FastingMenuSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Skeleton className="h-6 w-48 mx-auto mb-4" />
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

export default function FastingMenuPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<FastingMenuSkeleton />}>
          <FastingMenuContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
