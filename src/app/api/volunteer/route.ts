import { NextRequest, NextResponse } from "next/server"
import { VOLUNTEER_EVENT } from "@/config/volunteer"
import { ageFromBirthday, isMinorBirthday, validateVolunteer } from "@/lib/volunteer-validate"
import { saveVolunteer } from "@/lib/volunteers"
import { sendVolunteerConfirmation, sendVolunteerNotification } from "@/lib/volunteer-email"
import type { VolunteerFormData, VolunteerRecord } from "@/types/volunteer"

export async function POST(req: NextRequest) {
  let body: VolunteerFormData
  try {
    body = (await req.json()) as VolunteerFormData
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
  // A bot filled the hidden field: pretend it worked, store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ success: true })
  }
  const errors = validateVolunteer(body)
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 400 })
  }

  const minor = isMinorBirthday(body.birthday)
  const now = new Date().toISOString()
  const record: VolunteerRecord = {
    id: crypto.randomUUID(),
    createdAt: now,
    eventDate: VOLUNTEER_EVENT.date,
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    birthday: body.birthday.trim(),
    age: ageFromBirthday(body.birthday) as number,
    isMinor: minor,
    contactName: minor ? `${body.guardianFirstName.trim()} ${body.guardianLastName.trim()}` : `${body.firstName.trim()} ${body.lastName.trim()}`,
    contactRelationship: minor ? "parent/guardian" : "self",
    contactPhone: (minor ? body.guardianPhone : body.phone).trim(),
    contactEmail: (minor ? body.guardianEmail : body.email).trim(),
    waiver: {
      agreed: true,
      signedBy: body.signatureName.trim(),
      signedAs: minor ? "parent/guardian" : "volunteer",
      signedAt: now,
      ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim(),
      userAgent: req.headers.get("user-agent") ?? "",
    },
  }

  try {
    await saveVolunteer(record)
  } catch (err) {
    console.error("Volunteer save failed:", err)
    return NextResponse.json({ error: "Something went wrong saving your sign-up. Please try again." }, { status: 500 })
  }

  // Emails are a courtesy: the sign-up is already saved if they fail.
  const results = await Promise.allSettled([sendVolunteerConfirmation(record), sendVolunteerNotification(record)])
  for (const r of results) {
    if (r.status === "rejected") console.error("Volunteer email failed:", r.reason)
  }

  return NextResponse.json({ success: true })
}
