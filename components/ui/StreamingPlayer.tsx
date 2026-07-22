'use client'

export type StreamingPlatform = 'spotify' | 'apple' | 'youtube' | 'tidal' | 'audiomack'

type Embed = { src: string; height: number; allow: string }

function spotifyEmbed(url: string): Embed | null {
  const u = new URL(url)
  const [, type, id] = u.pathname.split('/')
  if (!type || !id) return null
  return {
    src: `https://open.spotify.com/embed/${type}/${id}`,
    height: type === 'track' || type === 'episode' ? 152 : 352,
    allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
  }
}

function appleEmbed(url: string): Embed | null {
  const u = new URL(url)
  const parts = u.pathname.split('/').filter(Boolean)
  const type = parts[1]
  return {
    src: `https://embed.music.apple.com${u.pathname}${u.search}`,
    height: type === 'song' || u.searchParams.has('i') ? 175 : 450,
    allow: 'autoplay *; encrypted-media *;',
  }
}

function youtubeEmbed(url: string): Embed | null {
  const u = new URL(url)
  const host = u.hostname.replace(/^www\./, '')
  let videoId: string | null = null
  let listId: string | null = u.searchParams.get('list')
  if (host === 'youtu.be') videoId = u.pathname.slice(1)
  else if (u.pathname === '/watch') videoId = u.searchParams.get('v')
  else if (u.pathname.startsWith('/embed/')) videoId = u.pathname.split('/')[2]
  if (!videoId && !listId) return null
  const src = videoId
    ? `https://www.youtube.com/embed/${videoId}${listId ? `?list=${listId}` : ''}`
    : `https://www.youtube.com/embed/videoseries?list=${listId}`
  return { src, height: 200, allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' }
}

function tidalEmbed(url: string): Embed | null {
  const u = new URL(url)
  const parts = u.pathname.split('/').filter(Boolean)
  const type = parts.find(p => ['track', 'album', 'playlist'].includes(p))
  const id = type ? parts[parts.indexOf(type) + 1] : null
  if (!type || !id) return null
  const plural = type === 'track' ? 'tracks' : type === 'album' ? 'albums' : 'playlists'
  return {
    src: `https://embed.tidal.com/${plural}/${id}`,
    height: type === 'track' ? 150 : 400,
    allow: 'autoplay; encrypted-media',
  }
}

function audiomackEmbed(url: string): Embed | null {
  const u = new URL(url)
  if (u.pathname.startsWith('/embed/')) return { src: url, height: 250, allow: 'autoplay; clipboard-write' }
  return { src: `${u.origin}/embed${u.pathname}`, height: 250, allow: 'autoplay; clipboard-write' }
}

function getEmbed(platform: StreamingPlatform, url: string): Embed | null {
  try {
    switch (platform) {
      case 'spotify': return spotifyEmbed(url)
      case 'apple': return appleEmbed(url)
      case 'youtube': return youtubeEmbed(url)
      case 'tidal': return tidalEmbed(url)
      case 'audiomack': return audiomackEmbed(url)
    }
  } catch {
    return null
  }
}

export function StreamingPlayer({ platform, url, className }: { platform: StreamingPlatform; url: string; className?: string }) {
  const embed = getEmbed(platform, url)
  if (!embed) return null
  return (
    <iframe
      src={embed.src}
      className={className ?? 'w-full rounded-lg'}
      style={{ height: embed.height }}
      frameBorder="0"
      allow={embed.allow}
      title={`${platform} player`}
    />
  )
}
