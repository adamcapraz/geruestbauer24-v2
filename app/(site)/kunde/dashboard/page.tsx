"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Clock, CheckCircle, ArrowRight } from "lucide-react"

type Anfrage = {
  id: string
  name: string
  email: string
  nachricht: string
  status: string
  created_at: string
  firma_id: string
  firmen?: { name: string; stadt: string }
}

export default function KundeDashboardOverview() {
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get anfragen sent by this customer (matched by email)
      const { data: anfragenData } = await supabase
        .from("anfragen")
        .select("*, firmen(name, stadt)")
        .eq("email", user.email)
        .order("created_at", { ascending: false })
        .limit(5)

      if (anfragenData) setAnfragen(anfragenData)
      setLoading(false)
    }
    loadData()
  }, [])

  const statusCounts = {
    total: anfragen.length,
    neu: anfragen.filter(a => a.status === "neu").length,
    beantwortet: anfragen.filter(a => a.status === "beantwortet").length,
  }

  if (loading) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Willkommen zurück</h1>
        <p className="text-muted-foreground mt-1">Hier finden Sie eine Übersicht Ihrer Anfragen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
                <p className="text-xs text-muted-foreground">Gesendete Anfragen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.neu}</p>
                <p className="text-xs text-muted-foreground">Offene Anfragen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.beantwortet}</p>
                <p className="text-xs text-muted-foreground">Beantwortet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA to search */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">Gerüstbauer in Ihrer Nähe finden</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Suchen Sie nach Gerüstbau-Firmen und senden Sie kostenlose Anfragen.
              </p>
            </div>
            <Link href="/geruestbau">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Firmen suchen
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Anfragen */}
      {anfragen.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Letzte Anfragen</CardTitle>
            <Link href="/kunde/dashboard/anfragen">
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
                    <p className="font-medium">
                      {(anfrage as any).firmen?.name || "Firma"}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{anfrage.nachricht}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </p>
                  </div>
                  <Badge variant={anfrage.status === "beantwortet" ? "default" : "secondary"}>
                    {anfrage.status === "neu" ? "Offen" : anfrage.status === "gelesen" ? "Gelesen" : "Beantwortet"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {anfragen.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Noch keine Anfragen</h3>
            <p className="text-muted-foreground mb-4">
              Suchen Sie nach Gerüstbau-Firmen und senden Sie Ihre erste Anfrage.
            </p>
            <Link href="/geruestbau">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Firmen suchen
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
