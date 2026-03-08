/**
 * /geruestbau — Ana firma listeleme sayfası
 *
 * DEĞİŞİKLİKLER:
 * - "use client" kaldırıldı → Server Component oldu (SEO için kritik!)
 * - generateMetadata eklendi (sayfa başına unique title/description)
 * - Canonical URL eklendi (pagination için)
 * - OG image eklendi
 * - JSON-LD LocalBusiness list şeması eklendi
 * - Filtreleme mantığı client component'e taşındı (FirmenListClient)
 *
 * NOT: Mevcut filtreleme/pagination mantığı (useState, useEffect vb.)
 * "FirmenListClient" adlı ayrı bir client component'te kalmalıdır.
 * Bu dosya sadece server-side metadata ve veri çekme işlemlerini yapar.
 */

import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { FirmenListClient } from "@/components/firmen-list-client" // mevcut "use client" mantığınız buraya taşınır

const BASE_URL = "https://geruestbauer24.eu"

interface PageProps {
  searchParams: Promise<{ page?: string; stadt?: string; bundesland?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const page = parseInt(params.page || "1", 10)
  const stadt = params.stadt || ""
  const bundesland = params.bundesland || ""

  let title = "Gerüstbaufirmen in Deutschland finden | Gerüstbauer24"
  let description =
    "Finden Sie geprüfte Gerüstbaufirmen in ganz Deutschland. Bewertungen lesen, Angebote vergleichen und den besten Gerüstbauer in Ihrer Region finden."

  if (stadt) {
    title = `Gerüstbauer in ${stadt} | Gerüstbauer24`
    description = `Geprüfte Gerüstbaufirmen in ${stadt}. Bewertungen lesen und unverbindliche Angebote anfordern.`
  } else if (bundesland) {
    title = `Gerüstbauer in ${bundesland} | Gerüstbauer24`
    description = `Geprüfte Gerüstbaufirmen in ${bundesland}. Bewertungen lesen und unverbindliche Angebote anfordern.`
  }

  const pageTitle = page > 1 ? `${title} – Seite ${page}` : title
  const canonicalUrl =
    page > 1
      ? `${BASE_URL}/geruestbau?page=${page}`
      : `${BASE_URL}/geruestbau`

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "Gerüstbauer24",
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent("Gerüstbaufirmen in Deutschland")}&subtitle=${encodeURIComponent("Geprüfte Unternehmen, echte Bewertungen")}&type=city`,
          width: 1200,
          height: 630,
          alt: "Gerüstbaufirmen in Deutschland – Gerüstbauer24",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        `${BASE_URL}/api/og?title=${encodeURIComponent("Gerüstbaufirmen in Deutschland")}&type=city`,
      ],
    },
  }
}

export default async function GeruestbauPage({ searchParams }: PageProps) {
  const params = await searchParams

  // Server-side'da ilk sayfa verisi çekilir (SEO için kritik — Googlebot bunu görür)
  const supabase = await createClient()
  const { data: firmen } = await supabase
    .from("firmen")
    .select("id, name, slug, stadt, stadt_slug, bundesland, bewertung, anzahl_bewertungen, geprueft, leistungen, google_bewertung, google_anzahl_bewertungen")
    .eq("aktiv", true)
    .order("google_bewertung", { ascending: false, nullsFirst: false })
    .limit(10)

  // JSON-LD: ItemList şeması
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Gerüstbaufirmen in Deutschland",
    "description": "Geprüfte Gerüstbaufirmen in ganz Deutschland",
    "url": `${BASE_URL}/geruestbau`,
    "numberOfItems": firmen?.length || 0,
    "itemListElement": (firmen || []).map((firma: { name: string; slug: string; stadt: string; stadt_slug: string; bundesland: string; bewertung: number; anzahl_bewertungen: number; google_bewertung: number | null; google_anzahl_bewertungen: number | null }, index: number) => ({
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/*
        FirmenListClient = mevcut "use client" bileşeniniz
        Tüm useState/useEffect/filter mantığı oraya taşınır.
        initialData prop'u ile server'dan veri geçirilir.
      */}
      <FirmenListClient initialData={firmen || []} searchParams={params} />
    </>
  )
}
