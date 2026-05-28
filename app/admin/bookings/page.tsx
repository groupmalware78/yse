import { prisma } from '@/lib/db'
import { BookingsClient } from './BookingsClient'

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { submittedAt: 'desc' } })
  return <BookingsClient initialBookings={bookings} />
}
