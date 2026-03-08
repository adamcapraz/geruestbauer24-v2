/**
 * /blog — Blog listeleme sayfası
 *
 * DEĞİŞİKLİKLER:
 * - generateMetadata fonksiyona dönüştürüldü (pagination için dinamik title/canonical)
 * - Canonical URL eklendi (pagination sayfaları için)
 * - OG image eklendi (dinamik)
 * - twitter:card eklendi
 * - Pagination sayfaları için unique title/description
 */

import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const BASE_URL = "https://geruestbauer24.eu"
const POSTS_PER_PAGE = 9

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || "1", 10))

  const title =
    currentPage > 1
      ? `Blog – Seite ${currentPage} | Gerüstbauer24 Tipps & Ratgeber`
      : "Blog | Gerüstbauer24 – Tipps & Ratgeber für Gerüstbau"

  const description =
    currentPage > 1
      ? `Gerüstbau Blog – Seite ${currentPage}. Tipps, Ratgeber und Neuigkeiten rund um das Thema Gerüstbau.`
      : "Entdecken Sie nützliche Tipps, Ratgeber und Neuigkeiten rund um das Thema Gerüstbau. Gerüstarten, Sicherheit und Branchentrends."

  const canonicalUrl =
    currentPage > 1 ? `${BASE_URL}/blog?page=${currentPage}` : `${BASE_URL}/blog`

  const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent("Gerüstbau Blog")}&subtitle=${encodeURIComponent("Tipps, Ratgeber & Neuigkeiten")}&type=blog`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "Gerüstbauer24",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: "Gerüstbauer24 Blog – Tipps & Ratgeber",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || "1", 10))
  const offset = (currentPage - 1) * POSTS_PER_PAGE

  const supabase = await createClient()

  const { count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)

  const totalPosts = count || 0
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, summary, image_url, category, tags, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  // JSON-LD: Blog şeması
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Gerüstbauer24 Blog",
    "description": "Tipps, Ratgeber und Neuigkeiten rund um das Thema Gerüstbau",
    "url": `${BASE_URL}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "Gerüstbauer24",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/placeholder-logo.png`,
      },
    },
    "blogPost": (posts || []).map((post: { title: string; summary: string; slug: string; published_at: string; image_url: string | null }) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.summary,
      "url": `${BASE_URL}/blog/${post.slug}`,
      "datePublished": post.published_at,
      "image": post.image_url || `${BASE_URL}/placeholder-logo.png`,
    })),
  }

  // BreadcrumbList şeması
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Startseite", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog" },
    ],
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero Section */}
      <section className="bg-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Gerüstbau <span className="text-orange-500">Blog</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Tipps, Ratgeber und aktuelle Neuigkeiten rund um das Thema Gerüstbau
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-orange-500 transition-colors">Startseite</Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground font-medium">Blog</span>
          </nav>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {posts && posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: { id: string; title: string; slug: string; summary: string; image_url: string | null; category: string | null; tags: string[] | null; published_at: string }) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="group h-full overflow-hidden border-border hover:border-orange-500/50 hover:shadow-lg transition-all duration-300">
                      <div className="relative h-48 bg-muted overflow-hidden">
                        {post.image_url ? (
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <span className="text-4xl font-bold text-orange-500">G24</span>
                          </div>
                        )}
                        {post.category && (
                          <Badge className="absolute top-3 left-3 bg-orange-500 text-white hover:bg-orange-600">
                            {post.category}
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <h2 className="text-lg font-semibold text-foreground group-hover:text-orange-500 transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {post.summary}
                        </p>
                        <div className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                          <span>Weiterlesen</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination — Link tabanlı (SEO için kritik, onClick değil) */}
              {totalPages > 1 && (
                <nav aria-label="Blog Seiten" className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={currentPage <= 1}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  >
                    <Link href={`/blog?page=${currentPage - 1}`}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Zurück
                    </Link>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        asChild
                        className={page === currentPage ? "bg-orange-500 hover:bg-orange-600" : ""}
                      >
                        <Link href={page === 1 ? "/blog" : `/blog?page=${page}`}>{page}</Link>
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={currentPage >= totalPages}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  >
                    <Link href={`/blog?page=${currentPage + 1}`}>
                      Weiter
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Noch keine Blogbeiträge
              </h2>
              <p className="text-muted-foreground">
                Hier werden bald interessante Artikel rund um das Thema Gerüstbau erscheinen.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
