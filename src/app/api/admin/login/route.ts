import { NextRequest, NextResponse } from "next/server"
import { checkPassword, setSessionCookie } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  let password: unknown
  try {
    password = ((await req.json()) as { password?: unknown }).password
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
  if (!checkPassword(password)) {
    // (a short pause makes guessing passwords slow)
    await new Promise((r) => setTimeout(r, 800))
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
  }
  return setSessionCookie(NextResponse.json({ success: true }))
}
