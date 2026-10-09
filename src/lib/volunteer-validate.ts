import { VOLUNTEER_EVENT } from "@/config/volunteer"
import type { VolunteerFormData } from "@/types/volunteer"

export type VolunteerErrors = Partial<Record<keyof VolunteerFormData, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s\-().]{7,}$/
const MAX = 120

export function parseAge(age: string): number | null {
  const n = Number(String(age).trim())
  return Number.isInteger(n) && n >= 5 && n <= 110 ? n : null
}

export function isMinorAge(age: string): boolean {
  const n = parseAge(age)
  return n !== null && n < VOLUNTEER_EVENT.minorAge
}

// Shared by the form (as you type) and the API (never trust the browser).
export function validateVolunteer(d: VolunteerFormData): VolunteerErrors {
  const e: VolunteerErrors = {}
  const minor = isMinorAge(d.age)
  const who = minor ? "Parent/guardian" : "Your"
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "")
  if (!str(d.firstName)) e.firstName = "First name is required."
  if (!str(d.lastName)) e.lastName = "Last name is required."
  if (parseAge(d.age) === null) e.age = "Enter the volunteer's age."
  if (minor && !str(d.contactName)) e.contactName = "Parent/guardian name is required."
  if (minor && !str(d.contactRelationship)) e.contactRelationship = "Relationship is required."
  if (!str(d.contactPhone)) e.contactPhone = `${who} phone number is required.`
  else if (!PHONE_RE.test(str(d.contactPhone))) e.contactPhone = "Enter a valid phone number."
  if (!str(d.contactEmail)) e.contactEmail = `${who} email is required.`
  else if (!EMAIL_RE.test(str(d.contactEmail))) e.contactEmail = "Enter a valid email address."
  if (d.waiverAgreed !== true) e.waiverAgreed = "The waiver must be agreed to."
  if (!str(d.signatureName)) e.signatureName = minor ? "A parent/guardian must type their full name to sign." : "Type your full name to sign."
  for (const k of ["firstName", "lastName", "contactName", "contactRelationship", "contactPhone", "contactEmail", "signatureName"] as const) {
    if (str(d[k]).length > MAX) e[k] = "That's too long."
  }
  return e
}
