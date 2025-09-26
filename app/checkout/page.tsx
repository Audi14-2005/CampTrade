"use client"

import { useCart } from "@/lib/use-cart"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"

export default function CheckoutPage() {
  const cart = useCart()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="-mt-2">
        <BackButton fallback="/cart" />
      </div>
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="rounded-xl border bg-card p-4">
        <div className="text-sm text-muted-foreground mb-2">Delivery method</div>
        <div className="flex gap-3">
          <label className="flex items-center gap-2">
            <input type="radio" name="delivery" defaultChecked /> Pickup
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="delivery" /> Delivery
          </label>
        </div>
      </div>
      <Button
        onClick={() => {
          cart.clear()
          alert("Order placed!")
        }}
      >
        Place order
      </Button>
    </div>
  )
}
