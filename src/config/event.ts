export const EVENT_CONFIG = {
  name: "The Social Club",
  tagline: "A place to connect, have fun, and be yourself.",
  // Date/time/location - configurable (leave as empty strings if unknown)
  date: "", // e.g. "Friday, September 26, 2026"
  time: "", // e.g. "6:00 PM – 8:00 PM"
  location: "", // e.g. "Triangle Sport Center"
  address: "", // full address
  ageRequirement: 13,
  donationAmount: 5,
  registrationOpen: true,
  capacity: 50, // set to 0 for unlimited
  contactEmail: "info@endlesssports.org",
  infoEmail: "amanda.wujcik@gmail.com",
  socialClubLogoUrl: "/logo.png",
  endlessSportsLogoUrl: "/endless-sports-logo.png",
} as const
