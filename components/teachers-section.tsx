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
  image: "/t1.jpeg",
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
  image: "/t3.jpeg",
    description: "Mrs. Rodriguez inspires a love of reading and writing in all her students.",
    subjects: ["English", "Literature", "Writing"],
  },
  {
    name: "Dr. Michael Lee",
    role: "History & Social Studies",
  image: "/t4.jpg",
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
  image: "/t2.jpeg",
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
  image: "/t4.jpg",
    description: "Coach Liam helps learners master organisation, focus, and growth mindset habits.",
    subjects: ["Study Skills", "Mindset", "Leadership"],
  },
]

type Teacher = (typeof TEACHERS)[number]

export default function TeachersSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const teachers = TEACHERS

  const [pageSize, setPageSize] = useState(4)
  const totalPages = Math.ceil(teachers.length / pageSize)
  const [currentPage, setCurrentPage] = useState(1)

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
              className="flex w-full"
            >
              {pages.map((group, pageIndex) => (
                <div key={pageIndex} className="grid w-full shrink-0 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {group.map((teacher) => (
                    <div
                      key={teacher.name}
                      className="group relative overflow-hidden rounded-2xl border border-transparent bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00a8e8]/40 hover:shadow-2xl"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-[#00a8e8]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <Image
                          src={teacher.image || "/placeholder.svg"}
                          alt={teacher.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                        />
                        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-[#0e2e47] shadow-sm backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span>{teacher.role}</span>
                          <span className="text-[#00a8e8]">{teacher.subjects[0]}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-[#0e2e47]">{teacher.name}</h3>
                        <p className="mt-2 text-sm text-gray-600">{teacher.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {teacher.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="inline-flex items-center rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-medium text-[#00a8e8] transition-transform duration-300 group-hover:-translate-y-0.5"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
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
