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
import { FirmenListClient } from "@/components/firmen-list-client"
import { BASE_URL, createSeoMetadata } from "@/lib/seo"

interface PageProps {
  searchParams: Promise<{ page?: string; stadt?: string; bundesland?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const hasSearchFilters = Object.keys(params).length > 0

  return createSeoMetadata({
    title: "Gerüstbaufirmen in Deutschland finden | Gerüstbauer24",
    description:
      "Verzeichnis geprüfter Gerüstbaufirmen: nach Bundesland, Stadt und Leistung filtern, Bewertungen vergleichen und unverbindlich Angebote anfragen.",
    canonicalPath: "/geruestbau",
    ...(hasSearchFilters ? { robots: { index: false, follow: true } } : {}),
  })
}

export default async function GeruestbauPage({ searchParams }: PageProps) {
  const params = await searchParams

  // Server-side'da ilk sayfa verisi çekilir (SEO için kritik — Googlebot bunu görür)
  const supabase = await createClient()
  let query = supabase
    .from("firmen")
    .select("id, name, slug, stadt, stadt_slug, bundesland, bewertung, anzahl_bewertungen, geprueft, leistungen, google_bewertung, google_anzahl_bewertungen", { count: "exact" })
    .eq("aktiv", true)

  if (params.stadt) query = query.ilike("stadt", `%${params.stadt}%`)
  if (params.bundesland) query = query.ilike("bundesland", `%${params.bundesland}%`)

  const { data: firmen, count } = await query
    .order("google_bewertung", { ascending: false, nullsFirst: false })
    .limit(10)

  // JSON-LD: ItemList şeması
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Gerüstbaufirmen in Deutschland",
    "description": "Geprüfte Gerüstbaufirmen in ganz Deutschland",
    "url": `${BASE_URL}/geruestbau`,
    "numberOfItems": count ?? firmen?.length ?? 0,
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
        ...((firma.google_bewertung ?? firma.bewertung) != null &&
        (firma.google_anzahl_bewertungen ?? firma.anzahl_bewertungen ?? 0) > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(firma.google_bewertung ?? firma.bewertung).toFixed(1),
                reviewCount: firma.google_anzahl_bewertungen ?? firma.anzahl_bewertungen,
                bestRating: "5",
                worstRating: "1",
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
      <FirmenListClient initialData={firmen || []} initialCount={count ?? 0} searchParams={params} />
    </>
  )
}
