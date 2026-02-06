"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { MessageSquare, Search, Clock, CheckCircle, Mail, Phone, Calendar, Eye } from "lucide-react"

type Anfrage = {
  id: string
  name: string
  email: string
  telefon: string
  nachricht: string
  status: string
  created_at: string
  firma_id: string
  adresse?: string
  leistung?: string
}

export default function FirmaAnfragenPage() {
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnfrage, setSelectedAnfrage] = useState<Anfrage | null>(null)
  const [filterStatus, setFilterStatus] = useState("alle")
  const [searchQuery, setSearchQuery] = useState("")
  const [antwortText, setAntwortText] = useState("")
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadAnfragen()
  }, [])

  const loadAnfragen = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: firmenData } = await supabase
      .from("firmen")
      .select("id")
      .eq("owner_id", user.id)

    if (!firmenData || firmenData.length === 0) {
      setLoading(false)
      return
    }

    const firmaIds = firmenData.map(f => f.id)
    const { data } = await supabase
      .from("anfragen")
      .select("*")
      .in("firma_id", firmaIds)
      .order("created_at", { ascending: false })

    if (data) setAnfragen(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("anfragen").update({ status }).eq("id", id)
    setAnfragen(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selectedAnfrage?.id === id) {
      setSelectedAnfrage(prev => prev ? { ...prev, status } : null)
    }
  }

  const openAnfrage = async (anfrage: Anfrage) => {
    setSelectedAnfrage(anfrage)
    setAntwortText("")
    if (anfrage.status === "neu") {
      await updateStatus(anfrage.id, "gelesen")
    }
  }

  const sendAntwort = async () => {
    if (!selectedAnfrage || !antwortText.trim()) return
    setSending(true)
    await updateStatus(selectedAnfrage.id, "beantwortet")
    setSending(false)
    setAntwortText("")
    setSelectedAnfrage(null)
  }

  const filteredAnfragen = anfragen.filter(a => {
    if (filterStatus !== "alle" && a.status !== filterStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.nachricht?.toLowerCase().includes(q)
    }
    return true
  })

  const statusCounts = {
    alle: anfragen.length,
    neu: anfragen.filter(a => a.status === "neu").length,
    gelesen: anfragen.filter(a => a.status === "gelesen").length,
    beantwortet: anfragen.filter(a => a.status === "beantwortet").length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "neu": return <Badge className="bg-blue-500 text-white hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />Neu</Badge>
      case "gelesen": return <Badge variant="secondary"><Eye className="h-3 w-3 mr-1" />Gelesen</Badge>
      case "beantwortet": return <Badge className="bg-green-600 text-white hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" />Beantwortet</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Anfragen</h1>
        <p className="text-muted-foreground mt-1">Verwalten Sie eingehende Kundenanfragen</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["alle", "neu", "gelesen", "beantwortet"] as const).map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className={filterStatus !== status ? "bg-transparent" : ""}
          >
            {status === "alle" ? "Alle" : status === "neu" ? "Neu" : status === "gelesen" ? "Gelesen" : "Beantwortet"}
            <span className="ml-2 bg-background/20 text-xs px-1.5 py-0.5 rounded-full">
              {statusCounts[status]}
            </span>
          </Button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Anfragen durchsuchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {filteredAnfragen.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Keine Anfragen</h3>
            <p className="text-muted-foreground">
              {anfragen.length === 0 ? "Sie haben noch keine Anfragen erhalten." : "Keine Anfragen entsprechen Ihrem Filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAnfragen.map((anfrage) => (
            <Card
              key={anfrage.id}
              className={`cursor-pointer transition-colors hover:border-primary/50 ${anfrage.status === "neu" ? "border-l-4 border-l-blue-500" : ""}`}
              onClick={() => openAnfrage(anfrage)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{anfrage.name}</p>
                      {getStatusBadge(anfrage.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{anfrage.nachricht}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{anfrage.email}</span>
                      {anfrage.telefon && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{anfrage.telefon}</span>}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedAnfrage} onOpenChange={(open) => !open && setSelectedAnfrage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Anfrage von {selectedAnfrage?.name}
              {selectedAnfrage && getStatusBadge(selectedAnfrage.status)}
            </DialogTitle>
            <DialogDescription>
              Eingegangen am{" "}
              {selectedAnfrage && new Date(selectedAnfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </DialogDescription>
          </DialogHeader>
          {selectedAnfrage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">E-Mail</p>
                  <a href={`mailto:${selectedAnfrage.email}`} className="text-sm font-medium text-primary hover:underline">{selectedAnfrage.email}</a>
                </div>
                {selectedAnfrage.telefon && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Telefon</p>
                    <a href={`tel:${selectedAnfrage.telefon}`} className="text-sm font-medium text-primary hover:underline">{selectedAnfrage.telefon}</a>
                  </div>
                )}
                {selectedAnfrage.adresse && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Adresse</p>
                    <p className="text-sm font-medium">{selectedAnfrage.adresse}</p>
                  </div>
                )}
                {selectedAnfrage.leistung && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Gewünschte Leistung</p>
                    <p className="text-sm font-medium">{selectedAnfrage.leistung}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Nachricht</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedAnfrage.nachricht}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Status:</p>
                <Select value={selectedAnfrage.status} onValueChange={(value) => updateStatus(selectedAnfrage.id, value)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neu">Neu</SelectItem>
                    <SelectItem value="gelesen">Gelesen</SelectItem>
                    <SelectItem value="beantwortet">Beantwortet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedAnfrage.status !== "beantwortet" && (
                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-medium">Schnellantwort per E-Mail</p>
                  <Textarea placeholder="Ihre Antwort schreiben..." value={antwortText} onChange={(e) => setAntwortText(e.target.value)} rows={3} />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="bg-transparent" onClick={() => setSelectedAnfrage(null)}>Schließen</Button>
                    <Button onClick={sendAntwort} disabled={!antwortText.trim() || sending}>
                      <Mail className="h-4 w-4 mr-2" />
                      {sending ? "Wird gesendet..." : "Als beantwortet markieren"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
