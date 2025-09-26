import type { ReactNode } from "react"
import { localDescriptions } from "./local-descriptions"

export default function ProductLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { id: string }
}) {
  const showHeading = ["p1", "p2", "p3"].includes(params.id)

  return (
    <div className="space-y-6">
      <main>{children}</main>
      {showHeading && (
        <section aria-labelledby="product-descriptions-heading" className="pt-2">
          <h2 id="product-descriptions-heading" className="text-xl font-semibold text-foreground text-balance">
            Product Descriptions
          </h2>
          {localDescriptions[params.id] && (
            <div className="mt-2">
              <p className="whitespace-pre-line text-sm text-foreground">{localDescriptions[params.id]}</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
