import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"

export default function AuthFehlerPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Startseite
        </Link>

        <Card className="border-border text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Authentifizierung fehlgeschlagen</CardTitle>
            <CardDescription>
              Bei der Verifizierung ist ein Fehler aufgetreten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="text-left">
                Der Bestätigungslink ist möglicherweise abgelaufen oder wurde bereits verwendet. 
                Bitte versuchen Sie es erneut oder registrieren Sie sich noch einmal.
              </p>
            </div>

            <ul className="text-sm text-muted-foreground text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">1.</span>
                Der Link ist nach 24 Stunden nicht mehr gültig
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">2.</span>
                Jeder Link kann nur einmal verwendet werden
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">3.</span>
                Prüfen Sie, ob Sie den neuesten Link verwenden
              </li>
            </ul>

            <div className="pt-4 space-y-2">
              <Link href="/auth/anmelden">
                <Button className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Erneut anmelden
                </Button>
              </Link>
              <Link href="/auth/registrieren">
                <Button variant="outline" className="w-full bg-transparent">
                  Neues Konto erstellen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
