export const dynamic = 'force-dynamic'

import { getSoundPackagesForUI } from '@/lib/queries'
import { SoundSystemAdminClient } from './SoundSystemAdminClient'

export default async function AdminSoundSystemPage() {
  const packages = await getSoundPackagesForUI()
  return <SoundSystemAdminClient initialPackages={packages} />
}
