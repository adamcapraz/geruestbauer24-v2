import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Force HTTPS redirect in production
  const proto = request.headers.get("x-forwarded-proto")
  if (proto === "http" && process.env.NODE_ENV === "production") {
    const httpsUrl = new URL(request.url)
    httpsUrl.protocol = "https:"
    return NextResponse.redirect(httpsUrl.toString(), 301)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
