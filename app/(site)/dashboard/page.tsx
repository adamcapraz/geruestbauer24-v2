"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function DashboardRedirect() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const redirect = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email_confirmed_at) {
        router.push("/auth/anmelden")
        return
      }
      const role = user.user_metadata?.role
      if (role === "owner") {
        router.push("/firma/dashboard")
      } else {
        router.push("/kunde/dashboard")
      }
    }
    redirect()
  }, [])

  return null
}
