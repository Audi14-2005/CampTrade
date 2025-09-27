"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/use-cart"
import { useAuth } from "@/lib/auth-context"
import { ShoppingCart, ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import { motion } from "framer-motion"

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const total = items.reduce((sum, item) => sum + (item.price * (item.__qty || 1)), 0)
  const totalItems = items.reduce((sum, item) => sum + (item.__qty || 1), 0)

  const handleUPIPayment = () => {
    setIsProcessing(true)
    // Generate order ID
    const orderId = `ORD${Date.now()}`

    // Create order data
    const orderData = {
      orderId,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.__qty || 1
      })),
      total,
      buyer: user?.email || 'guest@example.com',
      timestamp: new Date().toISOString()
    }

    // Store order data in sessionStorage for the payment page
    sessionStorage.setItem('currentOrder', JSON.stringify(orderData))

    // Navigate to UPI payment page
    router.push('/checkout/upi-payment')
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center space-y-4">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some items to your cart before checkout</p>
          <Link href="/browse">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.__qty || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price * (item.__qty || 1)}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user?.email || 'Guest'}</p>
                <p><strong>User Group:</strong> {user?.group_name || 'General'}</p>
                <p><strong>Total Items:</strong> {totalItems}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">UPI Payment</h3>
                      <p className="text-sm text-muted-foreground">Pay via UPI apps like PhonePe, Google Pay, Paytm</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUPIPayment}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? "Processing..." : "Pay via UPI"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Card Payment</h3>
                      <p className="text-sm text-muted-foreground">Credit/Debit card payment</p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}