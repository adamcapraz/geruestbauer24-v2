"use client"

import React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Globe, BarChart3, Mail, Shield, Megaphone, Code,
  Save, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronRight,
} from "lucide-react"

interface Setting {
  schluessel: string
  wert: string
  beschreibung: string | null
}

interface SettingsGroup {
  title: string
  description: string
  icon: React.ReactNode
  keys: string[]
}

const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: "Allgemeine Website-Einstellungen",
    description: "Titel, Beschreibung und grundlegende Metadaten der Website",
    icon: <Globe className="h-5 w-5" />,
    keys: [
      "site_title",
      "meta_description",
      "og_image_url",
    ],
  },
  {
    title: "SEO & Analytics",
    description: "Tracking-Codes, Suchmaschinen-Verifizierung und Schema.org",
    icon: <BarChart3 className="h-5 w-5" />,
    keys: [
      "google_analytics_id",
      "google_tag_manager_id",
      "google_search_console_verification",
      "bing_webmaster_verification",
      "schema_org_type",
    ],
  },
  {
    title: "Kontakt & Footer",
    description: "Kontaktdaten die auf der Website und im Footer angezeigt werden",
    icon: <Mail className="h-5 w-5" />,
    keys: [
      "contact_email",
      "contact_phone",
      "contact_address",
    ],
  },
  {
    title: "Impressum & Rechtliches",
    description: "Pflichtangaben nach deutschem Recht (TMG, DSGVO)",
    icon: <Shield className="h-5 w-5" />,
    keys: [
      "impressum_firmenname",
      "impressum_adresse",
      "impressum_telefon",
      "impressum_email",
      "impressum_geschaeftsfuehrer",
      "impressum_registergericht",
      "impressum_registernummer",
      "impressum_ust_id",
      "datenschutz_text",
      "cookie_consent_enabled",
      "cookie_consent_text",
      "widerrufsbelehrung_text",
    ],
  },
  {
    title: "Werbung & Einnahmen",
    description: "Google AdSense, gesponserte Firmen und Banner-Werbung",
    icon: <Megaphone className="h-5 w-5" />,
    keys: [
      "google_adsense_id",
      "custom_head_scripts",
      "featured_firma_enabled",
      "featured_firma_id",
      "banner_ads_enabled",
    ],
  },
  {
    title: "Benutzerdefinierte Head-Skripte",
    description: "Eigenen HTML/Script-Code in den <head>-Bereich der Website einbetten (z.B. AdSense, Tracking-Pixel, Verifizierungscodes)",
    icon: <Code className="h-5 w-5" />,
    keys: [
      "custom_head_scripts",
    ],
  },
]

const LABELS: Record<string, string> = {
  site_title: "Website-Titel",
  meta_description: "Meta-Beschreibung",
  og_image_url: "OG-Image URL (Social Media Vorschau)",
  google_analytics_id: "Google Analytics Measurement ID",
  google_tag_manager_id: "Google Tag Manager ID",
  google_search_console_verification: "Google Search Console Verifizierung",
  bing_webmaster_verification: "Bing Webmaster Verifizierung",
  schema_org_type: "Schema.org Typ",
  contact_email: "Kontakt E-Mail",
  contact_phone: "Kontakt Telefon",
  contact_address: "Kontakt Adresse",
  impressum_firmenname: "Firmenname",
  impressum_adresse: "Adresse",
  impressum_telefon: "Telefon",
  impressum_email: "E-Mail",
  impressum_geschaeftsfuehrer: "Geschäftsführer",
  impressum_registergericht: "Registergericht",
  impressum_registernummer: "Registernummer (HRB)",
  impressum_ust_id: "USt-IdNr.",
  datenschutz_text: "Datenschutzerklärung",
  cookie_consent_enabled: "Cookie-Banner aktiviert",
  cookie_consent_text: "Cookie-Banner Text",
  widerrufsbelehrung_text: "Widerrufsbelehrung",
  google_adsense_id: "Google AdSense Publisher ID",
  custom_head_scripts: "Eigene Head-Scripts (HTML-Code f\u00fcr <head>)",
  featured_firma_enabled: "Gesponserte Firmen aktiviert",
  featured_firma_id: "Gesponserte Firma ID",
  banner_ads_enabled: "Banner-Werbung aktiviert",
  custom_head_scripts: "Benutzerdefinierter Head-Code",
}

const PLACEHOLDERS: Record<string, string> = {
  site_title: "Gerüstbauer24 - Gerüstbauer in Deutschland finden",
  meta_description: "Finden Sie qualifizierte Gerüstbauer in Ihrer Nähe...",
  og_image_url: "https://example.com/og-image.jpg",
  google_analytics_id: "G-XXXXXXXXXX",
  google_tag_manager_id: "GTM-XXXXXXX",
  google_search_console_verification: "Verifizierungscode",
  bing_webmaster_verification: "Verifizierungscode",
  schema_org_type: "LocalBusiness",
  contact_email: "info@geruestbauer24.de",
  contact_phone: "+49 123 456789",
  contact_address: "Musterstraße 1, 10115 Berlin",
  impressum_firmenname: "Gerüstbauer24 GmbH",
  impressum_adresse: "Musterstraße 1, 10115 Berlin",
  impressum_telefon: "+49 123 456789",
  impressum_email: "info@geruestbauer24.de",
  impressum_geschaeftsfuehrer: "Max Mustermann",
  impressum_registergericht: "Amtsgericht Berlin-Charlottenburg",
  impressum_registernummer: "HRB 123456",
  impressum_ust_id: "DE123456789",
  google_adsense_id: "ca-pub-XXXXXXXXXX",
  custom_head_scripts: '<script async src="https://example.com/script.js" crossorigin="anonymous"></script>',
  featured_firma_id: "Firma UUID",
  custom_head_scripts: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX" crossorigin="anonymous"></script>',
}

