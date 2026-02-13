import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, Building2, HelpCircle } from "lucide-react"
import { getSettingsByKeys } from "@/lib/settings"
import { KontaktForm } from "@/components/kontakt-form"

export const metadata = {
  title: "Kontakt - Gerüstbauer24",
  description: "Nehmen Sie Kontakt mit uns auf. Wir helfen Ihnen gerne weiter.",
}

export default async function KontaktPage() {
  const s = await getSettingsByKeys([
    "contact_email",
    "contact_phone",
    "contact_address",
    "impressum_firmenname",
  ])

  const phone = s.contact_phone || "+49 1639540595"
  const email = s.contact_email || "info@geruestbauer24.eu"
  const address = s.contact_address || "Musterstraße 123, 10115 Berlin"
  const firmenname = s.impressum_firmenname || "Gerüstbauer24 GmbH"

  const addressLines = address.split(",").map((line: string) => line.trim())

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Kontakt
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {"Haben Sie Fragen? Wir sind für Sie da!"}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <KontaktForm />

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Kontaktinformationen</CardTitle>
                <CardDescription>
                  {"Sie erreichen uns über folgende Wege"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Telefon</h3>
                    <p className="text-muted-foreground">{phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">E-Mail</h3>
                    <p className="text-muted-foreground">{email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Adresse</h3>
                    <p className="text-muted-foreground">
                      {firmenname}<br />
                      {addressLines.map((line: string, i: number) => (
                        <span key={i}>{line}<br /></span>
                      ))}
                      Deutschland
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Erreichbarkeit</h3>
                    <p className="text-muted-foreground">Mo - Fr: 8:00 - 18:00 Uhr</p>
                    <p className="text-muted-foreground">Sa - So: Geschlossen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {"Häufige Fragen"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Wie kann ich meine Firma eintragen?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {"Registrieren Sie sich kostenlos und folgen Sie den Anweisungen zur Firmeneintragung."}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    {"Ist die Nutzung für Kunden kostenlos?"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {"Ja, die Suche nach Gerüstbauern und das Senden von Anfragen ist für Kunden völlig kostenlos."}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    {"Wie werden die Firmen geprüft?"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {"Wir überprüfen Gewerbeanmeldung, Zertifizierungen und Qualifikationen vor der Freischaltung."}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="/faq">Alle FAQs ansehen</a>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{"Sie sind Gerüstbauer?"}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {"Tragen Sie Ihr Unternehmen kostenlos ein und erreichen Sie neue Kunden."}
                    </p>
                    <Button asChild>
                      <a href="/auth/registrieren">Firma eintragen</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
