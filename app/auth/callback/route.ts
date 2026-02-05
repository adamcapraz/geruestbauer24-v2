import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")
  const token_hash = searchParams.get("token_hash")

  console.log("[v0] Auth callback hit - code:", !!code, "type:", type, "token_hash:", !!token_hash)

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

  // Handle PKCE flow (code exchange)
  if (code) {
    console.log("[v0] Attempting code exchange with PKCE code")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log("[v0] Code exchange result - user:", data?.user?.email, "error:", error?.message)
    
    if (!error && data?.user) {
      const role = data.user.user_metadata?.role
      console.log("[v0] User role:", role, "- redirecting to dashboard")
      
      if (role === "owner") {
        return NextResponse.redirect(`${origin}/firma/dashboard`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Handle token_hash flow (email verification via magic link)
  if (token_hash && type) {
    console.log("[v0] Attempting token hash verification")
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as "signup" | "email",
      token_hash,
    })
    
    console.log("[v0] Token verification result - user:", data?.user?.email, "error:", error?.message)
    
    if (!error && data?.user) {
      const role = data.user.user_metadata?.role
      
      if (role === "owner") {
        return NextResponse.redirect(`${origin}/firma/dashboard`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  console.log("[v0] Auth callback - no valid auth method, redirecting to error")
  return NextResponse.redirect(`${origin}/auth/fehler`)
}
