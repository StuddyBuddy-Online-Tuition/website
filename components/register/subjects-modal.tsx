"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type SubjectsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  options: string[]
  selected: string[]
  onToggle: (subject: string) => void
  onClear: () => void
  onDone: () => void
  icons?: Record<string, any>
}

export function SubjectsModal({ open, onOpenChange, options, selected, onToggle, onClear, onDone, icons = {} }: SubjectsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Select subjects</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((s, i) => {
            const id = `subject-${i}`
            const checked = selected.includes(s)
            const Icon = icons[s] || (() => null)
            return (
              <label key={s} htmlFor={id} className="flex items-center gap-3 rounded-md border p-3 hover:bg-[#f6fbff]">
                <Checkbox id={id} checked={checked} onCheckedChange={(v) => v === true ? onToggle(s) : onToggle(s)} />
                <span className="text-sm text-[#0e2e47] flex items-center gap-2">
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {s}
                </span>
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




