import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Building2, MessageSquareText, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSeoMetadata } from "@/lib/seo"

export const metadata: Metadata = createSeoMetadata({
  title: "Gerüstbaufirma kostenlos eintragen | Gerüstbauer24",
  description:
    "Mehr Aufträge für Ihren Gerüstbau: Firma kostenlos eintragen, Bewertungen sammeln und Anfragen von Kunden aus Ihrer Region erhalten.",
  canonicalPath: "/fuer-firmen",
})

const benefits = [
  {
    title: "Kostenlos sichtbar werden",
    description: "Erstellen Sie einen Firmeneintrag und präsentieren Sie Ihr Unternehmen Kunden in Ihrer Region.",
    icon: Building2,
  },
  {
    title: "Bewertungen zeigen",
    description: "Machen Sie Ihre Erfahrungen und Leistungen für Interessenten transparent.",
    icon: Star,
  },
  {
    title: "Regionale Anfragen erhalten",
    description: "Erreichen Sie Bauherren, die nach Gerüstbau-Leistungen in Ihrer Nähe suchen.",
    icon: MessageSquareText,
  },
]

export default function FuerFirmenPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-slate-900 px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground/75">
            Für Gerüstbaubetriebe
          </p>
          <h1 className="text-balance text-3xl font-bold text-white md:text-5xl">
            Mehr regionale Sichtbarkeit für Ihren Gerüstbaubetrieb
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Tragen Sie Ihre Firma kostenlos ein, präsentieren Sie Ihre Leistungen und erhalten Sie Anfragen von Kunden aus Ihrer Region.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/registrieren">
                Firma kostenlos eintragen
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/kontakt">Fragen? Kontakt aufnehmen</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {benefits.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="h-full">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon aria-hidden="true" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted px-4 py-14">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground">So starten Sie mit Ihrem Firmeneintrag</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Registrieren Sie Ihr Firmenkonto und ergänzen Sie Ihre Unternehmensdaten und Leistungen. Nach dem Eintragen können Interessenten Ihr Profil finden und unverbindliche Anfragen senden.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/auth/registrieren">Jetzt registrieren</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
