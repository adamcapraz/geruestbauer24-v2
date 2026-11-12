import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type Firma = {
  id: string
  name: string
  slug: string
  stadt: string
  stadt_slug: string
  bundesland: string
  bewertung: number | null
  anzahl_bewertungen: number | null
  geprueft: boolean
  leistungen: string[] | null
  google_bewertung?: number | null
  google_anzahl_bewertungen?: number | null
}

export async function FeaturedProperties() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_random_homepage_firms")

  if (error) {
    console.error("Error fetching featured firms:", error)
  }

  const firmen = error ? [] : ((data ?? []) as unknown as Firma[])

  if (firmen.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Derzeit sind keine Firmen verfügbar.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {firmen.map((firma) => {
        const bewertung = firma.google_bewertung ?? firma.bewertung
        const anzahlBewertungen = firma.google_anzahl_bewertungen ?? firma.anzahl_bewertungen
        const firmaUrl = firma.stadt_slug && firma.slug
          ? `/geruestbau/${firma.stadt_slug}/${firma.slug}`
          : `/geruestbau/${firma.id}`

        return (
          <Link href={firmaUrl} key={firma.id}>
            <Card className="flex h-full cursor-pointer flex-col overflow-hidden border-border transition-shadow hover:shadow-lg">
              <CardContent className="flex-grow p-6">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-bold text-foreground">{firma.name}</h3>
                  {firma.geprueft && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700">
                      <CheckCircle size={12} />
                      Geprüft
                    </Badge>
                  )}
                </div>
                <div className="mb-3 flex items-center text-muted-foreground">
                  <MapPin size={16} className="mr-1" />
                  <span>{firma.stadt}, {firma.bundesland}</span>
                </div>
                <div className="mb-4 flex items-center">
                  <Star size={16} className="mr-1 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-foreground">{bewertung?.toFixed(1) || "–"}</span>
                  <span className="ml-1 text-muted-foreground">({anzahlBewertungen || 0} Bewertungen)</span>
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
                <span className="font-medium text-primary hover:underline">Anfrage senden</span>
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
