import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"

export default async function BarrierefreiheitPage() {
  const settings = await getSettingsByKeys(["page_barrierefreiheit_title", "page_barrierefreiheit_content"])
  return <EditablePage title={settings.page_barrierefreiheit_title || ""} content={settings.page_barrierefreiheit_content || ""} fallbackTitle="Barrierefreiheit" />
}
