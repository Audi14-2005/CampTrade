"use client"

import { remainingDays } from "@/lib/time"
import { formatCurrencyINR } from "@/lib/utils"

export function PriceTag({
  price,
  discount,
  discountEndDate,
}: { price: number; discount?: number; discountEndDate?: string | null }) {
  const hasDiscount = !!discount && discount > 0
  const discounted = hasDiscount ? (price * (100 - discount!)) / 100 : price
  const days = hasDiscount && discountEndDate ? remainingDays(discountEndDate) : null

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl font-semibold">{formatCurrencyINR(discounted)}</div>
      {hasDiscount && (
        <>
          <div className="text-sm text-muted-foreground line-through">{formatCurrencyINR(price)}</div>
          {typeof days === "number" && days >= 0 && (
            <div className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground">
              {days} day{days === 1 ? "" : "s"} left
            </div>
          )}
        </>
      )}
    </div>
  )
}
