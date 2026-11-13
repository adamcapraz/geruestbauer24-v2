import type { Metadata } from "next"

export const BASE_URL = "https://geruestbauer24.eu"

export function fitSeoText(value: string, maxLength: number) {
  const text = value.replace(/\s+/g, " ").trim()
  if (text.length <= maxLength) return text

  const shortened = text.slice(0, maxLength - 1)
  const wordBoundary = shortened.lastIndexOf(" ")
  const end = wordBoundary >= Math.floor(maxLength * 0.6) ? wordBoundary : maxLength - 1

  return `${shortened.slice(0, end).trimEnd()}…`
}

export function createSeoMetadata({
  title,
  description,
  canonicalPath,
  image,
  type = "website",
  robots,
}: {
  title: string
  description: string
  canonicalPath: string
  image?: string
  type?: "website" | "article"
  robots?: Metadata["robots"]
}): Metadata {
  const renderedTitle = fitSeoText(title, 60)
  const renderedDescription = fitSeoText(description, 155)
  const imageUrl =
    image ??
    `${BASE_URL}/api/og?title=${encodeURIComponent(renderedTitle)}&subtitle=${encodeURIComponent(renderedDescription)}&type=${type === "article" ? "blog" : "city"}`
  const canonicalUrl = canonicalPath.startsWith("http")
    ? canonicalPath
    : new URL(canonicalPath, BASE_URL).toString()

  return {
    title: { absolute: renderedTitle },
    description: renderedDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: renderedTitle,
      description: renderedDescription,
      type,
      locale: "de_DE",
      siteName: "Gerüstbauer24",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: renderedTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: renderedTitle,
      description: renderedDescription,
      images: [imageUrl],
    },
    ...(robots ? { robots } : {}),
  }
}
