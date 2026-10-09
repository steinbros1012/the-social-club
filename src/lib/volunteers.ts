import { get, list, put } from "@vercel/blob"
import type { VolunteerRecord } from "@/types/volunteer"

// Volunteer sign-ups (and signed participant waivers, lib/waivers.ts) live in a PRIVATE
// Vercel Blob store ("social-club-volunteers"), one JSON file each. Its token is
// VOLUNTEERS_READ_WRITE_TOKEN (the site's other store, BLOB_READ_WRITE_TOKEN, is public and
// only hosts site media).
const PREFIX = "volunteers/"

export function privateStoreToken(): string {
  const t = process.env.VOLUNTEERS_READ_WRITE_TOKEN
  if (!t) throw new Error("VOLUNTEERS_READ_WRITE_TOKEN is not set")
  return t
}

export async function saveVolunteer(record: VolunteerRecord): Promise<void> {
  await put(`${PREFIX}${record.createdAt.slice(0, 10)}-${record.id}.json`, JSON.stringify(record, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    token: privateStoreToken(),
  })
}

async function readJson(pathname: string): Promise<VolunteerRecord | null> {
  const res = await get(pathname, { access: "private", token: privateStoreToken(), useCache: false })
  if (!res || res.statusCode !== 200 || !res.stream) return null
  const text = await new Response(res.stream).text()
  try {
    return JSON.parse(text) as VolunteerRecord
  } catch {
    return null
  }
}

// Every sign-up, newest first.
export async function listVolunteers(): Promise<VolunteerRecord[]> {
  const paths: string[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000, token: privateStoreToken() })
    paths.push(...page.blobs.map((b) => b.pathname))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  const records = await Promise.all(paths.map(readJson))
  return records
    .filter((r): r is VolunteerRecord => r !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
