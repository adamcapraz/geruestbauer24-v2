"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Building2, HelpCircle } from "lucide-react"

export default function KontaktPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [betreff, setBetreff] = useState("")
  const [nachricht, setNachricht] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !betreff || !nachricht) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    toast({
      title: "Nachricht gesendet",
      description: "Vielen Dank für Ihre Nachricht. Wir werden uns schnellstmöglich bei Ihnen melden.",
    })
    
    setName("")
    setEmail("")
    setBetreff("")
    setNachricht("")
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Kontakt
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Haben Sie Fragen? Wir sind für Sie da!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Schreiben Sie uns
              </CardTitle>
              <CardDescription>
                Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Ihr vollständiger Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="betreff">Betreff *</Label>
                  <Select value={betreff} onValueChange={setBetreff}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bitte wählen Sie einen Betreff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allgemein">Allgemeine Anfrage</SelectItem>
                      <SelectItem value="firma">Fragen zum Firmeneintrag</SelectItem>
                      <SelectItem value="technisch">Technisches Problem</SelectItem>
                      <SelectItem value="feedback">Feedback & Verbesserungsvorschläge</SelectItem>
                      <SelectItem value="kooperation">Kooperationsanfrage</SelectItem>
                      <SelectItem value="sonstiges">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nachricht">Nachricht *</Label>
                  <Textarea
                    id="nachricht"
                    placeholder="Ihre Nachricht an uns..."
                    rows={5}
                    value={nachricht}
                    onChange={(e) => setNachricht(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? (
                    "Wird gesendet..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Nachricht senden
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Kontaktinformationen</CardTitle>
                <CardDescription>
                  Sie erreichen uns über folgende Wege
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Telefon</h3>
                    <p className="text-muted-foreground">+49 (0) 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">E-Mail</h3>
                    <p className="text-muted-foreground">info@geruestbauer24.eu</p>
                    <p className="text-muted-foreground">support@geruestbauer24.eu</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Adresse</h3>
                    <p className="text-muted-foreground">
                      Gerüstbauer24 GmbH<br />
                      Musterstraße 123<br />
                      10115 Berlin<br />
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
                  Häufige Fragen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Wie kann ich meine Firma eintragen?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Registrieren Sie sich kostenlos und folgen Sie den Anweisungen zur Firmeneintragung.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Ist die Nutzung für Kunden kostenlos?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ja, die Suche nach Gerüstbauern und das Senden von Anfragen ist für Kunden völlig kostenlos.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Wie werden die Firmen geprüft?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Wir überprüfen Gewerbeanmeldung, Zertifizierungen und Qualifikationen vor der Freischaltung.
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
                    <h3 className="font-bold text-foreground mb-2">Sie sind Gerüstbauer?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Tragen Sie Ihr Unternehmen kostenlos ein und erreichen Sie neue Kunden.
                    </p>
                    <Button asChild>
                      <a href="/geruestbau/eintragen">Firma eintragen</a>
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
