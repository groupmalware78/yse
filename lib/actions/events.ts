'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export async function getEvents() {
  return prisma.event.findMany({ orderBy: { date: 'asc' } })
}

export async function createEvent(data: {
  title: string
  date: string
  time: string
  venue: string
  city: string
  type: string
  artists: string[]
  tickets?: string
  featured?: boolean
  description: string
}) {
  await prisma.event.create({ data })
  revalidatePath('/admin/events')
  revalidatePath('/')
}

export async function updateEvent(id: number, data: Partial<{
  title: string
  date: string
  time: string
  venue: string
  city: string
  type: string
  artists: string[]
  tickets: string
  featured: boolean
  description: string
}>) {
  await prisma.event.update({ where: { id }, data })
  revalidatePath('/admin/events')
  revalidatePath('/')
}

export async function deleteEvent(id: number) {
  await prisma.event.delete({ where: { id } })
  revalidatePath('/admin/events')
  revalidatePath('/')
}
