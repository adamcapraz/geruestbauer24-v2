import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function BestaetigungPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Startseite
        </Link>

        <Card className="border-border text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">E-Mail bestätigen</CardTitle>
            <CardDescription>
              Wir haben Ihnen eine Bestätigungs-E-Mail gesendet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-left">
                  Bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink, 
                  um Ihr Konto zu aktivieren.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Falls Sie keine E-Mail erhalten haben, überprüfen Sie bitte auch Ihren Spam-Ordner.
            </p>

            <div className="pt-4 space-y-2">
              <Link href="/auth/anmelden">
                <Button className="w-full">
                  Zur Anmeldung
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Zurück zur Startseite
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
