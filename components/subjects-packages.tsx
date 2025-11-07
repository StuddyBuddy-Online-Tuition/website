"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter } from "next/navigation"

type StudyPackage = {
  id: string
  groupName: string
  tier: string
  normalPriceMonthly?: number
  promoPriceMonthly?: number
  promoStart?: string
  promoEnd?: string
  popular?: boolean
  subjects: string[]
}

type SubjectsPackagesProps = {
  packages: StudyPackage[]
  selectedPackageId: string | null
  setSelectedPackageId: (id: string) => void
  setSelectedSubjects: (subjects: string[]) => void
  isInView: boolean
}

function isPromoActive(pkg: StudyPackage, now: Date = new Date()) {
  if (!pkg?.promoStart || !pkg?.promoEnd) return false
  const start = new Date(pkg.promoStart)
  const end = new Date(pkg.promoEnd)
  return now >= start && now <= end
}

function getPackagePricing(pkg: StudyPackage) {
  const promo = isPromoActive(pkg)
  const normalPrice = typeof pkg.normalPriceMonthly === "number" ? pkg.normalPriceMonthly : (pkg as any).priceMonthly
  const promoPrice = typeof pkg.promoPriceMonthly === "number" ? pkg.promoPriceMonthly : normalPrice
  return {
    isPromo: promo && promoPrice !== undefined,
    price: promo ? promoPrice : normalPrice,
    normalPrice,
    promoPrice,
  }
}

