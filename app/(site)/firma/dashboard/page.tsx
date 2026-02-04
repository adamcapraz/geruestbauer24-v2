"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Building2, 
  MessageSquare, 
  Star, 
  Eye, 
  Settings, 
  LogOut,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle,
  Clock
} from "lucide-react"

type Anfrage = {
  id: string
  name: string
  email: string
  telefon: string
  projektbeschreibung: string
  adresse: string
  wunschtermin: string
  status: string
  created_at: string
}

type Firma = {
  id: string
  name: string
  stadt: string
  bewertung: number
  anzahl_bewertungen: number
  geprueft: boolean
  aktiv: boolean
  slug: string
  stadt_slug: string
}

export default function FirmaDashboardPage() {
  const { user, signOut, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [firma, setFirma] = useState<Firma | null>(null)
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/anmelden")
      return
    }

    if (user && user.role !== "owner") {
      router.push("/dashboard")
      return
    }

    if (user) {
      loadData()
    }
  }, [user, authLoading])

  const loadData = async () => {
    // Load firma data linked to user
    const { data: firmaData } = await supabase
      .from("firmen")
      .select("*")
      .eq("email", user?.email)
      .single()

    if (firmaData) {
      setFirma(firmaData)
      
      // Load anfragen for this firma
      const { data: anfragenData } = await supabase
        .from("anfragen")
        .select("*")
        .eq("firma_id", firmaData.id)
        .order("created_at", { ascending: false })
      
      if (anfragenData) {
        setAnfragen(anfragenData)
      }
    }

    setLoading(false)
  }

  const updateAnfrageStatus = async (id: string, status: string) => {
    await supabase
      .from("anfragen")
      .update({ status })
      .eq("id", id)
    
    loadData()
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
            <h1 className="text-2xl font-bold text-foreground">Firmen-Dashboard</h1>
            <p className="text-muted-foreground">
              Willkommen zurück, {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {firma && (
              <Link href={`/geruestbau/${firma.stadt_slug}/${firma.slug}`}>
                <Button variant="outline" className="bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Firmenprofil ansehen
                </Button>
              </Link>
            )}
            <Button variant="outline" onClick={() => signOut()} className="bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>

        {!firma ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Keine Firma verknüpft</h2>
              <p className="text-muted-foreground mb-4">
                Ihr Konto ist noch nicht mit einer Firma verknüpft. 
                Bitte kontaktieren Sie uns, um Ihre Firma zu registrieren.
              </p>
              <Link href="/kontakt">
                <Button>Kontakt aufnehmen</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{anfragen.length}</p>
                      <p className="text-sm text-muted-foreground">Anfragen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Star className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{firma.bewertung || "-"}</p>
                      <p className="text-sm text-muted-foreground">Bewertung</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{firma.anzahl_bewertungen || 0}</p>
                      <p className="text-sm text-muted-foreground">Bewertungen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      {firma.geprueft ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <Clock className="h-6 w-6 text-orange-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {firma.geprueft ? "Geprüft" : "In Prüfung"}
                      </p>
                      <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="anfragen" className="space-y-4">
              <TabsList>
                <TabsTrigger value="anfragen">
                  Anfragen ({anfragen.length})
                </TabsTrigger>
                <TabsTrigger value="profil">Firmenprofil</TabsTrigger>
                <TabsTrigger value="einstellungen">Einstellungen</TabsTrigger>
              </TabsList>

              <TabsContent value="anfragen" className="space-y-4">
                {anfragen.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Keine Anfragen</h3>
                      <p className="text-muted-foreground">
                        Sie haben noch keine Anfragen erhalten.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  anfragen.map((anfrage) => (
                    <Card key={anfrage.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{anfrage.name}</CardTitle>
                            <CardDescription>
                              {new Date(anfrage.created_at).toLocaleDateString("de-DE", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </CardDescription>
                          </div>
                          <Badge variant={
                            anfrage.status === "neu" ? "default" :
                            anfrage.status === "bearbeitet" ? "secondary" :
                            anfrage.status === "abgeschlossen" ? "outline" : "destructive"
                          }>
                            {anfrage.status || "Neu"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${anfrage.email}`} className="text-primary hover:underline">
                              {anfrage.email}
                            </a>
                          </div>
                          {anfrage.telefon && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${anfrage.telefon}`} className="text-primary hover:underline">
                                {anfrage.telefon}
                              </a>
                            </div>
                          )}
                          {anfrage.adresse && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{anfrage.adresse}</span>
                            </div>
                          )}
                          {anfrage.wunschtermin && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{anfrage.wunschtermin}</span>
                            </div>
                          )}
                        </div>

                        {anfrage.projektbeschreibung && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm">{anfrage.projektbeschreibung}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant={anfrage.status === "bearbeitet" ? "secondary" : "default"}
                            onClick={() => updateAnfrageStatus(anfrage.id, "bearbeitet")}
                          >
                            Als bearbeitet markieren
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-transparent"
                            onClick={() => updateAnfrageStatus(anfrage.id, "abgeschlossen")}
                          >
                            Abschließen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="profil">
                <Card>
                  <CardHeader>
                    <CardTitle>Firmenprofil</CardTitle>
                    <CardDescription>
                      Ihre öffentlich sichtbaren Firmendaten
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Firmenname</p>
                        <p className="text-foreground">{firma.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Standort</p>
                        <p className="text-foreground">{firma.stadt}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge variant={firma.aktiv ? "default" : "secondary"}>
                          {firma.aktiv ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Verifizierung</p>
                        <Badge variant={firma.geprueft ? "default" : "outline"}>
                          {firma.geprueft ? "Geprüft" : "Ausstehend"}
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Link href="/kontakt">
                        <Button variant="outline" className="bg-transparent">
                          <Settings className="h-4 w-4 mr-2" />
                          Profil bearbeiten (Kontakt)
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="einstellungen">
                <Card>
                  <CardHeader>
                    <CardTitle>Kontoeinstellungen</CardTitle>
                    <CardDescription>
                      Verwalten Sie Ihre Kontoeinstellungen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">E-Mail</p>
                      <p className="text-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p className="text-foreground">{user?.name}</p>
                    </div>
                    <div className="pt-4 space-y-2">
                      <Button variant="outline" className="bg-transparent">
                        Passwort ändern
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
