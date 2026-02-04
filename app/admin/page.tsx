"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { createSlug } from "@/lib/utils/slug"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  HelpCircle,
  Mail,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  LayoutDashboard,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Search,
  Download,
  Star,
  Phone,
  Globe,
  RefreshCw,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Firma {
  id: string
  name: string
  stadt: string
  bundesland: string
  plz: string
  telefon: string
  email: string
  webseite: string | null
  beschreibung: string
  leistungen: string[]
  bewertung: number
  anzahl_bewertungen: number
  geprueft: boolean
  aktiv: boolean
  created_at: string
  google_place_id: string | null
  google_bewertung: number | null
  google_anzahl_bewertungen: number | null
  google_telefon: string | null
  google_webseite: string | null
  google_adresse: string | null
  google_oeffnungszeiten: string[] | null
  google_fotos: string[] | null
  google_letzte_aktualisierung: string | null
}

interface FAQ {
  id: string
  frage: string
  antwort: string
  kategorie: string
  reihenfolge: number
  aktiv: boolean
}

interface KontaktNachricht {
  id: string
  name: string
  email: string
  telefon: string | null
  betreff: string
  nachricht: string
  gelesen: boolean
  beantwortet: boolean
  created_at: string
}

interface Anfrage {
  id: string
  firma_id: string
  name: string
  email: string
  telefon: string | null
  nachricht: string
  status: string
  created_at: string
  firma?: Firma
}

interface GooglePlaceSearchResult {
  place_id: string
  name: string
  address: string
  rating: number
  user_ratings_total: number
}

interface GooglePlaceDetails {
  place_id: string
  name: string
  address: string
  postal_code: string
  city: string
  state: string
  phone: string
  website: string
  rating: number
  user_ratings_total: number
  opening_hours: string[]
  photos: string[]
  google_maps_url: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("uebersicht")
  
  // Data states
  const [firmen, setFirmen] = useState<Firma[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [nachrichten, setNachrichten] = useState<KontaktNachricht[]>([])
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  
  // Loading states
  const [firmenLoading, setFirmenLoading] = useState(false)
  const [faqLoading, setFaqLoading] = useState(false)
  const [nachrichtenLoading, setNachrichtenLoading] = useState(false)
  const [anfragenLoading, setAnfragenLoading] = useState(false)
  
  // Dialog states
  const [firmaDialogOpen, setFirmaDialogOpen] = useState(false)
  const [faqDialogOpen, setFaqDialogOpen] = useState(false)
  const [editingFirma, setEditingFirma] = useState<Firma | null>(null)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [nachrichtDetailOpen, setNachrichtDetailOpen] = useState(false)
  const [selectedNachricht, setSelectedNachricht] = useState<KontaktNachricht | null>(null)
  
  // Google Places states
  const [selectedCity, setSelectedCity] = useState("")
  const [googleSearchResults, setGoogleSearchResults] = useState<GooglePlaceSearchResult[]>([])
  const [googleSearchLoading, setGoogleSearchLoading] = useState(false)
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set())
  const [bulkImporting, setBulkImporting] = useState(false)
  const [bulkImportProgress, setBulkImportProgress] = useState({ current: 0, total: 0 })
  const [googleSearchQuery, setGoogleSearchQuery] = useState("")
  
