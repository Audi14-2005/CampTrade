"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/use-cart"
import { ArrowLeft, Smartphone, CheckCircle, Clock, QrCode } from "lucide-react"
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

export default function UPIPaymentPage() {
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [isPaid, setIsPaid] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const { clear } = useCart()

    useEffect(() => {
        // Get order data from sessionStorage
        const storedOrder = sessionStorage.getItem('currentOrder')
        if (storedOrder) {
            setOrderData(JSON.parse(storedOrder))
        } else {
            // Redirect to cart if no order data
            router.push('/cart')
        }
    }, [router])

    const generateUPIUrl = () => {
        if (!orderData) return ""

        const upiParams = {
            pa: '88825511797@ptyes', // UPI ID
            pn: 'CampTrade',
            am: orderData.total.toString(),
            cu: 'INR',
            tn: `Order ${orderData.orderId} - CampTrade Purchase`
        }

        const queryString = new URLSearchParams(upiParams).toString()
        return `upi://pay?${queryString}`
    }

    const generateQRCodeUrl = () => {
        const upiUrl = generateUPIUrl()
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`
    }

    const handlePaymentConfirmation = async () => {
        setIsProcessing(true)

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsPaid(true)
        clear()
        sessionStorage.removeItem('currentOrder')

        toast({
            title: "Payment Successful!",
            description: "Your order has been confirmed and payment received.",
        })

        // Redirect to success page after 3 seconds
        setTimeout(() => {
            router.push('/checkout/success')
        }, 3000)
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Loading Order...</h2>
                    <p className="text-muted-foreground">Please wait while we prepare your payment.</p>
                </div>
            </div>
        )
    }

    if (isPaid) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                        <p className="text-muted-foreground">Your order has been confirmed.</p>
                        <p className="text-sm text-muted-foreground mt-2">Redirecting to success page...</p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gray-900 text-white py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/checkout" className="text-gray-300 hover:text-white">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold">Secure Checkout</h1>
                            <p className="text-sm text-gray-300">CampTrade Payment Gateway</p>
                        </div>
                    </div>
                    <div className="bg-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        TEST MODE
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* UPI Payment Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                Pay via UPI
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-muted-foreground">
                                    Scan the QR code with any UPI app or tap the link below to open your UPI app.
                                    After completing payment, click Confirm.
                                </p>

                                {/* QR Code */}
                                <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg">
                                    <div className="flex justify-center mb-4">
                                        <QrCode className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <img
                                        src={generateQRCodeUrl()}
                                        alt="UPI QR Code"
                                        className="mx-auto max-w-[220px] w-full"
                                    />
                                    <div className="mt-4 p-3 bg-white rounded border text-xs break-all text-gray-600">
                                        {generateUPIUrl()}
                                    </div>
                                </div>

                                {/* Payment Confirmation */}
                                <div className="space-y-3">
                                    <Button
                                        onClick={handlePaymentConfirmation}
                                        disabled={isProcessing}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        size="lg"
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                Processing Payment...
                                            </div>
                                        ) : (
                                            "Confirm Payment"
                                        )}
                                    </Button>

                                    <p className="text-xs text-muted-foreground">
                                        Payments to: {orderData.buyer} • Beneficiary VPA: 88825511797@ptyes
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card className="bg-gray-900 text-white">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {orderData.items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex justify-between items-center py-2"
                                    >
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">₹{item.price * item.quantity}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="border-t border-gray-700 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{orderData.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-green-400">₹{orderData.total}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-700">
                                <p className="text-sm text-gray-300">
                                    Order #{orderData.orderId} • {new Date(orderData.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 text-sm mt-8">
                    This is a demo checkout inspired by Razorpay UI. No real money moves in test mode.
                </div>
            </div>
        </div>
    )
}
