import { BackButton } from "@/components/back-button"

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/browse" />
      </div>
      <h1 className="text-3xl font-semibold mb-4">Your Profile</h1>
      <p className="text-muted-foreground">Profile management coming soon.</p>
    </main>
  )
}
