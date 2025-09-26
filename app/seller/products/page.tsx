"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { BackButton } from "@/components/back-button"

export type Product = {
  id: string
  title: string
  description: string
  images: string[]
  price: number
  quantity: number
  discount?: number
  discountEndDate?: string | null
  category?: string
  tags?: string[]
  status?: "published" | "draft"
  rating?: number
  reserved?: boolean
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SellerProducts() {
  const [q, setQ] = useState("")
  const { data, isLoading, mutate } = useSWR<{ items: Product[] }>(
    `/api/products?owner=me&q=${encodeURIComponent(q)}`,
    fetcher,
  )

  useEffect(() => {
    mutate()
  }, [mutate])

  return (
    <div className="space-y-6">
      <div className="-mt-2">
        <BackButton fallback="/seller/home" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Your Products</h1>
        <Link href="/seller/products/new">
          <Button>New product</Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Input placeholder="Search your products…" value={q} onChange={(e) => setQ(e.target.value)} />
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
        {data?.items?.map((p) => (
          <ProductCard key={p.id} product={p} ownerActions mutate={mutate} />
        ))}
      </div>
    </div>
  )
}
