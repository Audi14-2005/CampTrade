"use client"

import type React from "react"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Persisted = {
  avatarDataUrl?: string
  name?: string
  universityEmail?: string
  universityEmailVerified?: boolean
  twoFactorEnabled?: boolean
  notificationsEnabled?: boolean
  bio?: string
  major?: string
  graduationYear?: string
  campusLocation?: string
  newField1?: string
  newField2?: boolean
  // </CHANGE>
}

const LS_KEY = "settings.profile"

function usePersistedState<T extends Persisted>(initial: T) {
  const [state, setState] = useState<T>(initial)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setState((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  return [state, setState] as const
}

export function SettingsProfileForm() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [state, setState] = usePersistedState<Persisted>({
    name: "",
    avatarDataUrl: "",
    bio: "",
    major: "",
    graduationYear: "",
    campusLocation: "",
    newField1: "",
    newField2: false,
    // </CHANGE>
  })

  function onPickImage() {
    fileRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || "")
      setState((s) => ({ ...s, avatarDataUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
          {state.avatarDataUrl ? (
            <Image
              src={state.avatarDataUrl || "/placeholder.svg?height=64&width=64&query=student avatar preview"}
              alt="Profile avatar preview"
              fill
              className="object-cover"
            />
          ) : (
            <Image
              src={"/placeholder.svg?height=64&width=64&query=student avatar placeholder"}
              alt="Empty avatar placeholder"
              fill
              className="object-cover opacity-80"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          <Button variant="secondary" size="sm" onClick={onPickImage}>
            Change Photo
          </Button>
          {state.avatarDataUrl ? (
            <Button variant="ghost" size="sm" onClick={() => setState((s) => ({ ...s, avatarDataUrl: "" }))}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          value={state.name || ""}
          onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell classmates about what you buy/sell or your interests (max 180 chars)"
          maxLength={180}
          value={state.bio || ""}
          onChange={(e) => setState((s) => ({ ...s, bio: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">
          A short bio helps others know you’re legit. Keep it friendly and concise.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="major">Major / Department</Label>
          <Input
            id="major"
            placeholder="e.g., Computer Science"
            value={state.major || ""}
            onChange={(e) => setState((s) => ({ ...s, major: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gradYear">Graduation Year</Label>
          <Input
            id="gradYear"
            inputMode="numeric"
            type="number"
            min={2000}
            max={2100}
            placeholder="e.g., 2027"
            value={state.graduationYear || ""}
            onChange={(e) => setState((s) => ({ ...s, graduationYear: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="campusLocation">Campus / Location</Label>
        <Input
          id="campusLocation"
          placeholder="e.g., Main Campus, North Campus, Off-campus"
          value={state.campusLocation || ""}
          onChange={(e) => setState((s) => ({ ...s, campusLocation: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">Helps buyers and sellers coordinate safe meetups on campus.</p>
      </div>

      <p className="text-xs text-muted-foreground">Changes save automatically.</p>

      {/* add new fields to form
      <div className="space-y-2">
        <Label htmlFor="newField1">New Field 1</Label>
        <Input
          id="newField1"
          placeholder="Enter value for new field 1"
          value={state.newField1 || ""}
          onChange={(e) => setState((s) => ({ ...s, newField1: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newField2">New Field 2</Label>
        <Switch
          checked={!!state.newField2}
          onCheckedChange={(v) => setState((s) => ({ ...s, newField2: v }))}
          aria-label="Toggle new field 2"
        />
      </div>
      // </CHANGE> */}
    </div>
  )
}

function isUniversityEmail(email: string) {
  // Accept .edu and common academic patterns like ac.xx or edu.xx
  const re = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?(edu|ac\.[a-z]{2}|edu\.[a-z]{2})$/i
  return re.test(email.trim())
}

function StatusPill({
  state,
}: {
  state: "verified" | "unverified" | "invalid" | "pending"
}) {
  const map = {
    verified: "bg-green-500/15 text-green-700",
    unverified: "bg-amber-500/15 text-amber-700",
    invalid: "bg-red-500/15 text-red-700",
    pending: "bg-blue-500/15 text-blue-700",
  } as const
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", map[state])}
      aria-live="polite"
    >
      {state === "verified"
        ? "Verified"
        : state === "pending"
          ? "Verification sent"
          : state === "invalid"
            ? "Invalid email"
            : "Needs verification"}
    </span>
  )
}

SettingsProfileForm.UniversityEmail = function UniversityEmail() {
  const [state, setState] = usePersistedState<Persisted>({
    universityEmail: "",
    universityEmailVerified: false,
  })
  const [status, setStatus] = useState<"verified" | "unverified" | "invalid" | "pending">(
    state.universityEmailVerified ? "verified" : "unverified",
  )

  useEffect(() => {
    setStatus(state.universityEmailVerified ? "verified" : "unverified")
  }, [state.universityEmailVerified])

  const valid = isUniversityEmail(state.universityEmail || "")

  async function onVerify() {
    if (!valid) {
      setStatus("invalid")
      return
    }
    setStatus("pending")
    // Simulate sending a verification email and completion
    await new Promise((r) => setTimeout(r, 1200))
    setState((s) => ({ ...s, universityEmailVerified: true }))
    setStatus("verified")
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="uemail">University Email</Label>
        <Input
          id="uemail"
          inputMode="email"
          type="email"
          placeholder="name@youruniversity.edu"
          value={state.universityEmail || ""}
          onChange={(e) =>
            setState((s) => ({
              ...s,
              universityEmail: e.target.value,
              universityEmailVerified: false,
            }))
          }
          aria-describedby="uemail-help"
        />
        <p id="uemail-help" className="text-xs text-muted-foreground">
          Use your official university address (for example, name@school.edu).
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <StatusPill state={status} />
        <Button size="sm" onClick={onVerify}>
          {status === "verified" ? "Re-verify" : "Verify"}
        </Button>
      </div>
    </div>
  )
}

SettingsProfileForm.TwoFactor = function TwoFactor() {
  const [state, setState] = usePersistedState<Persisted>({
    twoFactorEnabled: false,
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Two-Step Verification</p>
          <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
        </div>
        <Switch
          checked={!!state.twoFactorEnabled}
          onCheckedChange={(v) => setState((s) => ({ ...s, twoFactorEnabled: v }))}
          aria-label="Toggle two-step verification"
        />
      </div>
      {state.twoFactorEnabled ? (
        <p className="text-xs text-muted-foreground">
          Two-Step Verification is enabled. You’ll be prompted for a second factor when signing in.
        </p>
      ) : null}
    </div>
  )
}

SettingsProfileForm.Notifications = function Notifications() {
  const [state, setState] = usePersistedState<Persisted>({
    notificationsEnabled: true,
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Notifications</p>
          <p className="text-xs text-muted-foreground">Receive updates about orders, messages, and activity.</p>
        </div>
        <Switch
          checked={!!state.notificationsEnabled}
          onCheckedChange={(v) => setState((s) => ({ ...s, notificationsEnabled: v }))}
          aria-label="Toggle notifications"
        />
      </div>
    </div>
  )
}
