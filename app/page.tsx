"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function LandingPage() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

  const sampleItems = [
    {
      src: "/images/home-sample-1.png",
      alt: "Stack of spiral notebooks",
      name: "Notebooks",
      price: "40",
      description: {
        overview:
          "This highly respected textbook offers a comprehensive introduction to algorithms, blending rigorous theoretical concepts with practical problem-solving examples. It covers essential topics like sorting, graph algorithms, dynamic programming, and more, making it a cornerstone for computer science study. Ideal for students, instructors, and professionals who want both depth and clarity in understanding algorithms.",
        brand: "StudyMax",
        model: "SM-NB300",
        sku: "NB-SPIRAL-001",
        dimensions: "21cm x 15cm x 2.5cm",
        weight: "450g (pack of 5)",
        color: "Multi-color (Purple, Blue, Green, Yellow, Pink)",
        material: "80 GSM paper with cardboard cover",
        features: [
          "Spiral bound for easy page turning",
          "200 pages per notebook (1000 total)",
          "Ruled pages with margin",
          "Perforated sheets for clean removal",
          "Durable cardboard covers",
        ],
        specifications: "A5 size, 80 GSM paper, 40 sheets per notebook",
        usage: "Perfect for lectures, assignments, and daily note-taking",
        compatibility: "Standard pen and pencil friendly",
        origin: "Made in India",
        warranty: "No warranty (consumable item)",
        availability: "In Stock - 15 sets available",
        shipping: "Free campus delivery, Same day pickup available",
        returnPolicy: "7-day return if unopened",
        category: "Stationery & Books",
      },
    },
    {
      src: "/images/home-sample-2.png",
      alt: "Compact electric iron",
      name: "ironbox",
      price: "699",
      description: {
        overview:
          "The TI-84 Plus is a trusted graphing calculator widely used in high school and college courses. It features advanced graphing capabilities, built-in applications, and support for statistics, calculus, and scientific functions. Approved for standardized tests such as the SAT, ACT, and AP exams, it’s a durable and reliable tool for both classroom and exam settings.",
        brand: "HomeTech",
        model: "HT-IR1200",
        sku: "IRON-COMPACT-002",
        dimensions: "24cm x 10cm x 12cm",
        weight: "900g",
        color: "White and Light Blue",
        material: "Plastic body with stainless steel soleplate",
        features: [
          "1200W powerful heating element",
          "Non-stick ceramic soleplate",
          "Steam and dry ironing options",
          "Temperature control dial",
          "Auto shut-off safety feature",
          "Compact design for easy storage",
        ],
        specifications: "220-240V, 50Hz, 1200W power consumption",
        usage: "Ideal for cotton, silk, wool, and synthetic fabrics",
        compatibility: "Standard Indian power outlets",
        origin: "Made in China",
        warranty: "1 year manufacturer warranty",
        availability: "In Stock - 3 units available",
        shipping: "₹50 shipping, Free for orders above ₹500",
        returnPolicy: "15-day return with original packaging",
        category: "Home & Kitchen Appliances",
      },
    },
    {
      src: "/images/home-sample-3.png",
      alt: "Stainless steel electric kettle",
      name: "hot kettle",
      price: "299",
      description: {
        overview:
          "These over-ear noise-cancelling headphones are designed to block out distractions and deliver a rich, clear audio experience. With comfortable padding and long-lasting battery life, they are perfect for extended listening sessions at home, during travel, or while studying. Combining style, comfort, and performance, they create an immersive environment wherever you go.",
        brand: "QuickBoil",
        model: "QB-EK1500",
        sku: "KETTLE-SS-003",
        dimensions: "22cm x 16cm x 24cm",
        weight: "1.2kg",
        color: "Stainless Steel with Black accents",
        material: "304 grade stainless steel body",
        features: [
          "1.5L capacity for 4-6 cups",
          "Rapid boiling in 3-4 minutes",
          "Auto shut-off when water boils",
          "Boil-dry protection",
          "Cool-touch handle",
          "Cordless design with 360° base",
        ],
        specifications: "220V, 1500W, 1.5L capacity",
        usage: "Perfect for tea, coffee, instant noodles, and hot beverages",
        compatibility: "Standard power outlets with 3-pin plug",
        origin: "Made in India",
        warranty: "2 years on heating element, 1 year overall",
        availability: "In Stock - 8 units available",
        shipping: "Free campus delivery within 2 hours",
        returnPolicy: "30-day return with bill",
        category: "Kitchen Appliances",
      },
    },
    {
      src: "/images/home-sample-4.png",
      alt: "Assorted drafting and engineering tools kit",
      name: "Architecture Essentials",
      price: "200",
      description: {
        brand: "DraftPro",
        model: "DP-ARCH-KIT",
        sku: "ARCH-TOOLS-004",
        dimensions: "30cm x 20cm x 5cm (carry case)",
        weight: "650g",
        color: "Blue case with assorted tool colors",
        material: "High-grade plastic and metal instruments",
        features: [
          "Complete 15-piece drafting set",
          "Compass with extension bar",
          "Set squares (45° and 60°)",
          "Protractor and scale ruler",
          "Mechanical pencils (0.5mm, 0.7mm)",
          "Lead refills and eraser",
          "Portable zip case",
        ],
        specifications: "Precision-grade instruments, metric measurements",
        usage: "Essential for architecture, engineering, and technical drawing",
        compatibility: "Standard A4 and A3 drawing sheets",
        origin: "Made in Germany",
        warranty: "5 years on metal instruments, 1 year on case",
        availability: "In Stock - 5 kits available",
        shipping: "₹30 shipping, Free pickup from hostel",
        returnPolicy: "10-day return if all pieces intact",
        category: "Academic & Professional Tools",
      },
    },
  ]

  const toggleProduct = (index: number) => {
    setSelectedProduct(selectedProduct === index ? null : index)
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="hidden">
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

      <section className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-balance">Buy, sell, and swap items on campus</h1>
            <p className="text-muted-foreground text-pretty">
              Find textbooks, electronics, clothes and more from trusted students. Smooth, app-like experience with a
              secure checkout.
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
            className="rounded-xl border bg-card p-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {sampleItems.map((item, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div
                    className="aspect-video w-full rounded-md bg-muted mb-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleProduct(i)}
                  >
                    <img src={item.src || "/placeholder.svg"} alt={item.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Rs {item.price}</div>
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
                      className="mt-4 p-3 bg-muted/50 rounded-md text-xs space-y-2 overflow-hidden"
                    >
                      {item.description.overview && (
                        <p className="text-sm leading-relaxed text-foreground">{item.description.overview}</p>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <strong>Brand:</strong> {item.description.brand}
                        </div>
                        <div>
                          <strong>Model:</strong> {item.description.model}
                        </div>
                        <div>
                          <strong>Weight:</strong> {item.description.weight}
                        </div>
                        <div>
                          <strong>Material:</strong> {item.description.material}
                        </div>
                      </div>

                      <div>
                        <strong>Key Features:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {item.description.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        <div>
                          <strong>Warranty:</strong> {item.description.warranty}
                        </div>
                        <div>
                          <strong>Availability:</strong> {item.description.availability}
                        </div>
                        <div>
                          <strong>Shipping:</strong> {item.description.shipping}
                        </div>
                        <div>
                          <strong>Return Policy:</strong> {item.description.returnPolicy}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div>
                          <strong>Category:</strong> {item.description.category}
                        </div>
                        <div>
                          <strong>Origin:</strong> {item.description.origin}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t">
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
    </main>
  )
}
