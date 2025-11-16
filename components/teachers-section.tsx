"use client"

import type { MouseEvent } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useInView } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { Teacher as TeachersContent } from "@/payload-types"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type TeacherEntry = NonNullable<TeachersContent["teachers"]>[number]
type SubjectEntry = NonNullable<TeacherEntry["subjects"]>[number]

const HOVER_TINT_CLASSES = [
  "from-[#00a8e8]/15", // blue
  "from-[#4cd964]/15", // green
  "from-[#ff8a00]/15", // orange
  "from-[#ff3b30]/15", // red
  "from-[#af52de]/15", // purple
  "from-[#5ac8fa]/15", // light blue
]

type TeachersSectionProps = {
  teachers: TeachersContent
}

export default function TeachersSection({ teachers }: TeachersSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const teacherEntries: TeacherEntry[] = teachers.teachers ?? []

  const [pageSize, setPageSize] = useState(4)
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [hintTeacher, setHintTeacher] = useState<string | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherEntry | null>(null)
  const [modalTriggerRect, setModalTriggerRect] = useState<DOMRect | null>(null)
  const [isClient, setIsClient] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const modalCloseButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (isInView) {
      setCurrentPage(1)
    }
  }, [isInView])

  useEffect(() => {
    setIsClient(true)
  }, [])

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

    function updatePageSize(): void {
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

  const totalPages = Math.max(1, Math.ceil(teacherEntries.length / pageSize))

  useEffect(() => {
    setCurrentPage((prev) => {
      const maxPage = totalPages || 1
      return prev > maxPage ? maxPage : prev
    })
  }, [totalPages])
  useEffect(() => {
    if (!selectedTeacher || typeof document === "undefined") {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedTeacher])

  const currentTeachers = useMemo<TeacherEntry[]>(() => {
    const start = (currentPage - 1) * pageSize
    return teacherEntries.slice(start, start + pageSize)
  }, [teacherEntries, currentPage, pageSize])

  // One-time mobile hint: briefly show the overlay for the first card to teach interaction
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches
      const seen = window.localStorage.getItem("teachersOverlayHintSeen")
      if (!isCoarse || seen) return
      const firstTeacher = teacherEntries[0]
      if (!firstTeacher) return
      const firstId = firstTeacher.id ?? `${firstTeacher.name}-0`
      setHintTeacher(firstId)
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
  }, [teacherEntries])

  const closeModal = useCallback(() => {
    setSelectedTeacher(null)
    setModalTriggerRect(null)
  }, [])

  useEffect(() => {
    if (!selectedTeacher) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeModal()
      }
      if (event.key === "Tab" && modalRef.current) {
        const focusableSelectors = [
          "a[href]",
          "button:not([disabled])",
          "textarea:not([disabled])",
          'input[type="text"]:not([disabled])',
          'input[type="radio"]:not([disabled])',
          'input[type="checkbox"]:not([disabled])',
          "select:not([disabled])",
        ]
        const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors.join(",")))
        if (focusable.length === 0) {
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [closeModal, selectedTeacher])

  useEffect(() => {
    if (selectedTeacher && modalCloseButtonRef.current) {
      modalCloseButtonRef.current.focus()
    }
  }, [selectedTeacher])

  const handleViewMore = useCallback(
    (teacher: TeacherEntry, event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      const rect = event.currentTarget.getBoundingClientRect()
      setModalTriggerRect(rect)
      setSelectedTeacher(teacher)
      console.log(teacher.description)
    },
    [],
  )

  const computeModalOrigins = useCallback(() => {
    if (!modalTriggerRect || typeof window === "undefined") {
      return {
        originX: 0.5,
        originY: 0.5,
        offsetX: 0,
        offsetY: 0,
      }
    }
    const centerX = modalTriggerRect.left + modalTriggerRect.width / 2
    const centerY = modalTriggerRect.top + modalTriggerRect.height / 2
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const originX = Math.min(Math.max(centerX / viewportWidth, 0), 1)
    const originY = Math.min(Math.max(centerY / viewportHeight, 0), 1)
    const offsetX = centerX - viewportWidth / 2
    const offsetY = centerY - viewportHeight / 2
    return { originX, originY, offsetX, offsetY }
  }, [modalTriggerRect])

  const modalOrigins = selectedTeacher ? computeModalOrigins() : { originX: 0.5, originY: 0.5, offsetX: 0, offsetY: 0 }

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
            <h2 className="text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl">{teachers.title}</h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">{teachers.description}</p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl py-12">
          <div className="relative pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid w-full grid-cols-1 gap-8 py-4 md:grid-cols-2 lg:grid-cols-4"
              >
                {currentTeachers.map((teacher, teacherIndex) => {
                  const absoluteIndex = (currentPage - 1) * pageSize + teacherIndex
                  const cardId = teacher.id ?? `${teacher.name}-${absoluteIndex}`
                  const imageData = teacher.photo?.image
                  const imageUrl = typeof imageData === "string" ? null : imageData?.url
                  const imageAlt = teacher.photo?.alt || (typeof imageData !== "string" ? imageData?.alt : "") || teacher.name
                  const subjectPills = ((teacher.subjects ?? []) as SubjectEntry[]).slice(0, 3)
                  const hoverTintIndex = (absoluteIndex % HOVER_TINT_CLASSES.length + HOVER_TINT_CLASSES.length) % HOVER_TINT_CLASSES.length
                  return (
                    <div
                      key={cardId}
                      className="group relative overflow-hidden rounded-2xl border border-transparent bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00a8e8]/40 hover:shadow-2xl h-[420px] md:h-[440px] lg:h-[460px] cursor-pointer"
                      role="button"
                      aria-pressed={activeCard === cardId}
                      aria-label={`View subjects for ${teacher.name}`}
                      onMouseEnter={() => setHoveredCard(cardId)}
                      onMouseLeave={() => setHoveredCard((prev) => (prev === cardId ? null : prev))}
                      onClick={() => setActiveCard((prev) => (prev === cardId ? null : cardId))}
                    >
                      {/* Brand tint and glow accents to match site language */}
                      <div className="pointer-events-none absolute -right-8 -top-8 z-20 h-28 w-28 rounded-full bg-linear-to-br from-[#00a8e8]/20 to-transparent blur-2xl" />
                      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#00a8e8]/20 blur-3xl" />
                      </div>

                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={imageAlt}
                        fill
                        className="absolute inset-0 z-0 h-full w-full object-cover object-top md:object-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div
                        className={`absolute inset-0 z-10 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none ${
                          HOVER_TINT_CLASSES[hoverTintIndex]
                        }`}
                      />
                      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/30 via-black/0 to-transparent pointer-events-none" />

                      {/* Always-visible minimal name label */}
                      <div
                        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-xl border border-white/60 bg-white/70 px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-300 w-auto max-w-[85%] ${
                          activeCard === cardId || hoveredCard === cardId ? 'opacity-0 translate-y-1' : 'opacity-100'
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
                        animate={activeCard === cardId || hoveredCard === cardId || hintTeacher === cardId ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
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
                          {subjectPills.map((subject, pillIndex) => (
                            <span
                              key={subject.id ?? `${teacher.name}-${pillIndex}-${subject.label}`}
                              className="inline-flex items-center rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-medium text-[#00a8e8] transition-transform duration-300 group-hover:-translate-y-0.5"
                            >
                              {subject.label}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-xs text-[#516276] md:text-sm">{teacher.title}</p>
                          <button
                            type="button"
                            onClick={(event) => handleViewMore(teacher, event)}
                            className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#0e2e47] shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
                            aria-label={`View more about ${teacher.name}`}
                          >
                            View more
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
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
      {isClient &&
        createPortal(
          <AnimatePresence>
            {selectedTeacher && (
              <motion.div
                key="teachers-modal-backdrop"
                className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={selectedTeacher.name}
                  ref={modalRef}
                  className="relative mx-4 w-full max-w-xl overflow-hidden rounded-3xl border border-[#8fd9ff]/60 bg-white/80 shadow-2xl backdrop-blur-xl md:mx-8 lg:max-w-lg"
                  initial={{
                    opacity: 0,
                    scale: 0.45,
                    x: modalOrigins.offsetX,
                    y: modalOrigins.offsetY,
                    borderRadius: "24px",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    borderRadius: "32px",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.4,
                    x: modalOrigins.offsetX,
                    y: modalOrigins.offsetY,
                    borderRadius: "24px",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 22,
                  }}
                  style={{
                    transformOrigin: `${modalOrigins.originX * 100}% ${modalOrigins.originY * 100}%`,
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="relative h-[560px] bg-[#f4f9ff] sm:h-[620px] lg:h-[680px]">
                    {(() => {
                      const selectedImageData = selectedTeacher.photo?.image
                      const selectedImageUrl = typeof selectedImageData === "string" ? null : selectedImageData?.url
                      const selectedImageAlt =
                        selectedTeacher.photo?.alt ||
                        (typeof selectedImageData !== "string" ? selectedImageData?.alt : "") ||
                        selectedTeacher.name
                      return (
                        <Image
                          src={selectedImageUrl || "/placeholder.svg"}
                          alt={selectedImageAlt}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 640px, (min-width: 768px) 540px, 90vw"
                        />
                      )
                    })()}
                    <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-transparent" />
                    <button
                      ref={modalCloseButtonRef}
                      type="button"
                      aria-label="Close"
                      onClick={closeModal}
                      className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/80 text-lg font-semibold text-[#0e2e47] shadow-sm transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a8e8]/60"
                    >
                      ×
                    </button>
                    <motion.div
                      className="absolute inset-x-3 bottom-3 rounded-2xl border border-[#a8e9ff]/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl sm:inset-x-5 sm:bottom-5"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-[#0e2e47] md:text-2xl">{selectedTeacher.name}</h3>
                          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-[#00a8e8]">{selectedTeacher.title}</p>
                        </div>
                      </div>
                      {selectedTeacher.description && (
                        <p className="mt-3 text-sm text-[#516276] md:text-base whitespace-pre-line">{selectedTeacher.description}</p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {((selectedTeacher.subjects ?? []) as SubjectEntry[]).map((subject, idx) => (
                          <span
                            key={subject.id ?? `${selectedTeacher.name}-modal-${idx}-${subject.label}`}
                            className="inline-flex items-center rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-medium text-[#00a8e8]"
                          >
                            {subject.label}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  )
}
