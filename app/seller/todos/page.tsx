"use client"

import useSWR from "swr"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BackButton } from "@/components/back-button"

type Todo = {
  id: string
  title: string
  description?: string
  dueDate?: string
  status: "todo" | "in-progress" | "done"
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SellerTodos() {
  const { data, mutate } = useSWR<{ items: Todo[] }>("/api/todos", fetcher)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [due, setDue] = useState("")

  async function add() {
    if (!title.trim()) return
    await fetch("/api/todos", { method: "POST", body: JSON.stringify({ title, description: desc, dueDate: due }) })
    setTitle("")
    setDesc("")
    setDue("")
    mutate()
  }

  async function toggle(id: string, status: Todo["status"]) {
    await fetch("/api/todos", { method: "PUT", body: JSON.stringify({ id, status }) })
    mutate()
  }

  async function remove(id: string) {
    await fetch("/api/todos", { method: "DELETE", body: JSON.stringify({ id }) })
    mutate()
  }

  return (
    <div className="grid gap-6">
      <div className="-mt-2">
        <BackButton fallback="/seller/home" />
      </div>
      <h1 className="text-2xl font-semibold">To-do</h1>

      <div className="rounded-xl border bg-card p-4 grid gap-3">
        <div className="grid gap-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Due date</Label>
          <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <Button onClick={add}>Add</Button>
      </div>

      <div className="grid gap-3">
        {data?.items?.map((t) => (
          <div key={t.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.description}</div>
                {t.dueDate && <div className="text-xs text-muted-foreground mt-1">Due: {t.dueDate}</div>}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toggle(t.id, t.status === "done" ? "todo" : "done")}
                >
                  {t.status === "done" ? "Mark todo" : "Mark done"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(t.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!data?.items?.length && <div className="text-muted-foreground">No to-dos yet.</div>}
      </div>
    </div>
  )
}
