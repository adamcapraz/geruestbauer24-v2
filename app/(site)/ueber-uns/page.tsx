import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Star, Zap, Users, Target, Heart } from "lucide-react"

export const metadata = {
  title: "Über uns - Gerüstbauer24",
  description: "Erfahren Sie mehr über Gerüstbauer24 - Ihre Plattform für Gerüstbaufirmen in Deutschland.",
}

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Über Gerüstbauer24
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Wir verbinden Kunden mit den besten Gerüstbaufirmen in Deutschland
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Unsere Mission</h2>
            <p className="text-muted-foreground mb-4">
              Gerüstbauer24 wurde mit dem Ziel gegründet, die Suche nach qualifizierten Gerüstbaufirmen 
              in Deutschland zu vereinfachen. Wir wissen, wie schwierig es sein kann, einen zuverlässigen 
              und kompetenten Gerüstbauer zu finden.
            </p>
            <p className="text-muted-foreground mb-4">
              Unsere Plattform bietet eine umfassende Übersicht über geprüfte Gerüstbauunternehmen in 
              allen 16 Bundesländern. Mit echten Kundenbewertungen und detaillierten Firmenprofilen 
              helfen wir Ihnen, die richtige Entscheidung zu treffen.
            </p>
            <p className="text-muted-foreground">
              Ob für private Bauvorhaben, gewerbliche Projekte oder Industrieanlagen - bei uns 
              finden Sie den passenden Partner für Ihr Gerüstbauprojekt.
            </p>
          </div>
          <div className="bg-muted p-8 rounded-lg">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">500+</p>
                <p className="text-muted-foreground">Geprüfte Firmen</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">10.000+</p>
                <p className="text-muted-foreground">Vermittelte Anfragen</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">16</p>
                <p className="text-muted-foreground">Bundesländer</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">4.7</p>
                <p className="text-muted-foreground">Durchschnittsbewertung</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-foreground">Unsere Werte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardContent className="pt-8 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Qualität</h3>
                <p className="text-muted-foreground">
                  Wir listen nur geprüfte und qualifizierte Unternehmen, die höchste Standards erfüllen.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-8 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Transparenz</h3>
                <p className="text-muted-foreground">
                  Echte Kundenbewertungen und vollständige Unternehmensprofile für fundierte Entscheidungen.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-8 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Effizienz</h3>
                <p className="text-muted-foreground">
                  Schnelle und unkomplizierte Anfragen an mehrere Firmen gleichzeitig.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-foreground">Ihre Vorteile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">Für Kunden</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Kostenlose und unverbindliche Anfragen</li>
                      <li>Vergleich mehrerer Anbieter auf einen Blick</li>
                      <li>Echte Bewertungen von anderen Kunden</li>
                      <li>Regionale Suche in ganz Deutschland</li>
                      <li>Direkter Kontakt zu den Firmen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">Für Unternehmen</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Kostenloser Firmeneintrag</li>
                      <li>Erhöhte Sichtbarkeit bei potenziellen Kunden</li>
                      <li>Direkte Anfragen von interessierten Kunden</li>
                      <li>Präsentation Ihrer Leistungen und Referenzen</li>
                      <li>Aufbau einer positiven Online-Reputation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Unser Engagement</h2>
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Heart className="h-10 w-10 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Wir setzen uns täglich dafür ein, die beste Plattform für die Vermittlung von 
            Gerüstbaudienstleistungen in Deutschland zu sein. Unser Team arbeitet kontinuierlich 
            an der Verbesserung unserer Services und der Qualitätssicherung unserer gelisteten Unternehmen.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-primary rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary-foreground">
            Bereit loszulegen?
          </h2>
          <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
            Finden Sie jetzt den passenden Gerüstbauer für Ihr Projekt oder tragen Sie Ihre Firma kostenlos ein.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/geruestbau">
              <Button size="lg" variant="secondary">
                Gerüstbauer finden
              </Button>
            </Link>
            <Link href="/geruestbau/eintragen">
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Firma eintragen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
