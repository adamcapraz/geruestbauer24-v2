import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MessageCircle } from "lucide-react"

export const metadata = {
  title: "Häufig gestellte Fragen (FAQ) - Gerüstbauer24",
  description: "Antworten auf häufig gestellte Fragen rund um Gerüstbau, unsere Plattform und den Service von Gerüstbauer24.",
}

const faqCategories = [
  {
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
    title: "Für Kunden",
    questions: [
      {
        question: "Wie finde ich einen Gerüstbauer in meiner Nähe?",
        answer: "Nutzen Sie einfach unsere Suchfunktion auf der Startseite. Geben Sie Ihre Stadt, Postleitzahl oder Ihr Bundesland ein, und wir zeigen Ihnen alle verfügbaren Gerüstbaufirmen in Ihrer Region mit Bewertungen und Kontaktdaten."
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
        question: "Sind die Kundenbewertungen echt?",
        answer: "Ja, alle Bewertungen stammen von verifizierten Kunden, die tatsächlich eine Dienstleistung der jeweiligen Firma in Anspruch genommen haben. Wir prüfen jede Bewertung auf Echtheit und entfernen gefälschte oder missbräuchliche Einträge."
      },
      {
        question: "Was kostet ein Gerüst typischerweise?",
        answer: "Die Kosten für ein Gerüst variieren stark je nach Größe, Art und Mietdauer. Als grobe Orientierung: Ein Fassadengerüst für ein Einfamilienhaus kostet etwa 5-15€ pro m² und Monat. Für ein genaues Angebot empfehlen wir, direkt bei den Firmen anzufragen."
      }
    ]
  },
  {
    title: "Für Unternehmen",
    questions: [
      {
        question: "Wie kann ich meine Firma bei Gerüstbauer24 eintragen?",
        answer: "Klicken Sie auf 'Firma eintragen' und füllen Sie das Registrierungsformular aus. Sie benötigen grundlegende Firmendaten, Leistungsbeschreibungen und optional Referenzfotos. Nach der Prüfung wird Ihr Profil freigeschaltet."
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
    title: "Gerüstbau Allgemein",
    questions: [
      {
        question: "Welche Arten von Gerüsten gibt es?",
        answer: "Die häufigsten Gerüstarten sind: Fassadengerüste (für Außenarbeiten an Gebäuden), Raumgerüste (für Innenarbeiten), Fahrgerüste (mobile Gerüste auf Rollen), Hängegerüste (an Fassaden befestigt) und Schutzgerüste (für Sicherheitsmaßnahmen). Die Wahl hängt vom jeweiligen Projekt ab."
      },
      {
        question: "Wie lange dauert der Auf- und Abbau eines Gerüsts?",
        answer: "Der Aufbau eines Standard-Fassadengerüsts für ein Einfamilienhaus dauert in der Regel 4-8 Stunden. Größere oder komplexere Gerüste können mehrere Tage in Anspruch nehmen. Der Abbau geht meist schneller als der Aufbau."
      },
      {
        question: "Brauche ich eine Genehmigung für ein Gerüst?",
        answer: "Wenn das Gerüst auf öffentlichem Grund steht (z.B. Gehweg), benötigen Sie eine Sondernutzungsgenehmigung der Gemeinde. Auf Privatgrund ist in der Regel keine Genehmigung erforderlich. Die Gerüstbaufirma kann Sie hierzu beraten."
      },
      {
        question: "Wie sicher sind moderne Gerüste?",
        answer: "Professionell aufgebaute Gerüste nach DIN-Normen sind sehr sicher. Sie verfügen über Geländer, Bordbrett und rutschfeste Beläge. Die Statik wird berechnet und regelmäßig geprüft. Wichtig ist, dass nur qualifizierte Fachkräfte das Gerüst aufbauen."
      },
      {
        question: "Was muss ich vor der Gerüstaufstellung beachten?",
        answer: "Stellen Sie sicher, dass der Zugang zum Gebäude frei ist, informieren Sie ggf. Nachbarn, klären Sie Parkmöglichkeiten für die Montagefahrzeuge und sichern Sie empfindliche Pflanzen oder Gegenstände in der Nähe. Die Gerüstfirma wird Sie vor Ort beraten."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Häufig gestellte Fragen
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Finden Sie Antworten auf die wichtigsten Fragen rund um Gerüstbau und unsere Plattform
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* FAQ Categories */}
        <div className="max-w-3xl mx-auto space-y-10">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">
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
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

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
