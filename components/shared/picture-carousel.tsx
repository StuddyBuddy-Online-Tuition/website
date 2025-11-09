'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { MousePointerClick } from 'lucide-react'

type Picture = {
  src: string
  alt: string
  caption?: string
}

type PictureCarouselProps = {
  images: Picture[]
  className?: string
}

export default function PictureCarousel({ images, className }: PictureCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [naturalSize, setNaturalSize] = React.useState<{ w: number; h: number } | null>(null)

  React.useEffect(() => {
    if (!api) return
    const handleSelect = () => {
      try {
        setSelectedIndex(api.selectedScrollSnap())
      } catch {
        // no-op
      }
    }
    handleSelect()
    api.on('select', handleSelect)
    api.on('reInit', handleSelect)
    return () => {
      api.off('select', handleSelect)
      api.off('reInit', handleSelect)
    }
  }, [api])

  const totalPages = images.length

  // Autoplay: advance every few seconds, wrap to start at the end
  React.useEffect(() => {
    if (!api || totalPages <= 1 || lightboxOpen) return
    const intervalId = window.setInterval(() => {
      try {
        const isLast = selectedIndex >= totalPages - 1
        if (isLast) {
          api.scrollTo(0)
        } else {
          api.scrollNext()
        }
      } catch {
        // no-op
      }
    }, 4000) // 4s interval; adjust if needed
    return () => {
      window.clearInterval(intervalId)
    }
  }, [api, selectedIndex, totalPages, lightboxOpen])

  const getVisiblePages = React.useCallback((total: number, current: number): (number | 'ellipsis')[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    const result: (number | 'ellipsis')[] = [1]
    const start = Math.max(2, current)
    const end = Math.min(total - 1, current + 2)
    if (start > 2) result.push('ellipsis')
    for (let p = start; p <= end; p++) result.push(p)
    if (end < total - 1) result.push('ellipsis')
    result.push(total)
    return result
  }, [])

  // When lightbox opens, measure the image so the modal follows its aspect ratio
  React.useEffect(() => {
    if (!lightboxOpen) {
      setNaturalSize(null)
      return
    }
    const src = images[selectedIndex]?.src
    if (!src) return
    try {
      const probe = new window.Image()
      probe.src = src
      probe.onload = () => {
        setNaturalSize({ w: probe.naturalWidth, h: probe.naturalHeight })
      }
    } catch {
      // no-op if probe fails; modal will fallback to auto sizing
    }
  }, [lightboxOpen, selectedIndex, images])

  return (
    <div className={cn('relative h-full w-full', className)}>
      <Carousel className="h-full w-full" opts={{ loop: false, align: 'start' }} setApi={setApi}>
        <CarouselContent className="h-full ml-0">
          {images.map((img, idx) => (
            <CarouselItem key={img.src} className="h-full pl-0">
              <div
                className="group relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 border border-white/60 min-h-[300px] sm:min-h-[380px] md:min-h-[480px] flex items-center justify-center"
                role="button"
                tabIndex={0}
                aria-label="Open image in a modal"
                onClick={() => setLightboxOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setLightboxOpen(true)
                  }
                }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#00a8e8]/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-[#4cd964]/10 blur-2xl" />
                {/* Subtle brand-tinted gradient background for loading states */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#e6f7ff]/60 via-white to-[#4cd964]/10" />

                {/* Image */}
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={idx === 0}
                  sizes="(min-width: 1024px) 500px, (min-width: 640px) 400px, 350px"
                  className="object-contain object-center"
                />

                {/* Soft overlay to ensure text/edges remain readable */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                {/* Hint button to indicate click/zoom */}
                <button
                  type="button"
                  aria-label="View larger"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxOpen(true)
                  }}
                  className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1.5 text-xs font-medium text-[#0e2e47] shadow-md ring-1 ring-black/5 backdrop-blur hover:bg-white"
                >
                  <MousePointerClick className="h-4 w-4" />
                  <span className="hidden sm:inline">View</span>
                </button>

                {/* Optional caption */}
                {img.caption ? (
                  <div className="absolute bottom-0 left-0 right-0 bg-white/70 px-3 py-2 text-sm text-[#0e2e47] backdrop-blur-sm">
                    {img.caption}
                  </div>
                ) : null}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Pagination className="mt-3 w-full justify-center">
        <PaginationContent className="rounded-full bg-[#f2fbff] px-3 py-1.5 shadow-sm">
          <PaginationItem>
            <PaginationPrevious
              href="#carousel"
              onClick={(e) => {
                e.preventDefault()
                api?.scrollPrev()
              }}
              className="text-[#0e2e47] hover:text-[#00a8e8]"
              data-disabled={selectedIndex === 0}
              aria-disabled={selectedIndex === 0}
            />
          </PaginationItem>
          <PaginationItem className="sm:hidden">
            <span className="px-2 text-xs font-medium text-[#0e2e47]">
              {selectedIndex + 1} / {totalPages}
            </span>
          </PaginationItem>
          {getVisiblePages(totalPages, selectedIndex + 1).map((token, idx) => {
            if (token === 'ellipsis') {
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
                  href="#carousel"
                  isActive={page === selectedIndex + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    api?.scrollTo(page - 1)
                  }}
                  className={page === selectedIndex + 1 ? 'border-[#00a8e8] text-[#00a8e8]' : 'text-[#0e2e47] hover:text-[#00a8e8]'}
                  aria-label={`Go to slide ${page}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext
              href="#carousel"
              onClick={(e) => {
                e.preventDefault()
                api?.scrollNext()
              }}
              className="text-[#0e2e47] hover:text-[#00a8e8]"
              data-disabled={selectedIndex === totalPages - 1}
              aria-disabled={selectedIndex === totalPages - 1}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="w-auto max-w-[calc(100%-2rem)] sm:max-w-5xl border-none p-0 shadow-xl rounded-3xl" showCloseButton={false}>
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          <div
            className="relative overflow-hidden rounded-3xl bg-white w-[min(90vw,1000px)] max-h-[85vh] mx-auto"
            style={{
              // Let the container height follow the image's aspect ratio while staying within viewport bounds
              aspectRatio: naturalSize ? `${naturalSize.w}/${naturalSize.h}` : undefined,
            }}
          >
            <DialogClose className="absolute right-2 top-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/80 text-sm font-semibold text-[#0e2e47] shadow-sm hover:bg-white/90">
              ×
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e6f7ff]/60 via-white to-[#4cd964]/10" />
            <Image
              src={images[selectedIndex]?.src || ''}
              alt={images[selectedIndex]?.alt || 'Image'}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


