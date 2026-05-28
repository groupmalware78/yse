export const dynamic = 'force-dynamic'

import { getSettings } from '@/lib/actions/settings'
import { SettingsClient } from './SettingsClient'

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  return <SettingsClient settings={settings} />
}
