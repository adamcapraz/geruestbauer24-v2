"use client"

import { useEffect } from "react"

export function HeadScripts({ html }: { html: string }) {
  useEffect(() => {
    if (!html) return

    const container = document.createElement("div")
    container.innerHTML = html

    const scripts = container.querySelectorAll("script")
    const others = container.querySelectorAll(":not(script)")

    const appendedNodes: Node[] = []

    scripts.forEach((s) => {
      const ns = document.createElement("script")
      for (let i = 0; i < s.attributes.length; i++) {
        ns.setAttribute(s.attributes[i].name, s.attributes[i].value)
      }
      if (s.innerHTML) ns.innerHTML = s.innerHTML
      document.head.appendChild(ns)
      appendedNodes.push(ns)
    })

    others.forEach((el) => {
      const clone = el.cloneNode(true)
      document.head.appendChild(clone)
      appendedNodes.push(clone)
    })

    return () => {
      appendedNodes.forEach((node) => {
        if (node.parentNode === document.head) {
          document.head.removeChild(node)
        }
      })
    }
  }, [html])

  return null
}
