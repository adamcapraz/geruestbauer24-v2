import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function FirmaLayout({ children }: { children: React.ReactNode }) {
  return children
}
