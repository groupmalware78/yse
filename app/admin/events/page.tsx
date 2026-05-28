export const dynamic = 'force-dynamic'

import { getEventsForUI } from '@/lib/queries'
import { EventsAdminClient } from './EventsAdminClient'

export default async function AdminEventsPage() {
  const events = await getEventsForUI()
  return <EventsAdminClient initialEvents={events} />
}
