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
    <html lang="de">
      <head>
        {gscVerification && (
          <meta name="google-site-verification" content={gscVerification} />
        )}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {analyticsSettings.custom_head_scripts && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(){
                  var d=document,tmp=d.createElement('div');
                  tmp.innerHTML=${JSON.stringify(analyticsSettings.custom_head_scripts)};
                  var scripts=tmp.querySelectorAll('script');
                  scripts.forEach(function(s){
                    var ns=d.createElement('script');
                    for(var i=0;i<s.attributes.length;i++){
                      ns.setAttribute(s.attributes[i].name,s.attributes[i].value);
                    }
                    if(s.innerHTML)ns.innerHTML=s.innerHTML;
                    d.head.appendChild(ns);
                  });
                  var others=tmp.querySelectorAll(':not(script)');
                  others.forEach(function(el){d.head.appendChild(el.cloneNode(true));});
                })();
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
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
