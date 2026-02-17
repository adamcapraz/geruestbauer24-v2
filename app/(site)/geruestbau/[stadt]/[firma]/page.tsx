import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { denormalizeSlug } from "@/lib/utils/slug"
import FirmaDetailClient from "@/components/firma-detail-client"

type Props = {
  params: Promise<{ stadt: string; firma: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stadt, firma: firmaSlug } = await params
  const supabase = await createClient()

  const { data: firma } = await supabase
    .from("firmen")
    .select("name, stadt, bundesland, beschreibung, leistungen")
    .eq("stadt_slug", stadt)
    .eq("slug", firmaSlug)
    .eq("aktiv", true)
    .single()

  if (!firma) {
    const stadtName = denormalizeSlug(stadt)
    return {
      title: `Gerüstbauer in ${stadtName} | Gerüstbauer24`,
      description: `Finden Sie professionelle Gerüstbauer in ${stadtName}. Jetzt Angebote vergleichen auf Gerüstbauer24!`,
    }
  }

  const leistungenText = firma.leistungen?.slice(0, 3).join(", ") || "Fassadengerüst, Baugerüst, Industriegerüst"

  return {
    title: `${firma.name} | Gerüstbauer in ${firma.stadt} finden | Gerüstbauer24`,
    description: `${firma.name} in ${firma.stadt} bietet professionelle Gerüstbau-Dienstleistungen. Jetzt unverbindliche Angebote anfordern & Bewertungen lesen auf Gerüstbauer24!`,
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
    openGraph: {
      title: `${firma.name} | Gerüstbauer in ${firma.stadt}`,
      description: `${firma.name} in ${firma.stadt} bietet professionelle Gerüstbau-Dienstleistungen. Jetzt unverbindliche Angebote anfordern & Bewertungen lesen auf Gerüstbauer24!`,
      type: "website",
      locale: "de_DE",
      siteName: "Gerüstbauer24",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/geruestbau/${stadt}/${firmaSlug}`,
    },
  }
}

export default function FirmaDetailPage() {
  return <FirmaDetailClient />
}
