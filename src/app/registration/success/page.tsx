import Image from "next/image"
import Link from "next/link"
import { EVENT_CONFIG } from "@/config/event"

interface PageProps {
  searchParams: Promise<{ session_id?: string; type?: string }>
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isScholarship = params.type === "scholarship"

  const eventDetails = EVENT_CONFIG.date
    ? [
        { label: "Date", value: EVENT_CONFIG.date },
        { label: "Time", value: EVENT_CONFIG.time },
        { label: "Location", value: EVENT_CONFIG.location },
        { label: "Address", value: EVENT_CONFIG.address },
      ].filter((d) => d.value)
    : []

  return (
    <div className="min-h-screen bg-[#f3f5f5] flex flex-col items-center justify-center px-4 py-16">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-[#e7e7e7] max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#074694] px-8 py-10 text-center text-white">
          <div className="w-20 h-20 rounded-full bg-[#5ca8fe] flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg">
            🎉
          </div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tight mb-2">
            {isScholarship ? "You're Registered!" : "You're In!"}
          </h1>
          <p className="text-white/80 text-base">
            {isScholarship
              ? "Your registration has been received. No payment required."
              : "Registration confirmed and payment received."}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <p className="text-[#4B4F58] text-sm leading-relaxed mb-6">
            A confirmation email has been sent to the caregiver email address on file. Please check
            your inbox (and spam folder) within a few minutes.
          </p>

          {eventDetails.length > 0 && (
            <div className="bg-[#f3f5f5] rounded-2xl p-5 mb-6">
              <p className="font-heading font-bold text-[#101218] text-xs uppercase tracking-wide mb-4">
                Event Details
              </p>
              <dl className="space-y-2">
                {eventDetails.map(({ label, value }) => (
                  <div key={label} className="flex gap-4">
                    <dt className="text-[#4B4F58] text-sm w-20 flex-shrink-0">{label}</dt>
                    <dd className="text-[#101218] text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="bg-[#5ca8fe]/10 border border-[#5ca8fe]/20 rounded-2xl p-5 mb-6">
            <p className="font-heading font-bold text-[#074694] text-xs uppercase tracking-wide mb-3">
              Reminder
            </p>
            <p className="text-[#101218] text-sm leading-relaxed">
              <strong>Parents and caregivers must remain on-site</strong> for the full duration of
              the event. This is not a drop-off program.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 text-center bg-[#074694] hover:bg-[#063d82] text-white font-bold text-sm py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] focus-visible:ring-offset-2"
            >
              Back to Home
            </Link>
            <a
              href={`mailto:${EVENT_CONFIG.contactEmail}`}
              className="flex-1 text-center border-2 border-[#e7e7e7] hover:border-[#5ca8fe] text-[#4B4F58] hover:text-[#074694] font-bold text-sm py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] focus-visible:ring-offset-2"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Logos */}
      <div className="mt-10 flex items-center gap-6">
        <div className="relative w-28 h-8">
          <Image
            src={EVENT_CONFIG.endlessSportsLogoUrl}
            alt="Endless Sports"
            fill
            className="object-contain"
            sizes="112px"
          />
        </div>
        <span className="text-[#4B4F58] text-lg font-bold">×</span>
        <span className="font-heading font-bold text-[#4B4F58] text-xs uppercase tracking-wide">
          We Will Walk With You
        </span>
      </div>
    </div>
  )
}
