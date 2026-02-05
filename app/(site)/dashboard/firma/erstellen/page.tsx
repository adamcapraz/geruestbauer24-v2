"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createSlug } from "@/lib/utils/slug"

const BUNDESLAENDER = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
  "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
  "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
  "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
]

const LEISTUNGEN_OPTIONS = [
  "Fassadengerüst", "Baugerüst", "Dachgerüst", "Rollgerüst",
  "Hängegerüst", "Traggerüst", "Schutzgerüst", "Industriegerüst",
  "Eventgerüst", "Sonderkonstruktionen", "Gerüstverleih",
  "Auf- und Abbau", "Gerüstplanung", "Sicherheitsprüfung"
]

export default function FirmaErstellenPage() {
  const router = useRouter()
  const supabase = createClient()

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [form, setForm] = useState({
    name: "",
    stadt: "",
    plz: "",
    bundesland: "",
    telefon: "",
    email: "",
    webseite: "",
    beschreibung: "",
    leistungen: [] as string[],
    adresse: "",
  })

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const toggleLeistung = (leistung: string) => {
    setForm(prev => ({
      ...prev,
      leistungen: prev.leistungen.includes(leistung)
        ? prev.leistungen.filter(l => l !== leistung)
        : [...prev.leistungen, leistung]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Bitte geben Sie einen Firmennamen ein." })
      return
    }
    if (!form.stadt.trim()) {
      setMessage({ type: "error", text: "Bitte geben Sie eine Stadt ein." })
      return
    }
    if (!form.telefon.trim()) {
      setMessage({ type: "error", text: "Bitte geben Sie eine Telefonnummer ein." })
      return
    }

    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage({ type: "error", text: "Sie müssen angemeldet sein." })
      setSaving(false)
      return
    }

    const firmaData = {
      name: form.name.trim(),
      slug: createSlug(form.name.trim()),
      stadt: form.stadt.trim(),
      stadt_slug: createSlug(form.stadt.trim()),
      plz: form.plz.trim(),
      bundesland: form.bundesland,
      telefon: form.telefon.trim(),
      email: form.email.trim() || user.email || "",
      webseite: form.webseite.trim() || null,
      beschreibung: form.beschreibung.trim() || `${form.name.trim()} - Gerüstbau in ${form.stadt.trim()}`,
      leistungen: form.leistungen.length > 0 ? form.leistungen : ["Gerüstbau"],
      bewertung: 0,
      anzahl_bewertungen: 0,
      geprueft: false,
      aktiv: true,
      owner_id: user.id,
    }

    const { error } = await supabase.from("firmen").insert(firmaData)

    if (error) {
      setMessage({ type: "error", text: "Fehler beim Erstellen: " + error.message })
      setSaving(false)
      return
    }

    setMessage({ type: "success", text: "Firma erfolgreich eingetragen! Sie werden weitergeleitet..." })
    setTimeout(() => {
      router.push("/dashboard/firma")
    }, 1500)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/firma">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Firma eintragen</h1>
        <p className="text-muted-foreground mt-1">
          Tragen Sie Ihre Gerüstbau-Firma ein und werden Sie auf Gerüstbauer24 gefunden.
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Firmendaten
            </CardTitle>
            <CardDescription>Grundlegende Informationen zu Ihrer Firma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Firmenname *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="z.B. Müller Gerüstbau GmbH"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plz">PLZ</Label>
                <Input
                  id="plz"
                  value={form.plz}
                  onChange={(e) => updateField("plz", e.target.value)}
                  placeholder="z.B. 50667"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stadt">Stadt *</Label>
                <Input
                  id="stadt"
                  value={form.stadt}
                  onChange={(e) => updateField("stadt", e.target.value)}
                  placeholder="z.B. Köln"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bundesland">Bundesland</Label>
              <Select value={form.bundesland} onValueChange={(val) => updateField("bundesland", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Bundesland auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {BUNDESLAENDER.map((bl) => (
                    <SelectItem key={bl} value={bl}>{bl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={form.adresse}
                onChange={(e) => updateField("adresse", e.target.value)}
                placeholder="Straße und Hausnummer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kontaktdaten</CardTitle>
            <CardDescription>Wie können Kunden Sie erreichen?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefon">Telefon *</Label>
              <Input
                id="telefon"
                value={form.telefon}
                onChange={(e) => updateField("telefon", e.target.value)}
                placeholder="z.B. +49 221 1234567"
                type="tel"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="info@firma.de"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webseite">Webseite</Label>
              <Input
                id="webseite"
                value={form.webseite}
                onChange={(e) => updateField("webseite", e.target.value)}
                placeholder="https://www.ihre-firma.de"
              />
            </div>
          </CardContent>
        </Card>

        {/* Description & Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leistungen und Beschreibung</CardTitle>
            <CardDescription>Was bieten Sie an?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Leistungen</Label>
              <div className="flex flex-wrap gap-2">
                {LEISTUNGEN_OPTIONS.map((leistung) => (
                  <Button
                    key={leistung}
                    type="button"
                    variant={form.leistungen.includes(leistung) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLeistung(leistung)}
                    className={form.leistungen.includes(leistung) ? "" : "bg-transparent"}
                  >
                    {leistung}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beschreibung">Beschreibung</Label>
              <Textarea
                id="beschreibung"
                value={form.beschreibung}
                onChange={(e) => updateField("beschreibung", e.target.value)}
                placeholder="Beschreiben Sie Ihre Firma, Erfahrung und Spezialisierungen..."
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Eine gute Beschreibung hilft Kunden, Sie besser zu finden.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">* Pflichtfelder</p>
          <Button type="submit" size="lg" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Firma eintragen
          </Button>
        </div>
      </form>
    </div>
  )
}
