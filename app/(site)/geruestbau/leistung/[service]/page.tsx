import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { BASE_URL, createSeoMetadata } from "@/lib/seo"

const services = {
  fassadengeruest: {
    label: "Fassadengerüst",
    description:
      "Fassadengerüst für Sanierung, Anstrich oder Dämmung? Finden Sie geprüfte Gerüstbauer in Ihrer Region und vergleichen Sie kostenlos Angebote.",
    intro:
      "Ein Fassadengerüst bietet einen sicheren Zugang für Arbeiten an Außenwänden, bei Sanierungen, Anstrichen und Dämmungen. Vergleichen Sie regionale Gerüstbaubetriebe nach Bewertungen, Leistungen und Kontaktdaten.",
    aliases: ["fassadengeruest"],
  },
  industriegeruest: {
    label: "Industriegerüst",
    description:
      "Industriegerüst für Anlagen, Hallen oder Wartungsarbeiten? Finden Sie geprüfte Gerüstbauer in Ihrer Region und vergleichen Sie kostenlos Angebote.",
    intro:
      "Industriegerüste ermöglichen sichere Wartungs-, Montage- und Instandhaltungsarbeiten an Anlagen und Gebäuden. Finden Sie Gerüstbaubetriebe mit passenden Leistungen und fragen Sie unverbindlich Angebote an.",
    aliases: ["industriegeruest"],
  },
  eventgeruest: {
    label: "Eventgerüst",
    description:
      "Eventgerüst für Bühne, Veranstaltung oder temporäre Konstruktion? Finden Sie Gerüstbauer in Ihrer Region und vergleichen Sie kostenlos Angebote.",
    intro:
      "Eventgerüste kommen bei Bühnen, Veranstaltungen und temporären Konstruktionen zum Einsatz. Vergleichen Sie Anbieter in Ihrer Nähe und nehmen Sie direkt Kontakt zu passenden Gerüstbaubetrieben auf.",
    aliases: ["eventgeruest"],
  },
  treppenturm: {
    label: "Treppentürme",
    description:
      "Treppentürme für Baustellen, Veranstaltungen oder temporäre Zugänge? Finden Sie Gerüstbauer in Ihrer Region und vergleichen Sie kostenlos Angebote.",
    intro:
      "Treppentürme schaffen sichere, temporäre Zugänge auf Baustellen und bei Veranstaltungen. Entdecken Sie regionale Anbieter und vergleichen Sie ihre Leistungen und Kontaktdaten.",
    aliases: ["treppenturm", "treppentuerme"],
  },
  haengegeruest: {
    label: "Hängegerüst",
    description:
      "Hängegerüst für Fassaden, Brücken oder schwer erreichbare Bereiche? Finden Sie geprüfte Gerüstbauer in Ihrer Region und vergleichen Sie Angebote.",
    intro:
      "Hängegerüste sind eine Lösung für Arbeiten an Fassaden, Brücken und schwer erreichbaren Bereichen. Finden Sie passende Gerüstbaubetriebe und fragen Sie unverbindlich Angebote an.",
    aliases: ["haengegeruest"],
  },
  schutzgeruest: {
    label: "Schutzgerüst",
    description:
      "Schutzgerüst für Bauarbeiten, Dacharbeiten oder Fassadensanierung? Finden Sie Gerüstbauer in Ihrer Region und vergleichen Sie kostenlos Angebote.",
    intro:
      "Schutzgerüste sichern Arbeitsbereiche und schützen vor herabfallenden Gegenständen oder Witterung. Vergleichen Sie regionale Anbieter für Ihr Bau- oder Sanierungsprojekt.",
    aliases: ["schutzgeruest"],
  },
} as const

type ServiceSlug = keyof typeof services
type Company = {
  id: string
  name: string
  slug: string
  stadt: string
  stadt_slug: string
  bundesland: string | null
  adresse: string | null
  bewertung: number | null
  anzahl_bewertungen: number | null
  google_bewertung: number | null
  google_anzahl_bewertungen: number | null
  leistungen: string[] | null
}

type PageProps = { params: Promise<{ service: string }> }

function normalizeService(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
}

async function getCompaniesForService(service: (typeof services)[ServiceSlug]) {
  const supabase = await createClient()
  const batchSize = 1000
  const companies: Company[] = []

  for (let offset = 0; ; offset += batchSize) {
    const { data, error } = await supabase
      .from("firmen")
      .select("id, name, slug, stadt, stadt_slug, bundesland, adresse, bewertung, anzahl_bewertungen, google_bewertung, google_anzahl_bewertungen, leistungen")
      .eq("aktiv", true)
      .order("id")
      .range(offset, offset + batchSize - 1)

    if (error) throw error

    const batch = (data ?? []) as Company[]
    companies.push(
      ...batch.filter((company) =>
        (company.leistungen ?? []).some((leistung) =>
          service.aliases.some((alias) => normalizeService(leistung).includes(alias)),
        ),
      ),
    )

    if (batch.length < batchSize) break
  }

  return companies
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: serviceSlug } = await params
  const service = services[serviceSlug as ServiceSlug]
  if (!service) return createSeoMetadata({ title: "Leistung nicht gefunden", description: "Diese Gerüstbau-Leistung wurde nicht gefunden.", canonicalPath: "/geruestbau" })

  return createSeoMetadata({
    title: `${service.label}: Anbieter in Ihrer Nähe vergleichen`,
    description: service.description,
    canonicalPath: `/geruestbau/leistung/${serviceSlug}`,
  })
}

export default async function ServicePage({ params }: PageProps) {
  const { service: serviceSlug } = await params
  const service = services[serviceSlug as ServiceSlug]
  if (!service) notFound()

  const companies = await getCompaniesForService(service)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-slate-900 px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl">
          <p className="mb-2 text-sm font-medium text-slate-300">Gerüstbau nach Leistung</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{service.label} in Ihrer Nähe</h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">{service.intro}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          {companies.length} {companies.length === 1 ? "Anbieter" : "Anbieter"} für {service.label}
        </h2>
        {companies.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {companies.slice(0, 20).map((company) => {
              const rating = company.google_bewertung ?? company.bewertung
              const reviewCount = company.google_anzahl_bewertungen ?? company.anzahl_bewertungen ?? 0
              return (
                <li key={company.id}>
                  <Link href={`/geruestbau/${company.stadt_slug}/${company.slug}`} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Card className="h-full transition-colors hover:border-primary/50">
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-foreground">{company.name}</h3>
                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin aria-hidden="true" className="size-4" />
                          {[company.adresse, company.stadt, company.bundesland].filter(Boolean).join(", ")}
                        </p>
                        {rating !== null && rating !== undefined && reviewCount > 0 ? (
                          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <Star aria-hidden="true" className="size-4 text-amber-500" />
                            {Number(rating).toFixed(1)} von 5 ({reviewCount} Bewertungen)
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-lg border border-border bg-muted p-6 text-muted-foreground">
            Aktuell sind keine passenden Einträge verfügbar. Sehen Sie sich alle Gerüstbaubetriebe an oder kontaktieren Sie uns.
          </p>
        )}
        <p className="mt-8 text-sm text-muted-foreground">
          <Link className="underline underline-offset-4" href="/geruestbau">Alle Gerüstbaufirmen ansehen</Link>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.label,
            description: service.description,
            url: `${BASE_URL}/geruestbau/leistung/${serviceSlug}`,
            areaServed: { "@type": "Country", name: "Germany" },
            provider: { "@type": "Organization", name: "Gerüstbauer24", url: BASE_URL },
          }),
        }}
      />
    </div>
  )
}
