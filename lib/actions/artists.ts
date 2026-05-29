'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export async function getArtists() {
  return prisma.artist.findMany({
    include: { tracks: true, artistAlbums: true, artistShows: true },
    orderBy: { name: 'asc' },
  })
}

export async function getArtistBySlug(slug: string) {
  return prisma.artist.findUnique({
    where: { slug },
    include: { tracks: true, artistAlbums: true, artistShows: true },
  })
}

export async function createArtist(data: {
  name: string
  genre: string
  subGenre: string
  origin: string
  bio: string
  longBio: string
  color?: string
  image?: string
  streams?: string
  shows?: string
  albums?: number
  awards?: number
}) {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  await prisma.artist.create({ data: { slug, ...data } })
  revalidatePath('/admin/artists')
  revalidatePath('/artists')
}

export async function updateArtist(id: number, data: Partial<{
  name: string
  genre: string
  subGenre: string
  origin: string
  bio: string
  longBio: string
  color: string
  image: string
  streams: string
  shows: string
  albums: number
  awards: number
  instagramUrl: string
  twitterUrl: string
  youtubeUrl: string
  spotifyUrl: string
}>) {
  await prisma.artist.update({ where: { id }, data })
  revalidatePath('/admin/artists')
  revalidatePath('/artists')
}

export async function deleteArtist(id: number) {
  await prisma.artist.delete({ where: { id } })
  revalidatePath('/admin/artists')
  revalidatePath('/artists')
}
