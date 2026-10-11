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

// A volunteer under 18 has to be signed up by a parent/guardian, and an adult signs up for
// themselves. Returns what to tell the person when the birthday doesn't fit who is signing.
export function signerMismatch(signingAs: VolunteerFormData["signingAs"], birthday: string): string | null {
  const age = ageFromBirthday(birthday)
  if (age === null) return null
  const under = age < VOLUNTEER_EVENT.minorAge
  if (signingAs === "self" && under) return `Volunteers under ${VOLUNTEER_EVENT.minorAge} need a parent or guardian to sign up for them. Choose "My child" above.`
  if (signingAs === "guardian" && !under) return `This volunteer is ${VOLUNTEER_EVENT.minorAge} or older, so they sign up for themselves. Choose "I am" above.`
  return null
}

// Shared by the form (as you type) and the API (never trust the browser).
export function validateVolunteer(d: VolunteerFormData): VolunteerErrors {
  const e: VolunteerErrors = {}
  const minor = d.signingAs === "guardian"
  if (d.signingAs !== "self" && d.signingAs !== "guardian") e.signingAs = "Choose who is volunteering."
  const who = minor ? "Parent/guardian" : "Your"
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "")
  if (!str(d.firstName)) e.firstName = "First name is required."
  if (!str(d.lastName)) e.lastName = "Last name is required."
  if (ageFromBirthday(d.birthday) === null) e.birthday = "Enter the volunteer's date of birth."
  else {
    const mismatch = signerMismatch(d.signingAs, d.birthday)
    if (mismatch) e.birthday = mismatch
  }
  if (minor && !str(d.contactFirstName)) e.contactFirstName = "Parent/guardian first name is required."
  if (minor && !str(d.contactLastName)) e.contactLastName = "Parent/guardian last name is required."
  if (!str(d.contactPhone)) e.contactPhone = `${who} phone number is required.`
  else if (!PHONE_RE.test(str(d.contactPhone))) e.contactPhone = "Enter a valid phone number."
  if (!str(d.contactEmail)) e.contactEmail = `${who} email is required.`
  else if (!EMAIL_RE.test(str(d.contactEmail))) e.contactEmail = "Enter a valid email address."
  if (d.waiverAgreed !== true) e.waiverAgreed = "The waiver must be agreed to."
  if (!str(d.signatureName)) e.signatureName = minor ? "A parent/guardian must type their full name to sign." : "Type your full name to sign."
  for (const k of ["firstName", "lastName", "contactFirstName", "contactLastName", "contactPhone", "contactEmail", "signatureName"] as const) {
    if (str(d[k]).length > MAX) e[k] = "That's too long."
  }
  return e
}
