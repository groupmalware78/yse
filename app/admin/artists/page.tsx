export const dynamic = 'force-dynamic'

import { getArtistsForUI } from '@/lib/queries'
import { ArtistsAdminClient } from './ArtistsAdminClient'

export default async function AdminArtistsPage() {
  const artists = await getArtistsForUI()
  return <ArtistsAdminClient initialArtists={artists} />
}
