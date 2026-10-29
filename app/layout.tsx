import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import ConsentManager from "@/components/consent-manager"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { getSettingsByKeys } from "@/lib/settings"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// SSR erzwingen: Alle Seiten werden bei jedem Request dynamisch server-seitig gerendert
// (statisches Caching / ISR deaktiviert). Wird an alle untergeordneten Routen vererbt.
export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsByKeys([
    "site_title",
    "meta_description",
    "og_image_url",
  ])

  const title = settings.site_title || "Gerüstbauer24 - Gerüstbaufirmen in Deutschland finden"
  const description = settings.meta_description || "Finden Sie zuverlässige Gerüstbauer in Ihrer Region. Geprüfte Unternehmen, echte Bewertungen und schnelle Anfragen."

  return {
    metadataBase: new URL("https://geruestbauer24.eu"),
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const analyticsSettings = await getSettingsByKeys([
    "google_analytics_id",
    "google_tag_manager_id",
    "google_adsense_body_code",
    "cookie_consent_enabled",
    "cookie_consent_title",
    "cookie_consent_text",
  ])

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Gerüstbauer24",
              "url": "https://geruestbauer24.eu",
              "logo": "https://geruestbauer24.eu/placeholder-logo.png",
              "description": "Finden Sie zuverlässige Gerüstbauer in Ihrer Region. Geprüfte Unternehmen, echte Bewertungen und schnelle Anfragen.",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+49-163-9540595",
                "contactType": "customer service",
                "availableLanguage": ["German"]
              },
              "sameAs": [],
              "areaServed": {
                "@type": "Country",
                "name": "Germany"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Gerüstbauer24",
              "url": "https://geruestbauer24.eu",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://geruestbauer24.eu/geruestbau?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
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
