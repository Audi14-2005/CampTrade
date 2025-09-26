"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type BackButtonProps = {
  fallback?: string
  label?: string
  className?: string
}

export function BackButton({ fallback = "/", label = "Back", className }: BackButtonProps) {
  const router = useRouter()

  function onBack() {
    // Try history first; if there's no meaningful history, use fallback
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <div className={className}>
      <Button variant="ghost" size="sm" onClick={onBack} aria-label={label} className="gap-1 px-2">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">{label}</span>
        <span className="hidden sm:inline">{label}</span>
      </Button>
      {/* Accessible fallback link if JS disabled */}
      <noscript>
        <Link href={fallback} aria-label={label} className="inline-block text-sm underline underline-offset-4">
          {label}
        </Link>
      </noscript>
    </div>
  )
}
