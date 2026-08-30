import Link from "next/link"
import { EVENT_CONFIG } from "@/config/event"

interface PageProps {
  searchParams: Promise<{ registration_id?: string }>
}

export default async function CanceledPage({ searchParams }: PageProps) {
  // searchParams is async in Next.js 16+
  await searchParams

  return (
    <div className="min-h-screen bg-[#f3f5f5] flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl border border-[#e7e7e7] max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#101218] px-8 py-10 text-center text-white">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 text-3xl">
            😕
          </div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tight mb-2">
            Payment Canceled
          </h1>
          <p className="text-white/70 text-base">
            No worries — your spot hasn&apos;t been given away yet.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <p className="text-[#4B4F58] leading-relaxed mb-6">
            It looks like the payment didn&apos;t go through. This can happen if the window was closed
            early, the session timed out, or there was a card issue.
          </p>

          <div className="bg-[#5ca8fe]/10 border border-[#5ca8fe]/20 rounded-2xl p-5 mb-8">
            <p className="font-heading font-bold text-[#074694] text-xs uppercase tracking-wide mb-2">
              Need a Scholarship Instead?
            </p>
            <p className="text-[#4B4F58] text-sm leading-relaxed">
              If the ${EVENT_CONFIG.donationAmount} suggested donation is a barrier, you can
              register for free. Just check the scholarship box on the registration form —
              no explanation needed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/#register"
              className="flex-1 text-center bg-[#5ca8fe] hover:bg-[#4a96ec] text-white font-bold text-sm py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] focus-visible:ring-offset-2"
            >
              Try Again
            </Link>
            <a
              href={`mailto:${EVENT_CONFIG.contactEmail}`}
              className="flex-1 text-center border-2 border-[#e7e7e7] hover:border-[#5ca8fe] text-[#4B4F58] hover:text-[#074694] font-bold text-sm py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] focus-visible:ring-offset-2"
            >
              Get Help
            </a>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[#4B4F58] hover:text-[#074694] text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ca8fe] rounded"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
