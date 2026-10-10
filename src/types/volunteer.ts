// What the volunteer form sends.
export interface VolunteerFormData {
  firstName: string
  lastName: string
  birthday: string // YYYY-MM-DD
  // For volunteers under 18 these are the parent/guardian's; otherwise the volunteer's own.
  contactName: string
  contactRelationship: string
  contactPhone: string
  contactEmail: string
  waiverAgreed: boolean
  signatureName: string
  // Honeypot: real people never fill this in (it's hidden).
  website: string
}

// What's stored for each sign-up (private Vercel Blob storage).
export interface VolunteerRecord {
  id: string
  createdAt: string
  eventDate: string
  firstName: string
  lastName: string
  birthday?: string // YYYY-MM-DD; sign-ups from before the form asked for it only have an age
  age: number // on the day they signed up
  isMinor: boolean
  contactName: string
  contactRelationship: string
  contactPhone: string
  contactEmail: string
  waiver: {
    agreed: true
    signedBy: string // the typed signature
    signedAs: "volunteer" | "parent/guardian"
    signedAt: string // ISO time, set by the server
    ip: string
    userAgent: string
  }
}
