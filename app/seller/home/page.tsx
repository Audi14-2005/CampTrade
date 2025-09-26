"use client"

import useSWR from "swr"
import Link from "next/link"
import { motion } from "framer-motion"
import { BackButton } from "@/components/back-button"

type Stats = {
  sellerName: string
  totalProducts: number
  reservedCount: number
  trustBadge: "bronze" | "silver" | "gold" | "platinum"
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SellerHome() {
  const { data, isLoading } = useSWR<Stats>("/api/seller/me/stats", fetcher)

  return (
    <div className="space-y-6">
      <div className="-mt-2">
        <BackButton fallback="/browse" />
      </div>
      <h1 className="text-2xl font-semibold">Welcome back{data?.sellerName ? `, ${data.sellerName}` : ""}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Products", value: data?.totalProducts ?? 0 },
          { label: "Reserved", value: data?.reservedCount ?? 0 },
          { label: "Trust", value: data?.trustBadge ?? "bronze" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-5"
            role="status"
            aria-live="polite"
          >
            <div className="text-sm text-muted-foreground">{card.label}</div>
            <div className="mt-2 text-2xl font-semibold">
              {isLoading ? (
                <span className="inline-block h-6 w-24 bg-muted rounded animate-pulse" />
              ) : (
                String(card.value)
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/seller/products/new" className="rounded-md border bg-card p-4 hover:bg-accent transition-colors">
          Add product
        </Link>
        <Link href="/seller/orders" className="rounded-md border bg-card p-4 hover:bg-accent transition-colors">
          View orders
        </Link>
        <Link href="/profile" className="rounded-md border bg-card p-4 hover:bg-accent transition-colors">
          Manage profile
        </Link>
      </div>
    </div>
  )
}
