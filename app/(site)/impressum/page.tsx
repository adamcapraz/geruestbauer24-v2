import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"

export const metadata = {
  title: "Impressum - Gerüstbauer24",
}

export default async function ImpressumPage() {
  const settings = await getSettingsByKeys(["page_impressum_title", "page_impressum_content"])
  return <EditablePage title={settings.page_impressum_title || ""} content={settings.page_impressum_content || ""} fallbackTitle="Impressum" />
}
