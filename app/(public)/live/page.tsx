export const dynamic = 'force-dynamic'

import { getSettings } from '@/lib/actions/settings'
import { LiveClient } from './LiveClient'

export default async function LivePage() {
  const settings = await getSettings()
  return (
    <LiveClient
      tiktokLiveUrl={settings.tiktokLiveUrl ?? null}
      livePageEnabled={settings.livePageEnabled ?? true}
    />
  )
}
