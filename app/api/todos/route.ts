import type { NextRequest } from "next/server"
import { db, type Todo } from "@/lib/mock-db"

export async function GET() {
  return Response.json({ items: db.todos })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const t: Todo = {
    id: `t_${Math.random().toString(36).slice(2, 8)}`,
    title: body.title,
    description: body.description,
    dueDate: body.dueDate,
    status: "todo",
  }
  db.todos.unshift(t)
  return Response.json(t, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const idx = db.todos.findIndex((t) => t.id === body.id)
  if (idx === -1) return new Response("Not found", { status: 404 })
  db.todos[idx] = { ...db.todos[idx], ...body }
  return Response.json(db.todos[idx])
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const idx = db.todos.findIndex((t) => t.id === body.id)
  if (idx === -1) return new Response("Not found", { status: 404 })
  db.todos.splice(idx, 1)
  return new Response(null, { status: 204 })
}
