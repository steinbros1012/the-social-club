import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"

// Is this browser signed in? (the admin page asks on load)
export async function GET(req: NextRequest) {
  return NextResponse.json({ admin: isAdmin(req) })
}
