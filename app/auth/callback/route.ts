import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const type = searchParams.get("type")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Redirect based on user role
        if (user.user_metadata?.role === "owner") {
          return NextResponse.redirect(`${origin}/firma/dashboard`)
        }
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  // If there's no code or exchange failed, redirect to error page
  return NextResponse.redirect(`${origin}/auth/fehler`)
}
