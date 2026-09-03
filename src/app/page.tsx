"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { EVENT_CONFIG } from "@/config/event"
import RegistrationForm from "@/components/RegistrationForm"

// ---------- SCROLL REVEAL HOOK ----------
function useReveal() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

// ---------- NAV ----------
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#074694]/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
        {/* Desktop nav — centered links + right-aligned register */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-10" aria-label="Main navigation">
          <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors focus-ring rounded">About</a>
          <a href="#experience" className="text-white/80 hover:text-white text-sm font-medium transition-colors focus-ring rounded">Experience</a>
          <a href="#faq" className="text-white/80 hover:text-white text-sm font-medium transition-colors focus-ring rounded">FAQ</a>
        </nav>
        <a
          href="#register"
          className="hidden md:inline-flex ml-auto bg-[#5ca8fe] hover:bg-[#4a96ec] text-white text-sm font-bold px-5 py-2 rounded-full transition-colors focus-ring"
        >
          Register Now
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 focus-ring rounded ml-auto"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="block w-5 h-0.5 bg-white mb-1 transition-all" />
          <span className="block w-5 h-0.5 bg-white mb-1 transition-all" />
          <span className="block w-5 h-0.5 bg-white transition-all" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden bg-[#074694] border-t border-white/10 px-4 pb-4"
          aria-label="Mobile navigation"
        >
          {[
            { href: "#about", label: "About" },
            { href: "#experience", label: "Experience" },
            { href: "#faq", label: "FAQ" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-white/80 hover:text-white font-medium border-b border-white/10 last:border-0 focus-ring"
            >
              {label}
            </a>
          ))}
          <a
            href="#register"
            onClick={() => setMenuOpen(false)}
            className="mt-3 block text-center bg-[#5ca8fe] hover:bg-[#4a96ec] text-white font-bold px-5 py-3 rounded-full transition-colors focus-ring"
          >
            Register Now
          </a>
        </nav>
      )}
    </header>
  )
}

