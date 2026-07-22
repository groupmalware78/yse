import { prisma } from './db'

function parseArray(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[]
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return [] }
  }
  return []
}

export async function getArtistsForUI() {
  const rows = await prisma.artist.findMany({
    include: { tracks: true, artistAlbums: true, artistShows: true },
    orderBy: { name: 'asc' },
  })
  return rows.map(a => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    genre: a.genre,
    subGenre: a.subGenre,
    origin: a.origin,
    bio: a.bio,
    longBio: a.longBio,
    image: a.image,
    color: a.color,
    stats: { streams: a.streams, shows: a.shows, albums: a.albums, awards: a.awards },
    socials: {
      instagram: a.instagramUrl ?? '#',
      twitter: a.twitterUrl ?? '#',
      youtube: a.youtubeUrl ?? '#',
      spotify: a.spotifyUrl ?? '#',
    },
    tracks: a.tracks.map(t => ({ title: t.title, duration: t.duration, plays: t.plays, album: t.album })),
    albums: a.artistAlbums.map(al => ({ title: al.title, year: al.year, tracks: al.tracks })),
    upcomingShows: a.artistShows.map(s => ({ date: s.date, venue: s.venue, city: s.city })),
  }))
}

export type UIArtist = Awaited<ReturnType<typeof getArtistsForUI>>[0]

export async function getReleasesForUI() {
  const rows = await prisma.release.findMany({ orderBy: { year: 'desc' } })
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    artist: r.artist,
    artistSlug: r.artistSlug,
    type: r.type,
    year: r.year,
    genre: r.genre,
    tracks: r.tracks,
    label: r.label,
    streaming: {
      spotify: r.spotifyUrl ?? null,
      apple: r.appleUrl ?? null,
      youtube: r.youtubeUrl ?? null,
      tidal: r.tidalUrl ?? null,
      audiomack: r.audiomackUrl ?? null,
    },
    featured: r.featured,
  }))
}

export type UIRelease = Awaited<ReturnType<typeof getReleasesForUI>>[0]

export async function getEventsForUI() {
  const rows = await prisma.event.findMany({ orderBy: { date: 'asc' } })
  return rows.map(e => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time,
    venue: e.venue,
    city: e.city,
    type: e.type,
    artists: parseArray(e.artists),
    tickets: e.tickets ?? '#',
    featured: e.featured,
    description: e.description,
  }))
}

export type UIEvent = Awaited<ReturnType<typeof getEventsForUI>>[0]

function toProxyAudioUrl(url: string): string {
  // Already a proxy URL — leave as-is
  if (url.startsWith('/api/audio')) return url
  // Full S3 URL stored by earlier uploads — extract the key and proxy it
  const endpoint = process.env.AWS_ENDPOINT_URL
  const bucket = process.env.AWS_S3_BUCKET_NAME
  if (endpoint && bucket) {
    const prefix = `${endpoint}/${bucket}/`
    if (url.startsWith(prefix)) {
      const key = url.slice(prefix.length)
      return `/api/audio?key=${encodeURIComponent(key)}`
    }
  }
  return url
}

export async function getPlayerTracks() {
  const rows = await prisma.track.findMany({
    where: { featured: true, url: { not: null } },
    include: { artist: { select: { name: true } } },
    orderBy: { id: 'asc' },
  })
  return rows.map(t => ({
    id: t.id,
    title: t.title,
    artist: t.artist.name,
    url: toProxyAudioUrl(t.url!),
    duration: t.duration,
    album: t.album,
  }))
}

export type PlayerTrack = Awaited<ReturnType<typeof getPlayerTracks>>[0]

export async function getSoundPackagesForUI() {
  const rows = await prisma.soundPackage.findMany({ orderBy: { id: 'asc' } })
  return rows.map(p => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    priceRange: p.priceRange,
    capacity: p.capacity,
    duration: p.duration,
    features: parseArray(p.features),
    popular: p.popular,
    color: p.color ?? 'rgba(255,255,255,0.05)',
  }))
}
