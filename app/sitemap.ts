import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

const BASE_URL = "https://geruestbauer24.eu"

// ISR: Site haritası 1 saatte bir yenilenir
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // ─── Statik sayfalar ───────────────────────────────────────────────────────
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
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fuer-firmen`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/agb`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/nutzungsbedingungen`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/barrierefreiheit`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
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

  const cityLastModified = new Map<string, Date>()
  const firmenPages: MetadataRoute.Sitemap = []
  const companyBatchSize = 1000

  for (let offset = 0; ; offset += companyBatchSize) {
    const { data: companies, error } = await supabase
      .from("firmen")
      .select("slug, stadt_slug, updated_at")
      .eq("aktiv", true)
      .order("id")
      .range(offset, offset + companyBatchSize - 1)

    if (error) throw error

    for (const firma of companies ?? []) {
      const updatedAt = firma.updated_at ? new Date(firma.updated_at) : new Date()

      if (firma.stadt_slug) {
        const current = cityLastModified.get(firma.stadt_slug)
        if (!current || updatedAt > current) cityLastModified.set(firma.stadt_slug, updatedAt)
      }

      if (firma.stadt_slug && firma.slug) {
        firmenPages.push({
          url: `${BASE_URL}/geruestbau/${firma.stadt_slug}/${firma.slug}`,
          lastModified: updatedAt,
          changeFrequency: "weekly",
          priority: 0.8,
        })
      }
    }

    if (!companies || companies.length < companyBatchSize) break
  }

  const cityPages: MetadataRoute.Sitemap = Array.from(cityLastModified, ([stadtSlug, lastModified]) => ({
    url: `${BASE_URL}/geruestbau/${stadtSlug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = []
  const blogBatchSize = 1000

  for (let offset = 0; ; offset += blogBatchSize) {
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("slug")
      .range(offset, offset + blogBatchSize - 1)

    if (error) throw error

    for (const post of posts ?? []) {
      blogPages.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }

    if (!posts || posts.length < blogBatchSize) break
  }

  const servicePages: MetadataRoute.Sitemap = [
    "fassadengeruest",
    "industriegeruest",
    "eventgeruest",
    "treppenturm",
    "haengegeruest",
    "schutzgeruest",
  ].map((service) => ({
    url: `${BASE_URL}/geruestbau/leistung/${service}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...cityPages,
    ...firmenPages,
    ...servicePages,
    ...blogPages,
  ]
}
