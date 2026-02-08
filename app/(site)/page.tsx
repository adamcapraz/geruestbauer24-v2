import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { FeaturedProperties } from "@/components/featured-properties"
import Link from "next/link"
import { Shield, Star, Zap, Building2, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
            Finden Sie zuverlässige Gerüstbauer in Ihrer Region
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-slate-300">
            Geprüfte Gerüstbaufirmen, echte Bewertungen und unverbindliche Anfragen - alles auf einer Plattform.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Empfohlene Gerüstbaufirmen
              </h2>
              <p className="text-muted-foreground mt-2">
                Top-bewertete Unternehmen in Deutschland
              </p>
            </div>
            <Link href="/geruestbau" className="hidden md:flex items-center text-primary hover:underline">
              Alle Firmen anzeigen
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <FeaturedProperties />
          <div className="mt-8 text-center md:hidden">
            <Link href="/geruestbau">
              <Button variant="outline" className="bg-transparent">
                Alle Firmen anzeigen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-foreground">
            Warum Gerüstbauer24?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Wir verbinden Sie mit den besten Gerüstbaufirmen in Deutschland
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardContent className="pt-8 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Geprüfte Unternehmen</h3>
                <p className="text-muted-foreground">
                  Alle Firmen werden sorgfältig überprüft, bevor sie auf unserer Plattform gelistet werden.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-8 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Echte Bewertungen</h3>
                <p className="text-muted-foreground">
                  Lesen Sie authentische Bewertungen von echten Kunden und treffen Sie fundierte Entscheidungen.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-8 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Schnelle Anfragen</h3>
                <p className="text-muted-foreground">
                  Senden Sie unverbindliche Anfragen an mehrere Firmen gleichzeitig und erhalten Sie schnell Angebote.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <Building2 className="h-16 w-16 mx-auto mb-6 text-primary-foreground" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary-foreground">
            Sie sind Gerüstbauer?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-primary-foreground/90">
            Tragen Sie Ihr Unternehmen kostenlos ein und erreichen Sie neue Kunden in Ihrer Region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/registrieren">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Firma kostenlos eintragen
              </Button>
            </Link>
            <Link href="/ueber-uns">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Mehr erfahren
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">4.627+</p>
              <p className="text-muted-foreground mt-2">Geprüfte Firmen</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">283+</p>
              <p className="text-muted-foreground mt-2">Anfragen vermittelt</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">16</p>
              <p className="text-muted-foreground mt-2">Bundesländer</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">4.7</p>
              <p className="text-muted-foreground mt-2">Durchschnittliche Bewertung</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
