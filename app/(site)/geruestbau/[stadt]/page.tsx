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
import { denormalizeSlug } from "@/lib/utils/slug"
import { FirmenListClient } from "@/components/firmen-list-client"
import { BASE_URL, createSeoMetadata } from "@/lib/seo"

type Props = {
  params: Promise<{ stadt: string }>
  searchParams: Promise<{ page?: string }>
}

// SSR erzwingen: Bei jedem Request dynamisch server-seitig gerendert (kein Static/ISR)
export const dynamic = "force-dynamic"

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { stadt } = await params
  const filters = await searchParams
  const supabase = await createClient()
  const { data: cityData, count } = await supabase
    .from("firmen")
    .select("stadt", { count: "exact" })
    .eq("aktiv", true)
    .eq("stadt_slug", stadt)
    .limit(1)
    .maybeSingle()

  const stadtName = cityData?.stadt || denormalizeSlug(stadt)
  const companyCount = count ?? 0
  const description =
    companyCount < 2
      ? `Gerüstbaufirmen in ${stadtName} im Vergleich: Bewertungen, Leistungen & Kontaktdaten. Jetzt kostenlos Angebote für Fassaden- und Baugerüste anfragen.`
      : `${companyCount.toLocaleString("de-DE")} Gerüstbaufirmen in ${stadtName} im Vergleich: Bewertungen, Leistungen & Kontaktdaten. Jetzt kostenlos Angebote für Fassaden- und Baugerüste anfragen.`

  return createSeoMetadata({
    title: `Gerüstbau ${stadtName}: Gerüstbauer vergleichen`,
    description,
    canonicalPath: `/geruestbau/${stadt}`,
    ...(Object.keys(filters).length > 0 ? { robots: { index: false, follow: true } } : {}),
  })
}

export default async function StadtPage({ params, searchParams }: Props) {
  const { stadt } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || "1", 10)

  const supabase = await createClient()

  // Şehirde firma var mı kontrol et
  const { data: firmen, error, count } = await supabase
    .from("firmen")
    .select(
      "id, name, slug, stadt, stadt_slug, bundesland, bewertung, anzahl_bewertungen, geprueft, leistungen, google_bewertung, google_anzahl_bewertungen",
      { count: "exact" },
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
    "numberOfItems": count ?? firmen.length,
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
        initialCount={count ?? firmen.length}
        stadtName={stadtName}
        stadtSlug={stadt}
        searchParams={{ page: String(currentPage) }}
      />
    </>
  )
}
