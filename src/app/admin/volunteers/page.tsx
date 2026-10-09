"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ""

interface Volunteer {
  id: string
  volunteer_name: string
  volunteer_age: number
  is_minor: boolean
  guardian_name: string | null
  guardian_phone: string | null
  guardian_email: string | null
  signature_volunteer: string
  signature_volunteer_date: string
  signature_guardian: string | null
  signature_guardian_date: string | null
  event_date: string | null
  created_at: string
}

export default function AdminVolunteersPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") setAuthed(true)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setFetchError("")
    try {
      const res = await fetch("/api/admin/volunteers", {
        headers: { Authorization: `Bearer ${ADMIN_SECRET}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to load volunteers")
      setVolunteers(json.volunteers ?? [])
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load volunteers")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) load()
  }, [authed, load])

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-4">
        <form
          className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
              sessionStorage.setItem("admin_auth", "1")
              setAuthed(true)
            } else {
              setLoginError("Incorrect password.")
            }
          }}
        >
          <h1 className="text-2xl font-extrabold text-[#074694]">Volunteer admin</h1>
          <label htmlFor="admin-password" className="block text-sm font-semibold text-[#101218]">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[#c9d2e0] px-3 py-2.5"
          />
          {loginError && <p className="text-sm text-[#b42318]">{loginError}</p>}
          <button type="submit" className="w-full rounded-full bg-[#074694] text-white font-bold py-2.5">Sign in</button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#074694]">Volunteers</h1>
            <p className="text-[#4B4F58]">{volunteers.length} sign-up{volunteers.length === 1 ? "" : "s"}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="rounded-full border border-[#074694] text-[#074694] font-bold px-4 py-2">Refresh</button>
            <Link href="/admin" className="rounded-full bg-[#074694] text-white font-bold px-4 py-2">Player registrations</Link>
          </div>
        </div>

        {fetchError && <p className="text-[#b42318]">{fetchError}</p>}
        {loading && <p className="text-[#4B4F58]">Loading…</p>}

        {!loading && volunteers.length === 0 && !fetchError && (
          <p className="text-[#4B4F58]">No volunteer sign-ups yet.</p>
        )}

        {volunteers.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f1f5fb] text-left text-[#074694]">
                <tr>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Volunteer</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Parent or guardian</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Signed</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v.id} className="border-t border-[#e7e7e7] align-top">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(v.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold">{v.volunteer_name}</td>
                    <td className="px-4 py-3">{v.volunteer_age}</td>
                    <td className="px-4 py-3">{v.is_minor ? v.guardian_name : "—"}</td>
                    <td className="px-4 py-3">
                      {v.is_minor ? (
                        <>
                          <div>{v.guardian_phone}</div>
                          <div className="text-[#4B4F58]">{v.guardian_email}</div>
                        </>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div>{v.signature_volunteer} ({v.signature_volunteer_date})</div>
                      {v.is_minor && <div className="text-[#4B4F58]">Guardian: {v.signature_guardian} ({v.signature_guardian_date})</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
