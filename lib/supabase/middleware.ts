import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session - this handles token refresh and clears invalid sessions
  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      user = data.user
    }
  } catch {
    // Session is invalid, user stays null
  }

  const pathname = request.nextUrl.pathname

  // Protect admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user || user.user_metadata?.is_admin !== true) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in admins away from login page
  if (pathname === "/admin/login" && user?.user_metadata?.is_admin) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  // Protect user dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/firma/dashboard") || pathname.startsWith("/kunde/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/anmelden"
      return NextResponse.redirect(url)
    }
  }

  // Redirect /dashboard to role-based dashboard
  if (pathname === "/dashboard" && user) {
    const url = request.nextUrl.clone()
    url.pathname = user.user_metadata?.role === "owner" ? "/firma/dashboard" : "/kunde/dashboard"
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages (but not admin login)
  if (user && (pathname === "/auth/anmelden" || pathname === "/auth/registrieren")) {
    const url = request.nextUrl.clone()
    url.pathname = user.user_metadata?.role === "owner" ? "/firma/dashboard" : "/kunde/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
