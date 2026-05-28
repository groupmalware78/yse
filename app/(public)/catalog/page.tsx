import { getReleasesForUI } from '@/lib/queries'
import { CatalogClient } from './CatalogClient'

export default async function CatalogPage() {
  const releases = await getReleasesForUI()
  return <CatalogClient releases={releases} />
}
