import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MessageCircle, Search, Building2, ArrowRight } from "lucide-react"

export const metadata = {
  title: "FAQ - Gerüstbauer24 | Häufig gestellte Fragen zum Gerüstbau",
  description: "Antworten auf häufig gestellte Fragen rund um Gerüstbau, Kosten, Genehmigungen und unsere Plattform. Finden Sie geprüfte Gerüstbauer in Ihrer Nähe.",
  keywords: "Gerüstbau FAQ, Gerüst Kosten, Gerüstbauer finden, Gerüst mieten, Fassadengerüst",
}

const faqCategories = [
  {
    id: "allgemein",
    title: "Allgemeine Fragen",
    questions: [
      {
        question: "Was ist Gerüstbauer24?",
        answer: "Gerüstbauer24 ist Deutschlands führende Plattform zur Vermittlung von Gerüstbaudienstleistungen. Wir verbinden Kunden mit geprüften Gerüstbaufirmen in allen 16 Bundesländern und helfen dabei, den passenden Partner für jedes Bauprojekt zu finden."
      },
      {
        question: "Ist die Nutzung von Gerüstbauer24 kostenlos?",
        answer: "Ja, die Nutzung unserer Plattform ist für Kunden vollständig kostenlos. Sie können beliebig viele Anfragen an Gerüstbaufirmen stellen, ohne dass Gebühren anfallen. Auch für Unternehmen ist der Basiseintrag kostenlos."
      },
      {
        question: "Wie werden die Firmen auf Gerüstbauer24 geprüft?",
        answer: "Alle gelisteten Unternehmen durchlaufen einen Qualitätsprüfungsprozess. Wir überprüfen Gewerbeanmeldung, Versicherungsschutz, Referenzen und Qualifikationen. Zusätzlich fließen Kundenbewertungen in unser Qualitätsrating ein."
      },
      {
        question: "In welchen Regionen ist Gerüstbauer24 verfügbar?",
        answer: "Gerüstbauer24 ist deutschlandweit aktiv. Wir haben geprüfte Partnerunternehmen in allen 16 Bundesländern - von Bayern bis Schleswig-Holstein, von Nordrhein-Westfalen bis Sachsen."
      }
    ]
  },
  {
    id: "kunden",
    title: "Für Kunden",
    questions: [
      {
        question: "Wie finde ich einen Gerüstbauer in meiner Nähe?",
        answer: "Nutzen Sie einfach unsere Suchfunktion auf der Startseite. Geben Sie Ihre Stadt, Postleitzahl oder Ihr Bundesland ein, und wir zeigen Ihnen alle verfügbaren Gerüstbaufirmen in Ihrer Region mit Bewertungen und Kontaktdaten.",
        link: { href: "/geruestbau", text: "Jetzt Gerüstbauer suchen" }
      },
      {
        question: "Wie stelle ich eine Anfrage an eine Firma?",
        answer: "Wählen Sie eine Firma aus unserer Liste und klicken Sie auf 'Anfrage senden'. Füllen Sie das Formular mit Ihren Projektdetails aus - Art des Gerüsts, Standort, gewünschter Zeitraum. Die Firma erhält Ihre Anfrage und meldet sich direkt bei Ihnen."
      },
      {
        question: "Kann ich mehrere Angebote gleichzeitig einholen?",
        answer: "Ja, wir empfehlen sogar, Anfragen an mehrere Firmen zu senden, um Angebote vergleichen zu können. Sie können bis zu 5 Firmen gleichzeitig kontaktieren und erhalten so einen guten Überblick über Preise und Leistungen."
      },
      {
        question: "Wie vergleiche ich Angebote richtig?",
        answer: "Achten Sie beim Vergleich auf: 1) Gesamtpreis inkl. Auf- und Abbau, 2) Mietdauer und Verlängerungskosten, 3) Versicherungsschutz, 4) Zusatzleistungen wie Genehmigungseinholung, 5) Kundenbewertungen und Referenzen. Der günstigste Preis ist nicht immer die beste Wahl."
      },
      {
        question: "Sind die Kundenbewertungen echt?",
        answer: "Ja, alle Bewertungen stammen von verifizierten Kunden, die tatsächlich eine Dienstleistung der jeweiligen Firma in Anspruch genommen haben. Wir prüfen jede Bewertung auf Echtheit und entfernen gefälschte oder missbräuchliche Einträge."
      },
      {
        question: "Wie lange vorher sollte ich ein Gerüst bestellen?",
        answer: "Wir empfehlen eine Vorlaufzeit von mindestens 2-4 Wochen. In der Hochsaison (Frühjahr bis Herbst) kann es zu Engpässen kommen, daher ist eine frühzeitige Planung ratsam. Bei dringenden Projekten fragen Sie direkt bei den Firmen nach kurzfristiger Verfügbarkeit."
      }
    ]
  },
  {
    id: "unternehmen",
    title: "Für Unternehmen",
    questions: [
      {
        question: "Wie kann ich meine Firma bei Gerüstbauer24 eintragen?",
        answer: "Klicken Sie auf 'Firma eintragen' und füllen Sie das Registrierungsformular aus. Sie benötigen grundlegende Firmendaten, Leistungsbeschreibungen und optional Referenzfotos. Nach der Prüfung wird Ihr Profil freigeschaltet.",
        link: { href: "/geruestbau/eintragen", text: "Jetzt Firma eintragen" }
      },
      {
        question: "Was kostet der Firmeneintrag?",
        answer: "Der Basiseintrag mit allen wichtigen Funktionen ist dauerhaft kostenlos. Für erweiterte Funktionen wie Premium-Platzierung, erweiterte Statistiken oder zusätzliche Fotos bieten wir optionale Premium-Pakete an."
      },
      {
        question: "Wie erhalte ich Kundenanfragen?",
        answer: "Sobald Ihr Profil aktiv ist, können Kunden Sie direkt über unsere Plattform kontaktieren. Sie erhalten Anfragen per E-Mail und können diese im Dashboard verwalten. Je vollständiger Ihr Profil, desto mehr Anfragen erhalten Sie."
      },
      {
        question: "Kann ich meine Firmendaten jederzeit ändern?",
        answer: "Ja, Sie haben jederzeit Zugriff auf Ihr Firmenprofil und können Kontaktdaten, Leistungen, Fotos und alle weiteren Informationen aktualisieren. Änderungen werden nach kurzer Prüfung übernommen."
      }
    ]
  },
  {
    id: "geruestbau",
    title: "Gerüstbau Allgemein",
    questions: [
      {
        question: "Welche Arten von Gerüsten gibt es?",
        answer: "Die häufigsten Gerüstarten sind: Fassadengerüste (für Außenarbeiten an Gebäuden), Raumgerüste (für Innenarbeiten), Fahrgerüste (mobile Gerüste auf Rollen), Hängegerüste (an Fassaden befestigt) und Schutzgerüste (für Sicherheitsmaßnahmen). Die Wahl hängt vom jeweiligen Projekt ab."
      },
      {
        question: "Was kostet ein Gerüst pro Quadratmeter?",
        answer: "Die Kosten variieren je nach Gerüstart und Region: Fassadengerüst: 6-12€/m² pro Monat, Raumgerüst: 8-15€/m² pro Monat, Fahrgerüst (Kauf): ab 200€, Fahrgerüst (Miete): 15-30€/Tag. Hinzu kommen Auf- und Abbaukosten von ca. 5-10€/m². Für ein Einfamilienhaus (ca. 150m²) rechnen Sie mit 1.500-3.000€ Gesamtkosten für 4 Wochen."
      },
      {
        question: "Gerüst mieten oder kaufen - was lohnt sich?",
        answer: "Für einmalige Projekte lohnt sich die Miete fast immer. Der Kauf rechnet sich erst bei regelmäßiger Nutzung (mehr als 4-6 Mal pro Jahr) oder für Handwerksbetriebe. Beachten Sie auch Lagerung, Wartung und TÜV-Prüfungen bei Eigengerüsten."
      },
      {
        question: "Wie lange dauert der Auf- und Abbau eines Gerüsts?",
        answer: "Der Aufbau eines Standard-Fassadengerüsts für ein Einfamilienhaus dauert in der Regel 4-8 Stunden. Größere oder komplexere Gerüste können mehrere Tage in Anspruch nehmen. Der Abbau geht meist schneller als der Aufbau."
      },
      {
        question: "Brauche ich eine Genehmigung für ein Gerüst?",
        answer: "Wenn das Gerüst auf öffentlichem Grund steht (z.B. Gehweg), benötigen Sie eine Sondernutzungsgenehmigung der Gemeinde. Die Kosten liegen bei 50-200€. Auf Privatgrund ist in der Regel keine Genehmigung erforderlich. Die Gerüstbaufirma kann Sie hierzu beraten und die Genehmigung oft auch für Sie beantragen."
      },
      {
        question: "Wie sicher sind moderne Gerüste?",
        answer: "Professionell aufgebaute Gerüste nach DIN EN 12811 sind sehr sicher. Sie verfügen über Geländer (min. 1m Höhe), Bordbrett (15cm), Zwischenholm und rutschfeste Beläge. Die Statik wird berechnet und regelmäßig geprüft. Wichtig ist, dass nur qualifizierte Fachkräfte das Gerüst aufbauen."
      },
      {
        question: "Was passiert bei schlechtem Wetter?",
        answer: "Moderne Gerüste sind wetterfest und können bei normalem Regen, Wind und leichtem Schnee stehen bleiben. Bei Sturm (ab Windstärke 8) oder starkem Schneefall sollten Arbeiten eingestellt werden. Das Gerüst selbst muss dann zusätzlich gesichert werden. Die Mietzeit verlängert sich bei witterungsbedingten Ausfällen meist kostenfrei."
      },
      {
        question: "Gerüst für Dacharbeiten - was beachten?",
        answer: "Für Dacharbeiten benötigen Sie ein Dachfanggerüst mit spezieller Absturzsicherung. Zusätzlich sind Schutznetze und ggf. ein Schutzdach erforderlich. Die Kosten liegen etwa 20-30% höher als bei Standard-Fassadengerüsten. Informieren Sie die Gerüstfirma unbedingt über geplante Dacharbeiten."
      },
      {
        question: "Wann ist die beste Zeit für Gerüstbau?",
        answer: "Die Hauptsaison ist von März bis Oktober mit besten Wetterbedingungen. In dieser Zeit sind Gerüstbauer oft ausgebucht - früh planen! Im Winter (November-Februar) gibt es oft kürzere Wartezeiten und manchmal Rabatte, aber Witterungsrisiken. Ideal: Frühjahr oder Spätsommer buchen."
      }
    ]
  }
]

