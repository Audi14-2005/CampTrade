import type { NextRequest } from "next/server"
import { db, type Product } from "@/lib/mock-db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").toLowerCase()
  const owner = searchParams.get("owner")

  let items = db.products.filter((p) => p.status !== "draft")
  if (owner === "me") items = db.products.filter((p) => p.sellerId === "me")

  if (q) {
    items = items.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }

  return Response.json({ items })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const id = `p_${Math.random().toString(36).slice(2, 8)}`
  const product: Product = {
    id,
    title: body.title,
    description: body.description,
    images: body.images || [],
    price: body.price,
    quantity: body.quantity,
    discount: body.discount,
    discountEndDate: body.discountEndDate || null,
    category: body.category,
    tags: body.tags || [],
    sellerId: "me",
    status: body.status || "published",
    rating: 0,
  }
  db.products.unshift(product)
  return Response.json(product, { status: 201 })
}
