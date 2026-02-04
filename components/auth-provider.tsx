"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

type User = {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "owner" | "admin"
}

type AuthContextType = {
  user: User | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: { name: string; email: string; phone?: string; role: "customer" | "owner" }, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          setSupabaseUser(authUser)
          setUser({
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "Benutzer",
            email: authUser.email || "",
            phone: authUser.user_metadata?.phone || "",
            role: authUser.user_metadata?.role || "customer",
          })
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Benutzer",
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
          role: session.user.user_metadata?.role || "customer",
        })
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Protect routes that require authentication
  useEffect(() => {
    if (!isLoading) {
      const protectedPaths = ["/dashboard", "/firma/dashboard", "/profil"]

      const isProtectedPath = protectedPaths.some((path) => pathname?.startsWith(path))

      if (isProtectedPath && !user) {
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melden Sie sich an, um auf diese Seite zuzugreifen.",
          variant: "destructive",
        })
        router.push("/auth/anmelden")
      }

      // Redirect from auth pages if already logged in
      if ((pathname === "/auth/anmelden" || pathname === "/auth/registrieren") && user) {
        if (user.role === "owner") {
          router.push("/firma/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }, [pathname, user, isLoading, router, toast])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: "Willkommen zurück!",
          description: "Sie haben sich erfolgreich angemeldet.",
        })

        const role = data.user.user_metadata?.role || "customer"
        if (role === "owner") {
          router.push("/firma/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: unknown) {
      console.error("Sign in failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler"
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: errorMessage === "Invalid login credentials" 
          ? "Ungültige E-Mail oder Passwort." 
          : errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: { name: string; email: string; phone?: string; role: "customer" | "owner" }, password: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone || "",
            role: userData.role,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: "Konto erstellt!",
          description: "Bitte bestätigen Sie Ihre E-Mail-Adresse, um fortzufahren.",
        })
        router.push("/auth/bestaetigung")
      }
    } catch (error: unknown) {
      console.error("Sign up failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler"
      toast({
        title: "Registrierung fehlgeschlagen",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      setSupabaseUser(null)
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      })
      router.push("/")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  const value = {
    user,
    supabaseUser,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
