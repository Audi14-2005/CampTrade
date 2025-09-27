"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { Chatbot } from "@/components/chatbot"
import HomepageDescriptions from "@/components/homepage-descriptions"
import { Product } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function LandingPage() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const { user, groupName } = useAuth()

  useEffect(() => {
    // Use static sample data for homepage
    setProducts(getSampleProducts())
    setLoading(false)
  }, [])

  const getSampleProducts = (): Product[] => [
    {
      id: "1",
      name: "Spiral Notebooks",
      price: 40, // Realistic INR price
      description: "High-quality spiral notebooks perfect for students. 200 pages per notebook with ruled pages and durable covers.",
      image: "/images/home-sample-1.png",
      category: "Stationery & Books",
      seller: "StudyMax",
      recommended: true,
      brand: "StudyMax",
      model: "SM-NB300",
      condition: "New",
      location: "Campus Store"
    },
    {
      id: "2",
      name: "Compact Electric Iron",
      price: 699, // Realistic INR price
      description: "1200W powerful iron with ceramic soleplate, temperature control, and auto shut-off safety feature.",
      image: "/images/home-sample-2.png",
      category: "Home & Kitchen Appliances",
      seller: "HomeTech",
      recommended: false,
      brand: "HomeTech",
      model: "HT-IR1200",
      condition: "New",
      location: "Electronics Store"
    },
    {
      id: "3",
      name: "Electric Kettle",
      price: 299, // Realistic INR price
      description: "1.5L stainless steel electric kettle with rapid boiling, auto shut-off, and boil-dry protection.",
      image: "/images/home-sample-3.png",
      category: "Kitchen Appliances",
      seller: "QuickBoil",
      recommended: true,
      brand: "QuickBoil",
      model: "QB-EK1500",
      condition: "New",
      location: "Kitchen Store"
    },
    {
      id: "4",
      name: "Architecture Tools Kit",
      price: 200, // Realistic INR price
      description: "Complete 15-piece drafting set with compass, set squares, protractor, and mechanical pencils.",
      image: "/images/home-sample-4.png",
      category: "Academic & Professional Tools",
      seller: "DraftPro",
      recommended: false,
      brand: "DraftPro",
      model: "DP-ARCH-KIT",
      condition: "New",
      location: "Academic Store"
    }
  ]

  const toggleProduct = (index: number) => {
    setSelectedProduct(selectedProduct === index ? null : index)
  }

  return (
    <main className="min-h-dvh flex flex-col relative">
      <AnimatedBackground />
      <header className="hidden relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl">
            CampTrade
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/browse" className="underline underline-offset-4">
              Browse
            </Link>
            <Link href="/seller/home" className="underline underline-offset-4">
              Seller
            </Link>
            <Link href="/login">
              <Button variant="default">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex-1 relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-balance">
              {user ? `Welcome back, ${user.email.split('@')[0]}!` : "Buy, sell, and swap items on campus"}
            </h1>
            <p className="text-muted-foreground text-pretty">
              {user ? (
                <>
                  You belong to the <span className="font-semibold text-primary">{groupName}</span> group.
                  Find personalized recommendations and connect with your campus community.
                </>
              ) : (
                "Find textbooks, electronics, clothes and more from trusted students. Smooth, app-like experience with a secure checkout."
              )}
            </p>
            <div className="flex gap-3">
              <Link href="/browse">
                <Button>Start Browsing</Button>
              </Link>
              <Link href="/seller/products/new">
                <Button variant="secondary">List an Item</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 shadow-lg"
          >
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-lg border bg-background/60 backdrop-blur-sm p-3 animate-pulse">
                    <div className="aspect-video w-full rounded-md bg-muted mb-3"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                products.map((item, i) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border backdrop-blur-sm p-3 hover:bg-background/80 transition-colors relative ${item.recommended
                      ? 'bg-gradient-to-br from-yellow-50/20 to-orange-50/20 border-yellow-200/50'
                      : 'bg-background/60'
                      }`}
                  >
                    {item.recommended && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    )}

                    <div
                      className="aspect-video w-full rounded-md bg-muted mb-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => toggleProduct(i)}
                    >
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {item.name}
                          {item.recommended && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{item.price}
                        </div>
                      </div>
                      <button onClick={() => toggleProduct(i)} className="p-1 hover:bg-muted rounded transition-colors">
                        {selectedProduct === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>

                    {selectedProduct === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 p-3 bg-muted/30 backdrop-blur-sm rounded-md text-xs space-y-2 overflow-hidden"
                      >
                        <p className="text-sm leading-relaxed text-foreground">{item.description}</p>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <strong>Brand:</strong> {item.brand || 'N/A'}
                          </div>
                          <div>
                            <strong>Model:</strong> {item.model || 'N/A'}
                          </div>
                          <div>
                            <strong>Category:</strong> {item.category}
                          </div>
                          <div>
                            <strong>Condition:</strong> {item.condition || 'N/A'}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                          <div>
                            <strong>Seller:</strong> {item.seller}
                          </div>
                          <div>
                            <strong>Location:</strong> {item.location || 'Campus'}
                          </div>
                        </div>

                        {item.recommended && (
                          <div className="pt-2 border-t border-yellow-200">
                            <div className="flex items-center gap-2 text-yellow-700">
                              <Star className="h-4 w-4 fill-current" />
                              <strong>Recommended for you!</strong>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section with Detailed Descriptions */}
      <section className="relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover detailed information about our most popular items. Click on any product to explore comprehensive details, specifications, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <HomepageDescriptions />
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 bg-primary/5">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-semibold">
              Ready to Start Trading?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of students who are already buying, selling, and swapping items on campus.
              It's free, secure, and designed specifically for your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse All Items
                </Button>
              </Link>
              <Link href="/seller/products/new">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  List Your Item
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between text-sm">
          <span>© {new Date().getFullYear()} CampTrade</span>
          <div className="flex gap-4">
            <Link href="/tos" className="underline underline-offset-4">
              TOS
            </Link>
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/help" className="underline underline-offset-4">
              Help
            </Link>
          </div>
        </div>
      </footer>

      <Chatbot />
    </main>
  )
}