  // German cities list
  const germanCities = [
    "Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main", "Stuttgart", "Düsseldorf", "Leipzig",
    "Dortmund", "Essen", "Bremen", "Dresden", "Hannover", "Nürnberg", "Duisburg", "Bochum",
    "Wuppertal", "Bielefeld", "Bonn", "Münster", "Mannheim", "Karlsruhe", "Augsburg", "Wiesbaden",
    "Mönchengladbach", "Gelsenkirchen", "Aachen", "Braunschweig", "Kiel", "Chemnitz", "Halle",
    "Magdeburg", "Freiburg", "Krefeld", "Mainz", "Lübeck", "Erfurt", "Oberhausen", "Rostock",
    "Kassel", "Hagen", "Potsdam", "Saarbrücken", "Hamm", "Ludwigshafen", "Oldenburg", "Mülheim",
    "Osnabrück", "Leverkusen", "Heidelberg", "Darmstadt", "Solingen", "Regensburg", "Herne",
    "Paderborn", "Neuss", "Ingolstadt", "Offenbach", "Würzburg", "Fürth", "Ulm", "Heilbronn",
    "Pforzheim", "Wolfsburg", "Göttingen", "Bottrop", "Reutlingen", "Koblenz", "Bremerhaven",
    "Erlangen", "Bergisch Gladbach", "Remscheid", "Trier", "Recklinghausen", "Jena", "Moers",
    "Salzgitter", "Siegen", "Gütersloh", "Hildesheim", "Cottbus", "Kaiserslautern", "Witten",
    "Schwerin", "Gera", "Iserlohn", "Zwickau", "Düren", "Esslingen", "Ratingen", "Lünen",
    "Marl", "Velbert", "Ludwigsburg", "Wilhelmshaven", "Minden", "Flensburg", "Dessau"
  ].sort()
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<GooglePlaceDetails | null>(null)
  const [placeDetailsLoading, setPlaceDetailsLoading] = useState(false)
  const [importingPlace, setImportingPlace] = useState(false)
  const [linkToFirmaId, setLinkToFirmaId] = useState<string>("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  
  const router = useRouter()
  
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    checkUser()
  }, [supabase])

  useEffect(() => {
    if (user) {
      loadAllData()
    }
  }, [user])

  const checkUser = async () => {
    if (!supabase) {
      router.push("/admin/login")
      return
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user || user.user_metadata?.is_admin !== true) {
        router.push("/admin/login")
        return
      }
      
      setUser(user)
      setLoading(false)
    } catch {
      router.push("/admin/login")
    }
  }

  const loadAllData = async () => {
    await Promise.all([
      loadFirmen(),
      loadFaqs(),
      loadNachrichten(),
      loadAnfragen(),
    ])
  }

  const loadFirmen = async () => {
    setFirmenLoading(true)
    const { data } = await supabase.from("firmen").select("*").order("created_at", { ascending: false })
    setFirmen(data || [])
    setFirmenLoading(false)
  }

  const loadFaqs = async () => {
    setFaqLoading(true)
    const { data } = await supabase.from("faq").select("*").order("reihenfolge", { ascending: true })
    setFaqs(data || [])
    setFaqLoading(false)
  }

  const loadNachrichten = async () => {
    setNachrichtenLoading(true)
    const { data } = await supabase.from("kontakt_nachrichten").select("*").order("created_at", { ascending: false })
    setNachrichten(data || [])
    setNachrichtenLoading(false)
  }

  const loadAnfragen = async () => {
    setAnfragenLoading(true)
    const { data } = await supabase.from("anfragen").select("*, firma:firmen(name)").order("created_at", { ascending: false })
    setAnfragen(data || [])
    setAnfragenLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  // Firma CRUD
  const saveFirma = async (formData: FormData) => {
    const firmaData = {
      name: formData.get("name") as string,
      stadt: formData.get("stadt") as string,
      bundesland: formData.get("bundesland") as string,
      plz: formData.get("plz") as string || "",
      telefon: formData.get("telefon") as string,
      email: formData.get("email") as string,
      webseite: formData.get("webseite") as string || null,
      beschreibung: formData.get("beschreibung") as string,
      leistungen: (formData.get("leistungen") as string).split(",").map(s => s.trim()),
      geprueft: formData.get("geprueft") === "on",
      aktiv: formData.get("aktiv") === "on",
    }

    if (editingFirma) {
      await supabase.from("firmen").update(firmaData).eq("id", editingFirma.id)
    } else {
      await supabase.from("firmen").insert(firmaData)
    }

    setFirmaDialogOpen(false)
    setEditingFirma(null)
    loadFirmen()
  }

  const deleteFirma = async (id: string) => {
    if (confirm("Firma wirklich löschen?")) {
      await supabase.from("firmen").delete().eq("id", id)
      loadFirmen()
    }
  }

  // FAQ CRUD
  const saveFaq = async (formData: FormData) => {
    const faqData = {
      frage: formData.get("frage") as string,
      antwort: formData.get("antwort") as string,
      kategorie: formData.get("kategorie") as string,
      reihenfolge: parseInt(formData.get("reihenfolge") as string) || 0,
      aktiv: formData.get("aktiv") === "on",
    }

    if (editingFaq) {
      await supabase.from("faq").update(faqData).eq("id", editingFaq.id)
    } else {
      await supabase.from("faq").insert(faqData)
    }

    setFaqDialogOpen(false)
    setEditingFaq(null)
    loadFaqs()
  }

  const deleteFaq = async (id: string) => {
    if (confirm("FAQ wirklich löschen?")) {
      await supabase.from("faq").delete().eq("id", id)
      loadFaqs()
    }
  }

  // Nachricht actions
  const markNachrichtAsRead = async (id: string) => {
    await supabase.from("kontakt_nachrichten").update({ gelesen: true }).eq("id", id)
    loadNachrichten()
  }

  const markNachrichtAsAnswered = async (id: string) => {
    await supabase.from("kontakt_nachrichten").update({ beantwortet: true }).eq("id", id)
    loadNachrichten()
  }

  // Anfrage actions
  const updateAnfrageStatus = async (id: string, status: string) => {
    await supabase.from("anfragen").update({ status }).eq("id", id)
    loadAnfragen()
  }

  // Google Places functions
  const searchGooglePlaces = async () => {
  if (!selectedCity) return
  
  setGoogleSearchLoading(true)
  setGoogleSearchResults([])
  setSelectedPlaceDetails(null)
  setSelectedPlaces(new Set())
  
  const searchQuery = `Gerüstbau ${selectedCity} Deutschland`
  
  try {
  const response = await fetch(`/api/google-places/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
      } else {
        setGoogleSearchResults(data.results || [])
      }
    } catch (error) {
      alert("Fehler bei der Suche")
    } finally {
      setGoogleSearchLoading(false)
    }
  }

  const getPlaceDetails = async (placeId: string) => {
    setPlaceDetailsLoading(true)
    
    try {
      const response = await fetch(`/api/google-places/details?place_id=${placeId}`)
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
      } else {
        setSelectedPlaceDetails(data.result)
      }
    } catch (error) {
      alert("Fehler beim Laden der Details")
    } finally {
      setPlaceDetailsLoading(false)
    }
  }

  const importAsNewFirma = async () => {
    if (!selectedPlaceDetails) return
    
    setImportingPlace(true)
    
    try {
  const stadtName = selectedPlaceDetails.city || ""
  const firmaName = selectedPlaceDetails.name
  
  const firmaData = {
  name: firmaName,
  slug: createSlug(firmaName),
  stadt: stadtName,
  stadt_slug: createSlug(stadtName),
  bundesland: selectedPlaceDetails.state || "",
  plz: selectedPlaceDetails.postal_code || "",
  telefon: selectedPlaceDetails.phone || "",
  email: "",
  webseite: selectedPlaceDetails.website || null,
  beschreibung: `${firmaName} - Gerüstbau in ${stadtName}`,
  leistungen: ["Gerüstbau", "Fassadengerüst", "Baugerüst"],
  bewertung: selectedPlaceDetails.rating || 0,
  anzahl_bewertungen: selectedPlaceDetails.user_ratings_total || 0,
  geprueft: false,
  aktiv: true,
  google_place_id: selectedPlaceDetails.place_id,
  google_bewertung: selectedPlaceDetails.rating,
  google_anzahl_bewertungen: selectedPlaceDetails.user_ratings_total,
  google_telefon: selectedPlaceDetails.phone,
  google_webseite: selectedPlaceDetails.website,
  google_adresse: selectedPlaceDetails.address,
  google_oeffnungszeiten: selectedPlaceDetails.opening_hours,
  google_fotos: selectedPlaceDetails.photos,
  google_letzte_aktualisierung: new Date().toISOString(),
  }

      const { error } = await supabase.from("firmen").insert(firmaData)
      
      if (error) {
        alert("Fehler beim Importieren: " + error.message)
      } else {
        alert("Firma erfolgreich importiert!")
        loadFirmen()
        setSelectedPlaceDetails(null)
        setGoogleSearchResults([])
        setGoogleSearchQuery("")
      }
    } catch (error) {
      alert("Fehler beim Importieren")
    } finally {
      setImportingPlace(false)
    }
  }

  // Toggle place selection for bulk import
  const togglePlaceSelection = (placeId: string) => {
    const newSelected = new Set(selectedPlaces)
    if (newSelected.has(placeId)) {
      newSelected.delete(placeId)
    } else {
      newSelected.add(placeId)
    }
    setSelectedPlaces(newSelected)
  }

  // Select/Deselect all places
  const toggleSelectAll = () => {
    if (selectedPlaces.size === googleSearchResults.length) {
      setSelectedPlaces(new Set())
    } else {
      setSelectedPlaces(new Set(googleSearchResults.map(r => r.place_id)))
    }
  }

  // Bulk import selected places
  const bulkImportPlaces = async () => {
    if (selectedPlaces.size === 0) return
    
    setBulkImporting(true)
    setBulkImportProgress({ current: 0, total: selectedPlaces.size })
    
    const selectedResults = googleSearchResults.filter(r => selectedPlaces.has(r.place_id))
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < selectedResults.length; i++) {
      const result = selectedResults[i]
      setBulkImportProgress({ current: i + 1, total: selectedResults.length })
      
      try {
        // Get place details first
        const detailsResponse = await fetch(`/api/google-places/details?place_id=${result.place_id}`)
        const detailsData = await detailsResponse.json()
        
        if (detailsData.error || !detailsData.result) {
          errorCount++
          continue
        }
        
        const details = detailsData.result
        const stadtName = details.city || selectedCity || ""
        const firmaName = details.name
        
        const firmaData = {
          name: firmaName,
          slug: createSlug(firmaName),
          stadt: stadtName,
          stadt_slug: createSlug(stadtName),
          bundesland: details.state || "",
          plz: details.postal_code || "",
          telefon: details.phone || "",
          email: "",
          webseite: details.website || null,
          beschreibung: `${firmaName} - Gerüstbau in ${stadtName}`,
          leistungen: ["Gerüstbau", "Fassadengerüst", "Baugerüst"],
          bewertung: details.rating || 0,
          anzahl_bewertungen: details.user_ratings_total || 0,
          geprueft: false,
          aktiv: true,
          google_place_id: details.place_id,
          google_bewertung: details.rating,
          google_anzahl_bewertungen: details.user_ratings_total,
          google_telefon: details.phone,
          google_webseite: details.website,
          google_adresse: details.address,
          google_oeffnungszeiten: details.opening_hours,
          google_fotos: details.photos,
          google_letzte_aktualisierung: new Date().toISOString(),
        }
        
        // Check if already exists
        const { data: existing } = await supabase
          .from("firmen")
          .select("id")
          .eq("google_place_id", details.place_id)
          .single()
        
        if (existing) {
          errorCount++ // Already exists
          continue
        }
        
        const { error } = await supabase.from("firmen").insert(firmaData)
        
        if (error) {
          errorCount++
        } else {
          successCount++
        }
      } catch {
        errorCount++
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    setBulkImporting(false)
    setSelectedPlaces(new Set())
    loadFirmen()
    
    alert(`Import abgeschlossen!\n${successCount} Firmen erfolgreich importiert\n${errorCount} Fehler/Duplikate`)
  }

  const linkToExistingFirma = async () => {
    if (!selectedPlaceDetails || !linkToFirmaId) return
    
    setImportingPlace(true)
    
    try {
      const updateData = {
        google_place_id: selectedPlaceDetails.place_id,
        google_bewertung: selectedPlaceDetails.rating,
        google_anzahl_bewertungen: selectedPlaceDetails.user_ratings_total,
        google_telefon: selectedPlaceDetails.phone,
        google_webseite: selectedPlaceDetails.website,
        google_adresse: selectedPlaceDetails.address,
        google_oeffnungszeiten: selectedPlaceDetails.opening_hours,
        google_fotos: selectedPlaceDetails.photos,
        google_letzte_aktualisierung: new Date().toISOString(),
      }

      const { error } = await supabase.from("firmen").update(updateData).eq("id", linkToFirmaId)
      
      if (error) {
        alert("Fehler beim Verknüpfen: " + error.message)
      } else {
        alert("Google Places Daten erfolgreich verknüpft!")
        loadFirmen()
        setSelectedPlaceDetails(null)
        setLinkDialogOpen(false)
        setLinkToFirmaId("")
      }
    } catch (error) {
      alert("Fehler beim Verknüpfen")
    } finally {
      setImportingPlace(false)
    }
  }

  const refreshGoogleData = async (firma: Firma) => {
    if (!firma.google_place_id) return
    
    try {
      const response = await fetch(`/api/google-places/details?place_id=${firma.google_place_id}`)
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        return
      }
      
      const details = data.result
      const updateData = {
        google_bewertung: details.rating,
        google_anzahl_bewertungen: details.user_ratings_total,
        google_telefon: details.phone,
        google_webseite: details.website,
        google_adresse: details.address,
        google_oeffnungszeiten: details.opening_hours,
        google_fotos: details.photos,
        google_letzte_aktualisierung: new Date().toISOString(),
      }

      await supabase.from("firmen").update(updateData).eq("id", firma.id)
      alert("Google Daten aktualisiert!")
      loadFirmen()
    } catch (error) {
      alert("Fehler beim Aktualisieren")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = {
    firmen: firmen.length,
    firmenAktiv: firmen.filter(f => f.aktiv).length,
    firmenMitGoogle: firmen.filter(f => f.google_place_id).length,
    faqs: faqs.length,
    nachrichtenUngelesen: nachrichten.filter(n => !n.gelesen).length,
    anfragenNeu: anfragen.filter(a => a.status === "neu").length,
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">Gerüstbauer24 Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:text-white hover:bg-slate-800">
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="uebersicht" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="firmen" className="gap-2">
              <Building2 className="h-4 w-4" />
              Firmen
            </TabsTrigger>
            <TabsTrigger value="google-places" className="gap-2">
              <MapPin className="h-4 w-4" />
              Google Places
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="nachrichten" className="gap-2">
              <Mail className="h-4 w-4" />
              Nachrichten
              {stats.nachrichtenUngelesen > 0 && (
                <Badge variant="destructive" className="ml-1">{stats.nachrichtenUngelesen}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="anfragen" className="gap-2">
              <FileText className="h-4 w-4" />
              Anfragen
              {stats.anfragenNeu > 0 && (
                <Badge variant="destructive" className="ml-1">{stats.anfragenNeu}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="einstellungen" className="gap-2">
              <Settings className="h-4 w-4" />
              Einstellungen
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="uebersicht">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Firmen gesamt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.firmen}</div>
                  <p className="text-sm text-muted-foreground">{stats.firmenAktiv} aktiv</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Mit Google Places</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.firmenMitGoogle}</div>
                  <p className="text-sm text-muted-foreground">verknüpft</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">FAQ Einträge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.faqs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ungelesene Nachrichten</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{stats.nachrichtenUngelesen}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Neue Anfragen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.anfragenNeu}</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Neueste Nachrichten</CardTitle>
                </CardHeader>
                <CardContent>
                  {nachrichten.slice(0, 5).map((n) => (
                    <div key={n.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{n.name}</p>
                        <p className="text-sm text-muted-foreground">{n.betreff}</p>
                      </div>
                      {!n.gelesen && <Badge variant="secondary">Neu</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Neueste Anfragen</CardTitle>
                </CardHeader>
                <CardContent>
                  {anfragen.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-sm text-muted-foreground">{(a.firma as unknown as { name: string })?.name}</p>
                      </div>
                      <Badge variant={a.status === "neu" ? "default" : "secondary"}>{a.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Firmen Tab */}
          <TabsContent value="firmen">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Firmen verwalten</CardTitle>
                  <CardDescription>Alle Gerüstbaufirmen im System</CardDescription>
                </div>
                <Dialog open={firmaDialogOpen} onOpenChange={setFirmaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingFirma(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Neue Firma
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingFirma ? "Firma bearbeiten" : "Neue Firma anlegen"}</DialogTitle>
                    </DialogHeader>
                    <form action={saveFirma} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Firmenname</Label>
                          <Input id="name" name="name" defaultValue={editingFirma?.name} required />
                        </div>
                        <div>
                          <Label htmlFor="email">E-Mail</Label>
                          <Input id="email" name="email" type="email" defaultValue={editingFirma?.email} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="plz">PLZ</Label>
                          <Input id="plz" name="plz" defaultValue={editingFirma?.plz} />
                        </div>
                        <div>
                          <Label htmlFor="stadt">Stadt</Label>
                          <Input id="stadt" name="stadt" defaultValue={editingFirma?.stadt} required />
                        </div>
                        <div>
                          <Label htmlFor="bundesland">Bundesland</Label>
                          <Input id="bundesland" name="bundesland" defaultValue={editingFirma?.bundesland} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="telefon">Telefon</Label>
                          <Input id="telefon" name="telefon" defaultValue={editingFirma?.telefon} required />
                        </div>
                        <div>
                          <Label htmlFor="webseite">Webseite</Label>
                          <Input id="webseite" name="webseite" defaultValue={editingFirma?.webseite || ""} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="beschreibung">Beschreibung</Label>
                        <Textarea id="beschreibung" name="beschreibung" defaultValue={editingFirma?.beschreibung} required />
                      </div>
                      <div>
                        <Label htmlFor="leistungen">Leistungen (kommagetrennt)</Label>
                        <Input id="leistungen" name="leistungen" defaultValue={editingFirma?.leistungen?.join(", ")} />
                      </div>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <Switch id="geprueft" name="geprueft" defaultChecked={editingFirma?.geprueft} />
                          <Label htmlFor="geprueft">Geprüft</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="aktiv" name="aktiv" defaultChecked={editingFirma?.aktiv ?? true} />
                          <Label htmlFor="aktiv">Aktiv</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Speichern</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Ort</TableHead>
                      <TableHead>Bewertung</TableHead>
                      <TableHead>Google</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firmen.map((firma) => (
                      <TableRow key={firma.id}>
                        <TableCell className="font-medium">{firma.name}</TableCell>
                        <TableCell>{firma.plz} {firma.stadt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span>{firma.google_bewertung || firma.bewertung || "-"}</span>
                            <span className="text-muted-foreground text-xs">
                              ({firma.google_anzahl_bewertungen || firma.anzahl_bewertungen || 0})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {firma.google_place_id ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verknüpft
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => refreshGoogleData(firma)}
                                title="Google Daten aktualisieren"
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-slate-400">
                              Nicht verknüpft
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {firma.aktiv ? (
                              <Badge variant="default">Aktiv</Badge>
                            ) : (
                              <Badge variant="secondary">Inaktiv</Badge>
                            )}
                            {firma.geprueft && (
                              <Badge variant="outline" className="text-green-600">Geprüft</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingFirma(firma)
                                setFirmaDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFirma(firma.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Places Tab */}
          <TabsContent value="google-places">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Google Places Suche
                  </CardTitle>
                  <CardDescription>
                    Suchen Sie nach Gerüstbaufirmen und importieren Sie deren Daten
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Stadt auswählen</Label>
                    <div className="flex gap-2">
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Stadt wählen..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {germanCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={searchGooglePlaces} disabled={googleSearchLoading || !selectedCity}>
                        {googleSearchLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">Suchen</span>
                      </Button>
                    </div>
                    {selectedCity && (
                      <p className="text-sm text-muted-foreground">
                        Suche nach: Gerüstbau in {selectedCity}
                      </p>
                    )}
                  </div>

                  {/* Bulk Actions */}
                  {googleSearchResults.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPlaces.size === googleSearchResults.length && googleSearchResults.length > 0}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        <span className="text-sm font-medium">
                          {selectedPlaces.size > 0 
                            ? `${selectedPlaces.size} von ${googleSearchResults.length} ausgewählt`
                            : "Alle auswählen"
                          }
                        </span>
                      </div>
                      {selectedPlaces.size > 0 && (
                        <Button 
                          onClick={bulkImportPlaces} 
                          disabled={bulkImporting}
                          size="sm"
                        >
                          {bulkImporting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {bulkImportProgress.current}/{bulkImportProgress.total}
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              {selectedPlaces.size} Firmen importieren
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Search Results */}
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {googleSearchResults.map((result) => (
                      <div
                        key={result.place_id}
                        className={`p-3 border rounded-lg hover:bg-slate-50 transition-colors ${
                          selectedPlaces.has(result.place_id) ? "bg-primary/5 border-primary" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedPlaces.has(result.place_id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              togglePlaceSelection(result.place_id)
                            }}
                            className="h-4 w-4 mt-1 rounded border-slate-300"
                          />
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => getPlaceDetails(result.place_id)}
                          >
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-muted-foreground">{result.address}</div>
                            {result.rating && (
                              <div className="flex items-center gap-1 mt-1 text-sm">
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                <span className="font-medium">{result.rating}</span>
                                <span className="text-muted-foreground">
                                  ({result.user_ratings_total} Bewertungen)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {googleSearchResults.length === 0 && selectedCity && !googleSearchLoading && (
                      <p className="text-center text-muted-foreground py-4">
                        Keine Ergebnisse gefunden
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Details Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Firma Details</CardTitle>
                  <CardDescription>
                    {selectedPlaceDetails ? "Details der ausgewählten Firma" : "Wählen Sie eine Firma aus der Suche"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {placeDetailsLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                  
                  {selectedPlaceDetails && !placeDetailsLoading && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">{selectedPlaceDetails.name}</h3>
                        <p className="text-muted-foreground">{selectedPlaceDetails.address}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">{selectedPlaceDetails.rating || "-"}</span>
                          <span className="text-muted-foreground">
                            ({selectedPlaceDetails.user_ratings_total || 0} Bewertungen)
                          </span>
                        </div>
                        {selectedPlaceDetails.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-500" />
                            <span>{selectedPlaceDetails.phone}</span>
                          </div>
                        )}
                        {selectedPlaceDetails.website && (
                          <div className="flex items-center gap-2 col-span-2">
                            <Globe className="h-4 w-4 text-slate-500" />
                            <a href={selectedPlaceDetails.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                              {selectedPlaceDetails.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {selectedPlaceDetails.opening_hours.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Öffnungszeiten</h4>
                          <div className="text-sm space-y-1">
                            {selectedPlaceDetails.opening_hours.map((hour, i) => (
                              <p key={i} className="text-muted-foreground">{hour}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedPlaceDetails.photos.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Fotos</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedPlaceDetails.photos.slice(0, 3).map((photo, i) => (
                              <img
                                key={i}
                                src={photo || "/placeholder.svg"}
                                alt={`Foto ${i + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t">
                        <Button onClick={importAsNewFirma} disabled={importingPlace} className="flex-1">
                          {importingPlace ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Als neue Firma importieren
                        </Button>
                        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              Mit Firma verknüpfen
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Mit bestehender Firma verknüpfen</DialogTitle>
                              <DialogDescription>
                                Wählen Sie eine Firma aus, mit der die Google Places Daten verknüpft werden sollen.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Label htmlFor="firma-select">Firma auswählen</Label>
                              <Select value={linkToFirmaId} onValueChange={setLinkToFirmaId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Firma auswählen..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {firmen.filter(f => !f.google_place_id).map((firma) => (
                                    <SelectItem key={firma.id} value={firma.id}>
                                      {firma.name} - {firma.stadt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                                Abbrechen
                              </Button>
                              <Button onClick={linkToExistingFirma} disabled={!linkToFirmaId || importingPlace}>
                                {importingPlace ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : null}
                                Verknüpfen
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}

                  {!selectedPlaceDetails && !placeDetailsLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Suchen Sie nach einer Firma und klicken Sie auf ein Ergebnis, um Details anzuzeigen.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Linked Firms List */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Verknüpfte Firmen</CardTitle>
                <CardDescription>
                  Firmen mit Google Places Daten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firma</TableHead>
                      <TableHead>Google Bewertung</TableHead>
                      <TableHead>Google Telefon</TableHead>
                      <TableHead>Letzte Aktualisierung</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firmen.filter(f => f.google_place_id).map((firma) => (
                      <TableRow key={firma.id}>
                        <TableCell>
                          <div className="font-medium">{firma.name}</div>
                          <div className="text-sm text-muted-foreground">{firma.stadt}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span>{firma.google_bewertung || "-"}</span>
                            <span className="text-muted-foreground text-xs">
                              ({firma.google_anzahl_bewertungen || 0})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{firma.google_telefon || "-"}</TableCell>
                        <TableCell>
                          {firma.google_letzte_aktualisierung
                            ? new Date(firma.google_letzte_aktualisierung).toLocaleDateString("de-DE")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refreshGoogleData(firma)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Aktualisieren
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {firmen.filter(f => f.google_place_id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Noch keine Firmen mit Google Places verknüpft
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>FAQ verwalten</CardTitle>
                  <CardDescription>Häufig gestellte Fragen bearbeiten</CardDescription>
                </div>
                <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingFaq(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Neue FAQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingFaq ? "FAQ bearbeiten" : "Neue FAQ anlegen"}</DialogTitle>
                    </DialogHeader>
                    <form action={saveFaq} className="space-y-4">
                      <div>
                        <Label htmlFor="frage">Frage</Label>
                        <Input id="frage" name="frage" defaultValue={editingFaq?.frage} required />
                      </div>
                      <div>
                        <Label htmlFor="antwort">Antwort</Label>
                        <Textarea id="antwort" name="antwort" defaultValue={editingFaq?.antwort} required rows={4} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="kategorie">Kategorie</Label>
                          <Select name="kategorie" defaultValue={editingFaq?.kategorie || "Allgemein"}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Allgemein">Allgemein</SelectItem>
                              <SelectItem value="Für Kunden">Für Kunden</SelectItem>
                              <SelectItem value="Für Unternehmen">Für Unternehmen</SelectItem>
                              <SelectItem value="Gerüstbau">Gerüstbau</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="reihenfolge">Reihenfolge</Label>
                          <Input id="reihenfolge" name="reihenfolge" type="number" defaultValue={editingFaq?.reihenfolge || 0} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="aktiv" name="aktiv" defaultChecked={editingFaq?.aktiv ?? true} />
                        <Label htmlFor="aktiv">Aktiv</Label>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Speichern</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reihenfolge</TableHead>
                      <TableHead>Frage</TableHead>
                      <TableHead>Kategorie</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell>{faq.reihenfolge}</TableCell>
                        <TableCell className="max-w-md truncate">{faq.frage}</TableCell>
                        <TableCell><Badge variant="outline">{faq.kategorie}</Badge></TableCell>
                        <TableCell>
                          {faq.aktiv ? (
                            <Badge variant="default">Aktiv</Badge>
                          ) : (
                            <Badge variant="secondary">Inaktiv</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingFaq(faq)
                                setFaqDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFaq(faq.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nachrichten Tab */}
          <TabsContent value="nachrichten">
            <Card>
              <CardHeader>
                <CardTitle>Kontakt Nachrichten</CardTitle>
                <CardDescription>Eingegangene Nachrichten vom Kontaktformular</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Betreff</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nachrichten.map((nachricht) => (
                      <TableRow key={nachricht.id} className={!nachricht.gelesen ? "bg-slate-50" : ""}>
                        <TableCell>{new Date(nachricht.created_at).toLocaleDateString("de-DE")}</TableCell>
                        <TableCell>
                          <div className="font-medium">{nachricht.name}</div>
                          <div className="text-sm text-muted-foreground">{nachricht.email}</div>
                        </TableCell>
                        <TableCell>{nachricht.betreff}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {!nachricht.gelesen && <Badge variant="secondary">Ungelesen</Badge>}
                            {nachricht.beantwortet && <Badge variant="outline" className="text-green-600">Beantwortet</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedNachricht(nachricht)
                                    markNachrichtAsRead(nachricht.id)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{nachricht.betreff}</DialogTitle>
                                  <DialogDescription>
                                    Von: {nachricht.name} ({nachricht.email})
                                    {nachricht.telefon && ` | Tel: ${nachricht.telefon}`}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="whitespace-pre-wrap">{nachricht.nachricht}</p>
                                </div>
                                <DialogFooter>
                                  {!nachricht.beantwortet && (
                                    <Button onClick={() => markNachrichtAsAnswered(nachricht.id)}>
                                      Als beantwortet markieren
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anfragen Tab */}
          <TabsContent value="anfragen">
            <Card>
              <CardHeader>
                <CardTitle>Firmen Anfragen</CardTitle>
                <CardDescription>Anfragen an Gerüstbaufirmen</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Firma</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anfragen.map((anfrage) => (
                      <TableRow key={anfrage.id}>
                        <TableCell>{new Date(anfrage.created_at).toLocaleDateString("de-DE")}</TableCell>
                        <TableCell>
                          <div className="font-medium">{anfrage.name}</div>
                          <div className="text-sm text-muted-foreground">{anfrage.email}</div>
                        </TableCell>
                        <TableCell>{(anfrage.firma as unknown as { name: string })?.name || "-"}</TableCell>
                        <TableCell>
                          <Select
                            value={anfrage.status}
                            onValueChange={(value) => updateAnfrageStatus(anfrage.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="neu">Neu</SelectItem>
                              <SelectItem value="in_bearbeitung">In Bearbeitung</SelectItem>
                              <SelectItem value="abgeschlossen">Abgeschlossen</SelectItem>
                              <SelectItem value="abgelehnt">Abgelehnt</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Anfrage Details</DialogTitle>
                                <DialogDescription>
                                  Von: {anfrage.name} ({anfrage.email})
                                  {anfrage.telefon && ` | Tel: ${anfrage.telefon}`}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="whitespace-pre-wrap">{anfrage.nachricht}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Einstellungen Tab */}
          <TabsContent value="einstellungen">
            <Card>
              <CardHeader>
                <CardTitle>Einstellungen</CardTitle>
                <CardDescription>Allgemeine Plattform-Einstellungen</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Einstellungen werden in einer zukünftigen Version verfügbar sein.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
