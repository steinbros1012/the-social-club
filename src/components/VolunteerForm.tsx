"use client"

import { useMemo, useState } from "react"
import WaiverText from "@/components/WaiverText"
import { VOLUNTEER_EVENT } from "@/config/volunteer"
import { isMinorAge, validateVolunteer, type VolunteerErrors } from "@/lib/volunteer-validate"
import type { VolunteerFormData } from "@/types/volunteer"

const EMPTY: VolunteerFormData = {
  firstName: "",
  lastName: "",
  age: "",
  contactName: "",
  contactRelationship: "",
  contactPhone: "",
  contactEmail: "",
  waiverAgreed: false,
  signatureName: "",
  website: "",
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string
  hint?: string
}

function Field({ label, id, error, hint, required, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#101218] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-[#101218] placeholder:text-[#4B4F58]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1 ${
          error ? "border-red-400 bg-red-50" : "border-[#e7e7e7] bg-white hover:border-[#5ca8fe]/50"
        }`}
        {...props}
      />
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-[#4B4F58]">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

export default function VolunteerForm() {
  const [data, setData] = useState<VolunteerFormData>(EMPTY)
  const [errors, setErrors] = useState<VolunteerErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const minor = isMinorAge(data.age)
  const today = useMemo(() => new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), [])

  function set<K extends keyof VolunteerFormData>(key: K, value: VolunteerFormData[K]) {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const found = validateVolunteer(data)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setServerError("Please fix the highlighted fields.")
      return
    }
    setSubmitting(true)
    setServerError(null)
    try {
      const res = await fetch("/api/volunteer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      const json = (await res.json()) as { error?: string; errors?: VolunteerErrors }
      if (!res.ok) {
        setErrors(json.errors ?? {})
        setServerError(json.error ?? "Something went wrong. Please try again.")
        return
      }
      setDone(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setServerError("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-6" role="status">
        <div className="w-16 h-16 rounded-full bg-[#6EB104] text-white text-3xl flex items-center justify-center mx-auto mb-5" aria-hidden="true">✓</div>
        <h2 className="font-heading font-black text-[#101218] text-2xl uppercase mb-3">You&apos;re signed up!</h2>
        <p className="text-[#4B4F58] max-w-md mx-auto">
          Thank you, {data.firstName}! Your waiver is signed. We sent a confirmation to <strong>{data.contactEmail}</strong> with everything
          you need. See you on {VOLUNTEER_EVENT.date} at {VOLUNTEER_EVENT.time.split(" – ")[0]}!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {/* honeypot: hidden from people, bots fill it in */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <fieldset className="space-y-5">
        <legend className="font-heading font-black text-[#101218] text-xl uppercase mb-4">About the volunteer</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First Name" id="first-name" required autoComplete="given-name" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} />
          <Field label="Last Name" id="last-name" required autoComplete="family-name" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} />
        </div>
        <div className="sm:w-1/2">
          <Field label="Age" id="age" required type="number" inputMode="numeric" min={5} max={110} value={data.age} onChange={(e) => set("age", e.target.value)} error={errors.age}
            hint={`Under ${VOLUNTEER_EVENT.minorAge}? A parent or guardian fills in their details and signs the waiver.`} />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-heading font-black text-[#101218] text-xl uppercase mb-1">{minor ? "Parent / Guardian" : "Contact information"}</legend>
        <p className="text-[#4B4F58] text-sm">
          {minor ? "Because the volunteer is under 18, we need a parent or guardian's contact details." : "How we can reach you about the event."}
        </p>
        {minor && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Parent/Guardian Full Name" id="contact-name" required autoComplete="name" value={data.contactName} onChange={(e) => set("contactName", e.target.value)} error={errors.contactName} />
            <Field label="Relationship to Volunteer" id="contact-relationship" required placeholder="e.g. Mother, Father, Guardian" value={data.contactRelationship}
              onChange={(e) => set("contactRelationship", e.target.value)} error={errors.contactRelationship} />
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={minor ? "Parent/Guardian Phone" : "Phone"} id="contact-phone" required type="tel" autoComplete="tel" placeholder="(555) 555-5555" value={data.contactPhone}
            onChange={(e) => set("contactPhone", e.target.value)} error={errors.contactPhone} />
          <Field label={minor ? "Parent/Guardian Email" : "Email"} id="contact-email" required type="email" autoComplete="email" placeholder="name@example.com" value={data.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)} error={errors.contactEmail} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-heading font-black text-[#101218] text-xl uppercase mb-1">Waiver &amp; Release</legend>
        <p className="text-[#4B4F58] text-sm mb-4">
          Every volunteer needs a signed waiver.{" "}
          {minor ? <strong>A parent or guardian must sign on the volunteer&apos;s behalf.</strong> : "Please read it and sign below."}
        </p>
        <WaiverText />
        <label
          htmlFor="waiver-agreed"
          className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all mb-4 ${
            data.waiverAgreed ? "border-[#5ca8fe] bg-[#5ca8fe]/5" : errors.waiverAgreed ? "border-red-400 bg-red-50" : "border-[#e7e7e7] hover:border-[#5ca8fe]/40"
          }`}
        >
          <input id="waiver-agreed" type="checkbox" checked={data.waiverAgreed} onChange={() => set("waiverAgreed", !data.waiverAgreed)}
            className="w-5 h-5 mt-0.5 flex-shrink-0 accent-[#5ca8fe] cursor-pointer" />
          <span className="font-heading font-bold text-[#101218] text-sm">
            {minor
              ? `I am the parent or legal guardian of ${data.firstName || "the volunteer"}, and I have read and agree to the waiver and release of liability on their behalf.`
              : "I have read and agree to the waiver and release of liability."}
          </span>
        </label>
        {errors.waiverAgreed && <p role="alert" className="-mt-2 mb-4 text-xs text-red-500 font-medium">{errors.waiverAgreed}</p>}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={minor ? "Parent/Guardian Signature (type full name)" : "Signature (type your full name)"} id="signature" required autoComplete="off" value={data.signatureName}
            onChange={(e) => set("signatureName", e.target.value)} error={errors.signatureName} style={{ fontFamily: "cursive", fontSize: "1.05rem" }} />
          <div>
            <p className="block text-sm font-semibold text-[#101218] mb-1.5">Date</p>
            <p className="rounded-xl border border-[#e7e7e7] bg-[#f3f5f5] px-4 py-3 text-sm text-[#4B4F58]">{today}</p>
          </div>
        </div>
      </fieldset>

      {serverError && <p role="alert" className="text-sm text-red-600 font-medium text-center">{serverError}</p>}
      <button type="submit" disabled={submitting}
        className="w-full bg-[#6EB104] hover:bg-[#5c9303] disabled:opacity-60 text-white font-bold text-base px-8 py-4 rounded-full transition-colors focus-ring">
        {submitting ? "Signing up…" : "Sign Up to Volunteer"}
      </button>
    </form>
  )
}
