"use client"

import { useCart } from "@/lib/use-cart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatCurrencyINR } from "@/lib/utils"
import { BackButton } from "@/components/back-button"

export default function CartPage() {
  const cart = useCart()
  const total = cart.items.reduce((acc, it) => acc + it.price * (it.__qty ?? 1), 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="-mt-2">
        <BackButton fallback="/browse" />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Cart {cart.items.length ? `(${cart.items.length})` : ""}</h1>
        {cart.items.length > 0 && (
          <Button variant="ghost" onClick={cart.clear} aria-label="Clear cart">
            Clear cart
          </Button>
        )}
      </div>

      <div className="grid gap-3">
        {cart.items.map((it) => (
          <div
            key={it.id}
            className="rounded-xl border p-4 bg-card flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 max-w-full"
          >
            <img
              src={it.images?.[0] || `/placeholder.svg?height=96&width=96&query=product%20image` || "/placeholder.svg"}
              alt={it.title}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md object-cover border"
            />

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate text-sm sm:text-base">{it.title}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{formatCurrencyINR(it.price)}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded-md bg-muted text-foreground text-sm"
                onClick={() => cart.dec(it.id)}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <div className="w-6 text-center text-sm" aria-live="polite">
                {it.__qty ?? 1}
              </div>
              <button
                className="h-8 w-8 rounded-md bg-muted text-foreground text-sm"
                onClick={() => cart.inc(it.id)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button className="mt-2 sm:mt-0" variant="destructive" size="sm" onClick={() => cart.remove(it.id)}>
              Remove
            </Button>
          </div>
        ))}

        {!cart.items.length && (
          <div className="text-muted-foreground">
            Your cart is empty.{" "}
            <Link href="/browse" className="underline">
              Continue browsing
            </Link>
            .
          </div>
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-background border-t py-4">
        <div className="mx-auto max-w-4xl px-4 flex items-center gap-4 justify-between">
          <div className="text-base sm:text-lg font-semibold" aria-live="polite">
            Total: {formatCurrencyINR(total)}
          </div>
          <Link href="/checkout" className="w-full sm:w-auto">
            <Button className="w-full" disabled={!cart.items.length}>
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
