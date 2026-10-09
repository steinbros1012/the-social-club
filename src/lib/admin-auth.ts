import { createHmac, timingSafeEqual } from "node:crypto"
import type { NextRequest, NextResponse } from "next/server"

// Admin sign-in, checked on the server. The password (ADMIN_PASSWORD) and the key that
// signs the session cookie (ADMIN_SESSION_SECRET) are server-only env vars: nothing
// secret is shipped to the browser. The cookie is httpOnly, so page scripts can't read it.
export const ADMIN_COOKIE = "sc_admin"
const SESSION_HOURS = 12

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s || s.length < 32) throw new Error("ADMIN_SESSION_SECRET is not set")
  return s
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url")
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function checkPassword(password: unknown): boolean {
  const real = process.env.ADMIN_PASSWORD
  return typeof password === "string" && !!real && safeEqual(password, real)
}

// "<expiry ms>.<signature>"
export function newSessionToken(now: number = Date.now()): string {
  const expires = String(now + SESSION_HOURS * 3600 * 1000)
  return `${expires}.${sign(expires)}`
}

export function isValidSessionToken(token: string | undefined, now: number = Date.now()): boolean {
  if (!token) return false
  const [expires, sig] = token.split(".")
  if (!expires || !sig || !safeEqual(sig, sign(expires))) return false
  return Number(expires) > now
}

export function isAdmin(req: NextRequest): boolean {
  try {
    return isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)
  } catch {
    return false
  }
}

export function setSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, newSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  })
  return res
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return res
}
