"use client"

import useSWR from "swr"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { BackButton } from "@/components/back-button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BrowsePage() {
  const [q, setQ] = useState("")
  const { data, isLoading } = useSWR(`/api/products?q=${encodeURIComponent(q)}`, fetcher)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="-mt-2">
        <BackButton fallback="/" />
      </div>
      <h1 className="text-2xl font-semibold">Browse</h1>
      <div className="flex items-center gap-3">
        <Input placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="aspect-video rounded bg-muted animate-pulse" />
              <div className="h-4 w-3/4 bg-muted animate-pulse mt-3 rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse mt-2 rounded" />
            </div>
          ))}
        {data?.items?.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
