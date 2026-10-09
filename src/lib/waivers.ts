import { get, list, put } from "@vercel/blob"
import { privateStoreToken } from "@/lib/volunteers"

// Signed participant waivers, one private JSON file per registration (keyed by its id).
// Kept in the private Blob store with the volunteer sign-ups, so no database change is
// needed; the admin API merges them into each registration.
const PREFIX = "waivers/registrations/"

export interface ParticipantWaiver {
  registrationId: string
  participantName: string
  agreed: true
  signedBy: string // the typed signature
  signedDate: string // the date they entered
  signedAt: string // server time
  ip: string
  userAgent: string
}

export async function saveParticipantWaiver(w: ParticipantWaiver): Promise<void> {
  await put(`${PREFIX}${w.registrationId}.json`, JSON.stringify(w, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: privateStoreToken(),
  })
}

// registrationId -> waiver, for every signed waiver.
export async function waiversByRegistration(): Promise<Map<string, ParticipantWaiver>> {
  const token = privateStoreToken()
  const paths: string[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000, token })
    paths.push(...page.blobs.map((b) => b.pathname))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  const out = new Map<string, ParticipantWaiver>()
  await Promise.all(
    paths.map(async (p) => {
      const res = await get(p, { access: "private", token, useCache: false })
      if (!res || res.statusCode !== 200 || !res.stream) return
      try {
        const w = JSON.parse(await new Response(res.stream).text()) as ParticipantWaiver
        out.set(w.registrationId, w)
      } catch {
        // a damaged file is skipped, not fatal
      }
    }),
  )
  return out
}
