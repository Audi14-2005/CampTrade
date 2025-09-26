"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrencyINR } from "@/lib/utils"
import { useCart } from "@/lib/use-cart"
import { useToast } from "@/hooks/use-toast"

export function ProductCard({
  product,
  ownerActions,
  mutate,
}: {
  product: {
    id: string
    title: string
    images?: string[]
    price: number
    discount?: number
    discountEndDate?: string | null
    rating?: number
  }
  ownerActions?: boolean
  mutate?: () => void
}) {
  const cart = useCart()
  const { toast } = useToast()

  async function del() {
    await fetch(`/api/products/${product.id}`, { method: "DELETE" })
    mutate?.()
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
          <img
            src={product.images?.[0] || `/placeholder.svg?height=200&width=300&query=product%20image`}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="mt-3 font-medium line-clamp-1">{product.title}</div>
      <div className="text-sm text-muted-foreground">{formatCurrencyINR(product.price)}</div>

      {ownerActions && (
        <div className="mt-3 flex gap-2">
          <Link href={`/seller/products/${product.id}/edit`}>
            <Button size="sm">Edit</Button>
          </Link>
          <Button size="sm" variant="destructive" onClick={del}>
            Delete
          </Button>
        </div>
      )}

      {!ownerActions && (
        <div className="mt-3">
          <Button
            size="sm"
            onClick={() => {
              cart.add({
                id: product.id,
                title: product.title,
                price: product.price,
                images: product.images,
              })
              toast({ description: "Your item is added in cart" })
            }}
            aria-label={`Add ${product.title} to cart`}
          >
            Add to cart
          </Button>
        </div>
      )}
    </div>
  )
}
