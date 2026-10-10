import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { listVolunteers } from "@/lib/volunteers"
import type { VolunteerRecord } from "@/types/volunteer"

const CSV_COLUMNS: [string, (r: VolunteerRecord) => unknown][] = [
  ["signed_up", (r) => r.createdAt],
  ["event_date", (r) => r.eventDate],
  ["first_name", (r) => r.firstName],
  ["last_name", (r) => r.lastName],
  ["birthday", (r) => r.birthday ?? ""],
  ["age", (r) => r.age],
  ["minor", (r) => (r.isMinor ? "yes" : "no")],
  ["contact_name", (r) => r.contactName],
  ["contact_relationship", (r) => r.contactRelationship],
  ["contact_phone", (r) => r.contactPhone],
  ["contact_email", (r) => r.contactEmail],
  ["waiver_signed_by", (r) => r.waiver.signedBy],
  ["waiver_signed_as", (r) => r.waiver.signedAs],
  ["waiver_signed_at", (r) => r.waiver.signedAt],
  ["waiver_ip", (r) => r.waiver.ip],
]

function toCsv(rows: VolunteerRecord[]): string {
  const escape = (val: unknown): string => {
    const s = val === null || val === undefined ? "" : String(val)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const header = CSV_COLUMNS.map(([name]) => name).join(",")
  const body = rows.map((r) => CSV_COLUMNS.map(([, get]) => escape(get(r))).join(",")).join("\n")
  return `${header}\n${body}`
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const volunteers = await listVolunteers()
    if (req.nextUrl.searchParams.get("format") === "csv") {
      return new NextResponse(toCsv(volunteers), {
        status: 200,
        headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="volunteers.csv"' },
      })
    }
    return NextResponse.json({ volunteers })
  } catch (err) {
    console.error("Volunteer list failed:", err)
    return NextResponse.json({ error: "Could not load volunteers." }, { status: 500 })
  }
}
