import type { NextRequest } from "next/server"
import { db } from "@/lib/mock-db"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const idx = db.orders.findIndex((o) => o.id === params.id)
  if (idx === -1) return new Response("Not found", { status: 404 })
  db.orders[idx].status = body.status
  return Response.json(db.orders[idx])
}
