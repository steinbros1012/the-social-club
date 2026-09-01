"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { EVENT_CONFIG } from "@/config/event"
import RegistrationForm from "@/components/RegistrationForm"

// ---------- NAV ----------
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#074694]/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 focus-ring rounded-md">
          <Image
            src={EVENT_CONFIG.socialClubLogoUrl}
            alt="The Social Club Logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="font-heading font-bold text-white text-sm sm:text-base uppercase tracking-widest">
            The Social Club
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <a
            href="#about"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors focus-ring rounded"
          >
            About
          </a>
          <a
            href="#experience"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors focus-ring rounded"
          >
            Experience
          </a>
          <a
            href="#faq"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors focus-ring rounded"
          >
            FAQ
          </a>
          <a
            href="#register"
            className="bg-[#5ca8fe] hover:bg-[#4a96ec] text-white text-sm font-bold px-5 py-2 rounded-full transition-colors focus-ring"
          >
            Register Now
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 focus-ring rounded"
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
      {/* Background image */}
      <Image
        src="https://endlesssports.org/wp-content/uploads/2026/01/Group-Bowling-Week-1-scaled.jpg"
        alt="Social Club participants bowling together"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-16">
        <p className="font-heading text-[#5ca8fe] text-sm font-bold uppercase tracking-[4px] mb-4">
          Endless Sports + We Will Walk With You Present
        </p>

        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight mb-6 leading-none">
          The Social Club
        </h1>

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
            Register Now — ${EVENT_CONFIG.donationAmount}
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

