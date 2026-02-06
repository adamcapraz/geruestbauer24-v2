"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquare, Search, Clock, CheckCircle, Mail, Calendar, Eye, Building2 } from "lucide-react"

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
  firmen?: { name: string; stadt: string }
}

export default function KundeAnfragenPage() {
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnfrage, setSelectedAnfrage] = useState<Anfrage | null>(null)
  const [filterStatus, setFilterStatus] = useState("alle")
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    loadAnfragen()
  }, [])

  const loadAnfragen = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("anfragen")
      .select("*, firmen(name, stadt)")
      .eq("email", user.email)
      .order("created_at", { ascending: false })

    if (data) setAnfragen(data)
    setLoading(false)
  }

  const filteredAnfragen = anfragen.filter(a => {
    if (filterStatus !== "alle" && a.status !== filterStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        (a as any).firmen?.name?.toLowerCase().includes(q) ||
        a.nachricht?.toLowerCase().includes(q)
      )
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
      case "neu": return <Badge className="bg-amber-500 text-white hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />Offen</Badge>
      case "gelesen": return <Badge variant="secondary"><Eye className="h-3 w-3 mr-1" />Gelesen</Badge>
      case "beantwortet": return <Badge className="bg-green-600 text-white hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" />Beantwortet</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meine Anfragen</h1>
        <p className="text-muted-foreground mt-1">Übersicht aller Anfragen, die Sie an Firmen gesendet haben</p>
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
            {status === "alle" ? "Alle" : status === "neu" ? "Offen" : status === "gelesen" ? "Gelesen" : "Beantwortet"}
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
              {anfragen.length === 0 ? "Sie haben noch keine Anfragen gesendet." : "Keine Anfragen entsprechen Ihrem Filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAnfragen.map((anfrage) => (
            <Card
              key={anfrage.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => setSelectedAnfrage(anfrage)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold truncate">{(anfrage as any).firmen?.name || "Firma"}</p>
                      {getStatusBadge(anfrage.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{anfrage.nachricht}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {(anfrage as any).firmen?.stadt && (
                        <span>{(anfrage as any).firmen.stadt}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
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
              Anfrage an {(selectedAnfrage as any)?.firmen?.name || "Firma"}
              {selectedAnfrage && getStatusBadge(selectedAnfrage.status)}
            </DialogTitle>
            <DialogDescription>
              Gesendet am{" "}
              {selectedAnfrage && new Date(selectedAnfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </DialogDescription>
          </DialogHeader>
          {selectedAnfrage && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{(selectedAnfrage as any).firmen?.name || "Firma"}</p>
                </div>
                {(selectedAnfrage as any).firmen?.stadt && (
                  <p className="text-sm text-muted-foreground">{(selectedAnfrage as any).firmen.stadt}</p>
                )}
              </div>
              {selectedAnfrage.leistung && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Gewünschte Leistung</p>
                  <p className="text-sm font-medium">{selectedAnfrage.leistung}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Ihre Nachricht</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedAnfrage.nachricht}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <p className="font-medium">Status:</p>
                {getStatusBadge(selectedAnfrage.status)}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="bg-transparent" onClick={() => setSelectedAnfrage(null)}>
                  Schließen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
