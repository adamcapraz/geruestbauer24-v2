"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Search, MapPin } from "lucide-react"

const bundeslaender = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
]

export function SearchBar() {
  const router = useRouter()
  const [stadt, setStadt] = useState("")
  const [bundesland, setBundesland] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (stadt) params.append("stadt", stadt)
    if (bundesland) params.append("bundesland", bundesland)

    router.push(`/geruestbau?${params.toString()}`)
  }

  return (
    <Card className="p-6 shadow-lg max-w-4xl mx-auto border-0 bg-card">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Stadt oder PLZ eingeben"
            value={stadt}
            onChange={(e) => setStadt(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        <div className="w-full md:w-56">
          <Select value={bundesland} onValueChange={setBundesland}>
            <SelectTrigger>
              <SelectValue placeholder="Bundesland wählen" />
            </SelectTrigger>
            <SelectContent>
              {bundeslaender.map((land) => (
                <SelectItem key={land} value={land.toLowerCase().replace(/\s+/g, "-")}>
                  {land}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Suchen
        </Button>
      </form>
    </Card>
  )
}
