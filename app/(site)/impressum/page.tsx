import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSettingsByKeys } from "@/lib/settings"

export const metadata = {
  title: "Impressum - Gerüstbauer24",
  description: "Impressum und rechtliche Informationen zu Gerüstbauer24",
}

export default async function ImpressumPage() {
  const s = await getSettingsByKeys([
    "impressum_firmenname",
    "impressum_adresse",
    "impressum_telefon",
    "impressum_email",
    "impressum_geschaeftsfuehrer",
    "impressum_registergericht",
    "impressum_registernummer",
    "impressum_ust_id",
    "contact_email",
  ])

  const firmenname = s.impressum_firmenname || "Gerüstbauer24 GmbH"
  const adresse = s.impressum_adresse || "Musterstraße 123, 10115 Berlin"
  const telefon = s.impressum_telefon || "+49 1639540595"
  const email = s.impressum_email || s.contact_email || "info@geruestbauer24.eu"
  const geschaeftsfuehrer = s.impressum_geschaeftsfuehrer || "Max Mustermann"
  const registergericht = s.impressum_registergericht || "Amtsgericht Charlottenburg"
  const registernummer = s.impressum_registernummer || "HRB 12345 B"
  const ustId = s.impressum_ust_id || "DE321654789"

  // Split address into lines if it contains commas
  const adressLines = adresse.split(",").map((line: string) => line.trim())

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
              <CardTitle>{"Angaben gemäß § 5 TMG"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">{firmenname}</p>
                {adressLines.map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
                <p>Deutschland</p>
              </div>
              <div>
                <p><span className="font-medium text-foreground">Handelsregister:</span> {registernummer}</p>
                <p><span className="font-medium text-foreground">Registergericht:</span> {registergericht}</p>
              </div>
              <div>
                <p><span className="font-medium text-foreground">Umsatzsteuer-ID:</span> {ustId}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Vertreten durch</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{"Geschäftsführer: "}{geschaeftsfuehrer}</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Kontakt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p><span className="font-medium text-foreground">Telefon:</span> {telefon}</p>
              <p><span className="font-medium text-foreground">E-Mail:</span> {email}</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>{"Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV"}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{geschaeftsfuehrer}</p>
              {adressLines.map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Streitschlichtung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {"Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: "}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
              <p>
                {"Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>{"Haftung für Inhalte"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {"Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen."}
              </p>
              <p>
                {"Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>{"Haftung für Links"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {"Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich."}
              </p>
              <p>
                {"Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Urheberrecht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {"Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet."}
              </p>
              <p>
                {"Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
