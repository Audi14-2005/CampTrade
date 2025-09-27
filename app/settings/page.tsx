import type React from "react"
import { BackButton } from "@/components/back-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  BadgeCheck,
  Shield,
  Bell,
  HelpCircle,
  TriangleAlert,
  LogOut,
  Trash2,
  MapPin,
  UserRound,
  KeyRound,
} from "lucide-react"

import { SettingsProfileForm } from "@/components/settings-profile-form"

// Simple section wrapper for a11y
function SettingsSection({
  title,
  icon: Icon,
  description,
  children,
  id,
}: {
  title: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description?: string
  children: React.ReactNode
  id: string
}) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="mt-0.5 rounded-md border bg-muted/50 p-2 text-muted-foreground">
            <Icon className="h-4 w-4" aria-hidden />
          </div>
        ) : null}
        <div>
          <h2 id={id} className="text-xl font-semibold text-foreground text-pretty">
            {title}
          </h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      <Card className="border bg-card">
        <div className="divide-y">{children}</div>
      </Card>
    </section>
  )
}

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8 overflow-x-hidden">
      {/* Back */}
      <div className="mb-2">
        <BackButton fallback="/profile" />
      </div>

      <header className="rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground text-balance">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account, security, preferences, and support.
            </p>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              Verified Student
            </div>
          </div>
          {/* removed "View Profile"; keep a compact Edit button if needed */}
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" size="sm">View Profile</Button> */}
            <Button size="sm">Edit Profile</Button>
          </div>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left column: Account + Preferences */}
        <div className="space-y-8">
          {/* ACCOUNT */}
          {false && (
            <SettingsSection
              id="account-settings"
              title="Account"
              icon={UserRound}
              description="Manage your personal info, campus verification, and security."
            >
              <div className="p-4">
                <SettingsProfileForm />
              </div>

              <div className="p-4">
                <SettingsProfileForm.UniversityEmail />
              </div>

              {/* Campus Location */}
              <div className="flex flex-wrap items-start justify-between gap-4 p-4">
                <div className="w-full sm:w-auto">
                  <div className="font-medium text-foreground">Campus Location</div>
                  <p className="text-sm text-muted-foreground">Set your default campus for the marketplace.</p>
                  <div className="mt-3 grid gap-2 sm:min-w-[280px]">
                    <Label htmlFor="campus">Campus</Label>
                    <Input id="campus" placeholder="e.g., State University - Main Campus" />
                  </div>
                </div>
                <Button variant="outline" className="self-end bg-transparent">
                  Save
                </Button>
              </div>

              {/* Password */}
              <div className="flex items-start justify-between gap-4 p-4">
                <div>
                  <div className="font-medium text-foreground">Password</div>
                  <p className="text-sm text-muted-foreground">Choose a strong, unique password.</p>
                </div>
                <Button variant="outline">
                  <KeyRound className="mr-2 h-4 w-4" aria-hidden />
                  Change
                </Button>
              </div>

              {/* 2FA (toggle remains; can be wired to persistence later) */}
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="space-y-1">
                  <div className="font-medium text-foreground">Two‑Factor Authentication</div>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="twofa" className="text-sm text-muted-foreground">
                    Enable
                  </Label>
                  <Switch id="twofa" aria-label="Enable two-factor authentication" />
                </div>
              </div>
            </SettingsSection>
          )}

          {/* PREFERENCES */}
          <SettingsSection
            id="preferences"
            title="Preferences"
            icon={Bell}
            description="Control notifications, privacy, and default marketplace filters."
          >
            {/* Notifications */}
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="font-medium text-foreground">Notifications</div>
                <div className="text-sm text-muted-foreground">Choose which updates you want to receive.</div>
                <div className="mt-2 grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-msgs" className="text-sm">
                      Messages
                    </Label>
                    <Switch id="notif-msgs" defaultChecked aria-label="Messages notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-orders" className="text-sm">
                      Order updates
                    </Label>
                    <Switch id="notif-orders" defaultChecked aria-label="Order updates notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-safety" className="text-sm">
                      Safety alerts
                    </Label>
                    <Switch id="notif-safety" defaultChecked aria-label="Safety alerts notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-promos" className="text-sm">
                      Promotions
                    </Label>
                    <Switch id="notif-promos" aria-label="Promotions notifications" />
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="space-y-3">
                <div className="font-medium text-foreground">Privacy</div>
                <div className="text-sm text-muted-foreground">Control how others can find and contact you.</div>
                <div className="mt-2 grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="privacy-search" className="text-sm">
                      Show profile in search
                    </Label>
                    <Switch id="privacy-search" defaultChecked aria-label="Show profile in search" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="privacy-dm" className="text-sm">
                      Allow DMs from non‑campus buyers
                    </Label>
                    <Switch id="privacy-dm" aria-label="Allow DMs from non-campus buyers" />
                  </div>
                </div>
              </div>
            </div>

            {/* Default Marketplace Filters */}
            <div className="grid gap-4 p-4">
              <div className="space-y-3">
                <div className="font-medium text-foreground">Default Filters</div>
                <div className="text-sm text-muted-foreground">Set defaults for your browse experience.</div>
                <div className="mt-2 grid gap-2">
                  <Label htmlFor="default-campus">Default campus</Label>
                  <Input id="default-campus" placeholder="e.g., State University - Main Campus" />
                </div>
              </div>
            </div>
          </SettingsSection>
        </div>

        {/* Right column: Support + Actions */}
        <div className="space-y-8">
          {/* SUPPORT */}
          <SettingsSection
            id="support"
            title="Support"
            icon={HelpCircle}
            description="Find answers, stay safe, or report an issue."
          >
            <div className="grid gap-2 p-4 md:grid-cols-2">
              <Link
                href="/help"
                className="group flex items-center justify-between rounded-md border p-3 hover:bg-muted"
              >
                <span className="flex items-center gap-2 text-sm">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" aria-hidden />
                  Help & FAQ
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground">Open</span>
              </Link>
              <Link
                href="/tos"
                className="group flex items-center justify-between rounded-md border p-3 hover:bg-muted"
              >
                <span className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" aria-hidden />
                  Community Guidelines
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground">View</span>
              </Link>
              <Link
                href="/help#safety"
                className="group flex items-center justify-between rounded-md border p-3 hover:bg-muted"
              >
                <span className="flex items-center gap-2 text-sm">
                  <TriangleAlert className="h-4 w-4 text-muted-foreground" aria-hidden />
                  Safety Tips for Meetings
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground">Read</span>
              </Link>
              <Link
                href="/help/report"
                className="group flex items-center justify-between rounded-md border p-3 hover:bg-muted"
              >
                <span className="flex items-center gap-2 text-sm">
                  <TriangleAlert className="h-4 w-4 text-muted-foreground" aria-hidden />
                  Report a Problem
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground">Report</span>
              </Link>
            </div>
          </SettingsSection>

          {/* ACTIONS */}
          <SettingsSection
            id="actions"
            title="Actions"
            icon={MapPin}
            description="Ambassador program and account controls."
          >
            <div className="grid gap-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
                <div className="space-y-0.5">
                  <div className="font-medium text-foreground">Become a Campus Ambassador</div>
                  <p className="text-sm text-muted-foreground">
                    Grow the marketplace at your university and earn rewards.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/help#ambassador">Apply</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div className="space-y-0.5">
                  <div className="font-medium text-foreground">Log Out</div>
                  <p className="text-sm text-muted-foreground">Sign out from this device.</p>
                </div>
                <Button variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" aria-hidden />
                  Log Out
                </Button>
              </div>

              <div className="mt-1 flex items-start justify-between gap-3 rounded-md border p-3">
                <div className="space-y-0.5">
                  <div className="font-medium text-foreground">Delete Account</div>
                  <p className="text-sm text-muted-foreground">Permanently remove your account and data.</p>
                </div>
                <Button variant="ghost" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                  Delete
                </Button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
      {/* </CHANGE> end two-column grid */}
    </main>
  )
}
