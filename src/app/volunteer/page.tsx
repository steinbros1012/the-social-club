import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import VolunteerForm from "@/components/VolunteerForm"
import { EVENT_CONFIG } from "@/config/event"
import { VOLUNTEER_EVENT } from "@/config/volunteer"

export const metadata: Metadata = {
  title: "Volunteer | The Social Club",
  description: "Thank you for volunteering for the Social Club. Sign up and sign your waiver here.",
}

const DETAILS: { label: string; value: string; note?: string }[] = [
  { label: "Date", value: VOLUNTEER_EVENT.date },
  { label: "Time", value: VOLUNTEER_EVENT.time, note: VOLUNTEER_EVENT.timeNote },
  { label: "Location", value: `${VOLUNTEER_EVENT.location}, ${VOLUNTEER_EVENT.address}`, note: VOLUNTEER_EVENT.entranceNote },
  { label: "What to wear", value: VOLUNTEER_EVENT.dressNote },
]

export default function VolunteerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f3f5f5]">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 focus-ring rounded-md">
            <Image src={EVENT_CONFIG.endlessSportsLogoUrl} alt="Endless Sports" width={36} height={44} className="object-contain" />
            <Image src="/wwwwy-logo.png" alt="We Will Walk With You" width={90} height={55} className="object-contain" />
          </Link>
          <Link href="/" className="ml-auto text-[#4B4F58] hover:text-[#074694] text-sm font-medium transition-colors focus-ring rounded">← The Social Club</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-[#074694] text-white py-16 px-4 text-center">
          <p className="font-heading font-black text-sm uppercase tracking-[3px] text-[#5ca8fe] mb-4">Volunteers</p>
          <h1 className="font-heading font-black text-3xl sm:text-5xl uppercase mb-5">Thank you!</h1>
          <p className="max-w-2xl mx-auto text-white/85 text-lg leading-relaxed">
            Thank you for volunteering for the Social Club. It&apos;s because of volunteers like yourself that we&apos;re able to offer our programming!
          </p>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 pb-20 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-[#e7e7e7] p-6 sm:p-8">
            <h2 className="font-heading font-black text-[#101218] text-xl uppercase mb-5">Event details</h2>
            <dl className="grid sm:grid-cols-2 gap-5">
              {DETAILS.map((d) => (
                <div key={d.label}>
                  <dt className="text-xs font-bold text-[#4B4F58] uppercase tracking-wide mb-1">{d.label}</dt>
                  <dd className="text-[#101218] font-semibold">{d.value}</dd>
                  {d.note && <dd className="text-[#4B4F58] text-sm mt-0.5">{d.note}</dd>}
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-[#e7e7e7] p-6 sm:p-8">
            <div role="note" className="rounded-2xl bg-[#FFF4D6] border-2 border-[#F5B700] px-5 py-5 sm:px-7 sm:py-6 mb-8 text-center">
              <p className="font-heading font-black text-[#101218] text-2xl sm:text-3xl uppercase leading-tight">
                For Minors: anyone under the age of 18
              </p>
              <p className="font-heading font-bold text-[#101218] text-lg sm:text-xl mt-2">
                Parents and/or Guardians need to sign on their behalf.
              </p>
            </div>
            <h2 className="font-heading font-black text-[#101218] text-2xl uppercase mb-1">Sign up &amp; sign the waiver</h2>
            <p className="text-[#4B4F58] text-sm mb-8">Takes about 2 minutes.</p>
            <VolunteerForm />
          </div>

          <p className="text-center text-[#4B4F58] text-sm">
            Questions? Email{" "}
            <a href={`mailto:${EVENT_CONFIG.contactEmail}`} className="text-[#074694] font-semibold underline">{EVENT_CONFIG.contactEmail}</a>
          </p>
        </div>
      </main>
    </div>
  )
}
