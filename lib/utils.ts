import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toNullIfEmpty(value: unknown): string | null {
  if (value === undefined || value === null) return null
  const s = String(value).trim()
  return s.length === 0 ? null : s
}

export function normalizeEmail(email?: string): string | null {
  const e = toNullIfEmpty(email)
  return e ? e.toLowerCase() : null
}

export function parseSequentialId(id: string, expectedPrefix: string): number | null {
  if (!id?.startsWith(expectedPrefix)) return null
  const numeric = id.slice(expectedPrefix.length)
  if (!/^\d+$/.test(numeric)) return null
  const n = Number(numeric)
  return Number.isFinite(n) ? n : null
}

export function formatSequentialId(numeric: number, prefix: string, minWidth = 4): string {
  const s = String(numeric)
  const width = Math.max(minWidth, s.length)
  return `${prefix}${s.padStart(width, "0")}`
}

export function generateTicketId(prefix = "TKT", length = 8): string {
  const random = () => Math.random().toString(36).slice(2).toUpperCase()
  return `${prefix}-${(random() + random()).slice(0, length)}`
}
