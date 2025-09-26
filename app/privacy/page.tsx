import { BackButton } from "@/components/back-button"
import PrivacyPolicyContent from "@/components/privacy-policy-content"

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/" />
      </div>
      <h1 className="text-3xl font-semibold mb-4">Privacy & Policy</h1>
      <p className="text-muted-foreground">We value your privacy. This page describes how we handle data.</p>
      <PrivacyPolicyContent />
    </main>
  )
}