// ---------- HERO ----------
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{ animationPlayState: "running" }}
        className="absolute inset-0 w-full h-full object-cover object-center"
        poster="https://endlesssports.org/wp-content/uploads/2026/01/Group-Bowling-Week-1-scaled.jpg"
        ref={(el) => { if (el) el.playbackRate = 0.6 }}
      >
        <source src="https://gdtoauyrnppqxgdz.public.blob.vercel-storage.com/hero.mp4" type="video/mp4" />
      </video>
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-16">
        {/* Presenter line */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="relative w-20 h-24">
              <Image
                src={EVENT_CONFIG.endlessSportsLogoUrl}
                alt="Endless Sports"
                fill
                className="object-contain drop-shadow-lg"
                sizes="80px"
              />
            </div>
            <span className="text-white/40 font-bold text-2xl">&amp;</span>
            <div className="relative w-48 h-16">
              <Image
                src="/wwwwy-logo.png"
                alt="We Will Walk With You"
                fill
                className="object-contain drop-shadow-lg"
                sizes="192px"
              />
            </div>
          </div>
          <span className="text-white/70 font-medium text-sm tracking-widest">present</span>
        </div>

        {/* Social Club logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src={EVENT_CONFIG.socialClubLogoUrl}
            alt="The Social Club"
            width={200}
            height={200}
            priority
            className="object-contain drop-shadow-2xl"
          />
        </div>

        <p className="text-xl sm:text-2xl text-white/90 font-light max-w-xl mx-auto mb-4 leading-relaxed">
          {EVENT_CONFIG.tagline}
        </p>

        {EVENT_CONFIG.date && (
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-6 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 mb-10 text-white/90 text-sm font-medium border border-white/20">
            <span>📅 {EVENT_CONFIG.date}</span>
            {EVENT_CONFIG.time && <span className="hidden sm:block text-white/30">|</span>}
            {EVENT_CONFIG.time && <span>🕕 {EVENT_CONFIG.time}</span>}
            {EVENT_CONFIG.location && <span className="hidden sm:block text-white/30">|</span>}
            {EVENT_CONFIG.location && <span>📍 {EVENT_CONFIG.location}</span>}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#register"
            className="bg-[#5ca8fe] hover:bg-[#4a96ec] text-white font-bold text-lg px-10 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-[#5ca8fe]/30 hover:-translate-y-0.5 focus-ring"
          >
            Register Here
          </a>
          <a
            href="#about"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-10 py-4 rounded-full border border-white/30 transition-all focus-ring"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  )
}


// ---------- UPCOMING DATES BANNER ----------
function UpcomingDatesBanner() {
  const dates = [
    { label: "Saturday, September 26th", time: "12:00PM – 1:30PM", checkin: "Check-in 11:45AM" },
    { label: "Saturday, October 25th", time: "6:30PM – 8:00PM", checkin: "Check-in 6:15PM" },
    { label: "Saturday, November 22nd", time: "6:30PM – 8:00PM", checkin: "Check-in 6:15PM" },
  ]
  return (
    <section className="bg-[#074694] text-white py-8 px-4" aria-label="Upcoming event dates">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-heading font-black text-sm uppercase tracking-[3px] text-[#5ca8fe] mb-6">
          Upcoming Dates
        </p>
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 mb-6">
          {dates.map((d) => (
            <div key={d.label} className="flex-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/20">
              <p className="font-heading font-black text-white text-sm mb-1">{d.label}</p>
              <p className="text-white/90 text-sm font-medium">{d.time}</p>
              <p className="text-white/50 text-xs mt-1">{d.checkin}</p>
            </div>
          ))}
          <div className="flex-1 bg-white/5 rounded-2xl px-5 py-4 border border-white/10">
            <p className="font-heading font-black text-white/50 text-sm mb-1">December</p>
            <p className="text-white/40 text-sm">No Social Club</p>
            <p className="text-white/40 text-xs mt-1">Happy Holidays! 🎄</p>
          </div>
        </div>
        <a
          href="#register"
          className="inline-flex bg-[#5ca8fe] hover:bg-[#4a96ec] text-white text-sm font-bold px-8 py-2.5 rounded-full transition-colors focus-ring"
        >
          Register Now
        </a>
      </div>
    </section>
  )
}

// ---------- ABOUT ----------
function About() {
  const { ref, visible } = useReveal()

  return (
    <section id="about" className="py-24 bg-white" aria-labelledby="about-heading">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`max-w-3xl mx-auto px-4 sm:px-6 reveal ${visible ? "visible" : ""}`}
      >
        <h2
          id="about-heading"
          className="font-heading text-4xl sm:text-5xl font-black text-[#074694] uppercase leading-none mb-6 whitespace-nowrap"
        >
          What is The Social Club?
        </h2>
        <p className="text-[#4B4F58] text-lg leading-relaxed mb-4">
          The Social Club is a monthly hangout for teens and young adults with disabilities.
        </p>
        <p className="text-[#4B4F58] text-lg leading-relaxed mb-4">
          It is built around one thing: Connection!
        </p>
        <p className="text-[#4B4F58] text-lg leading-relaxed mb-8">
          No pressure, no competition, no judgment. Everyone is welcome exactly as they are.
          Participants can jump into activities or sit back and relax. The night is theirs.
        </p>
        <ul className="flex flex-col gap-3">
          {[
            "Open to everyone aged 13+",
            "No experience or ability level required",
            "Scholarships available, no one turned away",
            "Not a drop-off event — parents/caregivers must remain on-site",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#5ca8fe] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[#4B4F58] text-base">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ---------- EXPERIENCE ----------
function Experience() {
  const { ref, visible } = useReveal()
  const items = [
    {
      emoji: "🎯",
      title: "Your Night, Your Way",
      body: "No schedule or agenda - participants choose what they'd like to do! Our volunteers are there to help.",
    },
    {
      emoji: "🏀",
      title: "Sports",
      body: "Feeling sporty? We've got you covered! Try your hand at basketball, pickleball, golf, lacrosse or cornhole!",
    },
    {
      emoji: "🎲",
      title: "Games & Activities",
      body: "Visit our game room and select from over 25 board games and activities.",
    },
    {
      emoji: "🛋️",
      title: "The Sideline",
      body: "Need a break from the action? Enjoy a quiet and relaxed room where the lights are dim and the mood is chill.",
    },
    {
      emoji: "🍕",
      title: "Snacks",
      body: "If you need to refuel, light snacks and water are provided.",
    },
    {
      emoji: "🤝",
      title: "Coaches",
      body: "An amazing group of volunteers ensure that everyone enjoys themselves.",
    },
    {
      emoji: "💙",
      title: "Community",
      body: "Monthly events mean familiar faces, real friendships, and a group that keeps showing up for each other.",
    },
  ]

  return (
    <section
      id="experience"
      className="py-24 bg-[#f3f5f5]"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-14">
          <h2
            id="experience-heading"
            className="font-heading text-4xl sm:text-5xl font-black text-[#074694] uppercase leading-tight"
          >
            The Experience
          </h2>
        </div>

        <ul
          ref={ref as React.RefObject<HTMLUListElement>}
          className={`space-y-5 reveal ${visible ? "visible" : ""}`}
        >
          {items.map((item) => (
            <li key={item.title} className="flex items-start gap-4">
              <svg
                className="w-6 h-6 text-[#5ca8fe] flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-heading font-bold text-[#101218] text-base">
                  {item.title}
                </p>
                <p className="text-[#4B4F58] text-sm leading-relaxed mt-0.5">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}


// ---------- PHOTO CAROUSEL ----------
const CAROUSEL_PHOTOS = [
  { src: "/photos/sc-1.jpg", alt: "Participants playing cards at The Social Club" },
  { src: "/photos/sc-2.jpg", alt: "Playing sports at The Social Club" },
  { src: "/photos/sc-3.jpg", alt: "Putting green at The Social Club" },
  { src: "/photos/sc-4.jpg", alt: "Basketball at The Social Club" },
  { src: "/photos/sc-5.jpg", alt: "Group sports activity at The Social Club" },
  { src: "/photos/sc-6.jpg", alt: "Group photo at The Social Club" },
]

function PhotoCarousel() {
  // Duplicate photos for seamless infinite loop
  const doubled = [...CAROUSEL_PHOTOS, ...CAROUSEL_PHOTOS]
  return (
    <section className="py-3 bg-[#f3f5f5] overflow-hidden" aria-label="Photo gallery">
      <div className="marquee-wrapper overflow-hidden">
        <div className="marquee-track flex gap-3" style={{ width: "max-content" }}>
          {doubled.map(({ src, alt }, i) => (
            <div
              key={`${src}-${i}`}
              className="relative flex-shrink-0 w-72 sm:w-96 h-52 sm:h-64 rounded-2xl overflow-hidden shadow-sm"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="400px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ---------- REGISTRATION SECTION ----------
function RegistrationSection() {
  return (
    <section id="register" className="py-24 bg-[#f3f5f5]" aria-labelledby="register-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            id="register-heading"
            className="font-heading text-4xl sm:text-5xl font-black text-[#074694] uppercase leading-tight mb-4"
          >
            Register Now
          </h2>
          <p className="text-[#4B4F58] text-lg max-w-xl mx-auto">
            Secure your spot at The Social Club.{" "}
            <strong className="text-[#101218]">
              ${EVENT_CONFIG.donationAmount} suggested donation
            </strong>{" "}
            — scholarships available, no one turned away.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-[#e7e7e7] overflow-hidden">
          <RegistrationForm />
        </div>
      </div>
    </section>
  )
}

// ---------- FAQ ----------
function FAQ() {
  const faqs = [
    {
      q: "How much does it cost?",
      a: `The Social Club has a suggested $${EVENT_CONFIG.donationAmount} donation per participant. If that's a barrier, scholarships are available — just check the box on the registration form and you won't be charged.`,
    },
    {
      q: "Do parents/caregivers need to register separately?",
      a: "No. Parent/caregiver information is collected as part of the participant registration. One form covers the whole family unit.",
    },
    {
      q: "Is there a capacity limit?",
      a: `Yes — to keep the environment comfortable for everyone, we limit attendance to ${EVENT_CONFIG.capacity > 0 ? EVENT_CONFIG.capacity + " participants" : "a set number of participants"} per event. Register early to guarantee your spot.`,
    },
    {
      q: "Is the event accessible?",
      a: "Yes. All venue locations are fully wheelchair accessible. If you have specific accessibility needs, please let us know in the registration form and we will do everything we can to accommodate you.",
    },
    {
      q: "Can we attend multiple months?",
      a: "Absolutely — that's the idea! The Social Club is a recurring monthly program. Each month is a fresh experience, and the community gets richer the more you show up.",
    },
    {
      q: "What if we need to cancel?",
      a: `Please email us at ${EVENT_CONFIG.contactEmail} as soon as possible so we can open the spot for someone on the waitlist.`,
    },
  ]

  return (
    <section id="faq" className="py-24 bg-white" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="font-heading text-[#5ca8fe] text-xs font-bold uppercase tracking-[3px] mb-4">
            Common Questions
          </p>
          <h2
            id="faq-heading"
            className="font-heading text-4xl sm:text-5xl font-black text-[#074694] uppercase leading-tight"
          >
            FAQ
          </h2>
        </div>

        <div className="divide-y divide-[#e7e7e7]">
          {faqs.map(({ q, a }) => (
            <FAQItem key={q} question={q} answer={a} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${question.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}`

  return (
    <div className="py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full flex items-start justify-between gap-4 text-left group focus-ring rounded-lg px-1"
      >
        <span className="font-heading font-bold text-[#101218] text-base group-hover:text-[#074694] transition-colors">
          {question}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#5ca8fe]/10 text-[#5ca8fe] flex items-center justify-center text-sm font-bold transition-transform ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <div id={id} className="mt-3 px-1">
          <p className="text-[#4B4F58] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

// ---------- FOOTER ----------
function Footer() {
  return (
    <footer className="bg-[#101218] text-white py-16" aria-label="Site footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={EVENT_CONFIG.socialClubLogoUrl}
                alt="The Social Club Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed">{EVENT_CONFIG.tagline}</p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <p className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-4">
              Navigate
            </p>
            <ul className="space-y-2">
              {[
                { href: "#about", label: "About" },
                { href: "#experience", label: "Experience" },
                { href: "#register", label: "Register" },
                { href: "#faq", label: "FAQ" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-white/60 hover:text-white text-sm transition-colors focus-ring rounded"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-4">
              Questions?
            </p>
            <a
              href={`mailto:${EVENT_CONFIG.contactEmail}`}
              className="text-[#5ca8fe] hover:text-white text-sm transition-colors focus-ring rounded block mb-2"
            >
              {EVENT_CONFIG.contactEmail}
            </a>
            <a
              href="mailto:amanda.wujcik@gmail.com"
              className="text-[#5ca8fe] hover:text-white text-sm transition-colors focus-ring rounded block"
            >
              amanda.wujcik@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} The Social Club. A collaborative program from Endless
            Sports + We Will Walk With You.
          </p>
          <Link
            href="/admin"
            className="text-white/20 hover:text-white/40 text-xs transition-colors focus-ring rounded"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}

// ---------- PAGE ----------
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main>
        <Hero />
        <UpcomingDatesBanner />
        <About />
        <Experience />
        <PhotoCarousel />
        <RegistrationSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
