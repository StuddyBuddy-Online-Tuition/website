"use client"

import { useEffect, useMemo, useState } from "react"
import type { Subject } from "@/types/subject"
import type { Timeslot } from "@/types/timeslot"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const

const TIME_WINDOWS = [
  { start: "20:15", end: "21:15", label: "20:00–21:00" },
  { start: "21:20", end: "22:20", label: "21:05–22:05" },
] as const

type TimeWindowIndex = 0 | 1

function getTimeWindowIndex(startTime: string, endTime: string): TimeWindowIndex | null {
  const toHHmm = (t: string) => {
    const m = /^\d{2}:\d{2}/.exec(t)
    return m ? m[0] : t
  }
  const s = toHHmm(startTime)
  const e = toHHmm(endTime)
  if (s === TIME_WINDOWS[0].start && e === TIME_WINDOWS[0].end) return 0
  if (s === TIME_WINDOWS[1].start && e === TIME_WINDOWS[1].end) return 1
  return null
}

// Subject color mapping localized to avoid cross-module side effects
const SUBJECT_COLORS: Record<string, string> = {
  BIO: "bg-green-100 text-green-900 border-green-300",
  FIZ: "bg-yellow-100 text-yellow-900 border-yellow-300",
  KIM: "bg-purple-100 text-purple-900 border-purple-300",
  AM: "bg-red-100 text-red-900 border-red-300",
  MM: "bg-pink-100 text-pink-900 border-pink-300",
  BM: "bg-amber-100 text-amber-900 border-amber-300",
  BI: "bg-sky-100 text-sky-900 border-sky-300",
  SEJ: "bg-orange-100 text-orange-900 border-orange-300",
  GEO: "bg-emerald-100 text-emerald-900 border-emerald-300",
  SC: "bg-blue-100 text-blue-900 border-blue-300",
  PRN: "bg-indigo-100 text-indigo-900 border-indigo-300",
  PA: "bg-teal-100 text-teal-900 border-teal-300",
  EKO: "bg-cyan-100 text-cyan-900 border-cyan-300",
}

function getSubjectColor(abbrev: string): string {
  if (SUBJECT_COLORS[abbrev]) return SUBJECT_COLORS[abbrev]
  if (/D$/.test(abbrev)) {
    const base = abbrev.replace(/D$/, "")
    if (SUBJECT_COLORS[base]) return SUBJECT_COLORS[base]
  }
  return "bg-gray-100 text-gray-900 border-gray-300"
}

