import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { getSettingsByKeys } from "@/lib/settings"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsByKeys([
    "site_title",
    "meta_description",
    "og_image_url",
  ])

  const title = settings.site_title || "Gerüstbauer24 - Gerüstbaufirmen in Deutschland finden"
  const description = settings.meta_description || "Finden Sie zuverlässige Gerüstbauer in Ihrer Region. Geprüfte Unternehmen, echte Bewertungen und schnelle Anfragen."

  return {
    title: {
      default: title,
      template: `%s | Gerüstbauer24`,
    },
    description,
    generator: "v0.app",
    openGraph: {
      title,
      description,
      ...(settings.og_image_url ? { images: [settings.og_image_url] } : {}),
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
