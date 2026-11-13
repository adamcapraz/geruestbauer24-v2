import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"
import { createSeoMetadata } from "@/lib/seo"

export const metadata = createSeoMetadata({
  title: "Nutzungsbedingungen | Gerüstbauer24",
  description: "Regeln und Hinweise zur Nutzung der Plattform Gerüstbauer24.",
  canonicalPath: "/nutzungsbedingungen",
})

export default async function NutzungsbedingungenPage() {
  const settings = await getSettingsByKeys(["page_nutzungsbedingungen_title", "page_nutzungsbedingungen_content"])
  return <EditablePage title={settings.page_nutzungsbedingungen_title || ""} content={settings.page_nutzungsbedingungen_content || ""} fallbackTitle="Nutzungsbedingungen" />
}
