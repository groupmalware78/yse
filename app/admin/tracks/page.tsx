export const dynamic = 'force-dynamic'

import { getTracks } from '@/lib/actions/tracks'
import { getArtistsForUI } from '@/lib/queries'
import { TracksAdminClient } from './TracksAdminClient'

export default async function AdminTracksPage() {
  const [tracks, artists] = await Promise.all([getTracks(), getArtistsForUI()])
  return <TracksAdminClient initialTracks={tracks} artists={artists} />
}
