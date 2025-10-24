"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Calendar, BookOpen, User, Phone, Mail } from "lucide-react"

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false)
  const [confettiFn, setConfettiFn] = useState<null | ((opts?: any) => void)>(null)
  const submitBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let mounted = true
    import("canvas-confetti")
      .then((m) => {
        if (!mounted) return
        setConfettiFn(() => m.default as any)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const el = submitBtnRef.current
    if (el && confettiFn) {
      const rect = el.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight
      confettiFn({ particleCount: 120, spread: 70, origin: { x, y }, colors: ["#ffbf00", "#00a8e8", "#4cd964", "#0e2e47"] })
    }
    setTimeout(() => {
      setSubmitting(false)
      e.currentTarget.reset()
    }, 800)
  }

  // Deterministic animated background (orbs + dots) to avoid hydration mismatches
  const orbs = useMemo(() => {
    let seed = 3107
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
    let seed = 771
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

  const labelCls = "text-sm font-medium text-[#0e2e47]"
  const cardCls = "rounded-xl border bg-white p-6 shadow-sm"
  const fieldCls = "grid gap-2"

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#e6f7ff] to-white py-16 md:py-24">
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none">
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
      <div className="absolute inset-0 pointer-events-none">
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

      <div className="container relative z-10 px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ffbf00]/20 px-4 py-1 text-sm font-medium text-[#0e2e47]">
                <BookOpen className="h-4 w-4 text-[#ffbf00]" /> Parent Registration
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl">
                Enroll Your Child with Study Buddy
              </h1>
              <p className="mx-auto mt-3 max-w-[700px] text-gray-600 md:text-lg">
                Share a few details and we’ll match your child with the perfect tutor.
              </p>
            </motion.div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className={cardCls + " md:col-span-1"}>
              <div className="mb-4 flex items-center gap-2 text-[#0e2e47]">
                <User className="h-5 w-5" /> <span className="font-semibold">Parent Information</span>
              </div>
              <div className="grid gap-4">
                <div className={fieldCls}>
                  <label className={labelCls}>Parent Full Name</label>
                  <Input name="parentName" placeholder="Jane Doe" required className="bg-white" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className={fieldCls}>
                    <label className={labelCls}>Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input name="email" type="email" placeholder="jane@example.com" required className="pl-9 bg-white" />
                    </div>
                  </div>
                  <div className={fieldCls}>
                    <label className={labelCls}>Phone</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input name="phone" type="tel" placeholder="(555) 123-4567" required className="pl-9 bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cardCls + " md:col-span-1"}>
              <div className="mb-4 flex items-center gap-2 text-[#0e2e47]">
                <BookOpen className="h-5 w-5" /> <span className="font-semibold">Student Information</span>
              </div>
              <div className="grid gap-4">
                <div className={fieldCls}>
                  <label className={labelCls}>Student Full Name</label>
                  <Input name="studentName" placeholder="Johnny Doe" required className="bg-white" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className={fieldCls}>
                    <label className={labelCls}>Grade</label>
                    <select name="grade" required className="h-10 w-full rounded-md border bg-white px-3 text-sm">
                      <option value="">Select grade</option>
                      <option>Elementary</option>
                      <option>Middle School</option>
                      <option>High School</option>
                    </select>
                  </div>
                  <div className={fieldCls}>
                    <label className={labelCls}>Preferred Schedule</label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input name="schedule" placeholder="e.g. Weeknights, 6–8 PM" className="pl-9 bg-white" />
                    </div>
                  </div>
                </div>
                <div className={fieldCls}>
                  <label className={labelCls}>Subjects (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Math",
                      "Science",
                      "English",
                      "History",
                      "Computer Science",
                      "Languages",
                    ].map((s) => (
                      <label key={s} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-[#0e2e47] bg-white hover:bg-[#e6f7ff] cursor-pointer">
                        <input type="checkbox" name="subjects" value={s} className="accent-[#00a8e8]" />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={cardCls + " md:col-span-2"}>
              <div className={fieldCls}>
                <label className={labelCls}>Anything we should know?</label>
                <Textarea name="notes" placeholder="Learning goals, specific challenges, preferred teaching style, etc." className="min-h-[100px] bg-white" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-gray-500">We’ll reach out within one business day.</p>
                <Button ref={submitBtnRef} type="submit" disabled={submitting} className="bg-[#00a8e8] hover:bg-[#0077b6]">
                  {submitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </div>
          </motion.form>

          <motion.div
            className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Check className="h-4 w-4 text-[#4cd964]" /> Secure and private — we never share your information.
          </motion.div>
        </div>
      </div>
    </section>
  )
}


