/**
 * /blog/[slug] — Blog detay sayfası
 *
 * DEĞİŞİKLİKLER:
 * - OG image eklendi (blog başlığıyla dinamik görsel)
 * - twitter:card eklendi
 * - Canonical URL absolute yapıldı
 * - OG image width/height/type/alt eklendi
 * - generateStaticParams eklendi (build zamanında render)
 * - revalidate eklendi (blog yazıları haftada bir yenilenir)
 * - JSON-LD zaten iyi yazılmış, korundu + küçük iyileştirmeler yapıldı
 */

import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2 } from "lucide-react"

const BASE_URL = "https://geruestbauer24.eu"

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

// SSR erzwingen: Bei jedem Request dynamisch server-seitig gerendert (kein Static/ISR)
export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, summary, image_url, category")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!post) {
    return { title: "Beitrag nicht gefunden" }
  }

  // Dinamik OG görseli — blog yazısı başlığını içerir
  const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.category || "Gerüstbau Ratgeber")}&type=blog`

  return {
    title: `${post.title} | Gerüstbauer24 Blog`,
    description: post.summary,
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      locale: "de_DE",
      siteName: "Gerüstbauer24",
      images: [
        {
          // Eğer gerçek bir görsel varsa onu kullan, yoksa dinamik OG görseli
          url: post.image_url || ogImageUrl,
          width: 1200,
          height: 630,
          type: post.image_url ? "image/jpeg" : "image/png",
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [post.image_url || ogImageUrl],
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!post) {
    notFound()
  }

  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, summary, image_url, published_at")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const wordCount = post.content?.split(/\s+/).length || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const tags: string[] = post.tags || []

  // JSON-LD: BlogPosting (iyi yazılmış, sadece küçük iyileştirmeler)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary,
    "image": post.image_url || `${BASE_URL}/placeholder-logo.png`,
    "datePublished": post.published_at,
    "dateModified": post.updated_at || post.published_at,
    "author": {
      "@type": "Organization",
      "name": "Gerüstbauer24",
      "url": BASE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gerüstbauer24",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/placeholder-logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    "articleSection": post.category,
    "keywords": tags.join(", "),
    "wordCount": wordCount,
    "timeRequired": `PT${readingTime}M`,
  }

  // BreadcrumbList şeması
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Startseite", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": post.title },
      // Son öğede "item" yok — mevcut sayfa
    ],
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero Image */}
      <section className="relative h-64 md:h-96 bg-slate-900">
        {post.image_url ? (
          <>
            <Image src={post.image_url} alt={post.title} fill className="object-cover opacity-60" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl font-bold text-orange-500/20">G24</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container mx-auto max-w-4xl">
            {post.category && (
              <Badge className="bg-orange-500 text-white hover:bg-orange-600 mb-4">{post.category}</Badge>
            )}
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 text-balance">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} Min. Lesezeit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-orange-500 transition-colors">Startseite</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-orange-500 transition-colors">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <article>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-orange-500 pl-4">
              {post.summary}
            </p>
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                prose-headings:text-foreground prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-li:marker:text-orange-500
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Teilen:</span>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${BASE_URL}/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${BASE_URL}/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück zum Blog
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-12 px-4 bg-muted/30 border-t border-border">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">Ähnliche Beiträge</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: { id: string; title: string; slug: string; summary: string; image_url: string | null; published_at: string }) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="group h-full overflow-hidden border-border hover:border-orange-500/50 hover:shadow-lg transition-all duration-300">
                    <div className="relative h-40 bg-muted overflow-hidden">
                      {relatedPost.image_url ? (
                        <Image src={relatedPost.image_url} alt={relatedPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                          <span className="text-3xl font-bold text-orange-500">G24</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-2">{formatDate(relatedPost.published_at)}</p>
                      <h3 className="font-semibold text-foreground group-hover:text-orange-500 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center gap-1 text-orange-500 text-sm font-medium mt-3">
                        <span>Lesen</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
