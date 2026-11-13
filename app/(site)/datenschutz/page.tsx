import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"
import { createSeoMetadata } from "@/lib/seo"

export const metadata = createSeoMetadata({
  title: "Datenschutzerklärung | Gerüstbauer24",
  description: "Informationen zur Verarbeitung personenbezogener Daten bei der Nutzung von Gerüstbauer24.",
  canonicalPath: "/datenschutz",
})

export default async function DatenschutzPage() {
  const settings = await getSettingsByKeys(["page_datenschutz_title", "page_datenschutz_content"])
  return <EditablePage title={settings.page_datenschutz_title || ""} content={settings.page_datenschutz_content || ""} fallbackTitle="Datenschutz" />
}
