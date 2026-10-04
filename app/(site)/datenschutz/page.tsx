import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"

export const metadata = {
  title: "Datenschutzerklärung - Gerüstbauer24",
}

export default async function DatenschutzPage() {
  const settings = await getSettingsByKeys(["page_datenschutz_title", "page_datenschutz_content"])
  return <EditablePage title={settings.page_datenschutz_title || ""} content={settings.page_datenschutz_content || ""} fallbackTitle="Datenschutz" />
}
