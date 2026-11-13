import type React from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import ConsentManager from "@/components/consent-manager"
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
  const [analyticsSettings, requestHeaders] = await Promise.all([
    getSettingsByKeys([
      "google_analytics_id",
      "google_tag_manager_id",
      "google_adsense_code",
      "custom_head_scripts",
      "google_adsense_body_code",
      "cookie_consent_enabled",
      "cookie_consent_title",
      "cookie_consent_text",
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
          snippets={[analyticsSettings.google_adsense_code, analyticsSettings.custom_head_scripts]}
          allowAdSense={allowAdSense}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>

        <ConsentManager
          enabled={analyticsSettings.cookie_consent_enabled === "true"}
          title={analyticsSettings.cookie_consent_title}
          text={analyticsSettings.cookie_consent_text}
          analyticsId={analyticsSettings.google_analytics_id}
          tagManagerId={analyticsSettings.google_tag_manager_id}
          adsenseCode={analyticsSettings.google_adsense_body_code}
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
