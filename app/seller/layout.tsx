"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const items = [
  { href: "/seller/home", label: "Home" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/todos", label: "To-do" },
  { href: "/notifications", label: "Notifications" },
  { href: "/settings", label: "Settings" },
]

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/seller/home")
    }
  }

  const isSellerHome = pathname === "/seller/home"
  const hideMobileHeader =
    isSellerHome ||
    pathname.startsWith("/seller/products") ||
    pathname.startsWith("/seller/orders") ||
    /^\/seller\/[^/]+\/new(\/.*)?$/.test(pathname)

  return (
    <div className="min-h-dvh grid md:grid-cols-[260px_1fr]">
      {!hideMobileHeader && (
        <div className="md:hidden sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className={cn("flex items-center p-3", isSellerHome ? "justify-start" : "justify-between")}>
            <Button variant="ghost" size="sm" onClick={goBack} aria-label="Go back">
              Back
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Open menu">
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="px-4 py-3 border-b">
                  <SheetTitle>Seller</SheetTitle>
                </SheetHeader>
                <nav className="grid p-2">
                  {items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={cn(
                        "px-3 py-2 rounded-md hover:bg-sidebar-accent",
                        pathname === it.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground",
                      )}
                    >
                      {it.label}
                    </Link>
                  ))}
                  <div className="px-3 py-2 text-muted-foreground mt-4 text-sm">More</div>
                  <button className="text-left px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground">
                    Logout
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      <aside className="hidden md:block border-r bg-sidebar p-4">
        <div className="px-2 py-2 font-semibold text-lg">Seller</div>
        <nav className="mt-2 grid">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "px-3 py-2 rounded-md hover:bg-sidebar-accent",
                pathname === it.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
              )}
            >
              {it.label}
            </Link>
          ))}
          <div className="px-3 py-2 text-muted-foreground mt-6 text-sm">More</div>
          <button className="text-left px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground">
            Logout
          </button>
        </nav>
      </aside>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  )
}
