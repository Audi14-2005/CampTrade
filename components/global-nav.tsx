"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Settings, Bell, Shield, HelpCircle, User, Store, ShoppingCart, LogOut, LogIn } from "lucide-react"
import { useCart } from "@/lib/use-cart"
import { useAuth } from "@/lib/auth-context"

export default function GlobalNav() {
  const cart = useCart()
  const { user, signOut, groupName } = useAuth()
  const count = cart.items.reduce((acc, it) => acc + (it.__qty ?? 1), 0)

  return (
    <div className="flex items-center gap-2">
      {/* User info or auth buttons */}
      {user ? (
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-sm">
            <div className="font-medium">{user.email}</div>
            <div className="text-xs text-muted-foreground">{groupName}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <Button variant="outline" size="sm" className="bg-transparent">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      )}

      {/* Cart button with live count */}
      <Link href="/cart">
        <Button
          variant="outline"
          size="icon"
          aria-label={`Open cart (${count} items)`}
          className="relative shrink-0 bg-transparent"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] leading-5 text-center"
              aria-live="polite"
            >
              {count}
            </span>
          )}
          <span className="sr-only">Cart</span>
        </Button>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu" className="shrink-0 bg-transparent">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-80 sm:w-96 p-0">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-foreground">Menu</p>
            <p className="text-xs text-muted-foreground">Quick access</p>
          </div>

          <nav className="divide-y">
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Settings</span>
            </Link>

            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Notifications</span>
            </Link>

            <Link href="/privacy" className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Privacy</span>
            </Link>

            <Link href="/help" className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Help</span>
            </Link>

            <Link href="/browse" className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Buyer</span>
            </Link>

            <Link href="/seller" className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
              <Store className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Seller</span>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
