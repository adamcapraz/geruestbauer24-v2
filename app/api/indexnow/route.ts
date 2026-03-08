/**
 * POST /api/indexnow
 * Tüm aktif firmaları ve blog yazılarını IndexNow'a toplu gönderir.
 *
 * Kullanım:
 * curl -X POST https://geruestbauer24.eu/api/indexnow \
 *   -H "Content-Type: application/json" \
 *   -d '{"secret": "INDEXNOW_SUBMIT_SECRET değeri"}'
 */

import { createClient } from "@supabase/supabase-js"

const INDEXNOW_KEY = process.env.INDEXNOW_KEY
const BASE_URL = "https://geruestbauer24.eu"

async function submitToIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_KEY || urls.length === 0) return
  const validUrls = urls
    .filter((url: string) => url.startsWith("https://"))
    .slice(0, 10000)
  if (validUrls.length === 0) return
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "geruestbauer24.eu",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: validUrls,
      }),
    })
  } catch {
    // Sessizce başarısız ol
  }
}

export async function POST(request: Request) {
  const { secret } = await request.json().catch(() => ({}))

  if (!secret || secret !== process.env.INDEXNOW_SUBMIT_SECRET) {
    return new Response("Yetkisiz", { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Tüm aktif firma URL'leri
  const { data: firmen } = await supabase
    .from("firmen")
    .select("slug, stadt_slug")
    .eq("aktiv", true)

  const firmenUrls = (firmen || [])
    .filter((f: { slug: string; stadt_slug: string }) => f.stadt_slug && f.slug)
    .map((f: { slug: string; stadt_slug: string }) => `${BASE_URL}/geruestbau/${f.stadt_slug}/${f.slug}`)

  // Tüm yayınlanmış blog URL'leri
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true)

  const blogUrls = (posts || []).map((p: { slug: string }) => `${BASE_URL}/blog/${p.slug}`)

  // Statik sayfalar
  const staticUrls = [
    BASE_URL,
    `${BASE_URL}/geruestbau`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/faq`,
    `${BASE_URL}/ueber-uns`,
  ]

  const allUrls = [...staticUrls, ...firmenUrls, ...blogUrls]

  await submitToIndexNow(allUrls)

  return Response.json({
    success: true,
    submitted: allUrls.length,
    breakdown: {
      static: staticUrls.length,
      firmen: firmenUrls.length,
      blog: blogUrls.length,
    },
  })
}
