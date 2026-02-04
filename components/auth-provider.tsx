"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type User = {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "owner" | "admin"
  otpMethod: "email" | "phone"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (identifier: string, otp: string, identifierType: "email" | "phone") => Promise<void>
  signUp: (userData: Partial<User>, otp: string) => Promise<void>
  signOut: () => void
  requestOtp: (identifier: string, method: "email" | "phone", phone?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // This would be an actual API call to check authentication status
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Protect routes that require authentication
  useEffect(() => {
    if (!isLoading) {
      const protectedPaths = ["/dashboard", "/properties/create", "/bookings", "/profile"]

      const isProtectedPath = protectedPaths.some((path) => pathname?.startsWith(path))

      if (isProtectedPath && !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        })
        router.push("/auth/signin")
      }

      // Redirect from auth pages if already logged in
      if ((pathname === "/auth/signin" || pathname === "/auth/signup") && user) {
        router.push("/dashboard")
      }
    }
  }, [pathname, user, isLoading, router, toast])

  const signIn = async (identifier: string, otp: string, identifierType: "email" | "phone") => {
    setIsLoading(true)
    try {
      // This would be an actual API call to verify OTP and sign in
      // Simulating API response
      const mockUser: User = {
        id: "user-123",
        name: "John Doe",
        email: identifierType === "email" ? identifier : "user@example.com",
        phone: identifierType === "phone" ? identifier : "+91 9876543210",
        role: "customer",
        otpMethod: identifierType,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Sign in failed:", error)
      toast({
        title: "Sign in failed",
        description: "Invalid OTP or credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: Partial<User>, otp: string) => {
    setIsLoading(true)
    try {
      // This would be an actual API call to verify OTP and create account
      // Simulating API response
      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: userData.name || "New User",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "customer",
        otpMethod: userData.otpMethod || "email",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Sign up failed:", error)
      toast({
        title: "Sign up failed",
        description: "Invalid OTP or information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    })
    router.push("/")
  }

  const requestOtp = async (identifier: string, method: "email" | "phone", phone?: string) => {
    try {
      // This would be an actual API call to request OTP
      // Simulating API response
      const destination = method === "email" ? identifier : phone || identifier

      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to your ${method === "email" ? "email address" : "mobile number"} (${destination}).`,
      })

      return Promise.resolve()
    } catch (error) {
      console.error("OTP request failed:", error)
      toast({
        title: "OTP request failed",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    requestOtp,
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
