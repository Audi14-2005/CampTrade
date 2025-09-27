"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ShoppingBag, ArrowRight, Home, Package } from "lucide-react"
import { motion } from "framer-motion"

interface OrderData {
    orderId: string
    items: Array<{
        id: string
        title: string
        price: number
        quantity: number
    }>
    total: number
    buyer: string
    timestamp: string
}

export default function PaymentSuccessPage() {
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Try to get order data from sessionStorage
        const storedOrder = sessionStorage.getItem('currentOrder')
        if (storedOrder) {
            setOrderData(JSON.parse(storedOrder))
        }
    }, [])

    const handleContinueShopping = () => {
        router.push('/browse')
    }

    const handleViewOrders = () => {
        router.push('/profile')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
                            >
                                <CheckCircle className="h-5 w-5 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold text-green-600"
                        >
                            Payment Successful!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-gray-600"
                        >
                            Your order has been confirmed and payment received.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-500"
                        >
                            You will receive a confirmation email shortly.
                        </motion.p>
                    </div>

                    {/* Order Details */}
                    {orderData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="max-w-2xl mx-auto">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Order Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="font-medium">Order ID</span>
                                        <span className="text-gray-600">#{orderData.orderId}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium">Items Ordered:</h4>
                                        {orderData.items.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 + index * 0.1 }}
                                                className="flex justify-between items-center py-1"
                                            >
                                                <span className="text-sm">{item.title} (x{item.quantity})</span>
                                                <span className="text-sm font-medium">₹{item.price * item.quantity}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center text-lg font-semibold">
                                            <span>Total Paid</span>
                                            <span className="text-green-600">₹{orderData.total}</span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500 pt-2">
                                        Order placed on {new Date(orderData.timestamp).toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            onClick={handleContinueShopping}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            Continue Shopping
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>

                        <Button
                            onClick={handleViewOrders}
                            variant="outline"
                            size="lg"
                        >
                            <Package className="h-5 w-5 mr-2" />
                            View My Orders
                        </Button>

                        <Link href="/">
                            <Button variant="outline" size="lg">
                                <Home className="h-5 w-5 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto"
                    >
                        <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• You'll receive an email confirmation with order details</li>
                            <li>• The seller will be notified of your purchase</li>
                            <li>• You can track your order status in your profile</li>
                            <li>• Contact support if you have any questions</li>
                        </ul>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

