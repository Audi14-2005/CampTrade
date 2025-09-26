import { BackButton } from "@/components/back-button"
import { TermsAcceptForm } from "@/components/tos-accept-form"

export default function TOSPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/" />
      </div>
      <h1 className="text-3xl font-semibold mb-4">Terms & Conditions</h1>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          By continuing, you agree that you are a verified student and will use Campus Tracker responsibly. You
          understand that:
        </p>
        <ul className="list-disc pl-6 text-foreground">
          <li>You are responsible for your transactions.</li>
          <li>Illegal or prohibited items (alcohol, weapons, etc.) are forbidden.</li>
          <li>This is a peer-to-peer platform; we are not liable for user transactions.</li>
        </ul>
        <TermsAcceptForm />
      </div>
    </main>
  )
}
