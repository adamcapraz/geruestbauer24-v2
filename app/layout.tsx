import type React from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { GoogleAdSenseBodyCode } from "@/components/google-consent-tools"
import { AdminHeadContent } from "@/components/admin-head-content"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { getSettingsByKeys } from "@/lib/settings"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// SSR erzwingen: Alle Seiten werden bei jedem Request dynamisch server-seitig gerendert
// (statisches Caching / ISR deaktiviert). Wird an alle untergeordneten Routen vererbt.
export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsByKeys(["og_image_url"])
  const title = "Gerüstbauer finden & Angebote vergleichen | Gerüstbauer24"
  const description =
    "Geprüfte Gerüstbaufirmen in ganz Deutschland: echte Bewertungen lesen, kostenlos mehrere Angebote anfordern und den passenden Gerüstbauer finden."
  const image =
    settings.og_image_url ||
    `https://geruestbauer24.eu/api/og?title=${encodeURIComponent(title)}&type=city`

  return {
    metadataBase: new URL("https://geruestbauer24.eu"),
    title: { default: title, template: "%s | Gerüstbauer24" },
    description,
    generator: "v0.app",
    icons: {
      icon: "/icon.svg",
      apple: "/apple-icon.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "Gerüstbauer24",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [siteSettings, requestHeaders] = await Promise.all([
    getSettingsByKeys([
      "google_adsense_code",
      "custom_head_scripts",
      "google_adsense_body_code",
    ]),
    headers(),
  ])
  const requestHostname = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase()
  const allowAdSense = ["geruestbauer24.eu", "www.geruestbauer24.eu"].includes(requestHostname)

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <AdminHeadContent
          snippets={[siteSettings.google_adsense_code, siteSettings.custom_head_scripts]}
          allowAdSense={allowAdSense}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>

        <GoogleAdSenseBodyCode
          enabled={allowAdSense}
          code={siteSettings.google_adsense_body_code || ""}
        />
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
