"use client"

import { useEffect } from "react"

export function HeadScripts({ html }: { html: string }) {
  useEffect(() => {
    if (!html) return

    // Wait until user has interacted or page is idle
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
        // Always load external scripts async to avoid blocking
        if (s.src) {
          ns.async = true
        }
        if (s.innerHTML) ns.innerHTML = s.innerHTML
        document.head.appendChild(ns)
      })

      others.forEach((el) => {
        const clone = el.cloneNode(true)
        document.head.appendChild(clone)
      })
    }

    // Delay loading until after initial paint and user interaction
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => loadScripts(), { timeout: 4000 })
    } else {
      setTimeout(loadScripts, 3000)
    }
  }, [html])

  return null
}
