"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Star, CheckCircle } from "lucide-react"
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

export function FeaturedProperties() {
  const [firmen, setFirmen] = useState<Firma[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFirmen = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("firmen")
          .select("*")
          .eq("aktiv", true)
          .order("google_bewertung", { ascending: false, nullsFirst: false })
          .limit(6)

        if (error) {
          console.error("Error fetching firmen:", error)
          setFirmen([])
        } else {
          setFirmen(data || [])
        }
      } catch (error) {
        console.error("Error:", error)
        setFirmen([])
      } finally {
        setLoading(false)
      }
    }

    fetchFirmen()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden h-[220px]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (firmen.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Derzeit sind keine Firmen verfügbar.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {firmen.map((firma) => {
        const bewertung = firma.google_bewertung || firma.bewertung
        const anzahlBewertungen = firma.google_anzahl_bewertungen || firma.anzahl_bewertungen
        const firmaUrl = firma.stadt_slug && firma.slug 
          ? `/geruestbau/${firma.stadt_slug}/${firma.slug}` 
          : `/geruestbau/${firma.id}`
        
        return (
          <Link href={firmaUrl} key={firma.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full min-h-[220px] flex flex-col border-border">
              <CardContent className="p-6 flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-foreground">{firma.name}</h3>
                  {firma.geprueft && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700">
                      <CheckCircle size={12} />
                      Geprüft
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-muted-foreground mb-3">
                  <MapPin size={16} className="mr-1" />
                  <span>{firma.stadt}, {firma.bundesland}</span>
                </div>
                <div className="flex items-center mb-4">
                  <Star size={16} className="text-amber-500 mr-1 fill-amber-500" />
                  <span className="font-semibold text-foreground">{bewertung?.toFixed(1) || "–"}</span>
                  <span className="text-muted-foreground ml-1">({anzahlBewertungen || 0} Bewertungen)</span>
                </div>
                {firma.leistungen && firma.leistungen.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {firma.leistungen.slice(0, 3).map((leistung) => (
                      <Badge key={leistung} variant="outline" className="text-xs">
                        {leistung}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <span className="text-primary font-medium hover:underline">
                  Anfrage senden
                </span>
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
