import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const BASE_URL = "https://geruestbauer24.eu"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/geruestbau`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ueber-uns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/impressum`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic city pages and company pages from active firmen
  const { data: firmen } = await supabase
    .from("firmen")
    .select("slug, stadt_slug, updated_at")
    .eq("aktiv", true)

  const citySet = new Set<string>()
  const firmenPages: MetadataRoute.Sitemap = []

  if (firmen) {
    for (const firma of firmen) {
      // Collect unique cities
      if (firma.stadt_slug && !citySet.has(firma.stadt_slug)) {
        citySet.add(firma.stadt_slug)
      }

      // Company detail pages
      if (firma.stadt_slug && firma.slug) {
        firmenPages.push({
          url: `${BASE_URL}/geruestbau/${firma.stadt_slug}/${firma.slug}`,
          lastModified: firma.updated_at ? new Date(firma.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        })
      }
    }
  }

  // City listing pages
  const cityPages: MetadataRoute.Sitemap = Array.from(citySet).map((stadtSlug) => ({
    url: `${BASE_URL}/geruestbau/${stadtSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticPages, ...cityPages, ...firmenPages]
}
