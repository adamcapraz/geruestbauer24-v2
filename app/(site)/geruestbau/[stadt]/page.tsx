/**
 * /geruestbau/[stadt] — Şehir bazlı firma listeleme
 *
 * DEĞİŞİKLİKLER:
 * - "use client" kaldırıldı → Server Component
 * - generateMetadata eklendi (şehir adıyla dinamik title/description)
 * - generateStaticParams eklendi (bilinen şehirler build zamanında render edilir)
 * - Canonical URL eklendi
 * - OG image eklendi (şehir adıyla)
 * - JSON-LD LocalBusiness şeması eklendi
 * - notFound() eklendi (geçersiz şehir slug'ları için)
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServerlessClient } from "@supabase/supabase-js"
import { denormalizeSlug } from "@/lib/utils/slug"
import { FirmenListClient } from "@/components/firmen-list-client"

const BASE_URL = "https://geruestbauer24.eu"

type Props = {
  params: Promise<{ stadt: string }>
  searchParams: Promise<{ page?: string }>
}

// Build zamanında bilinen tüm şehirleri oluştur (ISR ile güncellenir)
export async function generateStaticParams() {
  const supabase = createServerlessClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: firmen } = await supabase
    .from("firmen")
    .select("stadt_slug")
    .eq("aktiv", true)
    .not("stadt_slug", "is", null)

  const uniqueStaedte = [...new Set((firmen || []).map((f: { stadt_slug: string }) => f.stadt_slug))]

  return uniqueStaedte.map((stadtSlug) => ({ stadt: stadtSlug }))
}

// Sayfaları 1 saatte bir yenile
export const revalidate = 3600

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { stadt } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || "1", 10)

  const stadtName = denormalizeSlug(stadt)

  const title =
    currentPage > 1
      ? `Gerüstbauer in ${stadtName} – Seite ${currentPage} | Gerüstbauer24`
      : `Gerüstbauer in ${stadtName} finden | Gerüstbauer24`

  const description = `Geprüfte Gerüstbaufirmen in ${stadtName}. Echte Bewertungen lesen und unverbindliche Angebote anfordern – kostenlos auf Gerüstbauer24.`

  const canonicalUrl =
    currentPage > 1
      ? `${BASE_URL}/geruestbau/${stadt}?page=${currentPage}`
      : `${BASE_URL}/geruestbau/${stadt}`

  const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(`Gerüstbauer in ${stadtName}`)}&subtitle=${encodeURIComponent("Geprüfte Firmen, echte Bewertungen")}&type=city`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "Gerüstbauer24",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Gerüstbauer in ${stadtName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  }
}

export default async function StadtPage({ params, searchParams }: Props) {
  const { stadt } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || "1", 10)

  const supabase = await createClient()

  // Şehirde firma var mı kontrol et
  const { data: firmen, error } = await supabase
    .from("firmen")
    .select(
      "id, name, slug, stadt, stadt_slug, bundesland, bewertung, anzahl_bewertungen, geprueft, leistungen, google_bewertung, google_anzahl_bewertungen"
    )
    .eq("aktiv", true)
    .eq("stadt_slug", stadt)
    .order("google_bewertung", { ascending: false, nullsFirst: false })

  // Geçersiz şehir → 404
  if (error || !firmen || firmen.length === 0) {
    notFound()
  }

  const stadtName = firmen[0]?.stadt || denormalizeSlug(stadt)
  const bundesland = firmen[0]?.bundesland || ""

  // JSON-LD: Şehir bazlı LocalBusiness listesi
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Gerüstbaufirmen in ${stadtName}`,
    "description": `Geprüfte Gerüstbaufirmen in ${stadtName}, ${bundesland}`,
    "url": `${BASE_URL}/geruestbau/${stadt}`,
    "numberOfItems": firmen.length,
    "itemListElement": firmen.slice(0, 10).map((firma: { name: string; slug: string; stadt: string; stadt_slug: string; bundesland: string; bewertung: number; anzahl_bewertungen: number; google_bewertung: number | null; google_anzahl_bewertungen: number | null }, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": firma.name,
        "url": `${BASE_URL}/geruestbau/${firma.stadt_slug}/${firma.slug}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": firma.stadt,
          "addressRegion": firma.bundesland,
          "addressCountry": "DE",
        },
        ...(firma.google_bewertung || firma.bewertung
          ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": (firma.google_bewertung || firma.bewertung).toFixed(1),
                "reviewCount": firma.google_anzahl_bewertungen || firma.anzahl_bewertungen || 1,
                "bestRating": "5",
                "worstRating": "1",
              },
            }
          : {}),
      },
    })),
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
        "name": `Gerüstbauer in ${stadtName}`,
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
      <FirmenListClient
        initialData={firmen}
        stadtName={stadtName}
        searchParams={{ page: String(currentPage) }}
      />
    </>
  )
}
