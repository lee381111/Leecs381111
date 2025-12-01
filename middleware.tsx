import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  console.log("[v0] Middleware pathname:", request.nextUrl.pathname)

  if (request.nextUrl.pathname.startsWith("/shared/")) {
    console.log("[v0] Middleware: Skipping auth for shared route")
    return NextResponse.next()
  }

  console.log("[v0] Middleware: Running auth check")
  // </CHANGE>
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
