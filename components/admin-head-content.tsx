import type React from "react"

interface HeadTag {
  tag: "script" | "meta" | "link"
  attributes: Record<string, string | boolean>
  content?: string
}

const ATTRIBUTE_NAMES: Record<string, string> = {
  crossorigin: "crossOrigin",
  referrerpolicy: "referrerPolicy",
  fetchpriority: "fetchPriority",
  "http-equiv": "httpEquiv",
  charset: "charSet",
  nomodule: "noModule",
}

function parseAttributes(source: string): Record<string, string | boolean> {
  const attributes: Record<string, string | boolean> = {}
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g

  for (const match of source.matchAll(attributePattern)) {
    const sourceName = match[1].toLowerCase()
    if (sourceName.startsWith("on")) continue

    const name = ATTRIBUTE_NAMES[sourceName] || sourceName
    const value = match[2] ?? match[3] ?? match[4]

    if (value === undefined && ["async", "defer", "nomodule"].includes(sourceName)) {
      attributes[name] = true
    } else if (value !== undefined) {
      attributes[name] = value
    }
  }

  return attributes
}

function isSafeWebUrl(value: string): boolean {
  try {
    const url = new URL(value, "https://geruestbauer24.eu")
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

function parseHeadTags(markup: string): HeadTag[] {
  const tags: HeadTag[] = []
  const tagPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>|<(meta|link)\b([^>]*)\/?>/gi

  for (const match of markup.matchAll(tagPattern)) {
    if (match[1] !== undefined) {
      const attributes = parseAttributes(match[1])
      const src = attributes.src
      if (typeof src === "string" && !isSafeWebUrl(src)) continue

      tags.push({ tag: "script", attributes, content: match[2] })
      continue
    }

    const tag = match[3].toLowerCase() as "meta" | "link"
    const attributes = parseAttributes(match[4])
    const url = attributes.href

    if (tag === "link" && typeof url === "string" && !isSafeWebUrl(url)) continue
    if (tag === "meta" && String(attributes.httpEquiv || "").toLowerCase() === "refresh") continue

    tags.push({ tag, attributes })
  }

  return tags
}

export function AdminHeadContent({ snippets }: { snippets: string[] }) {
  const tags = parseHeadTags(snippets.filter(Boolean).join("\n"))
  const seenScriptSources = new Set<string>()

  return (
    <>
      {tags.map((tag, index) => {
        if (tag.tag === "script") {
          const src = tag.attributes.src
          if (typeof src === "string") {
            if (seenScriptSources.has(src)) return null
            seenScriptSources.add(src)
          }

          return (
            <script
              key={`admin-head-script-${index}`}
              {...(tag.attributes as React.ScriptHTMLAttributes<HTMLScriptElement>)}
              data-admin-head-snippet="true"
              dangerouslySetInnerHTML={src ? undefined : { __html: tag.content || "" }}
            />
          )
        }

        if (tag.tag === "meta") {
          return (
            <meta
              key={`admin-head-meta-${index}`}
              {...(tag.attributes as React.MetaHTMLAttributes<HTMLMetaElement>)}
              data-admin-head-snippet="true"
            />
          )
        }

        return (
          <link
            key={`admin-head-link-${index}`}
            {...(tag.attributes as React.LinkHTMLAttributes<HTMLLinkElement>)}
            data-admin-head-snippet="true"
          />
        )
      })}
    </>
  )
}
