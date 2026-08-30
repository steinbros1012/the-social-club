"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { EVENT_CONFIG } from "@/config/event"

interface Registration {
  id: string
  participant_first_name: string
  participant_last_name: string
  participant_email: string
  participant_phone: string
  caregiver_first_name: string
  caregiver_last_name: string
  caregiver_email: string
  caregiver_phone: string
  caregiver_relationship: string
  scholarship_requested: boolean
  payment_status: string
  registration_status: string
  accommodation_notes: string | null
  dietary_notes: string | null
  created_at: string
}

// ---------- STATUS BADGE ----------
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    complete: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
    scholarship: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    incomplete: "bg-yellow-100 text-yellow-700",
    canceled: "bg-red-100 text-red-600",
    refunded: "bg-gray-100 text-gray-600",
    waitlist: "bg-purple-100 text-purple-700",
  }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}
    >
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
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    if (password === adminPw) {
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
          <Image
            src={EVENT_CONFIG.socialClubLogoUrl}
            alt="The Social Club Logo"
            width={56}
            height={56}
            className="rounded-full mx-auto mb-4"
          />
          <h1 className="font-heading font-black text-[#101218] text-xl uppercase">Admin Dashboard</h1>
          <p className="text-[#4B4F58] text-sm mt-1">The Social Club</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-[#101218] mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e7e7e7] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1"
              placeholder="Enter admin password…"
            />
            {error && (
              <p role="alert" className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#074694] hover:bg-[#063d82] text-white font-bold py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] focus-visible:ring-offset-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-[#4B4F58] hover:text-[#074694] text-sm transition-colors">
            ← Back to Site
          </Link>
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

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch("/api/admin/registrations", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
        },
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

  useEffect(() => {
    void fetchRegistrations()
  }, [fetchRegistrations])

  // Counts
  const total = registrations.length
  const complete = registrations.filter((r) => r.registration_status === "complete").length
  const paid = registrations.filter((r) => r.payment_status === "paid").length
  const scholarship = registrations.filter((r) => r.scholarship_requested).length
  const pending = registrations.filter((r) => r.registration_status === "incomplete").length

  // Filtered
  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      `${r.participant_first_name} ${r.participant_last_name}`.toLowerCase().includes(q) ||
      r.participant_email.toLowerCase().includes(q) ||
      r.caregiver_email.toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === "all" || r.registration_status === statusFilter
    return matchesSearch && matchesStatus
  })

  // CSV export
  function exportCSV() {
    const headers = [
      "ID",
      "Participant Name",
      "Participant Email",
      "Participant Phone",
      "Caregiver Name",
      "Caregiver Email",
      "Caregiver Phone",
      "Relationship",
      "Scholarship",
      "Payment Status",
      "Registration Status",
      "Accommodations",
      "Dietary Notes",
      "Registered At",
    ]

    const rows = registrations.map((r) => [
      r.id,
      `${r.participant_first_name} ${r.participant_last_name}`,
      r.participant_email,
      r.participant_phone,
      `${r.caregiver_first_name} ${r.caregiver_last_name}`,
      r.caregiver_email,
      r.caregiver_phone,
      r.caregiver_relationship,
      r.scholarship_requested ? "Yes" : "No",
      r.payment_status,
      r.registration_status,
      r.accommodation_notes ?? "",
      r.dietary_notes ?? "",
      new Date(r.created_at).toLocaleString(),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `social-club-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#f3f5f5]">
      {/* Top bar */}
      <header className="bg-[#074694] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={EVENT_CONFIG.socialClubLogoUrl}
            alt="The Social Club Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="font-heading font-black text-sm uppercase tracking-widest">Admin</p>
            <p className="text-white/60 text-xs">The Social Club</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
            ← Site
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_auth")
              onLogout()
            }}
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Registrations", value: total, color: "text-[#101218]" },
            { label: "Confirmed", value: complete, color: "text-green-600" },
            { label: "Scholarship", value: scholarship, color: "text-[#5ca8fe]" },
            { label: "Pending Payment", value: pending, color: "text-yellow-600" },
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
            className="flex-1 rounded-xl border border-[#e7e7e7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#e7e7e7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1"
          >
            <option value="all">All Statuses</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
            <option value="canceled">Canceled</option>
            <option value="waitlist">Waitlist</option>
          </select>
          <button
            onClick={() => void fetchRegistrations()}
            className="px-4 py-2.5 rounded-xl border border-[#e7e7e7] bg-white text-sm font-medium hover:border-[#5ca8fe] hover:text-[#074694] transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={registrations.length === 0}
            className="px-4 py-2.5 rounded-xl bg-[#074694] hover:bg-[#063d82] text-white text-sm font-bold transition-colors disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-[#4B4F58]">Loading registrations…</div>
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
                    {[
                      "Participant",
                      "Contact",
                      "Caregiver",
                      "Scholarship",
                      "Payment",
                      "Status",
                      "Registered",
                    ].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-bold text-[#4B4F58] uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e7e7]">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-[#f3f5f5]/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#101218]">
                          {r.participant_first_name} {r.participant_last_name}
                        </p>
                        {(r.accommodation_notes || r.dietary_notes) && (
                          <p className="text-[#5ca8fe] text-xs mt-0.5" title="Has accommodation/dietary notes">
                            ★ Notes on file
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#4B4F58]">{r.participant_email}</p>
                        <p className="text-[#4B4F58] text-xs">{r.participant_phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#101218]">
                          {r.caregiver_first_name} {r.caregiver_last_name}
                        </p>
                        <p className="text-[#4B4F58] text-xs capitalize">{r.caregiver_relationship}</p>
                      </td>
                      <td className="px-5 py-4">
                        {r.scholarship_requested ? (
                          <span className="text-[#5ca8fe] font-semibold">Yes</span>
                        ) : (
                          <span className="text-[#4B4F58]">No</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.payment_status} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.registration_status} />
                      </td>
                      <td className="px-5 py-4 text-[#4B4F58] text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-[#e7e7e7] bg-[#f3f5f5] text-xs text-[#4B4F58]">
              Showing {filtered.length} of {total} registration{total !== 1 ? "s" : ""}
              {paid > 0 && ` · ${paid} paid`}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ---------- PAGE ----------
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") {
      setAuthed(true)
    }
    setChecked(true)
  }, [])

  if (!checked) return null

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />
  }

  return <Dashboard onLogout={() => setAuthed(false)} />
}
