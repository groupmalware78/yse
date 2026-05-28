export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/actions/auth'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const session = await getSession()

  const [artistCount, releaseCount, eventCount, bookingStats, recentBookings, upcomingEvents] =
    await Promise.all([
      prisma.artist.count(),
      prisma.release.count(),
      prisma.event.count(),
      Promise.all([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: 'pending' } }),
        prisma.booking.count({ where: { status: 'confirmed' } }),
        prisma.booking.count({ where: { status: 'completed' } }),
        prisma.booking.count({ where: { status: 'cancelled' } }),
      ]).then(([total, pending, confirmed, completed, cancelled]) => ({
        total, pending, confirmed, completed, cancelled,
      })),
      prisma.booking.findMany({ orderBy: { submittedAt: 'desc' }, take: 5 }),
      prisma.event.findMany({ orderBy: { date: 'asc' }, take: 3 }),
    ])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardClient
      greeting={greeting}
      adminName={session?.name ?? 'Admin'}
      artistCount={artistCount}
      releaseCount={releaseCount}
      eventCount={eventCount}
      bookingStats={bookingStats}
      recentBookings={recentBookings}
      upcomingEvents={upcomingEvents}
    />
  )
}
