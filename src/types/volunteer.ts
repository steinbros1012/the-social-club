export interface VolunteerFormData {
  name: string
  age: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  waiverAgreed: boolean
  signatureVolunteer: string
  signatureVolunteerDate: string
  signatureGuardian: string
  signatureGuardianDate: string
}

export const VOLUNTEER_EVENT = {
  name: "The Social Club Volunteer",
  date: "2026-10-23",
  dateLabel: "Friday, October 23, 2026",
  time: "5:45 PM – 8:00 PM",
  location: "NW Cary YMCA",
  address: "6903 Carpenter Fire Station Rd, Cary, NC 27519",
  entrance: "Enter through the Crosspointe Church entrance.",
} as const
