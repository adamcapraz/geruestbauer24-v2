import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"
import { createSeoMetadata } from "@/lib/seo"

export const metadata = createSeoMetadata({
  title: "AGB | Gerüstbauer24",
  description: "Die Allgemeinen Geschäftsbedingungen für die Nutzung von Gerüstbauer24.",
  canonicalPath: "/agb",
})

export default async function AgbPage() {
  const settings = await getSettingsByKeys(["page_agb_title", "page_agb_content"])
  return <EditablePage title={settings.page_agb_title || ""} content={settings.page_agb_content || ""} fallbackTitle="AGB" />
}