export function SubjectsPackages(props: SubjectsPackagesProps) {
  const { packages, selectedPackageId, setSelectedPackageId, setSelectedSubjects, isInView } = props
  const router = useRouter()
  const [pageSize, setPageSize] = useState(3)
  const [currentPage, setCurrentPage] = useState(1)

  // Resolve responsive page size like subjects section
  useEffect(() => {
    if (typeof window === "undefined") return
    const resolvePageSize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) return 3
      if (window.matchMedia("(min-width: 768px)").matches) return 2
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
    return () => window.removeEventListener("resize", updatePageSize)
  }, [])

  const totalPages = Math.max(1, Math.ceil(packages.length / pageSize))

  useEffect(() => {
    setCurrentPage((prev) => {
      const maxPage = totalPages || 1
      return prev > maxPage ? maxPage : prev
    })
  }, [totalPages])

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    if (nextPage === currentPage) return
    setCurrentPage(nextPage)
  }

  const getVisiblePages = (total: number, current: number): (number | "ellipsis")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | "ellipsis")[] = [1]
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    if (start > 2) pages.push("ellipsis")
    for (let p = start; p <= end; p++) pages.push(p)
    if (end < total - 1) pages.push("ellipsis")
    pages.push(total)
    return pages
  }

  return (
    <div className="w-full">
      <div className="relative overflow-x-hidden pb-0">
        <motion.div
          initial={false}
          animate={{ x: `-${(currentPage - 1) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex w-full"
        >
        {Array.from({ length: Math.max(1, Math.ceil(packages.length / pageSize)) }, (_, pageIndex) => (
          <div key={pageIndex} className="grid w-full shrink-0 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages
          .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
          .map((pkg, idx) => {
          const pricing = getPackagePricing(pkg)
          const selected = selectedPackageId === pkg.id
          const visible = pkg.subjects.slice(0, 6)
          const extra = Math.max(0, pkg.subjects.length - visible.length)
          return (
            <motion.div
              key={pkg.id}
              style={{
                transform: isInView ? "none" : "translateY(20px)",
                opacity: isInView ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.06 * idx}s`,
                transformPerspective: 1000,
              }}
              whileHover={{ y: -14, rotateX: -3, rotateY: 3, scale: 1.02 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.12 }}
              className={`group relative overflow-hidden flex flex-col space-y-4 rounded-xl border bg-white p-6 shadow-md transition-all duration-150 hover:shadow-2xl ${
                selected ? "border-2 border-[#00a8e8] shadow-lg" : "hover:border-[#00a8e8]/40"
              }`}
            >
              {/* Accent and glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-linear-to-br from-[#00a8e8]/20 to-transparent blur-2xl" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#00a8e8]/20 blur-3xl" />
              </div>

              {pkg.popular && (
                <div className="absolute right-4 top-4">
                  <Badge className="bg-[#ffbf00] text-[#0e2e47] border-[#ffbf00]">Popular</Badge>
                </div>
              )}

              <div>
                <div className="text-sm text-[#00a8e8]">{pkg.groupName}</div>
                <h3 className="text-xl font-bold text-[#0e2e47]">{pkg.tier}</h3>
              </div>

              {/* Pricing row */}
              <div className="flex items-baseline gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-[#0e2e47]/70">RM</span>
                  <span className="text-3xl font-extrabold tracking-tight text-[#0e2e47]">{pricing.price.toFixed(2)}</span>
                </div>
                {pricing.isPromo ? (
                  <div className="text-sm text-gray-500 line-through">RM {pricing.normalPrice.toFixed(2)}</div>
                ) : null}
                <span className="ml-auto text-xs text-gray-500">per month</span>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-[#0e2e47]">Included subjects</div>
                <div className="flex flex-wrap gap-2">
                  {visible.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-medium text-[#00a8e8] transition-transform duration-300 group-hover:-translate-y-0.5"
                    >
                      {s}
                    </span>
                  ))}
                  {extra > 0 && (
                    <span className="inline-flex items-center rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-medium text-[#00a8e8] transition-transform duration-300 group-hover:-translate-y-0.5">
                      +{extra} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-auto">
                <Button
                  className={selected ? "w-full bg-[#4cd964] hover:bg-[#39c553]" : "w-full bg-[#00a8e8] hover:bg-[#0077b6]"}
                  onClick={() => {
                    setSelectedPackageId(pkg.id)
                    setSelectedSubjects(pkg.subjects)
                  }}
                >
                  {selected ? "Selected" : "Select Package"}
                </Button>
                {selected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-center text-xs font-medium text-[#00a8e8]"
                  >
                    Package selected
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
          </div>
        ))}
        </motion.div>
      </div>

      <Pagination className="mt-10 w-full justify-center">
        <PaginationContent className="rounded-full bg-[#f2fbff] px-3 py-1.5 shadow-sm">
          <PaginationItem>
            <PaginationPrevious
              href="#subjects"
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
              {currentPage} / {Math.max(1, Math.ceil(packages.length / pageSize))}
            </span>
          </PaginationItem>
          {(() => {
            const levelTotal = Math.max(1, Math.ceil(packages.length / pageSize))
            const items = getVisiblePages(levelTotal, currentPage)
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
                    href="#subjects"
                    isActive={page === currentPage}
                    onClick={(event) => {
                      event.preventDefault()
                      handlePageChange(page)
                    }}
                    className={
                      page === currentPage ? "border-[#00a8e8] text-[#00a8e8]" : "text-[#0e2e47] hover:text-[#00a8e8]"
                    }
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
              href="#subjects"
              onClick={(event) => {
                event.preventDefault()
                const levelTotal = Math.max(1, Math.ceil(packages.length / pageSize))
                if (currentPage < levelTotal) {
                  handlePageChange(currentPage + 1)
                }
              }}
              className="text-[#0e2e47] hover:text-[#00a8e8]"
              data-disabled={currentPage === Math.max(1, Math.ceil(packages.length / pageSize))}
              aria-disabled={currentPage === Math.max(1, Math.ceil(packages.length / pageSize))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {selectedPackageId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 flex flex-col items-center"
        >
          <p className="mb-4 text-gray-600">
            Selected package:
            <span className="font-medium text-[#00a8e8]"> {packages.find((p) => p.id === selectedPackageId)?.tier}</span>
            {" "}with {packages.find((p) => p.id === selectedPackageId)?.subjects.length || 0} subject
            {(packages.find((p) => p.id === selectedPackageId)?.subjects.length || 0) !== 1 ? "s" : ""}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              className="bg-[#00a8e8] hover:bg-[#0077b6]"
              onClick={() => {
                const selected = packages.find((p) => p.id === selectedPackageId)
                const subjects = selected ? selected.subjects : []
                const q = subjects.slice(0, 10).map((s) => encodeURIComponent(s)).join(",")
                const pkgGroup = selected ? encodeURIComponent(selected.groupName) : ""
                const pkgTier = selected ? encodeURIComponent(selected.tier) : ""
                const pkgParams = selected ? `&package_groupName=${pkgGroup}&package_tier=${pkgTier}` : ""
                router.push(`/?package_id=${encodeURIComponent(selectedPackageId)}&subjects=${q}${pkgParams}#contact`)
              }}
            >
              Request Information
            </Button>
            <Button
              type="button"
              className="border bg-white text-[#0e2e47] hover:bg-[#e6f7ff]"
              onClick={() => {
                setSelectedPackageId(null)
                setSelectedSubjects([])
              }}
            >
              Clear Selection
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}


