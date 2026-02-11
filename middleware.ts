import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sitemap/robots ve Next internal dosyaları middleware'den tamamen çıkar
  if (
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap.xml/" ||
    pathname === "/robots.txt" ||
    pathname === "/robots.txt/" ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    // matcher yine geniş kalabilir; yukarıdaki early-return sitemap'i korur
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
