"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const TEACHERS = [
  {
    name: "Ms. Sarah Johnson",
    role: "Math Specialist",
  image: "/t5.jpeg",
    description: "With 10+ years of experience teaching mathematics, Ms. Johnson makes numbers fun!",
    subjects: ["Algebra", "Geometry", "Calculus"],
  },
  {
    name: "Mr. David Chen",
    role: "Science Expert",
  image: "/t2.jpeg",
    description: "Mr. Chen brings science to life through exciting experiments and clear explanations.",
    subjects: ["Physics", "Chemistry", "Biology"],
  },
  {
    name: "Mrs. Emily Rodriguez",
    role: "Language Arts Tutor",
  image: "/t7.jpeg",
    description: "Mrs. Rodriguez inspires a love of reading and writing in all her students.",
    subjects: ["English", "Literature", "Writing"],
  },
  {
    name: "Dr. Michael Lee",
    role: "History & Social Studies",
    image: "/t8.jpeg",
    description: "Dr. Lee makes history fascinating with his storytelling approach to teaching.",
    subjects: ["History", "Geography", "Social Studies"],
  },
  {
    name: "Ms. Priya Patel",
    role: "STEM Integration Coach",
  image: "/t1.jpeg",
    description: "Ms. Patel connects STEM concepts with real-world challenges that spark curiosity.",
    subjects: ["STEM", "Robotics", "Coding"],
  },
  {
    name: "Mr. Andrew Martin",
    role: "Test Prep Strategist",
  image: "/t6.jpeg",
    description: "Mr. Martin equips students with confidence-building strategies for high-stakes exams.",
    subjects: ["SAT", "ACT", "PSLE"],
  },
  {
    name: "Dr. Hana Suzuki",
    role: "Creative Arts Mentor",
   image: "/t3.jpeg",
    description: "Dr. Suzuki blends creativity and critical thinking through multimedia storytelling.",
    subjects: ["Art", "Media Studies", "Drama"],
  },
  {
    name: "Coach Liam O'Connor",
    role: "Executive Skills Coach",
  image: "/t4.jpeg",
    description: "Coach Liam helps learners master organisation, focus, and growth mindset habits.",
    subjects: ["Study Skills", "Mindset", "Leadership"],
  },
]

type Teacher = (typeof TEACHERS)[number]

const HOVER_TINT_CLASSES = [
  "from-[#00a8e8]/15", // blue
  "from-[#4cd964]/15", // green
  "from-[#ff8a00]/15", // orange
  "from-[#ff3b30]/15", // red
  "from-[#af52de]/15", // purple
  "from-[#5ac8fa]/15", // light blue
]

