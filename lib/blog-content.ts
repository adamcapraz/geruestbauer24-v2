import sanitizeHtml, { type IOptions } from "sanitize-html"

const allowedTags = [
  "h2", "h3", "p", "ul", "ol", "li", "a", "strong", "em", "img", "blockquote",
]

const sanitizerOptions: IOptions = {
  allowedTags,
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  transformTags: {
    h1: "h2",
    a: (tagName, attribs) => {
      const href = attribs.href || ""
      const isExternal = /^https?:\/\//i.test(href) && !href.startsWith("https://geruestbauer24.eu") && !href.startsWith("http://geruestbauer24.eu")
      return {
        tagName,
        attribs: {
          ...attribs,
          ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
        },
      }
    },
  },
}

export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, sanitizerOptions)
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character)
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
}

export function markdownToBlogHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n")
  const output: string[] = []
  let list: "ul" | "ol" | null = null
  let items: string[] = []
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${inlineMarkdown(paragraph.join(" ").trim())}</p>`)
      paragraph = []
    }
  }
  const flushList = () => {
    if (list) output.push(`<${list}>${items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</${list}>`)
    list = null
    items = []
  }

  for (const line of lines) {
    const trimmed = line.trim()
    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed)
    const unordered = /^[-*+]\s+(.+)$/.exec(trimmed)
    const ordered = /^\d+[.)]\s+(.+)$/.exec(trimmed)

    if (!trimmed || /^---+$/.test(trimmed)) {
      flushParagraph()
      flushList()
    } else if (heading) {
      flushParagraph(); flushList()
      output.push(`<${heading[1].length === 1 ? "h2" : "h3"}>${inlineMarkdown(heading[2])}</${heading[1].length === 1 ? "h2" : "h3"}>`)
    } else if (unordered || ordered) {
      flushParagraph()
      const nextList = unordered ? "ul" : "ol"
      if (list !== nextList) { flushList(); list = nextList }
      items.push((unordered || ordered)![1])
    } else {
      flushList()
      paragraph.push(trimmed)
    }
  }
  flushParagraph(); flushList()
  return sanitizeBlogHtml(output.join(""))
}

export function renderBlogContent(content: string | null | undefined): string {
  if (!content?.trim()) return ""
  return /<\/?[a-z][^>]*>/i.test(content) ? sanitizeBlogHtml(content) : markdownToBlogHtml(content)
}
