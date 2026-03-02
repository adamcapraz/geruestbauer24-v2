"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  MapPin, 
  Star, 
  CheckCircle, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Building2,
  Award,
  Send,
  ExternalLink,
  ArrowLeft,
  Shield,
  ThumbsUp,
  Wrench
} from "lucide-react"

type Firma = {
  id: string
  name: string
  slug: string
  stadt_slug: string
  beschreibung: string
  stadt: string
  bundesland: string
  plz: string
  telefon: string
  email: string
  webseite: string | null
  bewertung: number
  anzahl_bewertungen: number
  geprueft: boolean
  aktiv: boolean
  leistungen: string[]
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

export default function FirmaDetailClient() {
  const [firma, setFirma] = useState<Firma | null>(null)
  const [loading, setLoading] = useState(true)
  const [anfrageName, setAnfrageName] = useState("")
  const [anfrageEmail, setAnfrageEmail] = useState("")
  const [anfrageTelefon, setAnfrageTelefon] = useState("")
  const [anfrageNachricht, setAnfrageNachricht] = useState("")
  const [sendingAnfrage, setSendingAnfrage] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const stadtSlug = params?.stadt as string
  const firmaSlug = params?.firma as string

  useEffect(() => {
    const fetchFirma = async () => {
      const { data, error } = await supabase
        .from("firmen")
        .select("*")
        .eq("stadt_slug", stadtSlug)
        .eq("slug", firmaSlug)
        .eq("aktiv", true)
        .single()

      if (error || !data) {
        setFirma(null)
      } else {
        setFirma(data)
      }
      setLoading(false)
    }

    if (stadtSlug && firmaSlug) {
      fetchFirma()
    }
  }, [stadtSlug, firmaSlug])

  const handleAnfrageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!anfrageName || !anfrageEmail || !anfrageNachricht) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      })
      return
    }

    setSendingAnfrage(true)
    
    const { error } = await supabase.from("anfragen").insert({
      firma_id: firma?.id,
      name: anfrageName,
      email: anfrageEmail,
      telefon: anfrageTelefon || null,
      nachricht: anfrageNachricht,
      status: "neu",
    })

    if (error) {
      toast({
        title: "Fehler",
        description: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Anfrage gesendet",
        description: "Ihre Anfrage wurde erfolgreich an die Firma übermittelt. Sie erhalten in Kürze eine Antwort.",
      })
      
      setAnfrageName("")
      setAnfrageEmail("")
      setAnfrageTelefon("")
      setAnfrageNachricht("")
    }
    
    setSendingAnfrage(false)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}
          />
        ))}
      </div>
    )
  }

  const displayRating = firma?.google_bewertung || firma?.bewertung || 0
  const displayReviewCount = firma?.google_anzahl_bewertungen || firma?.anzahl_bewertungen || 0
  const displayPhone = firma?.google_telefon || firma?.telefon
  const displayWebsite = firma?.google_webseite || firma?.webseite
  const displayAddress = firma?.google_adresse || `${firma?.plz} ${firma?.stadt}, ${firma?.bundesland}`
  const displayOpeningHours = firma?.google_oeffnungszeiten || []
  const displayPhotos = firma?.google_fotos || []

  const faqItems = firma ? [
    {
      question: `Was sind die Leistungen von ${firma.name}?`,
      answer: `${firma.name} bietet professionelle Gerüstbau-Dienstleistungen in ${firma.stadt} und Umgebung an. Zu den Leistungen gehören ${firma.leistungen?.slice(0, 3).join(", ") || "Fassadengerüst, Baugerüst, Industriegerüst"}. Kontaktieren Sie ${firma.name} direkt für ein individuelles Angebot.`
    },
    {
      question: `Wie erreiche ich ${firma.name}?`,
      answer: `Sie können ${firma.name} telefonisch unter ${displayPhone || "der angegebenen Nummer"} erreichen oder über das Kontaktformular auf dieser Seite eine unverbindliche Anfrage stellen. ${firma.name} ist in ${firma.stadt} ansässig und bedient auch die umliegende Region.`
    },
    {
      question: `Wie sind die Bewertungen von ${firma.name}?`,
      answer: `${firma.name} hat eine Bewertung von ${displayRating.toFixed(1)} von 5 Sternen bei ${displayReviewCount} Bewertungen. Diese Bewertungen stammen von Kunden, die bereits Erfahrungen mit ${firma.name} gemacht haben.`
    }
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-slate-900 py-8 px-4">
          <div className="container mx-auto">
            <Skeleton className="h-10 w-3/4 bg-slate-700" />
            <Skeleton className="h-6 w-1/2 mt-4 bg-slate-700" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!firma) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4 text-foreground">Firma nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Die gesuchte Firma existiert nicht oder wurde entfernt.</p>
          <Button onClick={() => router.push("/geruestbau")}>Zurück zur Übersicht</Button>
        </div>
      </div>
    )
  }

  // Generate JSON-LD structured data for rich search results
  const generateJsonLd = () => {
    if (!firma) return null

    const localBusiness = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": firma.name,
      "description": firma.beschreibung || `${firma.name} - Professioneller Gerüstbauer in ${firma.stadt}`,
      "url": `https://geruestbauer24.eu/geruestbau/${firma.stadt_slug}/${firma.slug}`,
      "telephone": displayPhone || undefined,
      "email": firma.email || undefined,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": firma.google_adresse || undefined,
        "addressLocality": firma.stadt,
        "addressRegion": firma.bundesland,
        "postalCode": firma.plz || undefined,
        "addressCountry": "DE"
      },
      ...(displayWebsite ? { "sameAs": [displayWebsite.startsWith("http") ? displayWebsite : `https://${displayWebsite}`] } : {}),
      ...(displayRating > 0 && displayReviewCount > 0 ? {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": displayRating.toFixed(1),
          "reviewCount": displayReviewCount,
          "bestRating": "5",
          "worstRating": "1"
        }
      } : {}),
      "image": displayPhotos.length > 0 ? displayPhotos[0] : "https://geruestbauer24.eu/placeholder-logo.png",
      "priceRange": "$$",
      "areaServed": {
        "@type": "City",
        "name": firma.stadt
      },
      ...(displayOpeningHours.length > 0 ? { "openingHours": displayOpeningHours } : {})
    }

    const faqSchema = faqItems.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    } : null

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://geruestbauer24.eu" },
        { "@type": "ListItem", "position": 2, "name": "Gerüstbau", "item": "https://geruestbauer24.eu/geruestbau" },
        { "@type": "ListItem", "position": 3, "name": `Gerüstbauer in ${firma.stadt}`, "item": `https://geruestbauer24.eu/geruestbau/${firma.stadt_slug}` },
        { "@type": "ListItem", "position": 4, "name": firma.name, "item": `https://geruestbauer24.eu/geruestbau/${firma.stadt_slug}/${firma.slug}` }
      ]
    }

    return { localBusiness, faqSchema, breadcrumb }
  }

  const jsonLd = generateJsonLd()

  // Add JSON-LD scripts dynamically on client side
  useEffect(() => {
    if (!jsonLd) return
    
    const addScript = (data: object, id: string) => {
      const existingScript = document.getElementById(id)
      if (existingScript) existingScript.remove()
      
      const script = document.createElement("script")
      script.id = id
      script.type = "application/ld+json"
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    }
    
    addScript(jsonLd.localBusiness, "jsonld-local-business")
    addScript(jsonLd.breadcrumb, "jsonld-breadcrumb")
    if (jsonLd.faqSchema) {
      addScript(jsonLd.faqSchema, "jsonld-faq")
    }
    
    return () => {
      document.getElementById("jsonld-local-business")?.remove()
      document.getElementById("jsonld-breadcrumb")?.remove()
      document.getElementById("jsonld-faq")?.remove()
    }
  }, [jsonLd])

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <section className="bg-slate-900 py-8 px-4">
        <div className="container mx-auto">
          <Link 
            href={`/geruestbau/${firma.stadt_slug}`}
            className="inline-flex items-center text-slate-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Alle Gerüstbauer in {firma.stadt}
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {firma.name} | Gerüstbauer in {firma.stadt}
                </h1>
              </div>
              <div className="flex items-center gap-3 flex-wrap mb-3">
                {firma.geprueft && (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle size={14} className="mr-1" />
                    Geprüft
                  </Badge>
                )}
                {firma.google_place_id && (
                  <Badge variant="outline" className="border-blue-400 text-blue-400">
                    Google verifiziert
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-slate-300 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{firma.stadt}, {firma.bundesland}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="text-white font-semibold">{displayRating.toFixed(1)}</span>
                  <span>({displayReviewCount} Bewertungen)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Photos Gallery */}
      {displayPhotos.length > 0 && (
        <section className="bg-slate-100 py-4">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {displayPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo || "/placeholder.svg"}
                  alt={`${firma.name} Foto ${index + 1}`}
                  className="h-32 w-48 object-cover rounded-lg flex-shrink-0"
                  crossOrigin="anonymous"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Introduction Section - SEO optimized */}
            <Card>
              <CardHeader>
                <CardTitle>Über {firma.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>{firma.name}</strong> ist ein erfahrener Gerüstbauer in {firma.stadt} und bietet 
                  professionelle Gerüstbau-Dienstleistungen für private und gewerbliche Kunden an. 
                  Als etabliertes Unternehmen in {firma.stadt} und Umgebung steht {firma.name} für 
                  Qualität, Zuverlässigkeit und fachgerechte Ausführung aller Gerüstarbeiten.
                </p>
                {firma.beschreibung && (
                  <p className="text-muted-foreground whitespace-pre-line">{firma.beschreibung}</p>
                )}
              </CardContent>
            </Card>

            {/* Leistungen Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Unsere Leistungen in {firma.stadt}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {firma.name} bietet ein breites Spektrum an Gerüstbau-Dienstleistungen in {firma.stadt} an:
                </p>
                {firma.leistungen && firma.leistungen.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {firma.leistungen.map((leistung) => (
                      <div key={leistung} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-foreground">{leistung}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Fassadengerüst", "Baugerüst", "Industriegerüst", "Schutzgerüst", "Hängegerüst", "Treppentürme"].map((leistung) => (
                      <div key={leistung} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-foreground">{leistung}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Warum wählen Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                  Warum {firma.name} wählen?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Erfahrung</h4>
                    <p className="text-sm text-muted-foreground">Langjährige Erfahrung im Gerüstbau</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Qualität</h4>
                    <p className="text-sm text-muted-foreground">{displayRating.toFixed(1)} Sterne bei {displayReviewCount} Bewertungen</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Regional</h4>
                    <p className="text-sm text-muted-foreground">Ansässig in {firma.stadt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Öffnungszeiten */}
            {displayOpeningHours.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Öffnungszeiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {displayOpeningHours.map((hour, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-foreground">{hour}</span>
                      </div>
                    ))}
                    {firma.google_place_id && (
                      <p className="text-xs text-muted-foreground mt-4">
                        Daten von Google Places
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Häufig gestellte Fragen zu {firma.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-sm">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Google Data Badge */}
            {firma.google_place_id && firma.google_letzte_aktualisierung && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Google Places
                </Badge>
                <span>
                  Zuletzt aktualisiert: {new Date(firma.google_letzte_aktualisierung).toLocaleDateString("de-DE")}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Kontakt & Servicegebiet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">{displayAddress}</p>
                  </div>
                </div>
                {displayPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <a href={`tel:${displayPhone}`} className="font-medium hover:text-primary">
                        {displayPhone}
                      </a>
                    </div>
                  </div>
                )}
                {firma.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">E-Mail</p>
                      <a href={`mailto:${firma.email}`} className="font-medium hover:text-primary">
                        {firma.email}
                      </a>
                    </div>
                  </div>
                )}
                {displayWebsite && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Webseite</p>
                      <a 
                        href={displayWebsite.startsWith("http") ? displayWebsite : `https://${displayWebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary flex items-center gap-1"
                      >
                        Webseite besuchen
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Servicegebiet</p>
                  <p className="font-medium">{firma.stadt} und Umgebung</p>
                </div>
              </CardContent>
            </Card>

            {/* Anfrage Form */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Unverbindliche Anfrage an {firma.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnfrageSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Ihr Name"
                      value={anfrageName}
                      onChange={(e) => setAnfrageName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ihre@email.de"
                      value={anfrageEmail}
                      onChange={(e) => setAnfrageEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefon">Telefon</Label>
                    <Input
                      id="telefon"
                      type="tel"
                      placeholder="+49 123 456789"
                      value={anfrageTelefon}
                      onChange={(e) => setAnfrageTelefon(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nachricht">Nachricht *</Label>
                    <Textarea
                      id="nachricht"
                      placeholder="Beschreiben Sie Ihr Gerüstbau-Projekt..."
                      rows={4}
                      value={anfrageNachricht}
                      onChange={(e) => setAnfrageNachricht(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={sendingAnfrage}>
                    {sendingAnfrage ? (
                      "Wird gesendet..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Anfrage senden
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Ihre Daten werden nur zur Bearbeitung Ihrer Anfrage verwendet.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-10 px-4 bg-primary mt-8">
        <div className="container mx-auto text-center">
          <h2 className="text-xl font-bold mb-3 text-primary-foreground">
            Jetzt Kontakt zu {firma.name} aufnehmen
          </h2>
          <p className="text-primary-foreground/80 mb-5 max-w-xl mx-auto">
            Fordern Sie ein unverbindliches Angebot für Ihr Gerüstbau-Projekt in {firma.stadt} an.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {displayPhone && (
              <a href={`tel:${displayPhone}`}>
                <Button size="lg" variant="secondary">
                  <Phone className="h-4 w-4 mr-2" />
                  Jetzt anrufen
                </Button>
              </a>
            )}
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => document.getElementById('nachricht')?.focus()}
            >
              Anfrage stellen
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
