import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { getSettingsByKeys } from "@/lib/settings"
import { HeadScripts } from "@/components/head-scripts"
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
    "google_search_console_verification",
    "custom_head_scripts",
  ])

  const gaId = analyticsSettings.google_analytics_id
  const gtmId = analyticsSettings.google_tag_manager_id
  const gscVerification = analyticsSettings.google_search_console_verification

  return (
    <html lang="de" suppressHydrationWarning>
      {gscVerification ? (
        <head><meta name="google-site-verification" content={gscVerification} /></head>
      ) : (
        <head />
      )}
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        {gaId && (
          <>
            <Script
              id="ga-script"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script
              id="ga-config"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
        {gtmId && (
          <>
            <Script
              id="gtm-script"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        {analyticsSettings.custom_head_scripts && (
          <HeadScripts html={analyticsSettings.custom_head_scripts} />
        )}
        <script
          type="application/ld+json"
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
