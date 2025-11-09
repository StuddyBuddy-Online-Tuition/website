'use client'

import { motion } from 'framer-motion'
import { Calculator, Atom, Languages, BookOpen, Brain, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import * as React from 'react'

type InteractiveLogoBadgesProps = {
  className?: string
}

export default function InteractiveLogoBadges({ className }: InteractiveLogoBadgesProps) {
  const burstAtElement = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x, y },
      colors: ['#ffbf00', '#00a8e8', '#4cd964', '#0e2e47'],
    })
  }

  return (
    <div className={className ? className : ''}>
      <div className="relative h-full w-full">
        <motion.button
          type="button"
          className="absolute top-[10%] right-[10%] h-16 w-16 cursor-pointer"
          whileHover={{ scale: 1.15, rotate: 8 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          onClick={(e) => burstAtElement(e.currentTarget)}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#ffbf00] shadow-md ring-1 ring-black/5">
            <Calculator className="h-8 w-8" />
          </div>
        </motion.button>

        <motion.button
          type="button"
          className="absolute bottom-[15%] left-[5%] h-16 w-16 cursor-pointer"
          whileHover={{ scale: 1.15, rotate: -8 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
          onClick={(e) => burstAtElement(e.currentTarget)}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#4cd964] shadow-md ring-1 ring-black/5">
            <Atom className="h-8 w-8" />
          </div>
        </motion.button>

        <motion.button
          type="button"
          className="absolute top-[40%] left-[0%] h-16 w-16 cursor-pointer"
          whileHover={{ scale: 1.15, rotate: 8 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 1 }}
          onClick={(e) => burstAtElement(e.currentTarget)}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#00a8e8] shadow-md ring-1 ring-black/5">
            <Languages className="h-8 w-8" />
          </div>
        </motion.button>

        <motion.button
          type="button"
          className="absolute top-[15%] left-[15%] h-14 w-14 cursor-pointer"
          whileHover={{ scale: 1.15, rotate: 6 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.4, delay: 0.2 }}
          onClick={(e) => burstAtElement(e.currentTarget)}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#00a8e8] shadow-md ring-1 ring-black/5">
            <BookOpen className="h-7 w-7" />
          </div>
        </motion.button>

        <motion.button
          type="button"
          className="absolute bottom-[10%] right-[20%] h-14 w-14 cursor-pointer"
          whileHover={{ scale: 1.15, rotate: -6 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.6, delay: 0.4 }}
          onClick={(e) => burstAtElement(e.currentTarget)}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#4cd964] shadow-md ring-1 ring-black/5">
            <Brain className="h-7 w-7" />
          </div>
        </motion.button>

        <motion.button
          type="button"
          className="absolute top-[55%] right-[25%] h-12 w-12 cursor-pointer"
          whileHover={{ scale: 1.15, rotate: 4 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.2, delay: 0.6 }}
          onClick={(e) => burstAtElement(e.currentTarget)}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#ffbf00] shadow-md ring-1 ring-black/5">
            <Sparkles className="h-6 w-6" />
          </div>
        </motion.button>
      </div>
    </div>
  )
}


