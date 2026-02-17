import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")
  const token_hash = searchParams.get("token_hash")

  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    },
  )

  const getDashboardPath = (role?: string) => {
    return role === "owner" ? "/firma/dashboard" : "/kunde/dashboard"
  }

  // Handle PKCE flow (code exchange)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      const role = data.user.user_metadata?.role
      return NextResponse.redirect(`${origin}${getDashboardPath(role)}`)
    }
  }

  // Handle token_hash flow (email verification via magic link)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as "signup" | "email",
      token_hash,
    })
    
    if (!error && data?.user) {
      const role = data.user.user_metadata?.role
      return NextResponse.redirect(`${origin}${getDashboardPath(role)}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/fehler`)
}
