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

/**
 * Normalizes Malaysian phone numbers to pure digits only.
 * Handles formats like: 012-345 6789, +60123456789, 60123456789, etc.
 * Returns digits only (e.g., "0123456789", "60123456789", or "01234567890" for 11-digit numbers).
 * Supports both 10-digit and 11-digit Malaysian phone numbers.
 * Retains country code "60" if user enters it.
 */
export function normalizeMalaysianPhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")
  if (!digits) return null
  // If starts with 60 (country code), retain it as is
  if (digits.startsWith("60")) {
    return digits
  }
  // If already starts with 0, return as is (handles both 10 and 11 digit numbers)
  if (digits.startsWith("0")) {
    return digits
  }
  // If no leading 0 or 60 and reasonable length (9-11 digits), assume missing leading 0
  if (digits.length >= 9 && digits.length <= 11) {
    return "0" + digits
  }
  return digits
}

// Build a WhatsApp deep link for parents to confirm registration.
// Cleans the phone to digits only; returns empty string if no digits found.
// Message includes parent name, student name and ticket number.
export function toWhatsAppHref(
  phone: string,
  parentName: string,
  studentName: string,
  ticketNo: string
): string {
  const digits = (phone || "").replace(/[^0-9]/g, "")
  if (!digits) return ""

  const message = `Hello Admin, I am ${parentName} and I would like to confirm the registration of my child, ${studentName}, for the online tuition program with StudyBuddy Tutors.\nRegistration Ticket Number: ${ticketNo}.\nKindly assist to review and confirm the registration. Thank you`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/+601110927926?text=${encodedMessage}`
}