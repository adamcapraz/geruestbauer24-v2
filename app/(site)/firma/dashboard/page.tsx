"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MessageSquare, Eye, Star, Plus, ArrowRight } from "lucide-react"

type Firma = {
  id: string
  name: string
  stadt: string
  bewertung: number
  anzahl_bewertungen: number
  aktiv: boolean
  slug: string
  stadt_slug: string
}

type Anfrage = {
  id: string
  name: string
  email: string
  nachricht: string
  status: string
  created_at: string
  firma_id: string
}

export default function FirmaDashboardOverview() {
  const [firmen, setFirmen] = useState<Firma[]>([])
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: firmenData } = await supabase
        .from("firmen")
        .select("*")
        .eq("owner_id", user.id)

      if (firmenData) setFirmen(firmenData)

      if (firmenData && firmenData.length > 0) {
        const firmaIds = firmenData.map(f => f.id)
        const { data: anfragenData } = await supabase
          .from("anfragen")
          .select("*")
          .in("firma_id", firmaIds)
          .order("created_at", { ascending: false })
          .limit(5)

        if (anfragenData) setAnfragen(anfragenData)
      }

      setLoading(false)
    }
    loadData()
  }, [])

  const neueAnfragen = anfragen.filter(a => a.status === "neu").length

  if (loading) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Firma Übersicht</h1>
        <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Firmen und Anfragen</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{firmen.length}</p>
                <p className="text-xs text-muted-foreground">Firmen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{anfragen.length}</p>
                <p className="text-xs text-muted-foreground">Anfragen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{neueAnfragen}</p>
                <p className="text-xs text-muted-foreground">Neue Anfragen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {firmen.length > 0 ? (firmen.reduce((acc, f) => acc + (f.bewertung || 0), 0) / firmen.length).toFixed(1) : "0.0"}
                </p>
                <p className="text-xs text-muted-foreground">Bewertung</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {firmen.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Noch keine Firma eingetragen</h3>
            <p className="text-muted-foreground mb-4">
              Tragen Sie Ihre Firma ein, um Anfragen zu erhalten und Ihr Profil zu verwalten.
            </p>
            <Link href="/firma/dashboard/erstellen">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Firma eintragen
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {firmen.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Meine Firmen</CardTitle>
            <Link href="/firma/dashboard/profil">
              <Button variant="ghost" size="sm">
                Alle anzeigen <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {firmen.map((firma) => (
                <div key={firma.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{firma.name}</p>
                    <p className="text-sm text-muted-foreground">{firma.stadt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={firma.aktiv ? "default" : "secondary"}>
                      {firma.aktiv ? "Aktiv" : "Inaktiv"}
                    </Badge>
                    {firma.bewertung > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {firma.bewertung}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {anfragen.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Letzte Anfragen</CardTitle>
            <Link href="/firma/dashboard/anfragen">
              <Button variant="ghost" size="sm">
                Alle anzeigen <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anfragen.slice(0, 3).map((anfrage) => (
                <div key={anfrage.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{anfrage.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{anfrage.nachricht}</p>
                  </div>
                  <Badge variant={anfrage.status === "neu" ? "default" : "secondary"}>
                    {anfrage.status === "neu" ? "Neu" : anfrage.status === "gelesen" ? "Gelesen" : "Beantwortet"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
