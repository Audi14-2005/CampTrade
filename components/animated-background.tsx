"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
    id: number
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
}

interface AnimatedBackgroundProps {
    className?: string
}

export function AnimatedBackground({ className = "" }: AnimatedBackgroundProps) {
    const [particles, setParticles] = useState<Particle[]>([])
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        // Check for reduced motion preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
        setPrefersReducedMotion(mediaQuery.matches)

        const handleReducedMotionChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches)
        }

        mediaQuery.addEventListener("change", handleReducedMotionChange)
        updateDimensions()
        window.addEventListener("resize", updateDimensions)

        return () => {
            window.removeEventListener("resize", updateDimensions)
            mediaQuery.removeEventListener("change", handleReducedMotionChange)
        }
    }, [])

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return

        const newParticles: Particle[] = []
        // Reduce particle count for better performance on smaller screens
        const particleCount = Math.min(30, Math.floor((dimensions.width * dimensions.height) / 20000))

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.2 + 0.1,
            })
        }

        setParticles(newParticles)
    }, [dimensions])

    // If user prefers reduced motion, show static background
    if (prefersReducedMotion) {
        return (
            <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
            </div>
        )
    }

    return (
        <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Animated gradient background */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
                    ],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Floating particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: particle.x,
                        top: particle.y,
                        opacity: particle.opacity,
                    }}
                    animate={{
                        x: [0, particle.speedX * 100, 0],
                        y: [0, particle.speedY * 100, 0],
                        scale: [1, 1.2, 1],
                        opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Geometric shapes */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-300/20 rounded-full"
                animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
            />

            <motion.div
                className="absolute top-3/4 right-1/4 w-24 h-24 border border-purple-300/20 rotate-45"
                animate={{
                    rotate: [45, 405],
                    scale: [1, 0.8, 1],
                }}
                transition={{
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                    scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }}
            />

            <motion.div
                className="absolute top-1/2 right-1/3 w-16 h-16 border border-pink-300/20 rounded-lg"
                animate={{
                    rotate: [-15, 15, -15],
                    y: [-10, 10, -10],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Floating orbs */}
            <motion.div
                className="absolute top-1/3 right-1/2 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-sm"
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -20, 15, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-orange-500/20 rounded-full blur-sm"
                animate={{
                    x: [0, -25, 20, 0],
                    y: [0, 25, -15, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Subtle grid pattern */}
            <motion.div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                }}
                animate={{
                    backgroundPosition: ["0px 0px", "50px 50px"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    )
}
