'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export async function getReleases() {
  return prisma.release.findMany({ orderBy: { year: 'desc' } })
}

export async function createRelease(data: {
  title: string
  artist: string
  artistSlug: string
  type: string
  year: number
  genre: string
  tracks: number
  label?: string
  spotifyUrl?: string
  appleUrl?: string
  youtubeUrl?: string
  tidalUrl?: string
  audiomackUrl?: string
  featured?: boolean
}) {
  await prisma.release.create({ data })
  revalidatePath('/admin/releases')
  revalidatePath('/catalog')
}

export async function updateRelease(id: number, data: Partial<{
  title: string
  artist: string
  artistSlug: string
  type: string
  year: number
  genre: string
  tracks: number
  featured: boolean
  spotifyUrl: string
  appleUrl: string
  youtubeUrl: string
  tidalUrl: string
  audiomackUrl: string
}>) {
  await prisma.release.update({ where: { id }, data })
  revalidatePath('/admin/releases')
  revalidatePath('/catalog')
}

export async function deleteRelease(id: number) {
  await prisma.release.delete({ where: { id } })
  revalidatePath('/admin/releases')
  revalidatePath('/catalog')
}
