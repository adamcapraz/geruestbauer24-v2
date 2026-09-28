"use client"

import { useEffect } from "react"

export function HeadScripts({ html }: { html: string }) {
  useEffect(() => {
    if (!html) return

    const loadScripts = () => {
      const container = document.createElement("div")
      container.innerHTML = html

      const scripts = container.querySelectorAll("script")
      const others = container.querySelectorAll(":not(script)")

      scripts.forEach((s) => {
        const ns = document.createElement("script")
        for (let i = 0; i < s.attributes.length; i++) {
          ns.setAttribute(s.attributes[i].name, s.attributes[i].value)
        }
        if (s.src) {
          ns.async = true
        }
        if (s.innerHTML) ns.innerHTML = s.innerHTML
        document.head.appendChild(ns)
      })

      // Non-script elements (meta tags etc.) are still added
      others.forEach((el) => {
        const clone = el.cloneNode(true)
        document.head.appendChild(clone)
      })
    }

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => loadScripts(), { timeout: 4000 })
    } else {
      setTimeout(loadScripts, 3000)
    }
  }, [html])

  return null
}
