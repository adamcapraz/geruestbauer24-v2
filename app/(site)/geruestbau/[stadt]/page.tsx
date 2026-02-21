"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import { useParams } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MapPin, 
  Star, 
  CheckCircle, 
  ArrowLeft, 
  Building2, 
  Shield, 
  Clock, 
  Euro,
  Phone,
  HelpCircle,
  ChevronDown
} from "lucide-react"
import { denormalizeSlug } from "@/lib/utils/slug"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type Firma = {
  id: string
  name: string
  slug: string
  stadt: string
  stadt_slug: string
  bundesland: string
  bewertung: number
  anzahlBewertungen: number
  geprueft: boolean
  leistungen: string[]
  google_bewertung?: number
  google_anzahl_bewertungen?: number
}

const leistungenListe = [
  {
    title: "Fassadengerüst",
    description: "Professionelle Fassadengerüste für Renovierungen, Malerarbeiten und Wärmedämmung an Gebäudefassaden."
  },
  {
    title: "Baugerüst",
    description: "Stabile Baugerüste für Neubau- und Sanierungsprojekte aller Größenordnungen."
  },
  {
    title: "Industriegerüst",
    description: "Spezialgerüste für Industrieanlagen, Produktionshallen und technische Einrichtungen."
  },
  {
    title: "Hängegerüst",
    description: "Hängende Gerüstsysteme für Brücken, Überhänge und schwer zugängliche Bereiche."
  },
  {
    title: "Schutzgerüst",
    description: "Schutz- und Fanggerüste zur Absicherung von Baustellen und Passanten."
  },
  {
    title: "Treppentürme",
    description: "Sichere Treppentürme und Zugänge für mehrstöckige Gerüstkonstruktionen."
  }
]

