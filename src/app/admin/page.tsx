"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { EVENT_CONFIG } from "@/config/event"

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ""
const MIN_ATTENDANCE = 20

interface Registration {
  id: string
  participant_first_name: string
  participant_last_name: string
  participant_dob: string | null
  participant_email: string
  participant_phone: string
  caregiver_first_name: string
  caregiver_last_name: string
  caregiver_email: string
  caregiver_phone: string
  caregiver_relationship: string
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  scholarship_requested: boolean
  payment_status: string
  registration_status: string
  accommodation_notes: string | null
  dietary_notes: string | null
  waiver_printed_name: string | null
  waiver_date: string | null
  created_at: string
}

// ---------- STATUS BADGE ----------
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    complete: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
    scholarship: "bg-[#6694B5]/20 text-[#074694]",
    pending: "bg-yellow-100 text-yellow-700",
    incomplete: "bg-yellow-100 text-yellow-700",
    canceled: "bg-red-100 text-red-600",
    refunded: "bg-gray-100 text-gray-500",
    waitlist: "bg-purple-100 text-purple-700",
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

// ---------- LOGIN ----------
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1")
      onLogin()
    } else {
      setError("Incorrect password.")
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f5f5] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-[#e7e7e7] max-w-sm w-full p-10">
        <div className="text-center mb-8">
          <Image src={EVENT_CONFIG.socialClubLogoUrl} alt="The Social Club" width={60} height={60} className="mx-auto mb-4" />
          <h1 className="font-heading font-black text-[#074694] text-xl uppercase">Admin Dashboard</h1>
          <p className="text-[#4B4F58] text-sm mt-1">The Social Club</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-[#101218] mb-1.5">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e7e7e7] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6694B5] focus:ring-offset-1"
              placeholder="Enter admin password…"
            />
            {error && <p role="alert" className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-[#074694] hover:bg-[#063d82] text-white font-bold py-3 rounded-xl transition-colors">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-[#4B4F58] hover:text-[#074694] text-sm transition-colors">← Back to Site</Link>
        </div>
      </div>
    </div>
  )
}

// ---------- ROW DETAIL DRAWER ----------
function RegistrationDrawer({
  reg,
  onClose,
  onMarkPaid,
  onMarkComplete,
  onCancel,
  onDelete,
}: {
  reg: Registration
  onClose: () => void
  onMarkPaid: (id: string) => Promise<void>
  onMarkComplete: (id: string) => Promise<void>
  onCancel: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [busy, setBusy] = useState(false)

  async function act(fn: (id: string) => Promise<void>, close = false) {
    setBusy(true)
    await fn(reg.id)
    setBusy(false)
    if (close) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
        <div className="bg-[#074694] text-white px-6 py-5 flex items-start justify-between">
          <div>
            <p className="font-heading font-black text-lg uppercase">
              {reg.participant_first_name} {reg.participant_last_name}
            </p>
            <p className="text-white/70 text-sm mt-0.5">Registered {new Date(reg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none mt-1">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex gap-3 flex-wrap">
            <StatusBadge status={reg.registration_status} />
            <StatusBadge status={reg.payment_status} />
            {reg.scholarship_requested && <StatusBadge status="scholarship" />}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {reg.payment_status !== "paid" && reg.payment_status !== "scholarship" && (
              <button
                disabled={busy}
                onClick={() => act(onMarkPaid)}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                Mark as Paid
              </button>
            )}
            {reg.registration_status !== "complete" && (
              <button
                disabled={busy}
                onClick={() => act(onMarkComplete)}
                className="px-4 py-2 rounded-lg bg-[#074694] hover:bg-[#063d82] text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                Mark Complete
              </button>
            )}
            {reg.registration_status !== "canceled" && (
              <button
                disabled={busy}
                onClick={() => { if (confirm("Cancel this registration?")) void act(onCancel) }}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              disabled={busy}
              onClick={() => { if (confirm("Permanently delete this registration? This cannot be undone.")) void act(onDelete, true) }}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>

          <hr className="border-[#e7e7e7]" />

          {/* Participant */}
          <section>
            <p className="font-heading font-bold text-[#074694] text-xs uppercase tracking-widest mb-3">Participant</p>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Email</dt><dd className="text-[#101218] break-all">{reg.participant_email}</dd></div>
              <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Phone</dt><dd className="text-[#101218]">{reg.participant_phone}</dd></div>
              {reg.participant_dob && <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Date of Birth</dt><dd className="text-[#101218]">{reg.participant_dob}</dd></div>}
            </dl>
          </section>

          <hr className="border-[#e7e7e7]" />

          {/* Caregiver */}
          <section>
            <p className="font-heading font-bold text-[#074694] text-xs uppercase tracking-widest mb-3">Parent / Caregiver</p>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Name</dt><dd className="text-[#101218]">{reg.caregiver_first_name} {reg.caregiver_last_name}</dd></div>
              <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Relationship</dt><dd className="text-[#101218] capitalize">{reg.caregiver_relationship}</dd></div>
              <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Email</dt><dd className="text-[#101218] break-all">{reg.caregiver_email}</dd></div>
              <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Phone</dt><dd className="text-[#101218]">{reg.caregiver_phone}</dd></div>
            </dl>
          </section>

          {(reg.emergency_contact_name || reg.emergency_contact_phone) && (
            <>
              <hr className="border-[#e7e7e7]" />
              <section>
                <p className="font-heading font-bold text-[#074694] text-xs uppercase tracking-widest mb-3">Emergency Contact</p>
                <dl className="space-y-2 text-sm">
                  {reg.emergency_contact_name && <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Name</dt><dd className="text-[#101218]">{reg.emergency_contact_name}</dd></div>}
                  {reg.emergency_contact_phone && <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Phone</dt><dd className="text-[#101218]">{reg.emergency_contact_phone}</dd></div>}
                </dl>
              </section>
            </>
          )}

          {(reg.accommodation_notes || reg.dietary_notes) && (
            <>
              <hr className="border-[#e7e7e7]" />
              <section>
                <p className="font-heading font-bold text-[#074694] text-xs uppercase tracking-widest mb-3">Notes</p>
                {reg.accommodation_notes && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-[#4B4F58] mb-1">Accommodations</p>
                    <p className="text-sm text-[#101218] bg-[#f3f5f5] rounded-xl p-3">{reg.accommodation_notes}</p>
                  </div>
                )}
                {reg.dietary_notes && (
                  <div>
                    <p className="text-xs font-semibold text-[#4B4F58] mb-1">Dietary</p>
                    <p className="text-sm text-[#101218] bg-[#f3f5f5] rounded-xl p-3">{reg.dietary_notes}</p>
                  </div>
                )}
              </section>
            </>
          )}

          {reg.waiver_printed_name && (
            <>
              <hr className="border-[#e7e7e7]" />
              <section>
                <p className="font-heading font-bold text-[#074694] text-xs uppercase tracking-widest mb-3">Waiver</p>
                <dl className="space-y-2 text-sm">
                  <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Signed by</dt><dd className="text-[#101218]">{reg.waiver_printed_name}</dd></div>
                  {reg.waiver_date && <div className="flex gap-2"><dt className="text-[#4B4F58] w-28 flex-shrink-0">Date</dt><dd className="text-[#101218]">{reg.waiver_date}</dd></div>}
                </dl>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- DASHBOARD ----------
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<Registration | null>(null)

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch("/api/admin/registrations", {
        headers: { Authorization: `Bearer ${ADMIN_SECRET}` },
      })
      if (!res.ok) throw new Error("Failed to fetch registrations")
      const json = await res.json()
      setRegistrations(json.registrations ?? [])
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetchRegistrations() }, [fetchRegistrations])

  async function patchRegistration(id: string, updates: Record<string, string>) {
    const res = await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_SECRET}`,
      },
      body: JSON.stringify(updates),
    })
    if (!res.ok) { alert("Update failed. Please try again."); return }
    const json = await res.json()
    setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, ...json.registration } : r))
    setSelected((prev) => prev?.id === id ? { ...prev, ...json.registration } : prev)
  }

  const markPaid = (id: string) => patchRegistration(id, { payment_status: "paid", registration_status: "complete" })
  const markComplete = (id: string) => patchRegistration(id, { registration_status: "complete" })
  const cancelReg = (id: string) => patchRegistration(id, { registration_status: "canceled" })

  async function deleteReg(id: string) {
    const res = await fetch(`/api/admin/registrations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` },
    })
    if (!res.ok) { alert("Delete failed. Please try again."); return }
    setRegistrations((prev) => prev.filter((r) => r.id !== id))
    setSelected(null)
  }

  // Stats
  const total = registrations.length
  const confirmed = registrations.filter((r) => r.registration_status === "complete").length
  const scholarships = registrations.filter((r) => r.scholarship_requested).length
  const pending = registrations.filter((r) => r.registration_status === "incomplete").length
  const needsNotes = registrations.filter((r) => r.accommodation_notes || r.dietary_notes).length

  // Filtered list
  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      `${r.participant_first_name} ${r.participant_last_name}`.toLowerCase().includes(q) ||
      r.participant_email.toLowerCase().includes(q) ||
      r.caregiver_email.toLowerCase().includes(q) ||
      `${r.caregiver_first_name} ${r.caregiver_last_name}`.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || r.registration_status === statusFilter
    return matchesSearch && matchesStatus
  })

  // CSV export (client-side)
  function exportCSV() {
    const headers = ["Participant Name","Participant Email","Participant Phone","DOB","Caregiver Name","Caregiver Email","Caregiver Phone","Relationship","Emergency Contact","Emergency Phone","Scholarship","Payment","Status","Accommodations","Dietary Notes","Waiver Signed By","Waiver Date","Registered At"]
    const rows = registrations.map((r) => [
      `${r.participant_first_name} ${r.participant_last_name}`,
      r.participant_email, r.participant_phone, r.participant_dob ?? "",
      `${r.caregiver_first_name} ${r.caregiver_last_name}`,
      r.caregiver_email, r.caregiver_phone, r.caregiver_relationship,
      r.emergency_contact_name ?? "", r.emergency_contact_phone ?? "",
      r.scholarship_requested ? "Yes" : "No",
      r.payment_status, r.registration_status,
      r.accommodation_notes ?? "", r.dietary_notes ?? "",
      r.waiver_printed_name ?? "", r.waiver_date ?? "",
      new Date(r.created_at).toLocaleString(),
    ])
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = `social-club-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  const minPct = Math.min(100, Math.round((confirmed / MIN_ATTENDANCE) * 100))
  const minMet = confirmed >= MIN_ATTENDANCE

  return (
    <div className="min-h-screen bg-[#f3f5f5]">
      {/* Header */}
      <header className="bg-[#074694] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={EVENT_CONFIG.socialClubLogoUrl} alt="The Social Club" width={36} height={36} className="object-contain" />
          <div>
            <p className="font-heading font-black text-sm uppercase tracking-widest">Admin</p>
            <p className="text-white/60 text-xs">The Social Club</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">← Site</Link>
          <button onClick={() => { sessionStorage.removeItem("admin_auth"); onLogout() }} className="text-white/70 hover:text-white text-sm transition-colors">Sign Out</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Minimum attendance bar */}
        <div className={`rounded-2xl p-5 mb-6 border ${minMet ? "bg-green-50 border-green-200" : "bg-white border-[#e7e7e7]"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-heading font-bold text-sm text-[#101218]">
              Minimum Attendance Progress
            </p>
            <p className={`text-sm font-bold ${minMet ? "text-green-600" : "text-[#074694]"}`}>
              {confirmed} / {MIN_ATTENDANCE} confirmed {minMet ? "✓ Minimum met!" : ""}
            </p>
          </div>
          <div className="h-3 bg-[#e7e7e7] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${minMet ? "bg-green-500" : "bg-[#6694B5]"}`}
              style={{ width: `${minPct}%` }}
            />
          </div>
          {!minMet && (
            <p className="text-xs text-[#4B4F58] mt-2">{MIN_ATTENDANCE - confirmed} more confirmed registration{MIN_ATTENDANCE - confirmed !== 1 ? "s" : ""} needed to hold the event.</p>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: total, color: "text-[#101218]" },
            { label: "Confirmed", value: confirmed, color: "text-green-600" },
            { label: "Pending", value: pending, color: "text-yellow-600" },
            { label: "Scholarships", value: scholarships, color: "text-[#074694]" },
            { label: "Has Notes", value: needsNotes, color: "text-[#6694B5]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-[#e7e7e7] shadow-sm">
              <p className="text-[#4B4F58] text-xs font-medium mb-1">{label}</p>
              <p className={`font-heading font-black text-3xl ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-[#e7e7e7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6694B5]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#e7e7e7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6694B5]"
          >
            <option value="all">All Statuses</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Pending</option>
            <option value="canceled">Canceled</option>
            <option value="waitlist">Waitlist</option>
          </select>
          <button onClick={() => void fetchRegistrations()} className="px-4 py-2.5 rounded-xl border border-[#e7e7e7] bg-white text-sm font-medium hover:border-[#6694B5] hover:text-[#074694] transition-colors">
            ↻ Refresh
          </button>
          <button onClick={exportCSV} disabled={registrations.length === 0} className="px-4 py-2.5 rounded-xl bg-[#074694] hover:bg-[#063d82] text-white text-sm font-bold transition-colors disabled:opacity-50">
            Export CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-[#4B4F58]">Loading…</div>
        ) : fetchError ? (
          <div className="text-center py-20 text-red-500">{fetchError}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#4B4F58]">No registrations found.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e7e7e7] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e7e7e7] bg-[#f3f5f5]">
                    {["Participant", "Contact", "Parent / Caregiver", "Payment", "Status", "Registered"].map((h) => (
                      <th key={h} scope="col" className="px-5 py-3 text-left text-xs font-bold text-[#4B4F58] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                    <th scope="col" className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e7e7]">
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-[#f3f5f5]/60 transition-colors cursor-pointer"
                      onClick={() => setSelected(r)}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#101218]">{r.participant_first_name} {r.participant_last_name}</p>
                        {r.scholarship_requested && <p className="text-[#074694] text-xs font-medium mt-0.5">Scholarship</p>}
                        {(r.accommodation_notes || r.dietary_notes) && (
                          <p className="text-[#6694B5] text-xs mt-0.5">⚠ Notes on file</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#4B4F58]">{r.participant_email}</p>
                        <p className="text-[#4B4F58] text-xs">{r.participant_phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#101218]">{r.caregiver_first_name} {r.caregiver_last_name}</p>
                        <p className="text-[#4B4F58] text-xs capitalize">{r.caregiver_relationship}</p>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={r.payment_status} /></td>
                      <td className="px-5 py-4"><StatusBadge status={r.registration_status} /></td>
                      <td className="px-5 py-4 text-[#4B4F58] text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4">
                        {r.payment_status !== "paid" && r.payment_status !== "scholarship" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); void markPaid(r.id) }}
                            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors whitespace-nowrap"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-[#e7e7e7] bg-[#f3f5f5] text-xs text-[#4B4F58]">
              Showing {filtered.length} of {total} registration{total !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </main>

      {/* Detail drawer */}
      {selected && (
        <RegistrationDrawer
          reg={selected}
          onClose={() => setSelected(null)}
          onMarkPaid={markPaid}
          onMarkComplete={markComplete}
          onCancel={cancelReg}
          onDelete={deleteReg}
        />
      )}
    </div>
  )
}

// ---------- PAGE ----------
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") setAuthed(true)
    setChecked(true)
  }, [])

  if (!checked) return null
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />
  return <Dashboard onLogout={() => setAuthed(false)} />
}
