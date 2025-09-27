import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CampTrade Mobile',
  description: 'Campus marketplace mobile app',
}

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
