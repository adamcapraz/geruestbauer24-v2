"use client"

import { useEffect, useRef } from "react"

type AdSenseBodySlotProps = {
  code: string
}

export default function AdSenseBodySlot({ code }: AdSenseBodySlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !code.trim()) return

    container.replaceChildren()
    container.innerHTML = code

    for (const sourceScript of Array.from(container.querySelectorAll("script"))) {
      const script = document.createElement("script")
      for (const attribute of Array.from(sourceScript.attributes)) {
        script.setAttribute(attribute.name, attribute.value)
      }
      script.textContent = sourceScript.textContent
      sourceScript.replaceWith(script)
    }
  }, [code])

  if (!code.trim()) return null

  return <div ref={containerRef} suppressHydrationWarning aria-label="Werbung" />
}
