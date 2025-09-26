import type { NextRequest } from "next/server"
import { db, type Order } from "@/lib/mock-db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seller = searchParams.get("seller")
  const buyer = searchParams.get("buyer")

  let items: any[] = []
  if (seller === "me") {
    const mineIds = db.products.filter((p) => p.sellerId === "me").map((p) => p.id)
    items = db.orders
      .filter((o) => mineIds.includes(o.productId))
      .map((o) => {
        const p = db.products.find((pp) => pp.id === o.productId)!
        return {
          id: o.id,
          productTitle: p.title,
          productImages: p.images,
          buyerName: o.buyerName,
          status: o.status,
          createdAt: o.createdAt,
        }
      })
  } else if (buyer === "me") {
    items = db.orders.filter((o) => o.buyerName === "Me").map((o) => ({ ...o }))
  }

  return Response.json({ items })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const id = `o_${Math.random().toString(36).slice(2, 8)}`
  const order: Order = {
    id,
    productId: body.productId,
    buyerName: body.buyerName || "Me",
    status: "processing",
    createdAt: new Date().toISOString(),
  }
  db.orders.unshift(order)
  return Response.json(order, { status: 201 })
}
