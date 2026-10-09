"use client"

import Link from "next/link"
import { useState } from "react"
import { VOLUNTEER_EVENT, type VolunteerFormData } from "@/types/volunteer"

const EMPTY: VolunteerFormData = {
  name: "",
  age: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  waiverAgreed: false,
  signatureVolunteer: "",
  signatureVolunteerDate: "",
  signatureGuardian: "",
  signatureGuardianDate: "",
}

const inputClass =
  "w-full rounded-lg border border-[#c9d2e0] bg-white px-3 py-2.5 text-[#101218] focus:outline-none focus:ring-2 focus:ring-[#074694]"

export default function VolunteerPage() {
  const [form, setForm] = useState<VolunteerFormData>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerFormData, string>>>({})
  const [submitError, setSubmitError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const age = parseInt(form.age, 10)
  const isMinor = !isNaN(age) && age > 0 && age < 18

  function set<K extends keyof VolunteerFormData>(key: K, value: VolunteerFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = "Enter your full name."
    if (isNaN(age) || age < 1 || age > 120) e.age = "Enter a valid age."
    if (isMinor) {
      if (!form.guardianName.trim()) e.guardianName = "Enter the parent or guardian name."
      if (form.guardianPhone.replace(/\D/g, "").length < 10) e.guardianPhone = "Enter a telephone number with area code."
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guardianEmail)) e.guardianEmail = "Enter a valid email address."
    }
    if (!form.waiverAgreed) e.waiverAgreed = "Check the box to agree to the waiver."
    if (!form.signatureVolunteer.trim()) e.signatureVolunteer = "Type your name as your signature."
    if (!form.signatureVolunteerDate) e.signatureVolunteerDate = "Choose a date."
    if (isMinor) {
      if (!form.signatureGuardian.trim()) e.signatureGuardian = "The parent or guardian must sign."
      if (!form.signatureGuardianDate) e.signatureGuardianDate = "Choose a date."
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitError("")
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.")
      setDone(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const Err = ({ name }: { name: keyof VolunteerFormData }) =>
    errors[name] ? <p className="text-sm text-[#b42318] mt-1">{errors[name]}</p> : null

  if (done) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 py-16">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#074694] mb-4">Thank you for volunteering</h1>
          <p className="text-[#4B4F58] mb-6">
            Your sign-up for {VOLUNTEER_EVENT.dateLabel} has been received. Please arrive on time at {VOLUNTEER_EVENT.location} so you can help with set-up.
          </p>
          <Link href="/" className="font-bold text-[#074694] underline">Back to The Social Club</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wide text-[#6EB104]">Endless Sports · The Social Club</p>
          <h1 className="text-4xl font-extrabold text-[#074694]">Volunteer sign-up</h1>
          <p className="text-[#4B4F58]">
            Thank you for volunteering for the Social Club. It&apos;s because of volunteers like you that we&apos;re able to offer our programming!
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-2">
          <h2 className="font-bold text-[#101218]">Event details</h2>
          <p className="text-[#4B4F58]">{VOLUNTEER_EVENT.dateLabel}, {VOLUNTEER_EVENT.time}</p>
          <p className="text-[#4B4F58]">{VOLUNTEER_EVENT.location}, {VOLUNTEER_EVENT.address}</p>
          <p className="text-[#4B4F58]">{VOLUNTEER_EVENT.entrance}</p>
          <p className="text-[#4B4F58]">Please be on time so you can assist in the set-up. Wear athletic clothing and shoes.</p>
        </section>

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#101218] mb-1.5">Full name</label>
              <input id="name" className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
              <Err name="name" />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-[#101218] mb-1.5">Age</label>
              <input id="age" type="number" min={1} max={120} inputMode="numeric" className={inputClass} value={form.age} onChange={(e) => set("age", e.target.value)} />
              <Err name="age" />
            </div>
          </div>

          {isMinor && (
            <fieldset className="space-y-4 rounded-xl border border-[#c9d2e0] p-4">
              <legend className="px-1 font-bold text-[#101218]">Parent or guardian</legend>
              <p className="text-sm text-[#4B4F58]">Volunteers under 18 need a parent or legal guardian to complete this section and sign the waiver.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="guardianName" className="block text-sm font-semibold text-[#101218] mb-1.5">Name</label>
                  <input id="guardianName" className={inputClass} value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
                  <Err name="guardianName" />
                </div>
                <div>
                  <label htmlFor="guardianPhone" className="block text-sm font-semibold text-[#101218] mb-1.5">Telephone</label>
                  <input id="guardianPhone" type="tel" className={inputClass} value={form.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} />
                  <Err name="guardianPhone" />
                </div>
                <div>
                  <label htmlFor="guardianEmail" className="block text-sm font-semibold text-[#101218] mb-1.5">Email</label>
                  <input id="guardianEmail" type="email" className={inputClass} value={form.guardianEmail} onChange={(e) => set("guardianEmail", e.target.value)} />
                  <Err name="guardianEmail" />
                </div>
              </div>
            </fieldset>
          )}

          <fieldset className="space-y-3">
            <legend className="font-bold text-[#101218] mb-2">Waiver and release</legend>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-[#c9d2e0] bg-[#f7f9fc] p-4 text-sm text-[#4B4F58] space-y-3">
              <p><strong className="text-[#101218]">Assumption of risk.</strong> I assume all of the risks of participating in and/or volunteering in this activity or event, including risks that may arise from negligence or carelessness by the persons or entities being released, from dangerous or defective equipment or property, or because of their possible liability without fault.</p>
              <p><strong className="text-[#101218]">Release.</strong> I waive, release, and discharge from any and all liability, including liability arising from negligence or fault, for my death, disability, personal injury, property damage, property theft, or any other harm that may occur to me, including while traveling to and from this event. This applies to Endless Sports and We Will Walk With You, their directors, officers, employees, volunteers, representatives, and agents, and the event holders, sponsors, and volunteers.</p>
              <p><strong className="text-[#101218]">Indemnity.</strong> I will indemnify, hold harmless, and not sue the entities or persons above for any liability or claim arising from my participation in this activity or event, whether caused by negligence or otherwise.</p>
              <p><strong className="text-[#101218]">Medical treatment and photos.</strong> This activity may involve physical activity and carries the potential for death, serious injury, and property loss. I consent to medical treatment deemed advisable in the event of injury, accident, or illness. I may be photographed or filmed, and I allow that likeness to be used for any legitimate purpose by the event holders, sponsors, organizers, and their assigns.</p>
              <p><strong className="text-[#101218]">Agreement.</strong> I have read this document, understand that it is a release of liability and a contract, and sign it of my own free will. The release is to be construed as broadly as applicable law allows.</p>
              <p><strong className="text-[#101218]">Parent or guardian (volunteers under 18).</strong> The undersigned parent or guardian confirms they have the legal capacity to act for the minor, consents to the minor&apos;s participation, and agrees to the terms above on the minor&apos;s behalf.</p>
            </div>
            <label className="flex items-start gap-3 text-[#101218]">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[#074694]" checked={form.waiverAgreed} onChange={(e) => set("waiverAgreed", e.target.checked)} />
              <span>I have read the waiver and agree to its terms.</span>
            </label>
            <Err name="waiverAgreed" />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-bold text-[#101218] mb-2">Signatures</legend>
            <p className="text-sm text-[#4B4F58]">Type your full name as your signature and choose today&apos;s date.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="signatureVolunteer" className="block text-sm font-semibold text-[#101218] mb-1.5">
                  Signature of volunteer{isMinor ? " (under 18)" : ""}
                </label>
                <input id="signatureVolunteer" className={inputClass} value={form.signatureVolunteer} onChange={(e) => set("signatureVolunteer", e.target.value)} />
                <Err name="signatureVolunteer" />
              </div>
              <div>
                <label htmlFor="signatureVolunteerDate" className="block text-sm font-semibold text-[#101218] mb-1.5">Date</label>
                <input id="signatureVolunteerDate" type="date" className={inputClass} value={form.signatureVolunteerDate} onChange={(e) => set("signatureVolunteerDate", e.target.value)} />
                <Err name="signatureVolunteerDate" />
              </div>
            </div>
            {isMinor && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="signatureGuardian" className="block text-sm font-semibold text-[#101218] mb-1.5">Signature of parent or legal guardian</label>
                  <input id="signatureGuardian" className={inputClass} value={form.signatureGuardian} onChange={(e) => set("signatureGuardian", e.target.value)} />
                  <Err name="signatureGuardian" />
                </div>
                <div>
                  <label htmlFor="signatureGuardianDate" className="block text-sm font-semibold text-[#101218] mb-1.5">Date</label>
                  <input id="signatureGuardianDate" type="date" className={inputClass} value={form.signatureGuardianDate} onChange={(e) => set("signatureGuardianDate", e.target.value)} />
                  <Err name="signatureGuardianDate" />
                </div>
              </div>
            )}
          </fieldset>

          {submitError && <p role="alert" className="text-sm text-[#b42318]">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto rounded-full bg-[#6EB104] hover:bg-[#5c9303] text-white font-bold px-8 py-3 transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit sign-up"}
          </button>
        </form>
      </div>
    </main>
  )
}
