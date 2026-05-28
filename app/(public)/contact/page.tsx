export const dynamic = 'force-dynamic'

import { getSettings } from '@/lib/actions/settings'
import { ContactClient } from './ContactClient'

export default async function ContactPage() {
  const settings = await getSettings()
  return <ContactClient settings={settings} />
}
