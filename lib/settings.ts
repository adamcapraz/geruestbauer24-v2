import { createClient } from "@/lib/supabase/server"

export interface SiteSettings {
  [key: string]: string
}

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

/**
 * Fetches all settings from the einstellungen table.
 * Server-side only - uses the Supabase server client.
 */
export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return getDefaultSettings()
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("einstellungen")
      .select("schluessel, wert")

    if (error || !data) {
      return getDefaultSettings()
    }

    const settings: SiteSettings = getDefaultSettings()
    for (const row of data) {
      settings[row.schluessel] = row.wert
    }
    return settings
  } catch {
    return getDefaultSettings()
  }
}

/**
 * Fetches specific settings by keys.
 */
export async function getSettingsByKeys(keys: string[]): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return getDefaultSettings()
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("einstellungen")
      .select("schluessel, wert")
      .in("schluessel", keys)

    if (error || !data) {
      return getDefaultSettings()
    }

    const settings: SiteSettings = getDefaultSettings()
    for (const row of data) {
      settings[row.schluessel] = row.wert
    }
    return settings
  } catch {
    return getDefaultSettings()
  }
}

/**
 * Fetches a single setting value by key.
 */
export async function getSetting(key: string): Promise<string> {
  const defaults = getDefaultSettings()
  if (!isSupabaseConfigured()) return defaults[key] || ""
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("einstellungen")
      .select("wert")
      .eq("schluessel", key)
      .single()

    if (error || !data) {
      return defaults[key] || ""
    }

    return data.wert
  } catch {
    return defaults[key] || ""
  }
}

function getDefaultSettings(): SiteSettings {
  return {
    site_title: "Gerüstbauer24 - Gerüstbaufirmen in Deutschland finden",
    meta_description: "Finden Sie zuverlässige Gerüstbauer in Ihrer Region. Geprüfte Unternehmen, echte Bewertungen und schnelle Anfragen.",
    og_image_url: "",
    contact_email: "info@geruestbauer24.eu",
    contact_phone: "+49 1639540595",
    contact_address: "",
    impressum_firmenname: "",
    impressum_adresse: "",
    impressum_telefon: "",
    impressum_email: "",
    impressum_geschaeftsfuehrer: "",
    impressum_registergericht: "",
    impressum_registernummer: "",
    impressum_ust_id: "",
    datenschutz_text: "",
    cookie_consent_enabled: "false",
    cookie_consent_text: "",
    widerrufsbelehrung_text: "",
  }
}
