"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Send, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function KontaktForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [telefon, setTelefon] = useState("")
  const [betreff, setBetreff] = useState("")
  const [nachricht, setNachricht] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

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

    const { error } = await supabase.from("kontakt_nachrichten").insert({
      name,
      email,
      telefon: telefon || null,
      betreff,
      nachricht,
      gelesen: false,
      beantwortet: false,
    })

    if (error) {
      toast({
        title: "Fehler",
        description: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Nachricht gesendet",
        description: "Vielen Dank für Ihre Nachricht. Wir werden uns schnellstmöglich bei Ihnen melden.",
      })

      setName("")
      setEmail("")
      setTelefon("")
      setBetreff("")
      setNachricht("")
    }

    setSending(false)
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Schreiben Sie uns
        </CardTitle>
        <CardDescription>
          {"Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen."}
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
            <Label htmlFor="telefon">Telefon (optional)</Label>
            <Input
              id="telefon"
              type="tel"
              placeholder="Ihre Telefonnummer"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
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
                <SelectItem value="feedback">{"Feedback & Verbesserungsvorschläge"}</SelectItem>
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
  )
}
