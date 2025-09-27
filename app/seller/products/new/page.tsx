"use client"

import type React from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  quantity: z.coerce.number().int().min(1, "At least 1"),
  discount: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional()
    .or(z.literal(Number.NaN))
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
  discountEndDate: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // comma separated
})

type FormValues = z.infer<typeof schema>

export default function NewProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [images, setImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index))
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const onDragLeave = () => setIsDragging(false)
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  async function onSubmit(values: FormValues) {
    try {
      if (!user) {
        console.error("User not authenticated")
        return
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          images,
          tags: values.tags
            ? values.tags
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
            : [],
          status: "published",
          seller_id: user.id,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Publish failed:", errorData)
        return
      }

      const result = await res.json()
      console.log("Product created successfully:", result)

      // Redirect to your list; SWR will revalidate there
      router.push("/seller/products")
    } catch (err) {
      console.error("Network error while publishing:", err)
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return
    const previews = await Promise.all(
      Array.from(files).map(async (f) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.readAsDataURL(f)
        })
      }),
    )
    setImages((prev) => [...prev, ...previews])
  }

  return (
    /* mobile padding + bottom space for sticky bar */
    <div className="mx-auto max-w-2xl md:max-w-4xl p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
      <div className="mb-4">
        <Link
          href="/seller/products"
          className="text-sm text-muted-foreground hover:text-foreground"
          aria-label="Back to Products"
        >
          {"\u2190"} Back to Products
        </Link>
      </div>

      <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/80 border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Add Product</CardTitle>
          <CardDescription className="text-pretty">
            Upload images and fill in the product details. Fields marked with an asterisk are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="new-product-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            {/* IMAGES */}
            <div className="grid gap-3">
              <Label>Images</Label>
              <label
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 sm:p-6 text-center cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <UploadCloud className="h-6 w-6 text-muted-foreground" aria-hidden />
                <span className="mt-2 text-sm text-muted-foreground">Drag & drop images here, or click to browse</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="sr-only"
                  aria-label="Upload product images"
                />
              </label>

              {images.length > 0 && (
                <>
                  <div className="sm:hidden -mx-1 overflow-x-auto">
                    <div className="flex gap-3 px-1">
                      {images.map((src, i) => (
                        <div key={i} className="relative flex-shrink-0 w-28">
                          <img
                            src={src || "/placeholder.svg?height=300&width=300&query=Product image preview"}
                            alt={`Image preview ${i + 1}`}
                            className="aspect-square w-28 rounded-md object-cover border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            aria-label={`Remove image ${i + 1}`}
                            className="absolute right-1 top-1 inline-flex items-center justify-center rounded-md bg-background/80 border px-1.5 py-1 text-foreground/80 backdrop-blur"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* desktop/tablet grid */}
                  <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((src, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={src || "/placeholder.svg?height=300&width=300&query=Product image preview"}
                          alt={`Image preview ${i + 1}`}
                          className="aspect-square w-full rounded-md object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          aria-label={`Remove image ${i + 1}`}
                          className="absolute right-1 top-1 inline-flex items-center justify-center rounded-md bg-background/80 border px-1.5 py-1 text-foreground/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <p className="text-xs text-muted-foreground">
                Recommended: square images, at least 800×800px. You can upload multiple images.
              </p>
            </div>

            <Separator />

            {/* PRICING & INVENTORY */}
            <div className="grid gap-4">
              <h3 className="font-medium">Pricing & Inventory</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="e.g., 499"
                    {...register("price")}
                    aria-invalid={!!errors.price}
                  />
                  {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    placeholder="e.g., 3"
                    {...register("quantity")}
                    aria-invalid={!!errors.quantity}
                  />
                  {errors.quantity && <p className="text-destructive text-sm">{errors.quantity.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount %</Label>
                  <Input
                    id="discount"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g., 10"
                    {...register("discount")}
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="discountEndDate">Discount end date</Label>
                  <Input id="discountEndDate" type="date" {...register("discountEndDate")} />
                </div>
              </div>
            </div>

            <Separator />

            {/* CATEGORIZATION */}
            <div className="grid gap-4">
              <h3 className="font-medium">Categorization</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g., Electronics" {...register("category")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="e.g., calculator, engineering, fx-991" {...register("tags")} />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/seller/products")}
                className="w-full sm:w-auto" // full-width on small screens
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full sm:w-auto" // full-width on small screens
              >
                {isSubmitting ? "Saving…" : "Save & Publish"}
              </Button>
            </div>
          </form>
          <div className="hidden">
            <div className="mx-auto max-w-2xl flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => router.push("/seller/products")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="new-product-form"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Saving…" : "Save & Publish"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
