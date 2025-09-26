import type { NextRequest } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = db.products.find((p) => p.id === params.id)
  if (!item) return new Response("Not found", { status: 404 })
  return Response.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const idx = db.products.findIndex((p) => p.id === params.id)
  if (idx === -1) return new Response("Not found", { status: 404 })
  db.products[idx] = { ...db.products[idx], ...body }
  return Response.json(db.products[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.products.findIndex((p) => p.id === params.id)
  if (idx === -1) return new Response("Not found", { status: 404 })
  db.products.splice(idx, 1)
  return new Response(null, { status: 204 })
}
