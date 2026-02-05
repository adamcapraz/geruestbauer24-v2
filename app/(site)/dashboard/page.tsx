"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MessageSquare, 
  Search, 
  LogOut,
  Clock,
  CheckCircle,
  Calendar,
  Building2,
  ArrowRight
} from "lucide-react"

type Anfrage = {
  id: string
  firma_id: string
  projektbeschreibung: string
  adresse: string
  wunschtermin: string
  status: string
  created_at: string
  firma?: {
    name: string
    stadt: string
  }
}

export default function DashboardPage() {
  const { user, signOut, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/anmelden")
      return
    }

    if (user && user.role === "owner") {
      router.push("/firma/dashboard")
      return
    }

    if (user) {
      loadAnfragen()
    }
  }, [user, authLoading])

  const loadAnfragen = async () => {
    const { data } = await supabase
      .from("anfragen")
      .select(`
        *,
        firma:firmen(name, stadt)
      `)
      .eq("email", user?.email)
      .order("created_at", { ascending: false })

    if (data) {
      setAnfragen(data)
    }
    setLoading(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mein Bereich</h1>
            <p className="text-muted-foreground">
              Willkommen zurück, {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/geruestbau">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Gerüstbauer suchen
              </Button>
            </Link>
            <Button variant="outline" onClick={() => signOut()} className="bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/geruestbau">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Gerüstbauer finden</p>
                    <p className="text-sm text-muted-foreground">In Ihrer Nähe</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{anfragen.length}</p>
                  <p className="text-sm text-muted-foreground">Meine Anfragen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {anfragen.filter(a => a.status === "abgeschlossen").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anfragen List */}
        <Card>
          <CardHeader>
            <CardTitle>Meine Anfragen</CardTitle>
            <CardDescription>
              Übersicht Ihrer gesendeten Anfragen an Gerüstbauer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {anfragen.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Anfragen</h3>
                <p className="text-muted-foreground mb-4">
                  Sie haben noch keine Anfragen an Gerüstbauer gesendet.
                </p>
                <Link href="/geruestbau">
                  <Button>
                    Gerüstbauer finden
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {anfragen.map((anfrage) => (
                  <div 
                    key={anfrage.id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {anfrage.firma?.name || "Firma"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {anfrage.firma?.stadt || anfrage.adresse}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(anfrage.created_at).toLocaleDateString("de-DE")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        anfrage.status === "neu" ? "default" :
                        anfrage.status === "bearbeitet" ? "secondary" :
                        anfrage.status === "abgeschlossen" ? "outline" : "default"
                      }>
                        {anfrage.status === "neu" && <Clock className="h-3 w-3 mr-1" />}
                        {anfrage.status === "abgeschlossen" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {anfrage.status || "Gesendet"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
