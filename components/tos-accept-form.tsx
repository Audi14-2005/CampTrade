"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function TermsAcceptForm() {
  const [accepted, setAccepted] = useState(false)
  const router = useRouter()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (accepted) {
      // proceed; defaulting to navigating back if no specific next step provided
      router.back()
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 border rounded-lg p-4 md:p-5">
      <div
        className={cn(
          "flex items-start gap-3 rounded-md p-2 transition-colors",
          !accepted && "border border-destructive/40 bg-destructive/5",
        )}
      >
        <Checkbox
          id="accept-terms"
          checked={accepted}
          onCheckedChange={(v) => setAccepted(Boolean(v))}
          aria-describedby="accept-terms-desc"
          className={cn(!accepted && "ring-2 ring-destructive/40 ring-offset-1")}
          aria-invalid={!accepted}
        />
        <div className="space-y-1">
          <Label htmlFor="accept-terms" className="font-medium">
            I Agree to the Terms & Conditions.
          </Label>
          <p
            id="accept-terms-desc"
            className={cn("text-sm", accepted ? "text-muted-foreground" : "text-destructive")}
            role={!accepted ? "alert" : undefined}
          >
            {!accepted ? "Please agree to continue." : "You must accept to continue."}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <Button type="submit" disabled={!accepted}>
          Continue
        </Button>
      </div>
    </form>
  )
}