const TEXTAREA_KEYS = ["datenschutz_text", "cookie_consent_text", "widerrufsbelehrung_text", "meta_description", "custom_head_scripts"]
const BOOLEAN_KEYS = ["cookie_consent_enabled", "featured_firma_enabled", "banner_ads_enabled"]

export default function AdminEinstellungen() {
  const supabase = createClient()
  const [settings, setSettings] = useState<Record<string, Setting>>({})
  const [editedValues, setEditedValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Allgemeine Website-Einstellungen": true,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("einstellungen")
      .select("*")
      .order("schluessel")

    if (error) {
      setMessage({ type: "error", text: "Fehler beim Laden der Einstellungen." })
      setLoading(false)
      return
    }

    const settingsMap: Record<string, Setting> = {}
    const valuesMap: Record<string, string> = {}
    for (const s of data || []) {
      settingsMap[s.schluessel] = s
      valuesMap[s.schluessel] = s.wert || ""
    }
    setSettings(settingsMap)
    setEditedValues(valuesMap)
    setLoading(false)
  }

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }))
  }

  const hasChanges = () => {
    for (const key of Object.keys(editedValues)) {
      const original = settings[key]?.wert || ""
      if (editedValues[key] !== original) return true
    }
    return false
  }

  const getChangedKeys = () => {
    const changed: string[] = []
    for (const key of Object.keys(editedValues)) {
      const original = settings[key]?.wert || ""
      if (editedValues[key] !== original) changed.push(key)
    }
    return changed
  }

  const saveSettings = async () => {
    setSaving(true)
    setMessage(null)

    const changedKeys = getChangedKeys()

    if (changedKeys.length === 0) {
      setMessage({ type: "error", text: "Keine Änderungen vorhanden." })
      setSaving(false)
      return
    }

    let hasError = false

    for (const key of changedKeys) {
      const { error } = await supabase
        .from("einstellungen")
        .upsert({
          schluessel: key,
          wert: editedValues[key],
        }, { onConflict: "schluessel" })

      if (error) {
        hasError = true
        break
      }
    }

    if (hasError) {
      setMessage({ type: "error", text: "Fehler beim Speichern. Bitte versuchen Sie es erneut." })
    } else {
      setMessage({ type: "success", text: `${changedKeys.length} Einstellung(en) erfolgreich gespeichert.` })
      await loadSettings()
    }

    setSaving(false)
    setTimeout(() => setMessage(null), 4000)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Einstellungen werden geladen...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Plattform-Einstellungen</h2>
          <p className="text-sm text-muted-foreground">
            Verwalten Sie alle Website-Einstellungen, SEO, rechtliche Angaben und Werbung.
          </p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving || !hasChanges()}
          className="gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Speichern..." : "Änderungen speichern"}
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
          message.type === "success"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Change Indicator */}
      {hasChanges() && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" />
          {getChangedKeys().length} ungespeicherte Änderung(en) vorhanden.
        </div>
      )}

      {/* Settings Groups */}
      {SETTINGS_GROUPS.map((group) => {
        const isExpanded = expandedGroups[group.title] ?? false
        const groupHasChanges = group.keys.some((key) => {
          const original = settings[key]?.wert || ""
          return editedValues[key] !== original
        })

        return (
          <Card key={group.title} className="overflow-hidden">
            <button
              type="button"
              onClick={() => toggleGroup(group.title)}
              className="flex w-full items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {group.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{group.title}</h3>
                    {groupHasChanges && (
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {isExpanded && (
              <CardContent className="border-t pt-5 space-y-5">
                {group.keys.map((key) => {
                  const label = LABELS[key] || key
                  const placeholder = PLACEHOLDERS[key] || ""
                  const description = settings[key]?.beschreibung || ""
                  const value = editedValues[key] ?? ""
                  const isChanged = value !== (settings[key]?.wert || "")

                  if (BOOLEAN_KEYS.includes(key)) {
                    return (
                      <div key={key} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            {label}
                            {isChanged && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                          </Label>
                          {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                          )}
                        </div>
                        <Switch
                          checked={value === "true"}
                          onCheckedChange={(checked) => handleChange(key, checked ? "true" : "false")}
                        />
                      </div>
                    )
                  }

                  if (TEXTAREA_KEYS.includes(key)) {
                    return (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-sm font-medium flex items-center gap-2">
                          {label}
                          {isChanged && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                        </Label>
                        {description && (
                          <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                        <Textarea
                          id={key}
                          value={value}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={placeholder}
                          rows={key === "datenschutz_text" || key === "widerrufsbelehrung_text" ? 8 : key === "custom_head_scripts" ? 6 : 3}
                          className={isChanged ? "border-amber-500/50" : ""}
                        />
                      </div>
                    )
                  }

                  return (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-sm font-medium flex items-center gap-2">
                        {label}
                        {isChanged && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                      </Label>
                      {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                      )}
                      <Input
                        id={key}
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className={isChanged ? "border-amber-500/50" : ""}
                      />
                    </div>
                  )
                })}
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
