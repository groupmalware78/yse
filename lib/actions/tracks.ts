'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export async function getTracks() {
  return prisma.track.findMany({
    include: { artist: { select: { name: true, slug: true } } },
    orderBy: { id: 'asc' },
  })
}

export async function createTrack(data: {
  title: string
  album: string
  duration: string
  artistId: number
  url?: string
  featured?: boolean
}) {
  await prisma.track.create({ data: { plays: '0', ...data } })
  revalidatePath('/admin/tracks')
}

export async function updateTrack(id: number, data: Partial<{
  title: string
  album: string
  duration: string
  url: string
  featured: boolean
}>) {
  await prisma.track.update({ where: { id }, data })
  revalidatePath('/admin/tracks')
}

export async function deleteTrack(id: number) {
  await prisma.track.delete({ where: { id } })
  revalidatePath('/admin/tracks')
}
