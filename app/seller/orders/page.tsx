"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"

type Order = {
  id: string
  productTitle: string
  productImages: string[]
  buyerName: string
  status: "processing" | "completed" | "shipped"
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function OrdersPage() {
  const { data, mutate } = useSWR<{ items: Order[] }>("/api/orders?seller=me", fetcher)

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
    mutate()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-2 pb-4 space-y-4">
      <BackButton fallback="/seller/home" />
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="grid gap-4">
        {data?.items?.map((o) => (
          <div key={o.id} className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex -space-x-2">
                {o.productImages.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img || `/placeholder.svg?height=80&width=80&query=product%20image`}
                    alt="Product"
                    className="w-12 h-12 rounded-md border object-cover"
                  />
                ))}
              </div>
              <div className="min-w-0">
                <div className="font-medium">{o.productTitle}</div>
                <div className="text-sm text-muted-foreground">Buyer: {o.buyerName}</div>
              </div>
              <div className="ml-auto text-sm">
                <span className="px-2 py-1 rounded bg-muted">{o.status}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => updateStatus(o.id, "completed")}>
                Mark completed
              </Button>
            </div>
          </div>
        ))}
        {!data?.items?.length && <div className="text-muted-foreground">No orders yet.</div>}
      </div>
    </div>
  )
}
