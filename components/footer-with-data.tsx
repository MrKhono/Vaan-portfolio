
import { getSettingsAction } from "@/actions/settings.actions"
import { Footer } from "@/components/footer"

export async function FooterWithData() {
  const settings = await getSettingsAction()
  return <Footer settings={settings} />
}