import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"

export default async function NutzungsbedingungenPage() {
  const settings = await getSettingsByKeys(["page_nutzungsbedingungen_title", "page_nutzungsbedingungen_content"])
  return <EditablePage title={settings.page_nutzungsbedingungen_title || ""} content={settings.page_nutzungsbedingungen_content || ""} fallbackTitle="Nutzungsbedingungen" />
}
