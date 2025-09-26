"use client"

import useSWR from "swr"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/use-cart"
import { PriceTag } from "@/components/price-tag"
import { BackButton } from "@/components/back-button"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR(`/api/products/${id}`, fetcher)
  const cart = useCart()
  const { toast } = useToast()

  if (!data) return <div className="p-6">Loading…</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-2 gap-8">
      <div className="lg:col-span-2 -mt-2 mb-2">
        <BackButton fallback="/browse" />
      </div>

      <div className="space-y-3">
        <div className="aspect-video w-full rounded-xl overflow-hidden border bg-muted">
          <img
            src={data.images?.[0] || `/placeholder.svg?height=400&width=600&query=product%20image`}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {data.images?.slice(0, 5).map((img: string, i: number) => (
            <div key={i} className="flex flex-col">
              <div className="rounded-md">
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Preview ${i + 1}`}
                  className="w-16 h-16 rounded-md border object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">{data.title}</h1>
        <PriceTag price={data.price} discount={data.discount} discountEndDate={data.discountEndDate} />
        <p className="text-muted-foreground">{data.description}</p>
        <div className="text-sm text-muted-foreground">Stock: {data.quantity}</div>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              cart.add(data)
              toast({ description: "Your item is added in cart" })
            }}
            aria-label={`Add ${data.title} to cart`}
          >
            Add to cart
          </Button>

          <Button variant="secondary">Request exchange</Button>
        </div>
      </div>
    </div>
  )
}
