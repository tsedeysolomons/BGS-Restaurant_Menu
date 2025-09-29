import Link from "next/link"
import { ArrowRight, Utensils, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                Authentic Ethiopian & Middle Eastern Cuisine
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Welcome to <span className="text-primary">BGS Restaurant</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
                Experience the rich flavors of traditional Ethiopian and Middle Eastern dishes. From our signature
                shawarma to authentic chicken specialties, every meal is crafted with passion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/menu">
                    View Full Menu <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  <Link href="/menu/fasting">Fasting Menu</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Menu Categories</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our diverse selection of authentic dishes, each prepared with traditional recipes and fresh
                ingredients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Shawarma */}
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src="/delicious-shawarma-wrap-with-meat-and-vegetables.jpg"
                      alt="Shawarma"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Shawarma</CardTitle>
                  <CardDescription>
                    Our signature shawarma wraps and platters, made with premium ingredients and special sauces.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/menu/shawarma">View Shawarma Menu</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Chicken Dishes */}
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src="/grilled-chicken-dish-with-ethiopian-spices-and-veg.jpg"
                      alt="Chicken Dishes"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Chicken Dishes</CardTitle>
                  <CardDescription>
                    Traditional Ethiopian chicken specialties, grilled and roasted to perfection with authentic spices.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/menu/chicken-dishes">View Chicken Menu</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Fasting Menu */}
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src="/colorful-vegetarian-ethiopian-fasting-food-with-ve.jpg"
                      alt="Fasting Menu"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Fasting Menu</CardTitle>
                  <CardDescription>
                    Delicious vegetarian and vegan options, perfect for fasting periods and plant-based diets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/menu/fasting">View Fasting Menu</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Drinks & Juices */}
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src="/fresh-fruit-juices-and-traditional-drinks-in-glass.jpg"
                      alt="Drinks & Juices"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Drinks & Juices</CardTitle>
                  <CardDescription>
                    Fresh fruit juices, traditional mojitos, and refreshing beverages to complement your meal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/menu/drinks-juices">View Drinks Menu</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Dine-in Experience */}
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <Utensils className="h-16 w-16 text-primary/60" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Dine-In Experience</CardTitle>
                  <CardDescription>
                    Enjoy our warm hospitality and authentic atmosphere in our comfortable dining space.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/menu">Order for Dine-In</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Takeaway */}
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <Clock className="h-16 w-16 text-primary/60" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">Quick Takeaway</CardTitle>
                  <CardDescription>
                    Order ahead for quick pickup. Perfect for busy schedules without compromising on quality.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/menu">Order Takeaway</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BGS Restaurant?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Authentic Recipes</h3>
                <p className="text-muted-foreground">
                  Traditional recipes passed down through generations, prepared with authentic spices and techniques.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fresh Daily</h3>
                <p className="text-muted-foreground">
                  All dishes prepared fresh daily using the finest ingredients and traditional cooking methods.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Convenient Location</h3>
                <p className="text-muted-foreground">
                  Located in the heart of Addis Ababa with both dine-in and takeaway options available.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
