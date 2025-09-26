"use client"

import type * as React from "react"
import Link from "next/link"
import { useMemo, useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  HelpCircle,
  BadgeCheck,
  Store,
  MapPin,
  MessageCircle,
  Mail,
  BookOpen,
  ShieldCheck,
  SearchIcon,
  ArrowRight,
} from "lucide-react"

type FaqItem = {
  id: string
  icon: React.ReactNode
  question: string
  answerSummary: string
  answerDetails: string
  keywords?: string[]
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "verify-account",
    icon: <BadgeCheck className="h-5 w-5 text-foreground" aria-hidden="true" />,
    question: "How to verify my account?",
    answerSummary: "Use your .edu email to confirm you’re part of campus.",
    answerDetails:
      "To keep our marketplace campus-only, we require a valid .edu email address. Head to Settings → Account and look for “Verify Email”. We’ll send a one-time link to your .edu inbox. Click it to complete verification. If you can’t find the email, check spam or request another link.",
    keywords: ["verify", "verification", "edu", "email", "account"],
  },
  {
    id: "sell-item",
    icon: <Store className="h-5 w-5 text-foreground" aria-hidden="true" />,
    question: "How to sell an item?",
    answerSummary: "Create a listing with clear photos and details.",
    answerDetails:
      "Go to Sell → New Listing. Add a clear title, at least 2 well-lit photos, a fair price, and honest condition notes. Pick a category so buyers can find it quickly. Listings with clear photos and specific details sell faster.",
    keywords: ["sell", "listing", "photos", "price", "condition"],
  },
  {
    id: "safe-meeting-spots",
    icon: <MapPin className="h-5 w-5 text-foreground" aria-hidden="true" />,
    question: "Safe meeting spots on campus",
    answerSummary: "Meet in public, well-lit areas—preferably with cameras.",
    answerDetails:
      "Choose a public spot like the campus library entrance, student union lobby, or other monitored common areas. Meet during daylight when possible, and let a friend know your plans. Avoid private rooms, residences, or remote areas.",
    keywords: ["safety", "meet", "meeting", "spot", "location"],
  },
  {
    id: "report-listing",
    icon: <ShieldCheck className="h-5 w-5 text-foreground" aria-hidden="true" />,
    question: "How do I report a listing or user?",
    answerSummary: "Use the Report option on the listing or profile.",
    answerDetails:
      "Open the listing or user profile and tap the ••• menu → Report. Select the reason and submit. Our team reviews reports quickly to protect your campus community.",
    keywords: ["report", "listing", "user", "abuse", "safety"],
  },
  {
    id: "reset-password",
    icon: <HelpCircle className="h-5 w-5 text-foreground" aria-hidden="true" />,
    question: "I forgot my password",
    answerSummary: "Reset via your .edu email from the login screen.",
    answerDetails:
      "On the login screen, select “Forgot password?”. Enter your .edu email and follow the reset link we send. If it doesn’t arrive within a few minutes, check spam or request another email.",
    keywords: ["password", "reset", "login", "email"],
  },
]

export default function HelpSupportContent() {
  const [query, setQuery] = useState("")
  const [mailtoHref, setMailtoHref] = useState<string>("")

  useEffect(() => {
    const subject = encodeURIComponent("Support Request - Campus Marketplace")
    const device = typeof navigator !== "undefined" ? navigator.userAgent : "unknown"
    const body = encodeURIComponent(
      [
        "Hi Support Team,",
        "",
        "I need help with:",
        "-",
        "",
        "Additional details:",
        "-",
        "",
        `Device: ${device}`,
        "Page: Help & Support",
      ].join("\n"),
    )
    // You can change the email address below to your support inbox
    setMailtoHref(`mailto:support@example.com?subject=${subject}&body=${body}`)
  }, [])

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return FAQ_DATA
    return FAQ_DATA.filter((f) => {
      const hay = [f.question, f.answerSummary, ...(f.keywords || [])].join(" ").toLowerCase()
      return hay.includes(q)
    })
  }, [query])

  return (
    <section className="space-y-8">
      {/* Search */}
      <div>
        <label htmlFor="help-search" className="sr-only">
          Search Help
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <SearchIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <Input
            id="help-search"
            placeholder="Search FAQs (e.g., verify, sell, safety)"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">FAQs</h2>
        {filteredFaqs.length === 0 ? (
          <p className="text-muted-foreground">No results. Try a different search term.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{item.question}</span>
                      <span className="text-sm text-muted-foreground">{item.answerSummary}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed text-foreground">{item.answerDetails}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Contact Support */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-5 w-5" aria-hidden="true" />
              Contact Support (Email)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Get help fast via email. We’ll reply with next steps.
            <div className="mt-3">
              <Button asChild className="w-full">
                <a href={mailtoHref}>
                  Email Support
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              In‑App Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Prefer chat? Open our in‑app support on seller pages.
            <div className="mt-3">
              <Button asChild variant="secondary" className="w-full">
                <Link href="/seller?chat=1">
                  Open Chat
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Resources</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Learn what’s okay to list and how to keep the marketplace fair.
              <div className="mt-3">
                <Button asChild size="sm" variant="outline">
                  <Link href="/tos">Read Guidelines</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Stay safe with best practices for meetups and payments.
              <div className="mt-3">
                <Button asChild size="sm" variant="outline">
                  <Link href="/privacy">View Tips</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="pointer-events-none sticky bottom-0 left-0 right-0">
        <div className="pointer-events-auto mx-auto max-w-3xl px-0 py-3">
          <Button asChild className="w-full">
            <a href={mailtoHref} aria-label="Contact Support via Email">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
