'use client'

function toEmbedUrl(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.replace(/^www\./, '') === 'audiomack.com' && !u.pathname.startsWith('/embed/')) {
      return `${u.origin}/embed${u.pathname}`
    }
    return url
  } catch {
    return url
  }
}

export function AudiomackPlayer({ url, className }: { url: string; className?: string }) {
  return (
    <iframe
      src={toEmbedUrl(url)}
      className={className ?? 'w-full rounded-lg'}
      style={{ height: 250 }}
      frameBorder="0"
      allow="autoplay; clipboard-write"
      title="Audiomack player"
    />
  )
}
