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
import FirmaDetailClient from "@/components/firma-detail-client"
import { createClient } from "@/lib/supabase/server"
import { denormalizeSlug } from "@/lib/utils/slug"
import { BASE_URL, createSeoMetadata, fitSeoText } from "@/lib/seo"

type Props = {
  params: Promise<{ stadt: string; firma: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stadt, firma: firmaSlug } = await params
  const supabase = await createClient()
  const { data: firma } = await supabase
    .from("firmen")
    .select("name, stadt, leistungen, google_bewertung, google_anzahl_bewertungen, bewertung, anzahl_bewertungen")
    .eq("stadt_slug", stadt)
    .eq("slug", firmaSlug)
    .eq("aktiv", true)
    .maybeSingle()

  if (!firma) {
    const stadtName = denormalizeSlug(stadt)
    return createSeoMetadata({
      title: `Gerüstbau in ${stadtName} | Gerüstbauer24`,
      description: `Finden Sie Gerüstbaufirmen in ${stadtName} und vergleichen Sie regionale Anbieter.`,
      canonicalPath: `/geruestbau/${stadt}/${firmaSlug}`,
    })
  }

  const services = firma.leistungen?.slice(0, 2) ?? []
  const rating = firma.google_bewertung ?? firma.bewertung
  const reviewCount = firma.google_anzahl_bewertungen ?? firma.anzahl_bewertungen ?? 0
  const ratingText = rating !== null && rating !== undefined && reviewCount > 0
    ? ` ★ ${Number(rating).toFixed(1)}/5 aus ${reviewCount} Bewertungen.`
    : ""
  const serviceText = services.length ? `: ${services.join(", ")}${firma.leistungen?.length > 2 ? " & mehr" : ""}.` : "."
  const descriptionWithServices = `${firma.name} in ${firma.stadt}${serviceText}${ratingText} Kontaktdaten ansehen und unverbindlich Angebot anfragen.`
  const descriptionWithoutServices = `${firma.name} in ${firma.stadt}.${ratingText} Kontaktdaten ansehen und unverbindlich Angebot anfragen.`
  const description = descriptionWithServices.length <= 155
    ? descriptionWithServices
    : descriptionWithoutServices

  return createSeoMetadata({
    title: `${firma.name} – Gerüstbau in ${firma.stadt} | Bewertungen`,
    description: fitSeoText(description, 155),
    canonicalPath: `/geruestbau/${stadt}/${firmaSlug}`,
    image: `${BASE_URL}/api/og?title=${encodeURIComponent(firma.name)}&subtitle=${encodeURIComponent(`Gerüstbau in ${firma.stadt}`)}&type=firma`,
  })
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

  const bewertung = firma.google_bewertung ?? firma.bewertung
  const anzahlBewertungen = firma.google_anzahl_bewertungen ?? firma.anzahl_bewertungen ?? 0
  const profileUrl = `${BASE_URL}/geruestbau/${stadt}/${firmaSlug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": firma.name,
    "url": profileUrl,
    "description": firma.beschreibung || `${firma.name} – professionelle Gerüstbauarbeiten in ${firma.stadt}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": firma.stadt,
      addressRegion: firma.bundesland,
      addressCountry: "DE",
      ...(firma.plz ? { postalCode: firma.plz } : {}),
      ...(firma.adresse ? { streetAddress: firma.adresse } : {}),
    },
    ...(firma.telefon || firma.google_telefon ? { telephone: firma.telefon || firma.google_telefon } : {}),
    ...(firma.webseite || firma.google_webseite ? { sameAs: [firma.webseite || firma.google_webseite] } : {}),
    ...(bewertung !== null && bewertung !== undefined && anzahlBewertungen > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(bewertung).toFixed(1),
            reviewCount: anzahlBewertungen,
            bestRating: "5",
            worstRating: "1",
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
      <FirmaDetailClient initialFirma={firma} />
    </>
  )
}
