import { MapPin, Phone, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">BGS Restaurant</h3>
            <p className="text-muted-foreground mb-4">
              Authentic Ethiopian and Middle Eastern cuisine. Experience the rich flavors of traditional dishes made
              with fresh ingredients and time-honored recipes.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">+251 911 123 456</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">Opening Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div>Mon - Sun: 8:00 AM - 11:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 BGS Restaurant. All rights reserved. | All prices include 15% VAT</p>
        </div>
      </div>
    </footer>
  )
}