// Generate FAQ Schema for SEO
function generateFAQSchema() {
  const allQuestions = faqCategories.flatMap(category => 
    category.questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  )

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allQuestions
  }
}

export default function FAQPage() {
  const faqSchema = generateFAQSchema()

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Häufig gestellte Fragen zum Gerüstbau
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Finden Sie Antworten auf die wichtigsten Fragen rund um Gerüstbau, Kosten, Genehmigungen und unsere Plattform
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Navigation */}
        <nav className="max-w-3xl mx-auto mb-10">
          <h2 className="sr-only">Schnellnavigation</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {faqCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category.title}
              </a>
            ))}
          </div>
        </nav>

        {/* FAQ Categories */}
        <div className="max-w-3xl mx-auto space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-border pb-3">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, itemIndex) => (
                  <AccordionItem 
                    key={itemIndex} 
                    value={`${categoryIndex}-${itemIndex}`}
                    className="border-border"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                      <h3 className="font-medium text-base">{item.question}</h3>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      <p>{item.answer}</p>
                      {item.link && (
                        <Link 
                          href={item.link.href} 
                          className="inline-flex items-center gap-1 mt-3 text-primary hover:underline font-medium"
                        >
                          {item.link.text}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Category CTAs */}
              {category.id === "kunden" && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Jetzt Gerüstbauer finden</p>
                      <p className="text-sm text-muted-foreground">Vergleichen Sie kostenlos Angebote aus Ihrer Region</p>
                    </div>
                    <Link href="/geruestbau" className="ml-auto">
                      <Button size="sm">Suchen</Button>
                    </Link>
                  </div>
                </div>
              )}

              {category.id === "unternehmen" && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Kostenlos Firma eintragen</p>
                      <p className="text-sm text-muted-foreground">Erreichen Sie neue Kunden in Ihrer Region</p>
                    </div>
                    <Link href="/auth/registrieren" className="ml-auto">
                      <Button size="sm">Eintragen</Button>
                    </Link>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Popular Cities */}
        <section className="max-w-3xl mx-auto mt-16">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Gerüstbauer in Ihrer Stadt finden
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen"].map((city) => (
              <Link
                key={city}
                href={`/geruestbau/${city.toLowerCase().replace("ü", "ue").replace("ö", "oe")}`}
                className="px-3 py-1.5 bg-muted rounded-md text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Gerüstbauer {city}
              </Link>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-muted rounded-lg p-8 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-foreground">
              Noch Fragen?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Wenn Sie keine passende Antwort gefunden haben, kontaktieren Sie uns gerne direkt. Wir helfen Ihnen weiter!
            </p>
            <Link href="/kontakt">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Kontakt aufnehmen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
