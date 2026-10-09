// Volunteer sign-up: the event volunteers are signing up for (shown on /volunteer and in
// the confirmation email). Update these for each event.
export const VOLUNTEER_EVENT = {
  date: "Friday, October 23, 2026",
  time: "5:45 PM – 8:00 PM",
  timeNote: "Please be on time so you can help with set-up.",
  location: "NW Cary YMCA",
  address: "6903 Carpenter Fire Station Rd, Cary, NC 27519",
  entranceNote: "Please enter through the Crosspointe Church entrance.",
  dressNote: "Wear athletic clothing and shoes.",
  // Who is told about each new volunteer sign-up.
  notifyEmails: ["amanda.wujcik@gmail.com"],
  minorAge: 18, // under this age, a parent/guardian signs the waiver
} as const
