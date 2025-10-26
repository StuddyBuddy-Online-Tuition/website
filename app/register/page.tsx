"use client"

import { useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, BookOpen, User, Phone, Mail, X, Languages, Dna, Atom, Globe, Calculator, FlaskConical } from "lucide-react"
import confetti from "canvas-confetti"

const GRADE_OPTIONS = ["S1", "S2", "S3", "S4", "S5", "F1", "F2", "F3", "F4", "F5", "CP"]
const SUBJECT_OPTIONS = [
  "English",
  "Bahasa Malaysia",
  "Biology",
  "Physics",
  "Geography",
  "Kimia",
  "Mathematics",
]
const SUBJECT_ICONS: Record<string, any> = {
  English: BookOpen,
  "Bahasa Malaysia": Languages,
  Biology: Dna,
  Physics: Atom,
  Geography: Globe,
  Kimia: FlaskConical,
  Mathematics: Calculator,
}

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [subjectsOpen, setSubjectsOpen] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const submitBtnRef = useRef<HTMLButtonElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      e.currentTarget.reset()
    }, 800)
  }

  const handleButtonClick = () => {
    const el = submitBtnRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight
      confetti({ particleCount: 120, spread: 70, origin: { x, y }, colors: ["#ffbf00", "#00a8e8", "#4cd964", "#0e2e47"] })
    }
    setSuccess(true)
  }

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    )
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
    <>
    <section className="relative overflow-hidden bg-linear-to-b from-[#e6f7ff] to-white py-12 md:py-24">
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
                Enroll Your Child with StudyBuddy
              </h1>
              <p className="mx-auto mt-3 max-w-[700px] text-gray-600 md:text-lg">
                Share a few details and we’ll match your child with the perfect tutor.
              </p>
            </motion.div>
          </div>

          {!success ? (
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
                  <Input name="parentname" placeholder="Nur Aisyah binti Ahmad" required className="bg-white" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className={fieldCls}>
                    <label className={labelCls}>Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input name="email" type="email" placeholder="contoh@email.com" required className="pl-9 bg-white" />
                    </div>
                  </div>
                  <div className={fieldCls}>
                    <label className={labelCls}>Phone</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input name="parentphone" type="tel" placeholder="012-345 6789" required className="pl-9 bg-white" />
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
                  <Input name="full_name" placeholder="Muhammad Danish bin Ali" required className="bg-white" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className={fieldCls}>
                    <label className={labelCls}>Choose Grade (For Year 2026)</label>
                    <select name="grade" required className="h-10 w-full rounded-md border bg-white px-3 text-sm">
                      <option value="">Grade</option>
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className={fieldCls}>
                    <label className={labelCls}>Student Phone</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input name="studentphone" type="tel" placeholder="013-987 6543" className="pl-9 bg-white" />
                    </div>
                  </div>
                </div>
                <div className={fieldCls}>
                  <label className={labelCls}>School</label>
                  <Input name="school" placeholder="SMK Taman Melawati" className="bg-white" />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls}>Preferred Name</label>
                  <Input name="name" placeholder="Danish" className="bg-white" />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls}>IC Number</label>
                  <Input name="ic_number" placeholder="010203-10-1234" className="bg-white" />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls}>Subjects</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" onClick={() => setSubjectsOpen(true)} className="border bg-white text-[#0e2e47] hover:bg-[#e6f7ff]">
                      {`Select subjects${selectedSubjects.length ? ` (${selectedSubjects.length})` : ""}`}
                    </Button>
                    {selectedSubjects.length === 0 ? (
                      <span className="text-sm text-gray-500">No subjects selected</span>
                    ) : (
                      selectedSubjects.map((s) => {
                        const Icon = SUBJECT_ICONS[s] || BookOpen
                        return (
                          <span key={s} className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-[#0e2e47] bg-white">
                            <Icon className="h-3.5 w-3.5" />
                            {s}
                            <button type="button" aria-label={`Remove ${s}`} onClick={() => toggleSubject(s)} className="hover:text-[#00a8e8]">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={cardCls + " md:col-span-2"}>
              <div className="mt-0 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
                <p className="text-sm text-gray-500">We’ll reach out within one business day.</p>
                <Button ref={submitBtnRef} type="submit" onClick={handleButtonClick} disabled={submitting} className="w-full sm:w-auto bg-[#00a8e8] hover:bg-[#0077b6]">
                  {submitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </div>
          </motion.form>
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className={cardCls + " md:col-span-2"}>
              <div className="flex flex-col items-center gap-3 text-center p-4 sm:p-6">
                <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#4cd964]/20">
                  <Check className="h-6 w-6 text-[#4cd964]" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#0e2e47]">Registration submitted</h2>
                <p className="text-gray-600 text-sm sm:text-base">We’ll contact you within one business day.</p>
              </div>
            </div>
          </motion.div>
          )}

          {/* Hidden inputs for selected subjects to submit with the form */}
          {!success && selectedSubjects.map((s) => (
            <input key={s} type="hidden" name="subjects" value={s} />
          ))}

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

    {/* Subjects selection modal */}
    <Dialog open={subjectsOpen} onOpenChange={setSubjectsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Select subjects</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUBJECT_OPTIONS.map((s, i) => {
            const id = `subject-${i}`
            const checked = selectedSubjects.includes(s)
            const Icon = SUBJECT_ICONS[s] || BookOpen
            return (
              <label key={s} htmlFor={id} className="flex items-center gap-3 rounded-md border p-3 hover:bg-[#f6fbff]">
                <Checkbox id={id} checked={checked} onCheckedChange={(v) => v === true ? toggleSubject(s) : toggleSubject(s)} />
                <span className="text-sm text-[#0e2e47] flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {s}
                </span>
              </label>
            )
          })}
        </div>
        <DialogFooter>
          <Button type="button" className="border bg-white text-[#0e2e47] hover:bg-[#e6f7ff]" onClick={() => setSelectedSubjects([])}>
            Clear
          </Button>
          <Button type="button" className="bg-[#00a8e8] hover:bg-[#0077b6]" onClick={() => setSubjectsOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    </>
  )
}


