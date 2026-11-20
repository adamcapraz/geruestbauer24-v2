import sanitizeHtml from "sanitize-html"

export const BLOG_ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "p", "ul", "ol", "li", "a", "strong", "em", "img", "blockquote",
]

export function sanitizeBlogHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: BLOG_ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attributes) => ({
        tagName,
        attribs: { href: attributes.href || "" },
      }),
      img: (tagName, attributes) => ({
        tagName,
        attribs: { src: attributes.src || "", alt: attributes.alt || "" },
      }),
    },
  })
}

export function validateBlogHtml(html: string): string | null {
  if (!html.trim() || !sanitizeBlogHtml(html).replace(/<[^>]*>/g, "").trim()) {
    return "Bitte gib einen Inhalt für den Blogbeitrag ein."
  }

  const stack: string[] = []
  const tokens = html.match(/<!--[\s\S]*?-->|<[^>]*>/g) || []
  for (const token of tokens) {
    if (token.startsWith("<!--") || /^<\s*!/.test(token)) continue
    const closing = /^<\s*\//.test(token)
    const name = token.match(/^<\s*\/?\s*([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase()
    if (!name) return "Der HTML-Quelltext enthält ein ungültiges Element. Bitte überprüfe die Tags."
    if (closing) {
      if (stack.pop() !== name) return `Der HTML-Quelltext ist fehlerhaft: Das schließende </${name}> passt nicht.`
    } else if (!/\/\s*>$/.test(token) && !["img", "br", "hr", "input", "meta", "link"].includes(name)) {
      stack.push(name)
    }
  }
  if (stack.length) return `Der HTML-Quelltext ist unvollständig: </${stack[stack.length - 1]}> fehlt.`

  const unsafeLink = [...html.matchAll(/\bhref\s*=\s*["']?([^\s"'>]+)/gi)]
    .some(([, href]) => !/^(https?:|mailto:|\/|#)/i.test(href))
  if (unsafeLink) return "Ein Link ist ungültig. Verwende eine https://-, http://-, mailto:- oder relative Adresse."
  return null
}