// ---------- QUICK INFO BAR ----------
function QuickInfoBar() {
  const items = [
    { icon: "🧒", label: "Ages 13+" },
    { icon: "📅", label: "Monthly Hangout" },
    { icon: "😌", label: "Low-Pressure" },
    { icon: "👨‍👩‍👧", label: "Parents Stay On-Site" },
    { icon: "💙", label: `$${EVENT_CONFIG.donationAmount} Suggested` },
    { icon: "🤝", label: "Scholarships Available" },
  ]

  return (
    <section className="bg-[#074694] py-5" aria-label="Event highlights">
      <div className="max-w-6xl mx-auto px-4">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {items.map(({ icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-white/90 text-sm font-medium"
            >
              <span aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ---------- ABOUT ----------
function About() {
  const activities = [
    "Board games & card games",
    "Arts & crafts",
    "Casual sports & activities",
    "Just hanging out and socializing",
    "Watching sports or movies",
    "Listening to music",
  ]

  return (
    <section id="about" className="py-24 bg-white" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="font-heading text-[#5ca8fe] text-xs font-bold uppercase tracking-[3px] mb-4">
              What We&apos;re About
            </p>
            <h2
              id="about-heading"
              className="font-heading text-4xl sm:text-5xl font-black text-[#101218] uppercase leading-tight mb-6"
            >
              What is The Social Club?
            </h2>
            <p className="text-[#4B4F58] text-lg leading-relaxed mb-6">
              The Social Club is a monthly hangout for teens and young adults with disabilities. It
              is built around one thing: real connection.
            </p>
            <p className="text-[#4B4F58] text-lg leading-relaxed mb-8">
              No pressure, no competition, no judgment. Everyone is welcome exactly as they are.
              Participants can jump into activities or sit back and relax. The night is theirs.
            </p>

            <div className="bg-[#f3f5f5] rounded-2xl p-6">
              <p className="font-heading font-bold text-[#101218] text-sm uppercase tracking-wide mb-4">
                On any given night, you might find:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activities.map((activity) => (
                  <li key={activity} className="flex items-center gap-3 text-[#4B4F58]">
                    <span className="w-2 h-2 rounded-full bg-[#5ca8fe] flex-shrink-0" aria-hidden="true" />
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://endlesssports.org/wp-content/uploads/2024/02/lax-clinic-group-scaled.jpg"
                alt="Group activity at the Social Club"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg mt-8">
              <Image
                src="https://endlesssports.org/wp-content/uploads/2026/03/sitting-clinic-2.webp"
                alt="Participants relaxing together"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- EXPERIENCE CARDS ----------
function Experience() {
  const cards = [
    {
      emoji: "🎯",
      title: "Your Night, Your Way",
      body: "No agenda, no schedule. Participants choose how they spend their time, with staff and volunteers there to help.",
    },
    {
      emoji: "🛋️",
      title: "The Sideline",
      body: "A quiet zone for anyone who needs a break from the action. Always available, no questions asked.",
    },
    {
      emoji: "🎲",
      title: "Games & Activities",
      body: "Lawn games, table games, arts and crafts, and more. Activities rotate each month so there is always something new.",
    },
    {
      emoji: "🤝",
      title: "Real Community",
      body: "Monthly events mean familiar faces, real friendships, and a group that keeps showing up for each other.",
    },
    {
      emoji: "🍕",
      title: "Snacks & Drinks",
      body: "Light snacks and water are provided. Let us know about dietary needs when you register and we will do our best.",
    },
  ]

  return (
    <section
      id="experience"
      className="py-24 bg-[#f3f5f5]"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="font-heading text-[#5ca8fe] text-xs font-bold uppercase tracking-[3px] mb-4">
            What to Expect
          </p>
          <h2
            id="experience-heading"
            className="font-heading text-4xl sm:text-5xl font-black text-[#101218] uppercase leading-tight"
          >
            The Experience
          </h2>
        </div>

        {/* Text cards — top row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {cards.map((card) => (
            <article
              key={card.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-[#e7e7e7] hover:border-[#5ca8fe]/30"
            >
              <div
                className="w-14 h-14 rounded-xl bg-[#074694]/10 flex items-center justify-center text-2xl mb-6"
                aria-hidden="true"
              >
                {card.emoji}
              </div>
              <h3 className="font-heading font-bold text-[#101218] text-xl mb-3">{card.title}</h3>
              <p className="text-[#4B4F58] leading-relaxed" dangerouslySetInnerHTML={{ __html: card.body }} />
            </article>
          ))}
        </div>

        {/* Photo cards — bottom row */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              src: "https://endlesssports.org/wp-content/uploads/2026/01/Group-Bowling-Week-1-scaled.jpg",
              alt: "Participants bowling together",
              label: "Real Community",
              sub: "Monthly events, familiar faces, real friendships.",
            },
            {
              src: "https://endlesssports.org/wp-content/uploads/2024/02/lax-clinic-group-2-scaled.jpg",
              alt: "Group photo from a Social Club event",
              label: "Come As You Are",
              sub: "No experience or ability level required.",
            },
            {
              src: "https://endlesssports.org/wp-content/uploads/2024/02/Lax-Clinic-tunnel-9-scaled.jpg",
              alt: "Participants cheering together",
              label: "Built for Everyone",
              sub: "Every part of the night is designed so everyone can join in.",
            },
          ].map(({ src, alt, label, sub }) => (
            <div key={label} className="relative rounded-2xl overflow-hidden min-h-[240px] shadow-sm">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#074694]/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="font-heading font-black text-xl uppercase leading-tight">{label}</p>
                <p className="text-white/80 text-sm mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- WHO IS IT FOR ----------
function WhoIsItFor() {
  return (
    <section className="py-24 bg-[#074694] text-white" aria-labelledby="who-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-heading text-[#5ca8fe] text-xs font-bold uppercase tracking-[3px] mb-4">
              Is This Right For Us?
            </p>
            <h2
              id="who-heading"
              className="font-heading text-4xl sm:text-5xl font-black uppercase leading-tight mb-6"
            >
              Who Is It For?
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              The Social Club is open to teens and young adults aged{" "}
              <strong className="text-white">{EVENT_CONFIG.ageRequirement}+</strong> with any
              disability: physical, intellectual, developmental, or otherwise.
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              Every participant brings a caregiver who stays on-site the whole time. This is not a
              drop-off program. It is a night out for the whole support team.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              { q: "Do participants need to be verbal?", a: "No. The Social Club is designed to welcome participants at all communication levels." },
              { q: "What if my child gets overwhelmed?", a: "The Sideline quiet space is always available. Our staff and volunteers are trained to support any situation with patience and care." },
              { q: "What if we've never done something like this?", a: "Perfect — that's exactly who this is for. First-timers are always welcome, and our team will be there to help everyone feel comfortable." },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="font-heading font-bold text-white mb-2">{q}</p>
                <p className="text-white/75 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- GUIDELINES ----------
function Guidelines() {
  const guidelines = [
    {
      num: "01",
      title: "Be Kind",
      body: "Treat everyone here with respect. Participants, caregivers, volunteers, and staff all deserve the same warmth.",
    },
    {
      num: "02",
      title: "Respect Space",
      body: "Some participants need extra room, physically or sensorily. Give it freely.",
    },
    {
      num: "03",
      title: "No Pressure",
      body: "Nobody has to do anything. Everything here is optional.",
    },
    {
      num: "04",
      title: "Caregivers Stay",
      body: "Parents and caregivers stay on-site the whole night. This is not a drop-off event.",
    },
    {
      num: "05",
      title: "Have Fun",
      body: "That is the whole point.",
    },
    {
      num: "06",
      title: "Leave It Better",
      body: "Clean up after yourself, cheer people on, and look out for each other.",
    },
  ]

  return (
    <section className="py-24 bg-white" aria-labelledby="guidelines-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="font-heading text-[#5ca8fe] text-xs font-bold uppercase tracking-[3px] mb-4">
            Community Standards
          </p>
          <h2
            id="guidelines-heading"
            className="font-heading text-4xl sm:text-5xl font-black text-[#101218] uppercase leading-tight"
          >
            Member Guidelines
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {guidelines.map(({ num, title, body }) => (
            <div key={num} className="flex gap-5">
              <div
                className="font-heading font-black text-4xl text-[#5ca8fe]/25 leading-none select-none flex-shrink-0 w-12"
                aria-hidden="true"
              >
                {num}
              </div>
              <div>
                <h3 className="font-heading font-bold text-[#101218] text-lg mb-2">{title}</h3>
                <p className="text-[#4B4F58] leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- PHOTO STRIP ----------
function PhotoStrip() {
  return (
    <section className="py-2 bg-[#f3f5f5] overflow-hidden" aria-label="Photo gallery">
      <div className="flex gap-2">
        {[
          {
            src: "https://endlesssports.org/wp-content/uploads/2024/02/lax-clinic-group-2-scaled.jpg",
            alt: "Group photo from a Social Club event",
          },
          {
            src: "https://endlesssports.org/wp-content/uploads/2026/01/Group-Bowling-Week-1-scaled.jpg",
            alt: "Participants bowling together",
          },
          {
            src: "https://endlesssports.org/wp-content/uploads/2024/02/Lax-Clinic-tunnel-9-scaled.jpg",
            alt: "Participants celebrating",
          },
          {
            src: "https://endlesssports.org/wp-content/uploads/2024/02/Lax-Clinic-15-scaled.jpg",
            alt: "Social Club activity",
          },
          {
            src: "https://endlesssports.org/wp-content/uploads/2024/02/Lax-Clinic-tunnel-1-scaled.jpg",
            alt: "Participants in a tunnel celebration",
          },
        ].map(({ src, alt }) => (
          <div key={src} className="relative flex-1 h-48 sm:h-64 rounded-xl overflow-hidden">
            <Image src={src} alt={alt} fill className="object-cover" sizes="20vw" />
          </div>
        ))}
      </div>
    </section>
  )
}

// ---------- PARTNERS ----------
function Partners() {
  return (
    <section className="py-20 bg-white" aria-labelledby="partners-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="font-heading text-[#5ca8fe] text-xs font-bold uppercase tracking-[3px] mb-4">
          Collaboration
        </p>
        <h2
          id="partners-heading"
          className="font-heading text-3xl sm:text-4xl font-black text-[#101218] uppercase mb-12"
        >
          Built Together
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20">
          {/* Endless Sports */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-52 h-16">
              <Image
                src={EVENT_CONFIG.endlessSportsLogoUrl}
                alt="Endless Sports logo"
                fill
                className="object-contain"
                sizes="208px"
              />
            </div>
            <p className="text-[#4B4F58] text-sm">endlesssports.org</p>
          </div>

          <div className="font-heading font-black text-[#e7e7e7] text-4xl select-none" aria-hidden="true">
            ×
          </div>

          {/* We Will Walk With You — text placeholder until client provides logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-52 h-16 rounded-xl bg-[#f3f5f5] border-2 border-dashed border-[#e7e7e7] flex items-center justify-center px-4">
              <p className="font-heading font-bold text-[#4B4F58] text-sm text-center uppercase tracking-wide">
                We Will Walk With You
              </p>
            </div>
            <p className="text-[#4B4F58] text-xs italic">Logo coming soon</p>
          </div>
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
          <p className="font-heading text-[#5ca8fe] text-xs font-bold uppercase tracking-[3px] mb-4">
            Join Us
          </p>
          <h2
            id="register-heading"
            className="font-heading text-4xl sm:text-5xl font-black text-[#101218] uppercase leading-tight mb-4"
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
      q: "Do caregivers need to register separately?",
      a: "No. Caregiver information is collected as part of the participant registration. One form covers the whole family unit.",
    },
    {
      q: "Is there a capacity limit?",
      a: `Yes — to keep the environment comfortable for everyone, we limit attendance to ${EVENT_CONFIG.capacity > 0 ? EVENT_CONFIG.capacity + " participants" : "a set number of participants"} per event. Register early to guarantee your spot.`,
    },
    {
      q: "What if my child needs 1:1 support?",
      a: "Caregivers are encouraged to stay with their participant as much as needed. Our volunteer staff can also provide additional support — just note any needs in the accommodation field when registering.",
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
            className="font-heading text-4xl sm:text-5xl font-black text-[#101218] uppercase leading-tight"
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
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="font-heading font-black text-white text-sm uppercase tracking-widest">
                The Social Club
              </span>
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
              Contact
            </p>
            <a
              href={`mailto:${EVENT_CONFIG.contactEmail}`}
              className="text-[#5ca8fe] hover:text-white text-sm transition-colors focus-ring rounded"
            >
              {EVENT_CONFIG.contactEmail}
            </a>
            <div className="mt-6">
              <p className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-3">
                Presented By
              </p>
              <div className="relative w-36 h-10">
                <Image
                  src={EVENT_CONFIG.endlessSportsLogoUrl}
                  alt="Endless Sports"
                  fill
                  className="object-contain object-left brightness-0 invert"
                  sizes="144px"
                />
              </div>
            </div>
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
        <QuickInfoBar />
        <About />
        <Experience />
        <WhoIsItFor />
        <Guidelines />
        <PhotoStrip />
        <Partners />
        <RegistrationSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
