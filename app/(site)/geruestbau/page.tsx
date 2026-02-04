"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchBar } from "@/components/search-bar"
import { MapPin, Star, CheckCircle, Building2, Wrench, HardHat, Truck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Firma = {
  id: string
  name: string
  slug: string
  stadt: string
  stadt_slug: string
  bundesland: string
  bewertung: number
  anzahl_bewertungen: number
  geprueft: boolean
  leistungen: string[]
  google_bewertung?: number
  google_anzahl_bewertungen?: number
}

const alleLeistungen = [
  { id: "fassadengeruest", label: "Fassadengerüst", icon: Building2 },
  { id: "industriegeruest", label: "Industriegerüst", icon: Wrench },
  { id: "eventgeruest", label: "Eventgerüst", icon: HardHat },
  { id: "treppenturm", label: "Treppentürme", icon: Truck },
  { id: "haengegeruest", label: "Hängegerüst", icon: Building2 },
  { id: "schutzgeruest", label: "Schutzgerüst", icon: HardHat },
]

function FirmenContent() {
  const [firmen, setFirmen] = useState<Firma[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLeistungen, setSelectedLeistungen] = useState<string[]>([])
  const [nurGeprueft, setNurGeprueft] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClient()

  const stadt = searchParams?.get("stadt") || ""
  const bundesland = searchParams?.get("bundesland") || ""

  useEffect(() => {
    const fetchFirmen = async () => {
      setLoading(true)
      
      let query = supabase
        .from("firmen")
        .select("*")
        .eq("aktiv", true)
        .order("google_bewertung", { ascending: false, nullsFirst: false })

      if (stadt) {
        query = query.ilike("stadt", `%${stadt}%`)
      }

      if (bundesland) {
        query = query.ilike("bundesland", `%${bundesland}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching firmen:", error)
        setFirmen([])
      } else {
        setFirmen(data || [])
      }
      setLoading(false)
    }

    fetchFirmen()
  }, [stadt, bundesland])

  const handleLeistungChange = (leistung: string) => {
    setSelectedLeistungen((prev) => {
      if (prev.includes(leistung)) {
        return prev.filter((l) => l !== leistung)
      }
      return [...prev, leistung]
    })
  }

  const filteredFirmen = firmen.filter((firma) => {
    if (nurGeprueft && !firma.geprueft) return false
    if (selectedLeistungen.length > 0) {
      return selectedLeistungen.some((leistung) =>
        firma.leistungen?.some((l) => l.toLowerCase().includes(leistung.toLowerCase()))
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-slate-900 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white text-center">
            Gerüstbaufirmen in Deutschland
          </h1>
          <p className="text-slate-300 text-center mb-8 max-w-2xl mx-auto">
            Finden Sie den passenden Gerüstbauer für Ihr Projekt
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 shrink-0">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Filter</h3>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="geprueft"
                        checked={nurGeprueft}
                        onCheckedChange={(checked) => setNurGeprueft(checked as boolean)}
                      />
                      <label htmlFor="geprueft" className="text-sm font-medium cursor-pointer">
                        Nur geprüfte Firmen
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Leistungen</h4>
                    <div className="space-y-2">
                      {alleLeistungen.map((leistung) => (
                        <div key={leistung.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={leistung.id}
                            checked={selectedLeistungen.includes(leistung.label)}
                            onCheckedChange={() => handleLeistungChange(leistung.label)}
                          />
                          <label htmlFor={leistung.id} className="text-sm cursor-pointer flex items-center gap-2">
                            <leistung.icon className="h-4 w-4 text-muted-foreground" />
                            {leistung.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Firmen Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {loading ? "Laden..." : `${filteredFirmen.length} Firmen gefunden`}
                </p>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/4 mb-4" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredFirmen.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Keine Firmen gefunden</h3>
                    <p className="text-muted-foreground">
                      Versuchen Sie es mit anderen Filterkriterien.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredFirmen.map((firma) => {
                    const bewertung = firma.google_bewertung || firma.bewertung
                    const anzahlBewertungen = firma.google_anzahl_bewertungen || firma.anzahl_bewertungen
  const firmaUrl = firma.stadt_slug && firma.slug
  ? `/geruestbau/${firma.stadt_slug}/${firma.slug}`
  : `/geruestbau/${firma.id}`
                    
                    return (
                      <Link key={firma.id} href={firmaUrl}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-lg">{firma.name}</h3>
                              {firma.geprueft && (
                                <Badge variant="secondary" className="ml-2 shrink-0 bg-green-100 text-green-700">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Geprüft
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{firma.stadt}, {firma.bundesland}</span>
                            </div>

                            <div className="flex items-center mb-4">
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                              <span className="font-semibold">{bewertung?.toFixed(1) || "–"}</span>
                              <span className="text-muted-foreground text-sm ml-1">
                                ({anzahlBewertungen || 0} Bewertungen)
                              </span>
                            </div>

                            {firma.leistungen && firma.leistungen.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {firma.leistungen.slice(0, 3).map((leistung) => (
                                  <Badge key={leistung} variant="outline" className="text-xs">
                                    {leistung}
                                  </Badge>
                                ))}
                                {firma.leistungen.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{firma.leistungen.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="px-6 pb-6 pt-0">
                            <Button variant="outline" className="w-full bg-transparent">
                              Details ansehen
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function FirmenPage() {
  return (
    <Suspense fallback={null}>
      <FirmenContent />
    </Suspense>
  )
}
