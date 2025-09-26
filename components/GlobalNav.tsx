"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Item = {
  href: string
  label: string
}

const items: Item[] = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/cart", label: "Cart" },
  { href: "/seller", label: "Seller" },
]

export default function GlobalNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sticky bottom nav */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      >
        <ul className="mx-auto flex max-w-xl items-center justify-between px-4 py-2">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "mx-auto flex w-full flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Using labels only for broad compatibility; icons can be added later */}
                  <span className="text-balance">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        {/* Reserve safe-area to avoid overlap on iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" aria-hidden="true" />
      </nav>
    </>
  )
}
