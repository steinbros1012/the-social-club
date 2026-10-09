import { Resend } from "resend"
import { VOLUNTEER_EVENT } from "@/config/volunteer"
import type { VolunteerRecord } from "@/types/volunteer"

// (created on first use, so builds and pages don't need the key just to load)
let client: Resend | null = null
function resend(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY)
  return client
}
const FROM = "The Social Club <noreply@endlesssports.org>"

// Resend reports failures in its result instead of throwing: surface them.
async function send(msg: Parameters<Resend["emails"]["send"]>[0]): Promise<void> {
  const { error } = await resend().emails.send(msg)
  if (error) throw new Error(`Resend: ${error.message}`)
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)
}

function shell(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
  <body style="font-family:Arial,sans-serif;color:#333;line-height:1.6;margin:0;padding:0;">
    <div style="max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#074694;color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;font-size:24px;letter-spacing:2px;">THE SOCIAL CLUB</h1>
        <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">A collaborative program from Endless Sports + We Will Walk With You</p>
      </div>
      <div style="background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px;">${body}</div>
    </div>
  </body></html>`
}

// To the volunteer (or their parent/guardian): thank you + everything they need to know.
export async function sendVolunteerConfirmation(r: VolunteerRecord): Promise<void> {
  const name = escapeHtml(r.firstName)
  const greeting = r.isMinor ? `Hi ${escapeHtml(r.contactName)},` : `Hi ${name},`
  const thanks = r.isMinor
    ? `Thank you for signing ${name} up to volunteer for the Social Club! It's because of volunteers like ${name} that we're able to offer our programming.`
    : "Thank you for volunteering for the Social Club! It's because of volunteers like yourself that we're able to offer our programming."
  const e = VOLUNTEER_EVENT
  await send({
    from: FROM,
    to: r.contactEmail,
    subject: "Thank you for volunteering for The Social Club!",
    html: shell(`
      <p>${greeting}</p>
      <p>${thanks}</p>
      <p><strong>Date:</strong> ${e.date}<br>
         <strong>Time:</strong> ${e.time} (${e.timeNote})<br>
         <strong>Location:</strong> ${e.location}, ${e.address}<br>
         ${e.entranceNote}</p>
      <p><strong>Note:</strong> ${e.dressNote}</p>
      <p>Your waiver has been signed${r.isMinor ? ` by ${escapeHtml(r.contactName)} (parent/guardian)` : ""}. See you there!</p>
      <p><em>The Social Club Team</em></p>`),
  })
}

// To the organizers: a new volunteer signed up.
export async function sendVolunteerNotification(r: VolunteerRecord): Promise<void> {
  const rows: [string, string][] = [
    ["Volunteer", `${r.firstName} ${r.lastName}`],
    ["Age", `${r.age}${r.isMinor ? " (minor)" : ""}`],
    [r.isMinor ? "Parent/Guardian" : "Contact", `${r.contactName}${r.contactRelationship ? ` (${r.contactRelationship})` : ""}`],
    ["Phone", r.contactPhone],
    ["Email", r.contactEmail],
    ["Waiver signed by", `${r.waiver.signedBy} (${r.waiver.signedAs}) on ${new Date(r.waiver.signedAt).toLocaleString("en-US", { timeZone: "America/New_York" })}`],
  ]
  const table = rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;">${k}</td><td style="padding:4px 0;"><strong>${escapeHtml(v)}</strong></td></tr>`).join("")
  await send({
    from: FROM,
    to: [...VOLUNTEER_EVENT.notifyEmails],
    subject: `New volunteer: ${r.firstName} ${r.lastName}`,
    html: shell(`<p>A new volunteer signed up for ${VOLUNTEER_EVENT.date}.</p><table>${table}</table><p>See every volunteer on the admin page.</p>`),
  })
}
