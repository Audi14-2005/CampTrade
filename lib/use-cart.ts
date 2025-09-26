"use client"

import { create } from "zustand"
// add persist middleware
import { persist, createJSONStorage } from "zustand/middleware"

type Item = {
  id: string
  title: string
  price: number
  images?: string[]
  __qty?: number
}

type CartStore = {
  items: Item[]
  add: (item: Item) => void
  remove: (id: string) => void
  inc: (id: string) => void
  dec: (id: string) => void
  clear: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const exists = s.items.find((i) => i.id === item.id)
          if (exists) {
            return {
              items: s.items.map((i) => (i.id === item.id ? { ...i, __qty: (i.__qty ?? 1) + 1 } : i)),
            }
          }
          return { items: [...s.items, { ...item, __qty: 1 }] }
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      inc: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, __qty: (i.__qty ?? 1) + 1 } : i)),
        })),
      dec: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, __qty: Math.max(1, (i.__qty ?? 1) - 1) } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "campustrade-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)
