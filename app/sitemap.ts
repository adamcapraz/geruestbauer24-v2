import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

const BASE_URL = "https://geruestbauer24.eu"
const ITEMS_PER_PAGE = 10  // geruestbau/page.tsx ile aynı olmalı
const POSTS_PER_PAGE = 9   // blog/page.tsx ile aynı olmalı

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

  // ─── Firma verileri ────────────────────────────────────────────────────────
  const { data: firmen } = await supabase
    .from("firmen")
    .select("slug, stadt_slug, bundesland, updated_at")
    .eq("aktiv", true)

  const citySet = new Set<string>()
  const bundeslandMap = new Map<string, number>() // bundesland → firma sayısı
  const firmenPages: MetadataRoute.Sitemap = []

  if (firmen) {
    for (const firma of firmen) {
      // Şehir sayfaları
      if (firma.stadt_slug && !citySet.has(firma.stadt_slug)) {
        citySet.add(firma.stadt_slug)
      }

      // Bundesland sayıları (pagination için)
      if (firma.bundesland) {
        const slug = firma.bundesland.toLowerCase().replace(/\s+/g, "-")
        bundeslandMap.set(slug, (bundeslandMap.get(slug) || 0) + 1)
      }

      // Firma detay sayfaları
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

  // ─── Şehir listeleme sayfaları ─────────────────────────────────────────────
  const cityPages: MetadataRoute.Sitemap = Array.from(citySet).map((stadtSlug) => ({
    url: `${BASE_URL}/geruestbau/${stadtSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // ─── Ana liste pagination sayfaları ───────────────────────────────────────
  const totalFirmen = firmen?.length || 0
  const totalFirmenPages = Math.ceil(totalFirmen / ITEMS_PER_PAGE)
  const firmenPaginationPages: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, totalFirmenPages - 1) },
    (_, i) => ({
      url: `${BASE_URL}/geruestbau?page=${i + 2}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  )

  // ─── Blog sayfaları ────────────────────────────────────────────────────────
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("is_published", true)

  const blogPages: MetadataRoute.Sitemap = blogPosts
    ? blogPosts.map((post: { slug: string; updated_at: string | null }) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    : []

  // ─── Blog pagination sayfaları ─────────────────────────────────────────────
  const totalBlogPosts = blogPosts?.length || 0
  const totalBlogPages = Math.ceil(totalBlogPosts / POSTS_PER_PAGE)
  const blogPaginationPages: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, totalBlogPages - 1) },
    (_, i) => ({
      url: `${BASE_URL}/blog?page=${i + 2}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })
  )

  return [
    ...staticPages,
    ...cityPages,
    ...firmenPages,
    ...firmenPaginationPages,
    ...blogPages,
    ...blogPaginationPages,
  ]
}
