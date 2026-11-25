"use client"

import { useEffect, useRef, type MouseEvent } from "react"

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: unknown[]
      showRevocationMessage?: () => void
    }
  }
}

export function GooglePrivacySettingsLink() {
  const openSettings = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const googlefc = (window.googlefc ??= {})
    const callbackQueue = (googlefc.callbackQueue ??= [])
    callbackQueue.push({
      CONSENT_DATA_READY: () => googlefc.showRevocationMessage?.(),
    })
  }

  return (
    <a
      href="#google-privacy-settings"
      onClick={openSettings}
      className="text-slate-300 transition-colors hover:text-primary"
    >
      Datenschutz-Einstellungen
    </a>
  )
}

export function GoogleAdSenseBodyCode({
  enabled,
  code,
}: {
  enabled: boolean
  code: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !code.trim() || !container) return

    container.innerHTML = code
    for (const sourceScript of Array.from(container.querySelectorAll("script"))) {
      const script = document.createElement("script")
      for (const attribute of Array.from(sourceScript.attributes)) {
        script.setAttribute(attribute.name, attribute.value)
      }
      script.textContent = sourceScript.textContent
      sourceScript.replaceWith(script)
    }

    return () => container.replaceChildren()
  }, [code, enabled])

  return <div ref={containerRef} aria-label="Werbung" />
}
