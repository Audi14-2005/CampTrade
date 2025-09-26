"use client"

import { useEffect, useRef, useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyContent() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      const tolerance = 8
      const reached = el.scrollTop + el.clientHeight >= el.scrollHeight - tolerance
      setAtBottom(reached)
    }

    // Initialize once in case content fits viewport
    onScroll()
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section aria-labelledby="privacy-overview" className="mt-6">
      {/* Summary section: quick scan */}
      <div className="rounded-lg border bg-card text-card-foreground p-4 md:p-6">
        <h2 id="privacy-overview" className="text-xl font-semibold text-balance mb-3">
          Quick summary
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Data we collect: your campus-verified email (.edu) and profile info you provide.</li>
          <li>How we use it: verify you belong to your campus and keep the community safe.</li>
          <li>We never sell your data. Ever.</li>
          <li>Your rights: edit your profile anytime or delete your account.</li>
        </ul>
      </div>

      {/* Detailed section: expandable */}
      <div
        ref={scrollRef}
        className="mt-6 max-h-[60vh] overflow-y-auto rounded-lg border bg-background p-4 md:p-6"
        aria-label="Privacy details. Scroll to the bottom to enable the Agree button."
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="collection">
            <AccordionTrigger className="text-left">Data Collection</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="mb-3">We collect only what we need to run a campus-only second-hand marketplace:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>.edu email address (for campus verification)</li>
                <li>Basic profile data you choose to provide (name, photo, campus, bio)</li>
              </ul>
              <p className="mt-3">
                We do not collect unnecessary personal information. You can update your profile data at any time.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="use">
            <AccordionTrigger className="text-left">Use of Data</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Confirm you belong to your campus community</li>
                <li>Help keep buyers and sellers safer by limiting access to verified students</li>
                <li>Operate and improve core features (listings, messaging, discovery)</li>
              </ul>
              <p className="mt-3">
                We do not use your data for unrelated advertising or profiling outside this app’s purpose.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="selling">
            <AccordionTrigger className="text-left">No Data Selling</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                We do not and will not sell your personal data to anyone. Period. We may use trusted service providers
                to support the app (for example, hosting), but they only process data strictly on our instructions and
                under appropriate safeguards.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rights">
            <AccordionTrigger className="text-left">Your Rights</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="mb-3">You’re in control of your information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Edit your profile information at any time</li>
                <li>Delete your account, which removes your profile and listings from the app</li>
              </ul>
              <p className="mt-3">
                If you have questions or requests related to your data, contact support from within the app.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 text-xs text-muted-foreground" aria-live="polite">
          {atBottom
            ? "You’ve reached the end. You can agree below."
            : "Scroll to the bottom to enable the Agree button."}
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-4 border-t bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur p-4 rounded-b-lg">
        <Button
          className="w-full text-base font-medium"
          disabled={!atBottom}
          aria-disabled={!atBottom}
          onClick={() => {
            // For now, simply return to the previous screen after agreeing.
            if (typeof window !== "undefined") {
              window.history.back()
            }
          }}
        >
          I Agree
        </Button>
        {!atBottom && (
          <p className="mt-2 text-xs text-muted-foreground">Read through the details above to enable this button.</p>
        )}
      </div>
    </section>
  )
}
