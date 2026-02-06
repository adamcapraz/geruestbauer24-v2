import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Datenschutzerklärung - Gerüstbauer24",
  description: "Datenschutzerklärung von Gerüstbauer24 - Informationen zum Schutz Ihrer personenbezogenen Daten",
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-900 py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Datenschutzerklärung
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>1. Datenschutz auf einen Blick</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <h3 className="font-semibold text-foreground">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
              
              <h3 className="font-semibold text-foreground mt-4">Datenerfassung auf dieser Website</h3>
              <p>
                <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen 
                Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
              </p>
              <p>
                <strong>Wie erfassen wir Ihre Daten?</strong><br />
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei 
                kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere 
                Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>2. Verantwortlicher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
              <div>
                <p className="font-semibold text-foreground">Gerüstbauer24 GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
                <p className="mt-2">Telefon: +49 1639540595</p>
                <p>E-Mail: info@geruestbauer24.eu</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>3. Ihre Rechte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Sie haben jederzeit das Recht:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger personenbezogener Daten zu verlangen (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung Ihrer Daten zu verlangen (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit Ihrer Daten zu verlangen (Art. 20 DSGVO)</li>
                <li>Der Verarbeitung Ihrer Daten zu widersprechen (Art. 21 DSGVO)</li>
              </ul>
              <p className="mt-4">
                Wenn Sie der Meinung sind, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht 
                verstößt, haben Sie das Recht, sich bei einer Aufsichtsbehörde zu beschweren.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>4. Datenerfassung auf dieser Website</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Server-Log-Dateien</h3>
                <p>
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten 
                  Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                <p className="mt-2">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. 
                  Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Kontaktformular</h3>
                <p>
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus 
                  dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
                  Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. 
                  Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Anfragen an Firmen</h3>
                <p>
                  Wenn Sie über unsere Plattform eine Anfrage an eine Gerüstbaufirma senden, werden 
                  Ihre angegebenen Kontaktdaten an das betreffende Unternehmen weitergeleitet, damit 
                  dieses Ihre Anfrage bearbeiten kann. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 
                  lit. b DSGVO (Vertragserfüllung bzw. vorvertragliche Maßnahmen).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>5. Registrierung und Nutzerkonto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Sie können sich auf unserer Website registrieren, um zusätzliche Funktionen zu nutzen. 
                Die dabei eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen 
                Angebotes oder Dienstes.
              </p>
              <p>
                Bei der Registrierung für Firmeneinträge werden zusätzlich firmenrelevante Daten 
                erhoben, die zur Darstellung des Firmenprofils auf unserer Plattform verwendet werden.
              </p>
              <p>
                Die bei der Registrierung erfassten Daten werden von uns gespeichert, solange Sie 
                auf unserer Website registriert sind und werden anschließend gelöscht. Gesetzliche 
                Aufbewahrungsfristen bleiben unberührt.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>6. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser 
                auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, 
                effektiver und sicherer zu machen.
              </p>
              <p>
                Einige Cookies sind "Session-Cookies" und werden nach Ende Ihrer Browser-Sitzung 
                automatisch gelöscht. Andere Cookies bleiben auf Ihrem Endgerät gespeichert, bis 
                Sie diese löschen (persistente Cookies).
              </p>
              <p>
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert 
                werden und Cookies nur im Einzelfall erlauben. Bei der Deaktivierung von Cookies kann 
                die Funktionalität unserer Website eingeschränkt sein.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>7. Datensicherheit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher 
                Inhalte eine SSL-bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie 
                daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an 
                dem Schloss-Symbol in Ihrer Browserzeile.
              </p>
              <p>
                Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns 
                übermitteln, nicht von Dritten mitgelesen werden.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>8. Löschung von Daten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Ihre personenbezogenen Daten werden gelöscht oder gesperrt, sobald der Zweck der 
                Speicherung entfällt. Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch 
                den europäischen oder nationalen Gesetzgeber in unionsrechtlichen Verordnungen, 
                Gesetzen oder sonstigen Vorschriften vorgesehen wurde.
              </p>
              <p>
                Eine Sperrung oder Löschung der Daten erfolgt auch dann, wenn eine durch die genannten 
                Normen vorgeschriebene Speicherfrist abläuft, es sei denn, dass eine Erforderlichkeit 
                zur weiteren Speicherung der Daten für einen Vertragsabschluss oder eine Vertragserfüllung besteht.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>9. Aktualität und Änderung dieser Datenschutzerklärung</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Februar 2026. Durch 
                die Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter gesetzlicher 
                bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern. 
                Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf dieser Website abgerufen werden.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
