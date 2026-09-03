"use client"

import { useState } from "react"
import { EVENT_CONFIG } from "@/config/event"
import type { RegistrationFormData } from "@/types/registration"

// ---------- TYPES ----------
type FormErrors = Partial<Record<keyof RegistrationFormData, string>>

const EMPTY_FORM: RegistrationFormData = {
  participantFirstName: "",
  participantLastName: "",
  participantDob: "",
  participantEmail: "",
  participantPhone: "",
  caregiverFirstName: "",
  caregiverLastName: "",
  caregiverRelationship: "",
  caregiverEmail: "",
  caregiverPhone: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  accommodationNotes: "",
  dietaryNotes: "",
  scholarshipRequested: false,
  waiverAgreed: false,
  waiverPrintedName: "",
  waiverDate: "",
}

// ---------- VALIDATION ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s\-().]{7,}$/

function validateStep(step: number, data: RegistrationFormData): FormErrors {
  const errors: FormErrors = {}

  if (step === 1) {
    if (!data.participantFirstName.trim()) errors.participantFirstName = "First name is required."
    if (!data.participantLastName.trim()) errors.participantLastName = "Last name is required."
    if (!data.participantEmail.trim()) {
      errors.participantEmail = "Email is required."
    } else if (!EMAIL_RE.test(data.participantEmail)) {
      errors.participantEmail = "Enter a valid email address."
    }
    if (!data.participantPhone.trim()) {
      errors.participantPhone = "Phone number is required."
    } else if (!PHONE_RE.test(data.participantPhone)) {
      errors.participantPhone = "Enter a valid phone number."
    }
  }

  if (step === 3) {
    if (!data.waiverAgreed) errors.waiverAgreed = "You must agree to the waiver to continue."
    if (!data.waiverPrintedName.trim()) errors.waiverPrintedName = "Please print your name to sign the waiver."
    if (!data.waiverDate.trim()) errors.waiverDate = "Please enter today's date."
  }

  if (step === 2) {
    if (!data.caregiverFirstName.trim()) errors.caregiverFirstName = "First name is required."
    if (!data.caregiverLastName.trim()) errors.caregiverLastName = "Last name is required."
    if (!data.caregiverRelationship.trim()) errors.caregiverRelationship = "Relationship is required."
    if (!data.caregiverEmail.trim()) {
      errors.caregiverEmail = "Email is required."
    } else if (!EMAIL_RE.test(data.caregiverEmail)) {
      errors.caregiverEmail = "Enter a valid email address."
    }
    if (!data.caregiverPhone.trim()) {
      errors.caregiverPhone = "Phone number is required."
    } else if (!PHONE_RE.test(data.caregiverPhone)) {
      errors.caregiverPhone = "Enter a valid phone number."
    }
  }

  return errors
}

// ---------- SUB-COMPONENTS ----------
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="px-8 pt-8 pb-0" aria-label={`Step ${step} of ${total}`}>
      <div className="flex items-center gap-2 mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                i + 1 <= step ? "bg-[#5ca8fe]" : "bg-[#e7e7e7]"
              }`}
            />
          </div>
        ))}
      </div>
      <p className="text-[#4B4F58] text-xs font-medium">
        Step {step} of {total}
      </p>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-xs text-red-500 font-medium">
      {message}
    </p>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string
  required?: boolean
}

function Field({ label, id, error, required, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#101218] mb-1.5">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-[#101218] placeholder:text-[#4B4F58]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1 ${
          error
            ? "border-red-400 bg-red-50"
            : "border-[#e7e7e7] bg-white hover:border-[#5ca8fe]/50"
        }`}
        {...props}
      />
      {error && <FieldError message={error} />}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  id: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function SelectField({ label, id, error, required, children, ...props }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#101218] mb-1.5">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <select
        id={id}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-[#101218] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1 bg-white ${
          error ? "border-red-400 bg-red-50" : "border-[#e7e7e7] hover:border-[#5ca8fe]/50"
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <FieldError message={error} />}
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  id: string
  hint?: string
}

