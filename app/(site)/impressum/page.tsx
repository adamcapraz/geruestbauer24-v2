import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Impressum - Gerüstbauer24",
  description: "Impressum und rechtliche Informationen zu Gerüstbauer24",
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-900 py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Impressum
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Angaben gemäß § 5 TMG</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Gerüstbauer24 GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
              </div>
              <div>
                <p><span className="font-medium text-foreground">Handelsregister:</span> HRB 12345 B</p>
                <p><span className="font-medium text-foreground">Registergericht:</span> Amtsgericht Charlottenburg</p>
              </div>
              <div>
                <p><span className="font-medium text-foreground">Umsatzsteuer-ID:</span> DE123456789</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Vertreten durch</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Geschäftsführer: Max Mustermann</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Kontakt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p><span className="font-medium text-foreground">Telefon:</span> +49 (0) 123 456 789</p>
              <p><span className="font-medium text-foreground">E-Mail:</span> info@geruestbauer24.eu</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Max Mustermann</p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Streitschlichtung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Haftung für Inhalte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Haftung für Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                Seiten verantwortlich.
              </p>
              <p>
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße 
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. 
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete 
                Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen 
                werden wir derartige Links umgehend entfernen.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Urheberrecht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung 
                des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den 
                privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p>
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die 
                Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. 
                Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen 
                entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte 
                umgehend entfernen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
