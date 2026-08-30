import type { Metadata } from "next"
import { Montserrat, Noto_Sans } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "The Social Club | Endless Sports + We Will Walk With You",
  description:
    "A welcoming social hangout for teens and young adults with disabilities. Connect, have fun, and be yourself — ages 13+, $5 suggested donation.",
  openGraph: {
    title: "The Social Club",
    description:
      "A welcoming social hangout for teens and young adults with disabilities. Connect, have fun, and be yourself.",
    images: [
      {
        url: "https://endlesssports.org/wp-content/uploads/2026/03/Social-Club-Logo.jpg",
        width: 800,
        height: 600,
        alt: "The Social Club Logo",
      },
    ],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
