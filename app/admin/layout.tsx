import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Gerüstbauer24",
  description: "Verwaltungsbereich für Gerüstbauer24",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      {children}
    </div>
  )
}
