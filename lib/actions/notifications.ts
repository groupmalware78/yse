'use server'
import { prisma } from '@/lib/db'

export async function getNotifications() {
  const [bookings, subscribers] = await Promise.all([
    prisma.booking.findMany({
      where: { status: 'pending' },
      orderBy: { submittedAt: 'desc' },
      take: 5,
      select: { id: true, ref: true, name: true, service: true, submittedAt: true },
    }),
    prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      take: 3,
      select: { id: true, email: true, subscribedAt: true },
    }),
  ])
  return { bookings, subscribers }
}
