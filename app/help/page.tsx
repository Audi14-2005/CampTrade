import { BackButton } from "@/components/back-button"
import HelpSupportContent from "@/components/help-support"

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-10">
      {/* header */}
      <div className="mb-4">
        <BackButton fallback="/" />
      </div>

      <header className="mb-4">
        <h1 className="text-3xl font-semibold text-foreground text-balance">Help & Support</h1>
        <p className="text-muted-foreground mt-1">Quickly find answers and get help from our team.</p>
      </header>

      <HelpSupportContent />
    </main>
  )
}
