import { getArtistsForUI } from '@/lib/queries'
import { ArtistsClient } from './ArtistsClient'

export default async function ArtistsPage() {
  const artists = await getArtistsForUI()
  return <ArtistsClient artists={artists} />
}
