"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Package = {
  id: string
  tier: string
  subjects: string[]
  normalPriceMonthly: number
  promoPriceMonthly?: number
  promoStart?: string
  promoEnd?: string
  popular?: boolean
}

type PackagesModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  packages: Package[]
  selectedPackageId: string | null
  onSelectPackage: (id: string) => void
  onClear: () => void
  onDone: () => void
  getPricing: (pkg: Package) => { isPromo: boolean; price: number; normalPrice: number; promoPrice?: number }
}

export function PackagesModal({ open, onOpenChange, packages, selectedPackageId, onSelectPackage, onClear, onDone, getPricing }: PackagesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Select package</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {packages.map((p) => {
            const selected = selectedPackageId === p.id
            const pricing = getPricing(p)
            return (
              <label key={p.id} className={`flex items-start justify-between gap-3 rounded-md border p-3 hover:bg-[#f6fbff] ${selected ? "border-[#00a8e8]" : ""}`}>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0e2e47]">{p.tier}</span>
                    {pricing.isPromo ? (
                      <Badge className="bg-[#4cd964] text-[#0e2e47] border-[#4cd964]">Promo</Badge>
                    ) : p.popular ? (
                      <Badge className="bg-[#ffbf00] text-[#0e2e47] border-[#ffbf00]">Popular</Badge>
                    ) : null}
                  </div>
                  <span className="text-xs text-gray-600">{`${p.subjects.length} subjects RM${pricing.price.toFixed(2)}/month`}</span>
                  {!pricing.isPromo && p.promoStart && p.promoEnd && (
                    <span className="text-xs text-gray-400">Date: {p.promoStart} - {p.promoEnd}</span>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {p.subjects.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] text-[#0e2e47] bg-white">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => onSelectPackage(p.id)}
                  className={selected ? "bg-[#00a8e8] hover:bg-[#0077b6]" : "border bg-white text-[#0e2e47] hover:bg-[#e6f7ff]"}
                >
                  {selected ? "Selected" : "Select"}
                </Button>
              </label>
            )
          })}
        </div>
        <DialogFooter>
          <Button type="button" className="border bg-white text-[#0e2e47] hover:bg-[#e6f7ff]" onClick={onClear}>
            Clear
          </Button>
          <Button type="button" className="bg-[#00a8e8] hover:bg-[#0077b6]" onClick={onDone}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


