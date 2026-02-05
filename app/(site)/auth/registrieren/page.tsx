"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User, Phone, ArrowLeft, Building2, Loader2 } from "lucide-react"

export default function RegistrierenPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [telefon, setTelefon] = useState("")
  const [passwort, setPasswort] = useState("")
  const [passwortBestaetigen, setPasswortBestaetigen] = useState("")
  const [kontotyp, setKontotyp] = useState<"customer" | "owner">("customer")
  const [agbAkzeptiert, setAgbAkzeptiert] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !passwort || !passwortBestaetigen) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      })
      return
    }

    if (passwort !== passwortBestaetigen) {
      toast({
        title: "Passwörter stimmen nicht überein",
        description: "Bitte überprüfen Sie Ihre Passwort-Eingaben.",
        variant: "destructive",
      })
      return
    }

    if (passwort.length < 8) {
      toast({
        title: "Passwort zu kurz",
        description: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        variant: "destructive",
      })
      return
    }

    if (!agbAkzeptiert) {
      toast({
        title: "AGB nicht akzeptiert",
        description: "Bitte akzeptieren Sie die AGB und Datenschutzerklärung.",
        variant: "destructive",
      })
      return
    }

    setLocalLoading(true)
    try {
      await signUp(
        {
          name,
          email,
          phone: telefon,
          role: kontotyp,
        },
        passwort
      )
    } catch {
      // Error already handled in signUp
    } finally {
      setLocalLoading(false)
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
            <CardTitle className="text-2xl">Registrieren</CardTitle>
            <CardDescription>
              Erstellen Sie ein kostenloses Konto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Kontotyp</Label>
                <RadioGroup
                  value={kontotyp}
                  onValueChange={(value: "customer" | "owner") => setKontotyp(value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="customer" id="kunde" className="peer sr-only" />
                    <Label
                      htmlFor="kunde"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <User className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Kunde</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="owner" id="firma" className="peer sr-only" />
                    <Label
                      htmlFor="firma"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Building2 className="mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">Firma</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{kontotyp === "owner" ? "Firmenname" : "Vollständiger Name"} *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={kontotyp === "owner" ? "Musterfirma GmbH" : "Max Mustermann"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                    disabled={localLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse *</Label>
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
                    disabled={localLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefon">Telefonnummer</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefon"
                    type="tel"
                    placeholder="+49 123 456789"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    className="pl-10"
                    disabled={localLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwort">Passwort *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passwort"
                    type="password"
                    placeholder="Mindestens 8 Zeichen"
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    className="pl-10"
                    required
                    disabled={localLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwort-bestaetigen">Passwort bestätigen *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passwort-bestaetigen"
                    type="password"
                    placeholder="Passwort wiederholen"
                    value={passwortBestaetigen}
                    onChange={(e) => setPasswortBestaetigen(e.target.value)}
                    className="pl-10"
                    required
                    disabled={localLoading}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agb"
                  checked={agbAkzeptiert}
                  onCheckedChange={(checked) => setAgbAkzeptiert(checked as boolean)}
                  disabled={localLoading}
                />
                <Label htmlFor="agb" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  Ich akzeptiere die{" "}
                  <Link href="/agb" className="text-primary hover:underline">AGB</Link> und{" "}
                  <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link> *
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={localLoading}>
                {localLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird registriert...
                  </>
                ) : (
                  "Konto erstellen"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Bereits ein Konto?{" "}
              <Link href="/auth/anmelden" className="text-primary hover:underline font-medium">
                Jetzt anmelden
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
