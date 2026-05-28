'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

const isSQLite = process.env.DATABASE_URL?.startsWith('file:') ?? false
const serializeArr = (v: string[]) => isSQLite ? JSON.stringify(v) as unknown as string[] : v

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.event.create({ data: { ...data, artists: serializeArr(data.artists) } as any })
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
  const payload = data.artists !== undefined ? { ...data, artists: serializeArr(data.artists) } : data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.event.update({ where: { id }, data: payload as any })
  revalidatePath('/admin/events')
  revalidatePath('/')
}

export async function deleteEvent(id: number) {
  await prisma.event.delete({ where: { id } })
  revalidatePath('/admin/events')
  revalidatePath('/')
}
