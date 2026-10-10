"use client"

import { useCallback, useEffect, useState } from "react"
import { formatBirthday } from "@/lib/volunteer-validate"
import type { VolunteerRecord } from "@/types/volunteer"

// The admin dashboard's Volunteers section: who signed up, their contact, and who signed
// the waiver (the volunteer, or a parent/guardian for minors). CSV export.
export default function VolunteersAdmin() {
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVolunteers = useCallback(async (): Promise<VolunteerRecord[]> => {
    const res = await fetch("/api/admin/volunteers")
    const json = (await res.json()) as { volunteers?: VolunteerRecord[]; error?: string }
    if (!res.ok) throw new Error(json.error ?? "Could not load volunteers.")
    return json.volunteers ?? []
  }, [])

  const apply = useCallback((p: Promise<VolunteerRecord[]>, isCurrent: () => boolean = () => true) => {
    p.then((list) => {
      if (isCurrent()) {
        setVolunteers(list)
        setError(null)
      }
    })
      .catch((e: unknown) => {
        if (isCurrent()) setError(e instanceof Error ? e.message : "Could not load volunteers.")
      })
      .finally(() => {
        if (isCurrent()) setLoading(false)
      })
  }, [])

  // first load (state only changes once the request comes back)
  useEffect(() => {
    let current = true
    apply(fetchVolunteers(), () => current)
    return () => {
      current = false
    }
  }, [apply, fetchVolunteers])

  function load() {
    setLoading(true)
    apply(fetchVolunteers())
  }

  async function exportCsv() {
    const res = await fetch("/api/admin/volunteers?format=csv")
    if (!res.ok) return
    const url = URL.createObjectURL(await res.blob())
    const a = document.createElement("a")
    a.href = url
    a.download = `volunteers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const minors = volunteers.filter((v) => v.isMinor).length

  return (
    <section className="mt-12" aria-labelledby="volunteers-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
        <div>
          <h2 id="volunteers-heading" className="font-heading font-black text-[#101218] text-xl uppercase">
            Volunteers
          </h2>
          <p className="text-[#4B4F58] text-sm">
            {volunteers.length} signed up{minors > 0 ? ` (${minors} under 18, waiver signed by a parent/guardian)` : ""}. Share the sign-up link:{" "}
            <a href="/volunteer" className="text-[#074694] font-semibold underline">/volunteer</a>
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="px-4 py-2.5 rounded-xl border border-[#e7e7e7] bg-white text-sm font-medium hover:border-[#6694B5] hover:text-[#074694] transition-colors">
            ↻ Refresh
          </button>
          <button onClick={() => void exportCsv()} disabled={volunteers.length === 0} className="px-4 py-2.5 rounded-xl bg-[#074694] hover:bg-[#063d82] text-white text-sm font-bold transition-colors disabled:opacity-50">
            Export CSV
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12 text-[#4B4F58]">Loading…</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-12 text-[#4B4F58] bg-white rounded-2xl border border-[#e7e7e7]">No volunteers yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e7e7e7] shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e7e7e7] bg-[#f3f5f5]">
                {["Volunteer", "Birthday / Age", "Contact", "Waiver", "Signed up"].map((h) => (
                  <th key={h} scope="col" className="px-5 py-3 text-left text-xs font-bold text-[#4B4F58] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e7e7]">
              {volunteers.map((v) => (
                <tr key={v.id}>
                  <td className="px-5 py-4 font-semibold text-[#101218]">{v.firstName} {v.lastName}</td>
                  <td className="px-5 py-4">
                    {v.birthday ? `${formatBirthday(v.birthday)} (${v.age})` : v.age}
                    {v.isMinor && <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Minor</span>}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#101218]">{v.contactName}{v.isMinor ? ` (${v.contactRelationship})` : ""}</p>
                    <p className="text-[#4B4F58] text-xs">{v.contactPhone}</p>
                    <p className="text-[#4B4F58] text-xs">{v.contactEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Signed</span>
                    <p className="text-[#4B4F58] text-xs mt-1">by {v.waiver.signedBy} ({v.waiver.signedAs})</p>
                  </td>
                  <td className="px-5 py-4 text-[#4B4F58] text-xs whitespace-nowrap">
                    {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
