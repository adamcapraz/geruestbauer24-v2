"use client"

import React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  LayoutDashboard, MessageSquare, Settings, Building2,
  LogOut, ChevronLeft, Menu, HardHat
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const navItems = [
  { href: "/firma/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/firma/dashboard/profil", label: "Mein Profil", icon: Building2 },
  { href: "/firma/dashboard/anfragen", label: "Anfragen", icon: MessageSquare },

  { href: "/firma/dashboard/einstellungen", label: "Einstellungen", icon: Settings },
]

export default function FirmaDashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Middleware handles redirect, just wait
        return
      }
      if (user.user_metadata?.role !== "owner") {
        router.replace("/kunde/dashboard")
        return
      }
      setUser(user)
      setLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="w-64 bg-slate-900 p-4 hidden md:block">
          <Skeleton className="h-8 w-40 mb-8 bg-slate-700" />
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-10 w-full mb-2 bg-slate-700" />
          ))}
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 md:z-auto
        w-64 h-screen md:h-auto bg-slate-900 text-white
        flex flex-col transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HardHat className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-400">Firmenkonto</span>
              </div>
              <p className="font-semibold text-sm truncate">{user?.user_metadata?.name || user?.email?.split("@")[0]}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${isActive
                    ? "bg-amber-600 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors mb-1"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            Zurück zur Webseite
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Abmelden
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center gap-3 p-4 border-b">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-amber-600" />
            <span className="font-semibold text-sm">Firma Dashboard</span>
          </div>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
