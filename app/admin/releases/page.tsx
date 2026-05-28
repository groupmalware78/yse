export const dynamic = 'force-dynamic'

import { getReleasesForUI, getArtistsForUI } from '@/lib/queries'
import { ReleasesAdminClient } from './ReleasesAdminClient'

export default async function AdminReleasesPage() {
  const [releases, artists] = await Promise.all([getReleasesForUI(), getArtistsForUI()])
  return <ReleasesAdminClient initialReleases={releases} artists={artists} />
}
