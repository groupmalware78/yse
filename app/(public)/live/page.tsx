export const dynamic = 'force-dynamic'

import { getSettings } from '@/lib/actions/settings'
import { LiveClient } from './LiveClient'

export default async function LivePage() {
  const settings = await getSettings()
  return (
    <LiveClient
      tiktokHandle={settings.tiktokHandle}
      tiktokProfileUrl={settings.tiktokProfileUrl}
      tiktokLiveUrl={settings.tiktokLiveUrl ?? null}
      livePageEnabled={settings.livePageEnabled ?? true}
      tiktokVideos={settings.tiktokVideos ?? []}
      iframeUrl={settings.iframeUrl ?? 'https://www.score808live.tv'}
      iframeEnabled={settings.iframeEnabled ?? true}
    />
  )
}
