'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

function generateRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return 'YSE-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function createBooking(data: {
  service: string
  eventName: string
  eventDate: string
  venue?: string
  city: string
  guestCount: string
  budget: string
  name: string
  email: string
  phone: string
  organization?: string
  notes?: string
  genre?: string
}) {
  await prisma.booking.create({
    data: {
      ref: generateRef(),
      venue: '',
      ...data,
    },
  })
  revalidatePath('/admin/bookings')
}

export async function updateBookingStatus(id: string, status: string) {
  await prisma.booking.update({ where: { id }, data: { status } })
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/dashboard')
}

export async function deleteBooking(id: string) {
  await prisma.booking.delete({ where: { id } })
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/dashboard')
}

export async function getBookings() {
  return prisma.booking.findMany({ orderBy: { submittedAt: 'desc' } })
}

export async function getBookingStats() {
  const [total, pending, confirmed, completed, cancelled] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'pending' } }),
    prisma.booking.count({ where: { status: 'confirmed' } }),
    prisma.booking.count({ where: { status: 'completed' } }),
    prisma.booking.count({ where: { status: 'cancelled' } }),
  ])
  return { total, pending, confirmed, completed, cancelled }
}