export default function TeachersSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const teachers = TEACHERS

  const [pageSize, setPageSize] = useState(4)
  const totalPages = Math.ceil(teachers.length / pageSize)
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [hintTeacher, setHintTeacher] = useState<string | null>(null)

  useEffect(() => {
    if (isInView) {
      setCurrentPage(1)
    }
  }, [isInView])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const resolvePageSize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        return 4
      }

      if (window.matchMedia("(min-width: 768px)").matches) {
        return 2
      }

      return 1
    }

    const updatePageSize = () => {
      setPageSize((prev) => {
        const next = resolvePageSize()
        return prev === next ? prev : next
      })
    }

    updatePageSize()
    window.addEventListener("resize", updatePageSize)

    return () => {
      window.removeEventListener("resize", updatePageSize)
    }
  }, [])

  useEffect(() => {
    setCurrentPage((prev) => {
      const maxPage = totalPages || 1
      return prev > maxPage ? maxPage : prev
    })
  }, [totalPages])

  const pages = useMemo<Teacher[][]>(
    () => Array.from({ length: totalPages }, (_, pageIndex) => teachers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)),
    [teachers, pageSize, totalPages],
  )

  // One-time mobile hint: briefly show the overlay for the first card to teach interaction
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches
      const seen = window.localStorage.getItem("teachersOverlayHintSeen")
      if (!isCoarse || seen) return
      const firstGroup = pages[0]
      const firstTeacher = firstGroup && firstGroup[0]
      if (!firstTeacher) return
      setHintTeacher(firstTeacher.name)
      const timer = window.setTimeout(() => {
        setHintTeacher(null)
        window.localStorage.setItem("teachersOverlayHintSeen", "1")
      }, 700)
      return () => {
        window.clearTimeout(timer)
      }
    } catch {
      // noop if storage/matchMedia unavailable
    }
  }, [pages])

  const getVisiblePages = (total: number, current: number): (number | "ellipsis")[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    const pages: (number | "ellipsis")[] = [1]
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    if (start > 2) pages.push("ellipsis")
    for (let p = start; p <= end; p++) pages.push(p)
    if (end < total - 1) pages.push("ellipsis")
    pages.push(total)
    return pages
  }

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    if (nextPage === currentPage) return

    setCurrentPage(nextPage)
  }

  return (
    <section id="teachers" ref={ref} className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#e6ffea] px-3 py-1 text-sm text-[#4cd964]">Our Teachers</div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl">
              Meet Our Amazing Tutors
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our passionate educators are dedicated to helping your child succeed.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl py-12">
          <div className="relative overflow-x-hidden pb-6">
            <motion.div
              initial={false}
              animate={{ x: `-${(currentPage - 1) * 100}%` }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex w-full py-4"
            >
              {pages.map((group, pageIndex) => (
                <div key={pageIndex} className="grid w-full shrink-0 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {group.map((teacher) => (
                    <div
                      key={teacher.name}
                      className="group relative overflow-hidden rounded-2xl border border-transparent bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00a8e8]/40 hover:shadow-2xl h-[420px] md:h-[440px] lg:h-[460px] cursor-pointer"
                      role="button"
                      aria-pressed={activeCard === teacher.name}
                      aria-label={`View subjects for ${teacher.name}`}
                      onMouseEnter={() => setHoveredCard(teacher.name)}
                      onMouseLeave={() => setHoveredCard((prev) => (prev === teacher.name ? null : prev))}
                      onClick={() => setActiveCard((prev) => (prev === teacher.name ? null : teacher.name))}
                    >
                      {/* Brand tint and glow accents to match site language */}
                      <div className="pointer-events-none absolute -right-8 -top-8 z-20 h-28 w-28 rounded-full bg-linear-to-br from-[#00a8e8]/20 to-transparent blur-2xl" />
                      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#00a8e8]/20 blur-3xl" />
                      </div>

                      <Image
                        src={teacher.image || "/placeholder.svg"}
                        alt={teacher.name}
                        fill
                        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div
                        className={`absolute inset-0 z-10 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none ${
                          HOVER_TINT_CLASSES[
                            (TEACHERS.findIndex((t) => t.name === teacher.name) % HOVER_TINT_CLASSES.length + HOVER_TINT_CLASSES.length) %
                              HOVER_TINT_CLASSES.length
                          ]
                        }`}
                      />
                      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/30 via-black/0 to-transparent pointer-events-none" />

                      {/* Always-visible minimal name label */}
                      <div
                        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-xl border border-white/60 bg-white/70 px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-300 w-auto max-w-[85%] ${
                          activeCard === teacher.name || hoveredCard === teacher.name ? 'opacity-0 translate-y-1' : 'opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="truncate text-center text-sm font-medium text-[#0e2e47] md:text-base">{teacher.name}</h3>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`h-3.5 w-3.5 text-[#0e2e47]/70 transition-transform duration-300 ${
                              activeCard === teacher.name || hoveredCard === teacher.name ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>

                      <motion.div
                        initial={false}
                        animate={activeCard === teacher.name || hoveredCard === teacher.name || hintTeacher === teacher.name ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.35 }}
                        className="absolute inset-x-3 bottom-3 z-30 rounded-xl border border-white/60 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md"
                      >
                        <button
                          type="button"
                          aria-label="Close"
                          onClick={(e) => {
                            e.stopPropagation()
                            setHoveredCard(null)
                            setActiveCard(null)
                          }}
                          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/80 text-sm font-semibold text-[#0e2e47] shadow-sm hover:bg-white/90"
                        >
                          ×
                        </button>
                        <h3 className="truncate text-base font-bold text-[#0e2e47] md:text-lg">{teacher.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {teacher.subjects.slice(0, 3).map((subject) => (
                            <span
                              key={subject}
                              className="inline-flex items-center rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-medium text-[#00a8e8] transition-transform duration-300 group-hover:-translate-y-0.5"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
          <Pagination className="mt-10 w-full justify-center">
            <PaginationContent className="rounded-full bg-[#f2fbff] px-3 py-1.5 shadow-sm">
              <PaginationItem>
                <PaginationPrevious
                  href="#teachers"
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1)
                    }
                  }}
                  className="text-[#0e2e47] hover:text-[#00a8e8]"
                  data-disabled={currentPage === 1}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem className="sm:hidden">
                <span className="px-2 text-xs font-medium text-[#0e2e47]">
                  {currentPage} / {totalPages}
                </span>
              </PaginationItem>
              {(() => {
                const items = getVisiblePages(totalPages, currentPage)
                return items.map((token, idx) => {
                  if (token === "ellipsis") {
                    return (
                      <PaginationItem key={`e-${idx}`} className="hidden sm:list-item">
                        <span className="px-2 text-[#0e2e47]">…</span>
                      </PaginationItem>
                    )
                  }
                  const page = token as number
                  return (
                    <PaginationItem key={page} className="hidden sm:list-item">
                      <PaginationLink
                        href="#teachers"
                        isActive={page === currentPage}
                        onClick={(event) => {
                          event.preventDefault()
                          handlePageChange(page)
                        }}
                        className={page === currentPage ? "border-[#00a8e8] text-[#00a8e8]" : "text-[#0e2e47] hover:text-[#00a8e8]"}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })
              })()}
              <PaginationItem>
                <PaginationNext
                  href="#teachers"
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1)
                    }
                  }}
                  className="text-[#0e2e47] hover:text-[#00a8e8]"
                  data-disabled={currentPage === totalPages}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  )
}