export default function StadtPage() {
  const params = useParams()
  const stadtSlug = params.stadt as string
  const [firmen, setFirmen] = useState<Firma[]>([])
  const [loading, setLoading] = useState(true)
  const [stadtName, setStadtName] = useState("")

  useEffect(() => {
    if (stadtSlug) {
      loadFirmen()
    }
  }, [stadtSlug])

  const loadFirmen = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/firmen?stadt_slug=${stadtSlug}`)
      if (response.ok) {
        const data = await response.json()
        setFirmen(data.firmen || [])
        if (data.firmen?.length > 0) {
          setStadtName(data.firmen[0].stadt)
        } else {
          setStadtName(denormalizeSlug(stadtSlug))
        }
      }
    } catch (error) {
      console.error("Error loading firmen:", error)
    } finally {
      setLoading(false)
    }
  }

  const faqItems = [
    {
      question: `Was kostet ein Gerüstbauer in ${stadtName || "der Stadt"}?`,
      answer: `Die Kosten für Gerüstbau in ${stadtName || "der Stadt"} variieren je nach Projektgröße, Gerüstart und Mietdauer. Für ein Einfamilienhaus liegen die Kosten typischerweise zwischen 6-12 Euro pro Quadratmeter Gerüstfläche. Fordern Sie kostenlose Angebote von unseren geprüften Gerüstbauern an.`
    },
    {
      question: `Wie lange dauert der Gerüstaufbau in ${stadtName || "der Stadt"}?`,
      answer: `Der Aufbau eines Standard-Fassadengerüsts dauert in der Regel 1-2 Tage. Bei größeren Projekten oder Spezialgerüsten kann die Montage entsprechend länger dauern. Unsere Gerüstbauer in ${stadtName || "der Stadt"} planen die Aufbauzeit individuell nach Ihren Anforderungen.`
    },
    {
      question: `Brauche ich eine Genehmigung für ein Gerüst in ${stadtName || "der Stadt"}?`,
      answer: `Für Gerüste auf öffentlichen Gehwegen oder Straßen in ${stadtName || "der Stadt"} ist eine Sondernutzungsgenehmigung erforderlich. Auf privatem Grund ist in der Regel keine Genehmigung nötig. Unsere Gerüstbauer kümmern sich bei Bedarf um alle erforderlichen Genehmigungen.`
    },
    {
      question: `Sind die Gerüstbauer in ${stadtName || "der Stadt"} versichert?`,
      answer: `Alle bei uns gelisteten Gerüstbauer in ${stadtName || "der Stadt"} verfügen über eine Betriebshaftpflichtversicherung. Diese deckt eventuelle Schäden während der Gerüstarbeiten ab. Fragen Sie bei der Anfrage nach den Versicherungsnachweisen.`
    }
  ]

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="bg-slate-900 py-12 px-4">
          <div className="container mx-auto">
            <Skeleton className="h-10 w-64 bg-slate-700" />
            <Skeleton className="h-6 w-96 mt-4 bg-slate-700" />
          </div>
        </section>
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  // Generate JSON-LD structured data
  const itemListSchema = firmen.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Gerüstbauer in ${stadtName}`,
    "description": `Liste der geprüften Gerüstbaufirmen in ${stadtName}`,
    "numberOfItems": firmen.length,
    "itemListElement": firmen.map((f, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": f.name,
        "url": `https://geruestbauer24.eu/geruestbau/${f.stadt_slug}/${f.slug}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": f.stadt,
          "addressRegion": f.bundesland,
          "addressCountry": "DE"
        },
        ...((f.google_bewertung || f.bewertung) > 0 ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": (f.google_bewertung || f.bewertung)?.toFixed(1),
            "reviewCount": f.google_anzahl_bewertungen || f.anzahlBewertungen || 0,
            "bestRating": "5",
            "worstRating": "1"
          }
        } : {})
      }
    }))
  } : null

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://geruestbauer24.eu" },
      { "@type": "ListItem", "position": 2, "name": "Gerüstbau", "item": "https://geruestbauer24.eu/geruestbau" },
      { "@type": "ListItem", "position": 3, "name": `Gerüstbauer in ${stadtName}`, "item": `https://geruestbauer24.eu/geruestbau/${stadtSlug}` }
    ]
  }

  return (
    <main className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero Section */}
      <section className="bg-slate-900 py-12 px-4">
        <div className="container mx-auto">
          <Link 
            href="/geruestbau" 
            className="inline-flex items-center text-slate-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Alle Städte
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">
            Gerüstbauer in {stadtName} - Geprüfte Fachbetriebe
          </h1>
          <p className="text-slate-300 mt-3 text-lg max-w-3xl">
            Finden Sie zuverlässige Gerüstbauer in {stadtName} und Umgebung. 
            {firmen.length} geprüfte Gerüstbaufirmen mit echten Kundenbewertungen.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-10 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-4xl">
            <p className="text-foreground leading-relaxed">
              Sie suchen einen erfahrenen <strong>Gerüstbauer in {stadtName}</strong>? Auf Gerüstbauer24 finden Sie 
              qualifizierte Gerüstbaufirmen aus {stadtName} und Umgebung. Unsere gelisteten Unternehmen bieten 
              professionelle Gerüstbau-Dienstleistungen für private und gewerbliche Bauprojekte. Ob Fassadengerüst 
              für die Hauserneuerung, Industriegerüst für Ihr Unternehmen oder Spezialgerüste für besondere 
              Anforderungen – bei uns finden Sie den passenden <strong>Gerüstbauer in {stadtName}</strong> für 
              Ihr Projekt. Vergleichen Sie Bewertungen, fordern Sie unverbindliche Angebote an und profitieren 
              Sie von der Expertise regionaler Fachbetriebe.
            </p>
          </div>
        </div>
      </section>

      {/* Firmen List */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            {firmen.length} Gerüstbaufirmen in {stadtName}
          </h2>
          
          {firmen.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Firmen gefunden</h3>
                <p className="text-muted-foreground mb-4">
                  In {stadtName} sind derzeit keine Gerüstbaufirmen registriert.
                </p>
                <Link href="/geruestbau">
                  <Button>Alle Firmen anzeigen</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {firmen.map((firma) => {
                const bewertung = firma.google_bewertung || firma.bewertung
                const anzahlBewertungen = firma.google_anzahl_bewertungen || firma.anzahlBewertungen
                
                return (
                  <Link 
                    key={firma.id} 
                    href={`/geruestbau/${firma.stadt_slug}/${firma.slug}`}
                    className="block"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg line-clamp-2">{firma.name}</h3>
                          {firma.geprueft && (
                            <Badge variant="secondary" className="ml-2 shrink-0 bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Geprüft
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{firma.stadt}, {firma.bundesland}</span>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                          <span className="font-semibold">{bewertung?.toFixed(1) || "–"}</span>
                          <span className="text-muted-foreground text-sm ml-1">
                            ({anzahlBewertungen || 0} Bewertungen)
                          </span>
                        </div>
                        
                        {firma.leistungen && firma.leistungen.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {firma.leistungen.slice(0, 3).map((leistung) => (
                              <Badge key={leistung} variant="outline" className="text-xs">
                                {leistung}
                              </Badge>
                            ))}
                            {firma.leistungen.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{firma.leistungen.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="px-6 pb-6 pt-0">
                        <Button variant="outline" className="w-full bg-transparent">
                          Details ansehen
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Warum Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            Warum einen Gerüstbauer in {stadtName} beauftragen?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Regionale Expertise</h3>
                <p className="text-muted-foreground text-sm">
                  Lokale Gerüstbauer kennen die Bauvorschriften in {stadtName} und wissen, 
                  welche Genehmigungen für Ihr Projekt erforderlich sind.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Schnelle Verfügbarkeit</h3>
                <p className="text-muted-foreground text-sm">
                  Kurze Anfahrtswege bedeuten schnellere Reaktionszeiten und flexiblere 
                  Terminplanung für Ihr Bauprojekt in {stadtName}.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Euro className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Faire Preise</h3>
                <p className="text-muted-foreground text-sm">
                  Vergleichen Sie mehrere Angebote von Gerüstbauern in {stadtName} und 
                  finden Sie das beste Preis-Leistungs-Verhältnis.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-foreground leading-relaxed max-w-4xl">
            Ein professioneller Gerüstbauer in {stadtName} ist für die Sicherheit auf Ihrer Baustelle 
            unerlässlich. Die Fachbetriebe sorgen nicht nur für standsichere Gerüstkonstruktionen, 
            sondern berücksichtigen auch Aspekte wie Verkehrssicherung, Witterungsschutz und 
            Zugänglichkeit. Durch die lokale Präsenz können bei Bedarf schnelle Anpassungen 
            vorgenommen werden.
          </p>
        </div>
      </section>

      {/* Leistungen Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            Leistungen unserer Gerüstbauer in {stadtName}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leistungenListe.map((leistung, index) => (
              <Card key={index}>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">{leistung.title}</h3>
                  <p className="text-muted-foreground text-sm">{leistung.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kosten Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            Kosten für Gerüstbau in {stadtName}
          </h2>
          <div className="max-w-4xl">
            <p className="text-foreground leading-relaxed mb-6">
              Die Kosten für Gerüstbau in {stadtName} hängen von verschiedenen Faktoren ab. 
              Hier finden Sie eine Übersicht der typischen Preisbereiche:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Fassadengerüst (Miete)</h3>
                  <p className="text-2xl font-bold text-primary">6 - 12 €/m²</p>
                  <p className="text-sm text-muted-foreground mt-1">pro Monat Standzeit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Auf- und Abbau</h3>
                  <p className="text-2xl font-bold text-primary">4 - 8 €/m²</p>
                  <p className="text-sm text-muted-foreground mt-1">einmalige Kosten</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              <strong>Einflussfaktoren:</strong> Gerüsthöhe, Zugänglichkeit des Gebäudes, Gerüstart, 
              benötigte Zusatzausstattung (Treppen, Planen, Netze), Mietdauer und regionale Preisunterschiede. 
              Fordern Sie für genaue Preise unverbindliche Angebote von Gerüstbauern in {stadtName} an.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            Häufig gestellte Fragen zu Gerüstbau in {stadtName}
          </h2>
          <div className="max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary-foreground">
            Jetzt Gerüstbauer in {stadtName} finden
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Vergleichen Sie kostenlos Angebote von geprüften Gerüstbaufirmen in {stadtName}. 
            Unverbindlich, schnell und zuverlässig.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kontakt">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Phone className="h-4 w-4 mr-2" />
                Anfrage stellen
              </Button>
            </Link>
            {firmen.length > 0 && (
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Firmen vergleichen
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
