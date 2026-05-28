import { getSoundPackagesForUI } from '@/lib/queries'
import { SoundSystemClient } from './SoundSystemClient'

export default async function SoundSystemPage() {
  const soundPackages = await getSoundPackagesForUI()
  return <SoundSystemClient soundPackages={soundPackages} />
}