function TextArea({ label, id, hint, ...props }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#101218] mb-1.5">
        {label}
      </label>
      {hint && <p className="text-xs text-[#4B4F58] mb-2">{hint}</p>}
      <textarea
        id={id}
        rows={3}
        className="w-full rounded-xl border border-[#e7e7e7] bg-white px-4 py-3 text-sm text-[#101218] placeholder:text-[#4B4F58]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1 hover:border-[#5ca8fe]/50 resize-none"
        {...props}
      />
    </div>
  )
}

// ---------- STEPS ----------
function StepParticipant({
  data,
  errors,
  onChange,
}: {
  data: RegistrationFormData
  errors: FormErrors
  onChange: (field: keyof RegistrationFormData, value: string) => void
}) {
  return (
    <fieldset>
      <legend className="font-heading font-black text-[#101218] text-2xl uppercase mb-1">
        Participant Info
      </legend>
      <p className="text-[#4B4F58] text-sm mb-8">
        Tell us about the person who will be attending The Social Club.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="First Name"
          id="participant-first-name"
          required
          autoComplete="given-name"
          value={data.participantFirstName}
          onChange={(e) => onChange("participantFirstName", e.target.value)}
          error={errors.participantFirstName}
          placeholder="Jane"
        />
        <Field
          label="Last Name"
          id="participant-last-name"
          required
          autoComplete="family-name"
          value={data.participantLastName}
          onChange={(e) => onChange("participantLastName", e.target.value)}
          error={errors.participantLastName}
          placeholder="Smith"
        />
        <Field
          label="Date of Birth"
          id="participant-dob"
          type="date"
          autoComplete="bday"
          value={data.participantDob}
          onChange={(e) => onChange("participantDob", e.target.value)}
          error={errors.participantDob}
        />
        <Field
          label="Email Address"
          id="participant-email"
          required
          type="email"
          autoComplete="email"
          value={data.participantEmail}
          onChange={(e) => onChange("participantEmail", e.target.value)}
          error={errors.participantEmail}
          placeholder="jane@example.com"
        />
        <Field
          label="Phone Number"
          id="participant-phone"
          required
          type="tel"
          autoComplete="tel"
          value={data.participantPhone}
          onChange={(e) => onChange("participantPhone", e.target.value)}
          error={errors.participantPhone}
          placeholder="(555) 555-5555"
          className="sm:col-span-2"
        />
      </div>
    </fieldset>
  )
}

function StepCaregiver({
  data,
  errors,
  onChange,
}: {
  data: RegistrationFormData
  errors: FormErrors
  onChange: (field: keyof RegistrationFormData, value: string) => void
}) {
  return (
    <fieldset>
      <legend className="font-heading font-black text-[#101218] text-2xl uppercase mb-1">
        Parent / Caregiver Info
      </legend>
      <p className="text-[#4B4F58] text-sm mb-8">
        The parent/caregiver must remain on-site for the full event. Confirmation emails will be sent here.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="First Name"
          id="caregiver-first-name"
          required
          autoComplete="given-name"
          value={data.caregiverFirstName}
          onChange={(e) => onChange("caregiverFirstName", e.target.value)}
          error={errors.caregiverFirstName}
          placeholder="John"
        />
        <Field
          label="Last Name"
          id="caregiver-last-name"
          required
          autoComplete="family-name"
          value={data.caregiverLastName}
          onChange={(e) => onChange("caregiverLastName", e.target.value)}
          error={errors.caregiverLastName}
          placeholder="Smith"
        />

        <SelectField
          label="Relationship to Participant"
          id="caregiver-relationship"
          required
          value={data.caregiverRelationship}
          onChange={(e) => onChange("caregiverRelationship", e.target.value)}
          error={errors.caregiverRelationship}
          className="sm:col-span-2"
        >
          <option value="">Select relationship…</option>
          <option value="parent">Parent</option>
          <option value="guardian">Legal Guardian</option>
          <option value="sibling">Sibling</option>
          <option value="grandparent">Grandparent</option>
          <option value="caregiver">Paid Caregiver / Support Worker</option>
          <option value="other">Other</option>
        </SelectField>

        <Field
          label="Email Address"
          id="caregiver-email"
          required
          type="email"
          autoComplete="email"
          value={data.caregiverEmail}
          onChange={(e) => onChange("caregiverEmail", e.target.value)}
          error={errors.caregiverEmail}
          placeholder="john@example.com"
        />
        <Field
          label="Phone Number"
          id="caregiver-phone"
          required
          type="tel"
          autoComplete="tel"
          value={data.caregiverPhone}
          onChange={(e) => onChange("caregiverPhone", e.target.value)}
          error={errors.caregiverPhone}
          placeholder="(555) 555-5555"
        />

        <div className="sm:col-span-2">
          <div className="h-px bg-[#e7e7e7] my-2" />
          <p className="font-heading font-bold text-[#101218] text-sm uppercase tracking-wide mt-6 mb-4">
            Emergency Contact (optional)
          </p>
        </div>

        <Field
          label="Emergency Contact Name"
          id="emergency-contact-name"
          autoComplete="name"
          value={data.emergencyContactName}
          onChange={(e) => onChange("emergencyContactName", e.target.value)}
          placeholder="Full name"
        />
        <Field
          label="Emergency Contact Phone"
          id="emergency-contact-phone"
          type="tel"
          autoComplete="tel"
          value={data.emergencyContactPhone}
          onChange={(e) => onChange("emergencyContactPhone", e.target.value)}
          placeholder="(555) 555-5555"
        />
      </div>
    </fieldset>
  )
}

