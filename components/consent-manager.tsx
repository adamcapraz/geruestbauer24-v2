"use client"

import { useCallback, useEffect, useState } from "react"

type ConsentState = {
  necessary: true
  statistics: boolean
  marketing: boolean
}

type ConsentManagerProps = {
  enabled: boolean
  title?: string
  text?: string
  analyticsId?: string
  tagManagerId?: string
  adsenseCode?: string
}

const STORAGE_KEY = "geruestbauer24-consent"
const CONSENT_VERSION = "2026-10-19"

function loadConsent(): ConsentState | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as { version?: string; consent?: ConsentState }
    return parsed.version === CONSENT_VERSION && parsed.consent?.necessary === true
      ? parsed.consent
      : null
  } catch {
    return null
  }
}

function saveConsent(consent: ConsentState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CONSENT_VERSION, consent }))
}

function loadScript(id: string, src: string, content?: string) {
  if (document.getElementById(id)) return
  const script = document.createElement("script")
  script.id = id
  script.async = true
  if (src) script.src = src
  if (content) script.textContent = content
  document.head.appendChild(script)
}

function activateOptionalServices(consent: ConsentState, props: ConsentManagerProps) {
  if (consent.statistics) {
    if (props.analyticsId) {
      loadScript("consent-ga-script", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(props.analyticsId)}`)
      loadScript("consent-ga-config", "", `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${props.analyticsId}');`)
    }
    if (props.tagManagerId) {
      loadScript("consent-gtm-script", "", `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+i:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${props.tagManagerId}');`)
    }
  }

  if (consent.marketing && props.adsenseCode?.trim()) {
    const container = document.getElementById("consent-adsense-container")
    if (!container || container.childElementCount > 0) return
    container.innerHTML = props.adsenseCode
    for (const sourceScript of Array.from(container.querySelectorAll("script"))) {
      const script = document.createElement("script")
      for (const attribute of Array.from(sourceScript.attributes)) script.setAttribute(attribute.name, attribute.value)
      script.textContent = sourceScript.textContent
      sourceScript.replaceWith(script)
    }
  }
}

export default function ConsentManager(props: ConsentManagerProps) {
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState({ statistics: false, marketing: false })

  useEffect(() => {
    const handleOpen = () => {
      const current = loadConsent()
      setDraft({ statistics: current?.statistics ?? false, marketing: current?.marketing ?? false })
      setIsOpen(true)
    }
    window.addEventListener("open-cookie-settings", handleOpen)
    const stored = loadConsent()
    if (stored) {
      setConsent(stored)
      activateOptionalServices(stored, props)
    } else if (props.enabled) {
      setIsOpen(true)
    }
    return () => window.removeEventListener("open-cookie-settings", handleOpen)
  }, [props])

  const apply = useCallback((next: ConsentState) => {
    saveConsent(next)
    setConsent(next)
    setIsOpen(false)
    activateOptionalServices(next, props)
  }, [props])

  const openSettings = useCallback(() => {
    const current = consent ?? loadConsent()
    setDraft({ statistics: current?.statistics ?? false, marketing: current?.marketing ?? false })
    setIsOpen(true)
  }, [consent])

  if (!props.enabled) return null

  return (
    <>
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <div>
              <h2 id="cookie-title" className="text-base font-semibold text-slate-900">{props.title || "Ihre Datenschutzeinstellungen"}</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{props.text || "Wir verwenden notwendige Technologien für den Betrieb der Website. Statistik- und Marketing-Technologien werden nur nach Ihrer Auswahl geladen. Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ ändern."}</p>
            </div>
            {consent !== null && (
              <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm sm:grid-cols-3">
                <label className="flex items-start gap-2"><input type="checkbox" checked readOnly className="mt-1" /><span><strong>Notwendig</strong><br /><span className="text-slate-600">Für Sicherheit und Grundfunktionen erforderlich.</span></span></label>
                <label className="flex items-start gap-2"><input type="checkbox" checked={draft.statistics} onChange={(event) => setDraft((value) => ({ ...value, statistics: event.target.checked }))} className="mt-1" /><span><strong>Statistik</strong><br /><span className="text-slate-600">Nur falls Google-Analytics- oder Tag-Manager-Code eingerichtet ist.</span></span></label>
                <label className="flex items-start gap-2"><input type="checkbox" checked={draft.marketing} onChange={(event) => setDraft((value) => ({ ...value, marketing: event.target.checked }))} className="mt-1" /><span><strong>Marketing</strong><br /><span className="text-slate-600">Nur falls AdSense-Werbung eingerichtet ist.</span></span></label>
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => apply({ necessary: true, statistics: false, marketing: false })} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary">Ablehnen</button>
              {consent === null ? <button type="button" onClick={() => { setDraft({ statistics: false, marketing: false }); setConsent({ necessary: true, statistics: false, marketing: false }) }} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary">Einstellungen</button> : <button type="button" onClick={() => apply({ necessary: true, ...draft })} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary">Auswahl speichern</button>}
              <button type="button" onClick={() => apply({ necessary: true, statistics: true, marketing: true })} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary">Alle akzeptieren</button>
            </div>
          </div>
        </div>
      )}
      <div id="consent-adsense-container" aria-label="Werbung" />
      <button type="button" onClick={openSettings} className="sr-only focus:not-sr-only focus:fixed focus:bottom-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg">Cookie-Einstellungen</button>
    </>
  )
}

export function CookieSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))} className="text-slate-300 hover:text-primary transition-colors">Cookie-Einstellungen</button>
}
