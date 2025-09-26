"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Splash() {
  const router = useRouter()

  useEffect(() => {
    const seen = typeof window !== "undefined" && window.localStorage.getItem("campustrade_splash_seen")
    const timeout = setTimeout(() => {
      router.replace("/")
      if (!seen) window.localStorage.setItem("campustrade_splash_seen", "1")
    }, 1400)
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <main className="min-h-dvh grid place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.45, type: "spring" }}
          className="text-4xl font-semibold"
        >
          CampTrade
        </motion.div>
        <div className="mt-3 text-muted-foreground">Connecting students, one trade at a time</div>
      </motion.div>
    </main>
  )
}