// Map CSV Subject field (without BM/DLP) to our base color keys
function getBaseAbbrevFromSubjectField(subjectField: string): string {
  const normalized = subjectField
    .replace(/\b(BM|DLP)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()

  if (normalized.startsWith("kimia")) return "KIM"
  if (normalized.startsWith("fizik")) return "FIZ"
  if (normalized.startsWith("biology") || normalized.startsWith("biologi")) return "BIO"
  if (normalized.startsWith("add math")) return "AM"
  if (normalized.startsWith("matematik")) return "MM"
  if (normalized.startsWith("bahasa malaysia")) return "BM"
  if (normalized.startsWith("bahasa inggeris")) return "BI"
  if (normalized.startsWith("sejarah")) return "SEJ"
  if (normalized.startsWith("geografi")) return "GEO"
  if (normalized.startsWith("sains")) return "SC"
  if (normalized.includes("perniagaan") || normalized.includes("perdagangan")) return "PRN"
  if (normalized.includes("prinsip akaun") || normalized.includes("prinsip perakaunan")) return "PA"
  if (normalized.startsWith("ekonomi")) return "EKO"
  return normalized.slice(0, 3).toUpperCase()
}

function getBaseLabelFromSubjectField(subjectField: string): string {
  const normalized = subjectField
    .replace(/\b(BM|DLP)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()

  if (normalized.startsWith("kimia")) return "Kimia"
  if (normalized.startsWith("fizik")) return "Fizik"
  if (normalized.startsWith("biology") || normalized.startsWith("biologi")) return "Biology"
  if (normalized.startsWith("add math")) return "Add Math"
  if (normalized.startsWith("matematik")) return "Matematik"
  if (normalized.startsWith("bahasa malaysia")) return "Bahasa Malaysia"
  if (normalized.startsWith("bahasa inggeris")) return "Bahasa Inggeris"
  if (normalized.startsWith("sejarah")) return "Sejarah"
  if (normalized.startsWith("geografi")) return "Geografi"
  if (normalized.startsWith("sains")) return "Sains"
  if (normalized.includes("prinsip perniagaan")) return "Prinsip Perniagaan"
  if (normalized.includes("perniagaan") || normalized.includes("perdagangan")) return "P. Perniagaan"
  if (normalized.includes("prinsip akaun") || normalized.includes("prinsip perakaunan")) return "Prinsip Akaun"
  if (normalized.startsWith("ekonomi")) return "Ekonomi"
  return subjectField
}

type GradeOption = {
  value: string
  label: string
}

type Props = {
  initialSubjects: Subject[]
  initialTimeslots: Timeslot[]
  title: string
  description: string
  availableGrades: GradeOption[]
}

export default function MasterTimetable({ initialSubjects, initialTimeslots, title, description, availableGrades }: Props) {
  const [selectedStandards, setSelectedStandards] = useState<string[]>([])
  const STORAGE_KEY = "masterTimetable:selectedStandards"

  // Build grade values set from CMS
  const gradeValues = useMemo(() => {
    return new Set(availableGrades.map((g) => g.value))
  }, [availableGrades])

  // Get default initial selection (F1-F5)
  const defaultInitialSelection = useMemo(() => {
    const fGrades = availableGrades.filter((g) => g.value.startsWith("F")).map((g) => g.value)
    return fGrades.slice(0, 5) // F1-F5
  }, [availableGrades])

  // Load saved selection on mount, or use default F1-F5 if no saved selection
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          const filtered = parsed
            .filter((s) => typeof s === "string" && gradeValues.has(s))
            .slice(0, 5)
          if (filtered.length > 0) {
            setSelectedStandards(filtered)
            return
          }
        }
      }
      // If no valid saved selection, use default F1-F5
      if (defaultInitialSelection.length > 0) {
        setSelectedStandards(defaultInitialSelection)
      }
    } catch {
      // If error, use default F1-F5
      if (defaultInitialSelection.length > 0) {
        setSelectedStandards(defaultInitialSelection)
      }
    }
  }, [gradeValues, defaultInitialSelection])

  // Persist selection when it changes
  useEffect(() => {
    try {
      if (typeof window === "undefined") return
      if (selectedStandards.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedStandards))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [selectedStandards])

  const subjectsByStandard = useMemo(() => {
    const map: Record<string, Subject[]> = {}
    for (const s of initialSubjects) {
      if (!map[s.standard]) map[s.standard] = []
      map[s.standard].push(s)
    }
    return map
  }, [initialSubjects])

  const subjectByCode = useMemo(() => {
    const map = new Map<string, Subject>()
    for (const s of initialSubjects) map.set(s.code, s)
    return map
  }, [initialSubjects])

  const handleToggleStandard = (standard: string) => {
    setSelectedStandards((prev) => {
      if (prev.includes(standard)) return prev.filter((s) => s !== standard)
      if (prev.length >= 5) return prev // max 5
      return [...prev, standard]
    })
  }

  type GridEntry = { subject: Subject; teacherName: string }

  const gridData = useMemo(() => {
    // Record per standard -> day -> timeIndex -> GridEntry[]
    const result: Record<string, Record<string, Record<number, GridEntry[]>>> = {}
    for (const standard of selectedStandards) {
      result[standard] = {}
      for (const day of DAYS) {
        result[standard][day] = { 0: [], 1: [] }
      }
      // Filter normal timeslots for subjects in this standard (show all subjects, no DLP/KSSM filtering)
      const subjectsForStandard = (subjectsByStandard[standard] ?? []).filter((s) => s.type === "Classroom")
      const subjectCodes = new Set(subjectsForStandard.map((s) => s.code))
      const normalSlots = initialTimeslots.filter(
        (t) => subjectCodes.has(t.subjectCode) && t.studentId === null,
      )
      for (const slot of normalSlots) {
        const subject = subjectByCode.get(slot.subjectCode)
        if (!subject) continue
        const idx = getTimeWindowIndex(slot.startTime, slot.endTime)
        if (idx === null) continue
        const day = slot.day
        result[standard][day][idx].push({ subject, teacherName: slot.teacherName })
      }
    }
    return result
  }, [selectedStandards, subjectsByStandard, subjectByCode, initialTimeslots])

  
  // Build legend for only the subjects currently displayed in the grid
  const legendItems = useMemo(() => {
    const map = new Map<string, { abbrev: string; colorClass: string; name: string }>()
    for (const standard of selectedStandards) {
      const dayMap = gridData[standard]
      if (!dayMap) continue
      for (const day of DAYS) {
        const windows = dayMap[day]
        for (const idx of [0, 1] as TimeWindowIndex[]) {
          const entries = windows?.[idx] ?? []
          for (const entry of entries) {
            const baseAbbrev = getBaseAbbrevFromSubjectField(entry.subject.subject)
            if (!map.has(baseAbbrev)) {
              const label = getBaseLabelFromSubjectField(entry.subject.subject)
              map.set(baseAbbrev, { abbrev: baseAbbrev, colorClass: getSubjectColor(baseAbbrev), name: label })
            }
          }
        }
      }
    }
    return Array.from(map, ([, info]) => info).sort((a, b) => a.abbrev.localeCompare(b.abbrev))
  }, [selectedStandards, gridData])

  function getStandardLongLabel(standard: string): string {
    if (!standard) return ""
    const prefix = standard.startsWith("F") ? "Form" : "Standard"
    const number = standard.replace(/^[A-Za-z]+/, "")
    return `${prefix} ${number}`
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-[#0e2e47] md:text-[34px]">{title}</h2>
          <p className="text-sm text-muted-foreground md:max-w-xl">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start rounded-full border-[#00a8e8]/20 bg-white px-4 py-2 text-sm font-semibold text-[#0e2e47] shadow-sm transition-all hover:border-[#00a8e8]/40 hover:text-[#00a8e8] hover:shadow-md">
                <span className="mr-2">Select Standards</span>
                {selectedStandards.length > 0 && (
                  <Badge variant="secondary" className="rounded-full bg-[#e6f7ff] px-2 py-0.5 font-mono text-[#00a8e8]">
                    {selectedStandards.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] rounded-2xl border border-[#00a8e8]/15 bg-white p-3 shadow-xl" align="end">
              <div className="max-h-64 space-y-1 overflow-auto">
                {availableGrades.map((grade) => {
                  const isSelected = selectedStandards.includes(grade.value)
                  const disabled = !isSelected && selectedStandards.length >= 5
                  return (
                    <Button
                      key={grade.value}
                      variant="ghost"
                      className={cn(
                        "w-full justify-between rounded-xl border border-transparent px-3 py-2 text-sm font-medium transition-all",
                        isSelected
                          ? "border-[#00a8e8] bg-[#e6f7ff] text-[#00a8e8] shadow-sm"
                          : "bg-white text-[#0e2e47] hover:bg-[#f4f8fb]",
                        disabled && "opacity-50",
                      )}
                      onClick={() => handleToggleStandard(grade.value)}
                      disabled={disabled}
                    >
                      <span>{grade.value}</span>
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border border-[#00a8e8]/40 text-white transition-colors",
                          isSelected ? "bg-[#00a8e8]" : "bg-white text-transparent",
                        )}
                      >
                        <Check className={cn("h-3 w-3", !isSelected && "opacity-0")} />
                      </div>
                    </Button>
                  )
                })}
              </div>
              {selectedStandards.length > 0 && (
                <div className="mt-3 border-t border-[#00a8e8]/10 pt-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-center rounded-full bg-[#fef2f2] px-4 py-2 text-sm font-semibold text-[#dc2626] transition-all hover:bg-[#fee2e2]"
                    onClick={() => setSelectedStandards([])}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card className="border border-[#00a8e8]/10 shadow-[0_20px_45px_-25px_rgba(0,168,232,0.45)]">
        <CardContent className="overflow-x-auto pt-6">
          {selectedStandards.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">Select standards to view the timetable.</p>
          ) : (
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr>
                  <th className="border px-2 py-2 align-middle w-32">Standard</th>
                  {DAYS.map((day) => (
                    <th key={day} className="border px-2 py-2 text-center" colSpan={2}>
                      {day}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="border px-2 py-1 text-left text-xs text-muted-foreground">Rows</th>
                  {DAYS.flatMap((day) => (
                    TIME_WINDOWS.map((tw) => (
                      <th key={`${day}-${tw.label}`} className="border px-2 py-1 text-center text-xs text-muted-foreground">
                        {tw.label}
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedStandards.map((standard) => (
                  <tr key={standard} className="align-top">
                    <td className="border p-0 align-middle">
                      <div className="h-full w-full p-3 flex items-center justify-center text-center">
                        <div className="flex flex-col items-center leading-tight">
                          <div className="text-sm font-semibold text-navy">{getStandardLongLabel(standard)}</div>
                          <div className="text-[11px] font-mono text-muted-foreground">{standard}</div>
                        </div>
                      </div>
                    </td>
                    {DAYS.flatMap((day) => (
                      ([0, 1] as TimeWindowIndex[]).map((idx) => {
                        const entries = gridData[standard]?.[day]?.[idx] ?? []
                        return (
                          <td key={`${standard}-${day}-${idx}`} className="border px-2 py-2">
                            <div className="flex flex-col gap-1">
                              {entries.length === 0 ? (
                                <span className="text-xs text-muted-foreground">-</span>
                              ) : (
                                entries.map((entry) => {
                                  const abbrev = getBaseAbbrevFromSubjectField(entry.subject.subject)
                                  return (
                                    <div
                                      key={entry.subject.code}
                                      className={cn("rounded-md border px-2 py-1 leading-tight text-xs", getSubjectColor(abbrev))}
                                    >
                                      <div className="flex items-center gap-1 flex-wrap">
                                        <span className="font-semibold">{abbrev}</span>
                                        <span className="opacity-70">•</span>
                                        <span className="font-mono">{entry.subject.code}</span>
                                      </div>
                                      <div className="opacity-80 text-[10px]">{entry.teacherName}</div>
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          </td>
                        )
                      })
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {selectedStandards.length > 0 && legendItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground mr-1">Legend:</span>
          {legendItems.map((item) => (
            <div key={item.name} className={cn("flex items-center gap-1 rounded-md border px-2 py-1", item.colorClass)}>
              <span className="font-semibold">{item.abbrev}</span>
              <span className="opacity-70">–</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


