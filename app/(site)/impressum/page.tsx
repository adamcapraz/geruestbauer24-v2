import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"
import { createSeoMetadata } from "@/lib/seo"

export const metadata = createSeoMetadata({
  title: "Impressum | Gerüstbauer24",
  description: "Angaben zum Betreiber von Gerüstbauer24 und Kontaktmöglichkeiten.",
  canonicalPath: "/impressum",
})

export default async function ImpressumPage() {
  const settings = await getSettingsByKeys(["page_impressum_title", "page_impressum_content"])
  return <EditablePage title={settings.page_impressum_title || ""} content={settings.page_impressum_content || ""} fallbackTitle="Impressum" />
}
