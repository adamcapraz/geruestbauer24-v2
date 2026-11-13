import { EditablePage } from "@/components/editable-page"
import { getSettingsByKeys } from "@/lib/settings"
import { createSeoMetadata } from "@/lib/seo"

export const metadata = createSeoMetadata({
  title: "Barrierefreiheit | Gerüstbauer24",
  description: "Informationen zur Barrierefreiheit und zu den Zugänglichkeitsfunktionen von Gerüstbauer24.",
  canonicalPath: "/barrierefreiheit",
})

export default async function BarrierefreiheitPage() {
  const settings = await getSettingsByKeys(["page_barrierefreiheit_title", "page_barrierefreiheit_content"])
  return <EditablePage title={settings.page_barrierefreiheit_title || ""} content={settings.page_barrierefreiheit_content || ""} fallbackTitle="Barrierefreiheit" />
}
