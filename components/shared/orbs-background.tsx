"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

type OrbsBackgroundProps = {
  className?: string
}

export default function OrbsBackground({ className = "" }: OrbsBackgroundProps) {
  // Deterministic moving background elements (avoid hydration mismatch)
  const orbs = useMemo(() => {
    let seed = 2025
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    return Array.from({ length: 14 }, () => ({
      top: `${rand() * 100}%`,
      left: `${rand() * 100}%`,
      size: `${rand() * 200 + 140}px`,
      xAmp: rand() * 40 - 20,
      duration: rand() * 4 + 5,
      delay: rand() * 1.5,
      blur: rand() * 4 + 2,
    }))
  }, [])

  const dots = useMemo(() => {
    let seed = 9091
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 4294967296
      return seed / 4294967296
    }
    return Array.from({ length: 18 }, () => ({
      top: `${rand() * 100}%`,
      left: `${rand() * 100}%`,
      size: `${rand() * 22 + 10}px`,
      duration: rand() * 2 + 3,
      delay: rand() * 1.2,
    }))
  }, [])

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Gradient orbs */}
      <div className="absolute inset-0">
        {orbs.map((c, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-linear-to-r from-[#00a8e8]/30 to-[#4cd964]/30"
            style={{ top: c.top, left: c.left, width: c.size, height: c.size, filter: `blur(${c.blur}px)` }}
            animate={{ y: [0, -60, 0], x: [0, c.xAmp, 0], opacity: [0.28, 0.45, 0.28], scale: [1, 1.08, 1] }}
            transition={{ duration: c.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: c.delay }}
          />
        ))}
      </div>

      {/* Floating dots */}
      <div className="absolute inset-0">
        {dots.map((c, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full bg-[#00a8e8]/35"
            style={{ top: c.top, left: c.left, width: c.size, height: c.size }}
            animate={{ y: [0, -25, 0], x: [0, 16, 0], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: c.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: c.delay }}
          />
        ))}
      </div>
    </div>
  )
}






