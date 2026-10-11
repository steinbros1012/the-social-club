import { VOLUNTEER_EVENT } from "@/config/volunteer"
import type { VolunteerFormData } from "@/types/volunteer"

export type VolunteerErrors = Partial<Record<keyof VolunteerFormData, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s\-().]{7,}$/
const MAX = 120

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const MIN_AGE = 5
const MAX_AGE = 110

// Today as YYYY-MM-DD in the event's time zone, so the browser and the server agree.
export function todayIso(): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: VOLUNTEER_EVENT.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date())
  const part = (type: string): string => parts.find((p) => p.type === type)?.value ?? ""
  return `${part("year")}-${part("month")}-${part("day")}`
}

// Age today for a YYYY-MM-DD birthday; null if it isn't a real date or the age is out of range.
export function ageFromBirthday(birthday: string, today: string = todayIso()): number | null {
  const m = DATE_RE.exec(String(birthday).trim())
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(Date.UTC(y, mo - 1, d))
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null
  const [ty, tm, td] = today.split("-").map(Number)
  const age = ty - y - (tm < mo || (tm === mo && td < d) ? 1 : 0)
  return age >= MIN_AGE && age <= MAX_AGE ? age : null
}

export function isMinorBirthday(birthday: string): boolean {
  const n = ageFromBirthday(birthday)
  return n !== null && n < VOLUNTEER_EVENT.minorAge
}

// YYYY-MM-DD -> MM/DD/YYYY for emails and the admin page.
export function formatBirthday(birthday: string): string {
  const m = DATE_RE.exec(birthday)
  return m ? `${m[2]}/${m[3]}/${m[1]}` : birthday
}

// Shared by the form (as you type) and the API (never trust the browser).
export function validateVolunteer(d: VolunteerFormData): VolunteerErrors {
  const e: VolunteerErrors = {}
  const age = ageFromBirthday(d.birthday)
  const minor = age !== null && age < VOLUNTEER_EVENT.minorAge
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "")
  const contact = (emailKey: "email" | "guardianEmail", phoneKey: "phone" | "guardianPhone", who: string): void => {
    if (!str(d[emailKey])) e[emailKey] = `${who} email is required.`
    else if (!EMAIL_RE.test(str(d[emailKey]))) e[emailKey] = "Enter a valid email address."
    if (!str(d[phoneKey])) e[phoneKey] = `${who} phone number is required.`
    else if (!PHONE_RE.test(str(d[phoneKey]))) e[phoneKey] = "Enter a valid phone number."
  }
  if (!str(d.firstName)) e.firstName = "First name is required."
  if (!str(d.lastName)) e.lastName = "Last name is required."
  if (age === null) e.birthday = "Enter the volunteer's date of birth."
  else if (minor) {
    if (!str(d.guardianFirstName)) e.guardianFirstName = "Parent/guardian first name is required."
    if (!str(d.guardianLastName)) e.guardianLastName = "Parent/guardian last name is required."
    contact("guardianEmail", "guardianPhone", "Parent/guardian")
  } else contact("email", "phone", "Your")
  if (d.waiverAgreed !== true) e.waiverAgreed = "The waiver must be agreed to."
  if (!str(d.signatureName)) e.signatureName = minor ? "A parent/guardian must type their full name to sign." : "Type your full name to sign."
  for (const k of ["firstName", "lastName", "email", "phone", "guardianFirstName", "guardianLastName", "guardianEmail", "guardianPhone", "signatureName"] as const) {
    if (str(d[k]).length > MAX) e[k] = "That's too long."
  }
  return e
}
