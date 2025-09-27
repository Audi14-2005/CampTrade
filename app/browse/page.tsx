"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/use-cart"
import { campTradeAPI, Product, PricePrediction } from "@/lib/api"
import { generateProductImageUrl } from "@/lib/product-image-generator"
import { generateProductDescription } from "@/lib/product-description-generator"
import { ChevronDown, ChevronUp, Star, TrendingUp, TrendingDown, Minus, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function BrowsePage() {
  const [q, setQ] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pricePredictions, setPricePredictions] = useState<Record<string, PricePrediction>>({})
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [generatedDescriptions, setGeneratedDescriptions] = useState<Record<string, string>>({})

  const { user } = useAuth()
  const { add: addToCart } = useCart()
  const { toast } = useToast()
  const userId = user?.user_id || "user_0001"

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      images: product.image ? [product.image] : [],
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        console.log('Fetching products for userId:', userId)
        const fetchedProducts = await campTradeAPI.getProducts(userId)
        console.log('Fetched products:', fetchedProducts)
        console.log('Number of products fetched:', fetchedProducts.length)
        setProducts(fetchedProducts)

        // Fetch price predictions for recommended items (only if they exist in backend)
        const recommendedProducts = fetchedProducts.filter(p => p.recommended)
        const predictions: Record<string, PricePrediction> = {}

        // Only try to fetch predictions for items that are likely to exist in the backend
        // Skip items with IDs that are too high (like 714, 904) as they might not exist
        const validProducts = recommendedProducts.filter(p => {
          const itemId = parseInt(p.id)
          return itemId <= 500 // Only try items with IDs 1-500
        })

        for (const product of validProducts.slice(0, 3)) { // Limit to first 3 to avoid too many API calls
          try {
            const prediction = await campTradeAPI.getPricePrediction(product.id, campTradeAPI.getCurrentTimestamp())
            if (prediction) {
              predictions[product.id] = prediction
            }
          } catch (error) {
            console.log(`Price prediction not available for item ${product.id}`)
            // Continue without this prediction
          }
        }

        setPricePredictions(predictions)

        // Generate descriptions for products that don't have them
        const productsNeedingDescriptions = fetchedProducts.filter(p => !p.description || p.description === 'No description available')
        if (productsNeedingDescriptions.length > 0) {
          console.log('Generating descriptions for', productsNeedingDescriptions.length, 'products')

          const descriptions: Record<string, string> = {}
          for (const product of productsNeedingDescriptions.slice(0, 10)) { // Limit to first 10 to avoid too many API calls
            try {
              const description = await generateProductDescription(product.name, product.category)
              descriptions[product.id] = description
            } catch (error) {
              console.log(`Failed to generate description for ${product.name}`)
              descriptions[product.id] = `Quality ${product.name} in good condition. Perfect for students.`
            }
          }

          setGeneratedDescriptions(descriptions)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to sample data if API fails
        console.log('Using fallback sample data')
        const sampleProducts: Product[] = [
          {
            id: "1",
            name: "Wireless Headphones",
            price: 299, // Realistic INR price
            description: "High-quality wireless headphones with noise cancellation",
            image: "/product-placeholder.svg",
            category: "electronics",
            seller: "TechStore",
            recommended: true,
            brand: "AudioTech",
            model: "ATH-300",
            condition: "New",
            location: "Campus"
          },
          {
            id: "2",
            name: "Programming Book",
            price: 150, // Realistic INR price
            description: "Complete guide to modern web development",
            image: "/product-placeholder.svg",
            category: "books",
            seller: "BookStore",
            recommended: false,
            brand: "TechPress",
            model: "WEB-2024",
            condition: "Good",
            location: "Library"
          }
        ]
        setProducts(sampleProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [userId])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(q.toLowerCase()) ||
    product.category.toLowerCase().includes(q.toLowerCase()) ||
    product.description.toLowerCase().includes(q.toLowerCase())
  )

  const toggleProduct = (index: number) => {
    setSelectedProduct(selectedProduct === index ? null : index)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="-mt-2">
        <BackButton fallback="/" />
      </div>
      <h1 className="text-2xl font-semibold">Browse</h1>
      <div className="flex items-center gap-3">
        <Input placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {/* Debug info */}
      <div className="text-sm text-muted-foreground">
        Showing {products.length} products | Loading: {loading ? 'Yes' : 'No'} | User: {userId}
      </div>

      {loading ? (
        // Loading skeleton
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="aspect-video rounded bg-muted animate-pulse" />
              <div className="h-4 w-3/4 bg-muted animate-pulse mt-3 rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse mt-2 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((item, i) => (
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
                className="aspect-video w-full rounded-md bg-muted mb-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                onClick={() => toggleProduct(i)}
              >
                <img
                  src={generateProductImageUrl(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = '/product-placeholder.svg'
                  }}
                />
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
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    {campTradeAPI.formatPrice(item.price)}
                    {pricePredictions[item.id] && (
                      <span className="flex items-center gap-1 text-xs">
                        {pricePredictions[item.id].trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {pricePredictions[item.id].trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                        {pricePredictions[item.id].trend === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}
                        {campTradeAPI.formatPrice(pricePredictions[item.id].predicted_price)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                  <button onClick={() => toggleProduct(i)} className="p-1 hover:bg-muted rounded transition-colors">
                    {selectedProduct === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {selectedProduct === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-3 bg-muted/30 backdrop-blur-sm rounded-md text-xs space-y-2 overflow-hidden"
                >
                  <p className="text-sm leading-relaxed text-foreground">
                    {generatedDescriptions[item.id] || item.description}
                  </p>

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
                    {pricePredictions[item.id] && (
                      <div>
                        <strong>Price Prediction:</strong> {campTradeAPI.formatPrice(pricePredictions[item.id].predicted_price)}
                        <span className="ml-2 text-xs">
                          ({pricePredictions[item.id].trend === 'up' ? '↗️' : pricePredictions[item.id].trend === 'down' ? '↘️' : '➡️'}
                          {Math.round(pricePredictions[item.id].confidence * 100)}% confidence)
                        </span>
                      </div>
                    )}
                  </div>

                  {item.recommended && (
                    <div className="pt-2 border-t border-yellow-200">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <Star className="h-4 w-4 fill-current" />
                        <strong>Recommended for you!</strong>
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <div className="pt-3 border-t border-muted-foreground/20">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
