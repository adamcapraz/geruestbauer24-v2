"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building2, MapPin, Phone, Mail, Globe, Star, Edit, Save, X, Plus,
  CheckCircle, AlertCircle, Loader2, ExternalLink
} from "lucide-react"
import { createSlug } from "@/lib/utils/slug"

type Firma = {
  id: string
  name: string
  stadt: string
  stadt_slug: string
  slug: string
  bundesland: string
  plz: string
  telefon: string
  email: string
  webseite: string | null
  beschreibung: string
  leistungen: string[]
  bewertung: number
  anzahl_bewertungen: number
  aktiv: boolean
  geprueft: boolean
  google_adresse: string | null
}

export default function FirmaProfilPage() {
  const [firmen, setFirmen] = useState<Firma[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Firma>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadFirmen()
  }, [])

  const loadFirmen = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("firmen")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })

    if (data) setFirmen(data)
    setLoading(false)
  }

  const startEdit = (firma: Firma) => {
    setEditingId(firma.id)
    setEditForm({
      name: firma.name,
      stadt: firma.stadt,
      plz: firma.plz,
      bundesland: firma.bundesland,
      telefon: firma.telefon,
      email: firma.email,
      webseite: firma.webseite,
      beschreibung: firma.beschreibung,
      leistungen: firma.leistungen,
    })
    setMessage(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    setMessage(null)

    const updateData = {
      ...editForm,
      slug: createSlug(editForm.name || ""),
      stadt_slug: createSlug(editForm.stadt || ""),
    }

    const { error } = await supabase
      .from("firmen")
      .update(updateData)
      .eq("id", editingId)

    if (error) {
      setMessage({ type: "error", text: "Fehler beim Speichern: " + error.message })
    } else {
      setMessage({ type: "success", text: "Firma erfolgreich aktualisiert." })
      setEditingId(null)
      loadFirmen()
    }
    setSaving(false)
  }

  if (loading) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mein Profil</h1>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Firmenprofile</p>
        </div>
        <Link href="/auth/registrieren">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Neue Firma
          </Button>
        </Link>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {firmen.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Noch keine Firma eingetragen</h3>
            <p className="text-muted-foreground mb-4">
              Tragen Sie Ihre Firma ein, um auf Gerüstbauer24 gefunden zu werden.
            </p>
            <Link href="/auth/registrieren">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Firma eintragen
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {firmen.map((firma) => (
            <Card key={firma.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {firma.name}
                      {firma.geprueft && (
                        <Badge className="bg-green-600 text-white">Geprüft</Badge>
                      )}
                      <Badge variant={firma.aktiv ? "default" : "secondary"}>
                        {firma.aktiv ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {firma.plz} {firma.stadt}, {firma.bundesland}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {firma.slug && firma.stadt_slug && (
                      <Link href={`/geruestbau/${firma.stadt_slug}/${firma.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ansehen
                        </Button>
                      </Link>
                    )}
                    {editingId !== firma.id ? (
                      <Button variant="outline" size="sm" className="bg-transparent" onClick={() => startEdit(firma)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Bearbeiten
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveEdit} disabled={saving}>
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                          Speichern
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === firma.id ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Firmenname</Label>
                      <Input
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stadt</Label>
                      <Input
                        value={editForm.stadt || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, stadt: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PLZ</Label>
                      <Input
                        value={editForm.plz || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, plz: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bundesland</Label>
                      <Input
                        value={editForm.bundesland || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bundesland: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input
                        value={editForm.telefon || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, telefon: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>E-Mail</Label>
                      <Input
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Webseite</Label>
                      <Input
                        value={editForm.webseite || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, webseite: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Beschreibung</Label>
                      <Textarea
                        value={editForm.beschreibung || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, beschreibung: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Leistungen (kommagetrennt)</Label>
                      <Input
                        value={(editForm.leistungen || []).join(", ")}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          leistungen: e.target.value.split(",").map(l => l.trim()).filter(Boolean)
                        }))}
                        placeholder="Fassadengerüst, Baugerüst, Dachgerüst"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {firma.beschreibung && (
                      <p className="text-sm text-muted-foreground">{firma.beschreibung}</p>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {firma.telefon && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{firma.telefon}</span>
                        </div>
                      )}
                      {firma.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{firma.email}</span>
                        </div>
                      )}
                      {firma.webseite && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={firma.webseite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                            {firma.webseite.replace(/https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                      {firma.bewertung > 0 && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span>{firma.bewertung} ({firma.anzahl_bewertungen} Bewertungen)</span>
                        </div>
                      )}
                    </div>
                    {firma.leistungen && firma.leistungen.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {firma.leistungen.map((l, i) => (
                          <Badge key={i} variant="secondary">{l}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
