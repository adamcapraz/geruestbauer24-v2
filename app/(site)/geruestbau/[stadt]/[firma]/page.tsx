/**
 * /geruestbau/[stadt]/[firma] — Firma detay sayfası
 *
 * DEĞİŞİKLİKLER:
 * - OG image eklendi (firma adıyla dinamik görsel)
 * - JSON-LD LocalBusiness şeması eklendi (RichResult için)
 * - BreadcrumbList şeması eklendi
 * - Canonical URL düzeltildi (relative → absolute)
 * - generateStaticParams eklendi (build zamanında render)
 * - notFound() geçersiz kombinasyonlar için
 * - twitter:card eklendi
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServerlessClient } from "@supabase/supabase-js"
import { denormalizeSlug } from "@/lib/utils/slug"

const FirmaDetailClient = dynamic(() => import("@/components/firma-detail-client"))

const BASE_URL = "https://geruestbauer24.eu"

type Props = {
  params: Promise<{ stadt: string; firma: string }>
}

// Build zamanında tüm geçerli firma sayfalarını oluştur
export async function generateStaticParams() {
  const supabase = createServerlessClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: firmen } = await supabase
    .from("firmen")
    .select("slug, stadt_slug")
    .eq("aktiv", true)
    .not("slug", "is", null)
    .not("stadt_slug", "is", null)

  return (firmen || []).map((firma: { slug: string; stadt_slug: string }) => ({
    stadt: firma.stadt_slug,
    firma: firma.slug,
  }))
}

// Firma sayfaları haftada bir yenilenir (fiyatlar, bilgiler güncellenir)
export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stadt, firma: firmaSlug } = await params
  const supabase = await createClient()

  const { data: firma } = await supabase
    .from("firmen")
    .select("name, stadt, bundesland, beschreibung, leistungen, google_bewertung, google_anzahl_bewertungen")
    .eq("stadt_slug", stadt)
    .eq("slug", firmaSlug)
    .eq("aktiv", true)
    .single()

  // Firma bulunamadıysa genel meta ver (notFound() page.tsx'de çağrılır)
  if (!firma) {
    const stadtName = denormalizeSlug(stadt)
    return {
      title: `Gerüstbauer in ${stadtName} | Gerüstbauer24`,
      description: `Finden Sie professionelle Gerüstbauer in ${stadtName}. Jetzt Angebote vergleichen auf Gerüstbauer24!`,
    }
  }

  const leistungenText =
    firma.leistungen?.slice(0, 3).join(", ") || "Fassadengerüst, Baugerüst, Industriegerüst"

  const title = `${firma.name} – Gerüstbauer in ${firma.stadt} | Gerüstbauer24`
  const description = `${firma.name} in ${firma.stadt} (${firma.bundesland}): Professioneller Gerüstbau – ${leistungenText}. Jetzt unverbindlich anfragen & Bewertungen lesen!`

  const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(firma.name)}&subtitle=${encodeURIComponent(`Gerüstbauer in ${firma.stadt} · ${leistungenText}`)}&type=firma`

  return {
    title,
    description,
    keywords: [
      firma.name,
      "Gerüstbau",
      "Gerüstbauer",
      firma.stadt,
      firma.bundesland,
      ...leistungenText.split(", "),
      "Gerüst mieten",
      "Gerüstbau Angebot",
    ],
    alternates: {
      // Absolute URL (relative URL metadataBase olmadan sosyal platformlarda çalışmaz)
      canonical: `${BASE_URL}/geruestbau/${stadt}/${firmaSlug}`,
    },
    openGraph: {
      title: `${firma.name} | Gerüstbauer in ${firma.stadt}`,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "Gerüstbauer24",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${firma.name} – Gerüstbauer in ${firma.stadt}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function FirmaDetailPage({ params }: Props) {
  const { stadt, firma: firmaSlug } = await params
  const supabase = await createClient()

  const { data: firma } = await supabase
    .from("firmen")
    .select("*")
    .eq("stadt_slug", stadt)
    .eq("slug", firmaSlug)
    .eq("aktiv", true)
    .single()

  // Geçersiz kombinasyon → 404
  if (!firma) {
    notFound()
  }

  const bewertung = firma.google_bewertung || firma.bewertung
  const anzahlBewertungen = firma.google_anzahl_bewertungen || firma.anzahl_bewertungen

  // JSON-LD: LocalBusiness (zengin sonuçlar için)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": firma.name,
    "url": `${BASE_URL}/geruestbau/${stadt}/${firmaSlug}`,
    "description": firma.beschreibung || `${firma.name} – professionelle Gerüstbauarbeiten in ${firma.stadt}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": firma.stadt,
      "addressRegion": firma.bundesland,
      "addressCountry": "DE",
      ...(firma.plz ? { "postalCode": firma.plz } : {}),
      ...(firma.strasse ? { "streetAddress": firma.strasse } : {}),
    },
    ...(firma.telefon ? { "telephone": firma.telefon } : {}),
    ...(firma.website ? { "sameAs": [firma.website] } : {}),
    ...(bewertung && anzahlBewertungen
      ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": bewertung.toFixed(1),
            "reviewCount": anzahlBewertungen,
            "bestRating": "5",
            "worstRating": "1",
          },
        }
      : {}),
    ...(firma.leistungen?.length
      ? {
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Gerüstbau-Leistungen",
            "itemListElement": firma.leistungen.map((l: string) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": l,
              },
            })),
          },
        }
      : {}),
    "areaServed": {
      "@type": "City",
      "name": firma.stadt,
    },
    "priceRange": "$$",
  }

  // BreadcrumbList şeması
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Startseite",
        "item": BASE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Alle Gerüstbauer",
        "item": `${BASE_URL}/geruestbau`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Gerüstbauer in ${firma.stadt}`,
        "item": `${BASE_URL}/geruestbau/${stadt}`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": firma.name,
        // Son öğede "item" yok — mevcut sayfa
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <FirmaDetailClient />
    </>
  )
}
