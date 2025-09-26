"use client"

import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`, fetcher)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [price, setPrice] = useState<number | string>("")
  const [qty, setQty] = useState<number | string>("")

  // populate once loaded
  if (!isLoading && data && title === "" && desc === "") {
    setTitle(data.title)
    setDesc(data.description)
    setPrice(data.price)
    setQty(data.quantity)
  }

  async function save() {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        title,
        description: desc,
        price: Number(price),
        quantity: Number(qty),
      }),
    })
    await mutate()
    router.push("/seller/products")
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-40 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Quantity</Label>
            <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={save}>Save</Button>
          <Button variant="secondary" onClick={() => router.push("/seller/products")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