function StepPreferences({
  data,
  errors,
  onChange,
  onToggleScholarship,
  onToggleWaiver,
}: {
  data: RegistrationFormData
  errors: FormErrors
  onChange: (field: keyof RegistrationFormData, value: string) => void
  onToggleScholarship: () => void
  onToggleWaiver: () => void
}) {
  return (
    <fieldset>
      <legend className="font-heading font-black text-[#101218] text-2xl uppercase mb-1">
        Preferences & Support
      </legend>
      <p className="text-[#4B4F58] text-sm mb-8">
        Help us make sure the night works for everyone.
      </p>

      <div className="space-y-5">
        <TextArea
          label="Accessibility or Accommodation Needs"
          id="accommodation-notes"
          hint="e.g. wheelchair access, sensory sensitivities, communication preferences, 1:1 support needs"
          value={data.accommodationNotes}
          onChange={(e) => onChange("accommodationNotes", e.target.value)}
          placeholder="Describe any needs we should be aware of…"
        />
        <TextArea
          label="Dietary Notes"
          id="dietary-notes"
          hint="Allergies, restrictions, or preferences for snacks"
          value={data.dietaryNotes}
          onChange={(e) => onChange("dietaryNotes", e.target.value)}
          placeholder="e.g. nut allergy, gluten-free, vegetarian…"
        />

        {/* Scholarship toggle */}
        <div>
          <div className="h-px bg-[#e7e7e7] mb-5" />
          <label
            htmlFor="scholarship-requested"
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              data.scholarshipRequested
                ? "border-[#5ca8fe] bg-[#5ca8fe]/5"
                : "border-[#e7e7e7] hover:border-[#5ca8fe]/40"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <input
                id="scholarship-requested"
                type="checkbox"
                checked={data.scholarshipRequested}
                onChange={onToggleScholarship}
                className="w-5 h-5 rounded border-[#e7e7e7] accent-[#5ca8fe] cursor-pointer focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1"
              />
            </div>
            <div>
              <p className="font-heading font-bold text-[#101218] text-sm">
                I would like to request a scholarship
              </p>
              <p className="text-[#4B4F58] text-sm mt-1 leading-relaxed">
                The ${EVENT_CONFIG.donationAmount} suggested donation is waived. No payment
                information will be collected, and no one will follow up to ask why. Everyone
                deserves to participate.
              </p>
            </div>
          </label>
        </div>

        {/* Waiver */}
        <div>
          <div className="h-px bg-[#e7e7e7] mb-5" />
          <p className="font-heading font-bold text-[#101218] text-sm uppercase tracking-wide mb-3">
            Waiver & Release
          </p>
          <div className="bg-[#f3f5f5] rounded-xl p-4 text-xs text-[#4B4F58] leading-relaxed mb-4 max-h-48 overflow-y-auto border border-[#e7e7e7]">
            <p className="font-bold text-[#101218] mb-2 uppercase tracking-wide">Endless Sports &amp; We Will Walk With You - Waiver / Release</p>
            <p className="mb-2">I HEREBY ASSUME ALL OF THE RISKS OF PARTICIPATING AND/OR VOLUNTEERING IN THIS ACTIVITY OR EVENT, including by way of example and not limitation, any risks that may arise from negligence or carelessness on the part of the persons or entities being released, from dangerous or defective equipment or property owned, maintained, or controlled by them, or because of their possible liability without fault. I acknowledge that this Accident Waiver and Release of Liability Form will be used by the event holders, sponsors, and organizers of the activity or event in which I may participate, and that it will govern my actions and responsibilities at said activity or event. In consideration of my application and permitting me to participate in this event, I hereby take action for myself, my executors, administrators, heirs, next of kin, successors, and assigns as follows:</p>
            <p className="mb-2">(A) I WAIVE, RELEASE, AND DISCHARGE from any and all liability, including but not limited to, liability arising from the negligence or fault of the entities or persons released, for my death, disability, personal injury, property damage, property theft, or actions of any kind which may hereafter occur to me including my traveling to and from this event, THE FOLLOWING ENTITIES OR PERSONS: Endless Sports and We Will Walk With You, their directors, officers, employees, volunteers, representatives, and agents, the activity or event holders, activity or event sponsors, activity or event volunteers;</p>
            <p className="mb-2">(B) I INDEMNIFY, HOLD HARMLESS, AND PROMISE NOT TO SUE the entities or persons mentioned in this paragraph from any and all liabilities or claims made as a result of participation in this activity or event, whether caused by the negligence of release or otherwise. I acknowledge that Endless Sports and We Will Walk With You and their directors, officers, volunteers, representatives, and agents are NOT responsible for the errors, omissions, acts, or failures to act of any party or entity conducting a specific event or activity on behalf of Endless Sports and We Will Walk With You.</p>
            <p className="mb-2">I acknowledge that this activity or event may involve physical activity, and may carry with it the potential for death, serious injury, and property loss. I hereby consent to receive medical treatment which may be deemed advisable in the event of injury, accident, and/or illness during this activity or event. I understand that at this event or related activities, I may be photographed. I agree to allow my photo, video, or film likeness to be used for any legitimate purpose by the event holders, producers, sponsors, organizers, and assigns. The accident waiver and release of liability shall be construed broadly to provide a release and waiver to the maximum extent permissible under applicable law.</p>
            <p className="mb-2">I CERTIFY THAT I HAVE READ THIS DOCUMENT, AND I FULLY UNDERSTAND ITS CONTENT. I AM AWARE THAT THIS IS A RELEASE OF LIABILITY AND A CONTRACT AND I SIGN IT OF MY OWN FREE WILL.</p>
            <p className="font-semibold text-[#101218]">PARENT / GUARDIAN WAIVER FOR MINORS (Under 18 years old) OR PARTICIPANTS WITH FORMAL GUARDIANSHIP: The undersigned parent or guardian does hereby represent that he/she is, in fact, acting in such capacity, has consented to his/her child or ward&apos;s participation in the activity or event, and has agreed individually and on behalf of the child or ward, to the terms of the accident waiver and release of liability set forth above. The undersigned parent or guardian further agrees to save &amp; hold harmless and indemnify each and all of the parties referred to above from all liability, loss, cost, claim, or damage whatsoever which may be imposed upon said parties because of any defect in or lack of such capacity to so act and release said parties on behalf of the minor and the parents or legal guardian.</p>
          </div>

          <label
            htmlFor="waiver-agreed"
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all mb-4 ${
              data.waiverAgreed
                ? "border-[#5ca8fe] bg-[#5ca8fe]/5"
                : errors.waiverAgreed
                ? "border-red-400 bg-red-50"
                : "border-[#e7e7e7] hover:border-[#5ca8fe]/40"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <input
                id="waiver-agreed"
                type="checkbox"
                checked={data.waiverAgreed}
                onChange={onToggleWaiver}
                className="w-5 h-5 rounded border-[#e7e7e7] accent-[#5ca8fe] cursor-pointer focus:ring-2 focus:ring-[#5ca8fe] focus:ring-offset-1"
              />
            </div>
            <div>
              <p className="font-heading font-bold text-[#101218] text-sm">
                I have read and agree to the waiver and release of liability
              </p>
            </div>
          </label>
          {errors.waiverAgreed && <FieldError message={errors.waiverAgreed} />}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Print Your Name (Signature)"
              id="waiver-printed-name"
              required
              value={data.waiverPrintedName}
              onChange={(e) => onChange("waiverPrintedName", e.target.value)}
              error={errors.waiverPrintedName}
              placeholder="Print full name"
            />
            <Field
              label="Today's Date"
              id="waiver-date"
              required
              type="date"
              value={data.waiverDate}
              onChange={(e) => onChange("waiverDate", e.target.value)}
              error={errors.waiverDate}
            />
          </div>
        </div>
      </div>
    </fieldset>
  )
}

function StepReview({
  data,
  submitting,
  serverError,
}: {
  data: RegistrationFormData
  submitting: boolean
  serverError: string | null
}) {
  return (
    <fieldset>
      <legend className="font-heading font-black text-[#101218] text-2xl uppercase mb-1">
        Review & {data.scholarshipRequested ? "Submit" : "Pay"}
      </legend>
      <p className="text-[#4B4F58] text-sm mb-8">
        Check your details before {data.scholarshipRequested ? "completing registration" : "proceeding to payment"}.
      </p>

      <div className="space-y-4 mb-8">
        {/* Participant summary */}
        <div className="bg-[#f3f5f5] rounded-xl p-5">
          <p className="font-heading font-bold text-[#101218] text-xs uppercase tracking-wide mb-3">
            Participant
          </p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-[#4B4F58]">Name</span>
            <span className="text-[#101218] font-medium">
              {data.participantFirstName} {data.participantLastName}
            </span>
            <span className="text-[#4B4F58]">Email</span>
            <span className="text-[#101218] font-medium break-all">{data.participantEmail}</span>
            <span className="text-[#4B4F58]">Phone</span>
            <span className="text-[#101218] font-medium">{data.participantPhone}</span>
            {data.participantDob && (
              <>
                <span className="text-[#4B4F58]">Date of Birth</span>
                <span className="text-[#101218] font-medium">{data.participantDob}</span>
              </>
            )}
          </div>
        </div>

        {/* Caregiver summary */}
        <div className="bg-[#f3f5f5] rounded-xl p-5">
          <p className="font-heading font-bold text-[#101218] text-xs uppercase tracking-wide mb-3">
            Parent / Caregiver
          </p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-[#4B4F58]">Name</span>
            <span className="text-[#101218] font-medium">
              {data.caregiverFirstName} {data.caregiverLastName}
            </span>
            <span className="text-[#4B4F58]">Relationship</span>
            <span className="text-[#101218] font-medium capitalize">{data.caregiverRelationship}</span>
            <span className="text-[#4B4F58]">Email</span>
            <span className="text-[#101218] font-medium break-all">{data.caregiverEmail}</span>
          </div>
        </div>

        {/* Payment summary */}
        <div
          className={`rounded-xl p-5 border-2 ${
            data.scholarshipRequested
              ? "border-green-200 bg-green-50"
              : "border-[#5ca8fe]/30 bg-[#5ca8fe]/5"
          }`}
        >
          <p className="font-heading font-bold text-[#101218] text-xs uppercase tracking-wide mb-2">
            Payment
          </p>
          {data.scholarshipRequested ? (
            <p className="text-green-700 font-medium text-sm">
              Scholarship applied - no payment required. ✓
            </p>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-[#4B4F58] text-sm">Suggested donation</p>
              <p className="font-heading font-black text-[#074694] text-2xl">
                ${EVENT_CONFIG.donationAmount}
              </p>
            </div>
          )}
        </div>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          <strong>Error:</strong> {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#074694] hover:bg-[#063d82] disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-black text-lg py-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] focus-visible:ring-offset-2"
      >
        {submitting
          ? "Processing…"
          : data.scholarshipRequested
          ? "Complete Registration - Free"
          : `Proceed to Payment - $${EVENT_CONFIG.donationAmount}`}
      </button>

      {!data.scholarshipRequested && (
        <p className="text-center text-[#4B4F58] text-xs mt-3">
          You&apos;ll be redirected to a secure Stripe checkout page.
        </p>
      )}
    </fieldset>
  )
}

// ---------- CLOSED STATE ----------
function RegistrationClosed() {
  return (
    <div className="p-10 text-center">
      <div className="text-4xl mb-4" aria-hidden="true">🔒</div>
      <h3 className="font-heading font-black text-[#101218] text-xl uppercase mb-2">
        Registration is Currently Closed
      </h3>
      <p className="text-[#4B4F58]">
        Check back soon or contact us at{" "}
        <a
          href={`mailto:${EVENT_CONFIG.contactEmail}`}
          className="text-[#5ca8fe] hover:underline focus-ring rounded"
        >
          {EVENT_CONFIG.contactEmail}
        </a>{" "}
        for more information.
      </p>
    </div>
  )
}

// ---------- MAIN COMPONENT ----------
export default function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<RegistrationFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const TOTAL_STEPS = 4

  if (!EVENT_CONFIG.registrationOpen) {
    return <RegistrationClosed />
  }

  function handleChange(field: keyof RegistrationFormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
    // Clear the error for this field on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleToggleScholarship() {
    setData((prev) => ({ ...prev, scholarshipRequested: !prev.scholarshipRequested }))
  }

  function handleToggleWaiver() {
    setData((prev) => ({ ...prev, waiverAgreed: !prev.waiverAgreed }))
    if (errors.waiverAgreed) setErrors((prev) => { const next = { ...prev }; delete next.waiverAgreed; return next })
  }

  function scrollToForm() {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleNext() {
    const stepErrors = validateStep(step, data)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      // Scroll to first error
      const firstErrorKey = Object.keys(stepErrors)[0]
      const el = document.getElementById(
        firstErrorKey
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()
          .replace(/^-/, ""),
      )
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setErrors({})
    setStep((s) => s + 1)
    scrollToForm()
  }

  function handleBack() {
    setErrors({})
    setStep((s) => s - 1)
    scrollToForm()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setServerError(json.error || "Something went wrong. Please try again.")
        setSubmitting(false)
        return
      }

      if (json.type === "scholarship") {
        // Scholarship — redirect to success page
        window.location.href = `/registration/success?type=scholarship`
      } else if (json.type === "payment" && json.checkoutUrl) {
        // Payment — redirect to Stripe
        window.location.href = json.checkoutUrl
      } else {
        setServerError("Unexpected response. Please try again.")
        setSubmitting(false)
      }
    } catch {
      setServerError("A network error occurred. Please check your connection and try again.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
      <ProgressBar step={step} total={TOTAL_STEPS} />

      <div className="p-8 pt-6">
        {step === 1 && (
          <StepParticipant data={data} errors={errors} onChange={handleChange} />
        )}
        {step === 2 && (
          <StepCaregiver data={data} errors={errors} onChange={handleChange} />
        )}
        {step === 3 && (
          <StepPreferences
            data={data}
            errors={errors}
            onChange={handleChange}
            onToggleScholarship={handleToggleScholarship}
            onToggleWaiver={handleToggleWaiver}
          />
        )}
        {step === 4 && (
          <StepReview data={data} submitting={submitting} serverError={serverError} />
        )}

        {/* Navigation */}
        <div className={`flex gap-3 mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="px-6 py-3 rounded-xl border-2 border-[#e7e7e7] text-[#4B4F58] font-semibold text-sm hover:border-[#5ca8fe] hover:text-[#074694] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] focus-visible:ring-offset-2 disabled:opacity-50"
            >
              ← Back
            </button>
          )}
          {step < TOTAL_STEPS && (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-8 py-3 rounded-xl bg-[#6694B5] hover:bg-[#5580a0] text-white font-bold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] focus-visible:ring-offset-2"
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
