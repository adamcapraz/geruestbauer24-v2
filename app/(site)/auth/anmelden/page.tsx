"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, ArrowLeft } from "lucide-react"

export default function AnmeldenPage() {
  const [email, setEmail] = useState("")
  const [passwort, setPasswort] = useState("")
  const { signIn, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !passwort) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      })
      return
    }

    try {
      await signIn(email, passwort, "email")
      toast({
        title: "Erfolgreich angemeldet",
        description: "Sie werden weitergeleitet...",
      })
    } catch (error) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Bitte überprüfen Sie Ihre Zugangsdaten.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Startseite
        </Link>
        
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Anmelden</CardTitle>
            <CardDescription>
              Melden Sie sich an, um auf Ihr Konto zuzugreifen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="passwort">Passwort</Label>
                  <Link href="/auth/passwort-vergessen" className="text-sm text-primary hover:underline">
                    Passwort vergessen?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passwort"
                    type="password"
                    placeholder="Ihr Passwort"
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird angemeldet..." : "Anmelden"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Noch kein Konto?{" "}
              <Link href="/auth/registrieren" className="text-primary hover:underline font-medium">
                Jetzt registrieren
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Mit der Anmeldung akzeptieren Sie unsere{" "}
          <Link href="/agb" className="text-primary hover:underline">AGB</Link> und{" "}
          <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>.
        </p>
      </div>
    </div>
  )
}
