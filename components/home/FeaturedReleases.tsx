'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, ExternalLink, ArrowRight, Disc } from 'lucide-react'
import type { UIRelease } from '@/lib/queries'
import { SectionHeader } from '@/components/ui/GlassCard'
import { StreamingPlayer, type StreamingPlatform } from '@/components/ui/StreamingPlayer'

const hasUrl = (url: string | null | undefined) => !!url && url.trim() !== '' && url.trim() !== '#'

const genreColors: Record<string, string> = {
  Dancehall: '#d4af37',
  'Roots Reggae': '#00ffcc',
  'Afrobeats / Reggae': '#ff0077',
  'Caribbean Fusion': '#ff0077',
  'Dub / Reggae': '#39ff14',
  'Sound System': '#39ff14',
}

const platformLabels: { platform: StreamingPlatform; label: string }[] = [
  { platform: 'spotify', label: '♫ Spotify' },
  { platform: 'apple', label: '♪ Apple' },
  { platform: 'youtube', label: '▶ YT' },
  { platform: 'tidal', label: '~ TIDAL' },
  { platform: 'audiomack', label: '▲ Audiomack' },
]

function AlbumCard({ release, index }: { release: UIRelease; index: number }) {
  const accent = genreColors[release.genre] || '#d4af37'
  const letters = release.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const [activePlatform, setActivePlatform] = useState<StreamingPlatform | null>(null)
  const urls: Record<StreamingPlatform, string | null> = {
    spotify: release.streaming.spotify,
    apple: release.streaming.apple,
    youtube: release.streaming.youtube,
    tidal: release.streaming.tidal,
    audiomack: release.streaming.audiomack,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group"
    >
      <div className="glass rounded-2xl overflow-hidden card-hover border border-white/5 hover:border-white/10">
        {/* Album art */}
        <div className="album-art-wrap relative aspect-square">
          {/* Abstract gradient art */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 35% 25%, ${accent}30 0%, #111 40%, #080808 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-grid opacity-30" />

          {/* Vinyl-style rings */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            {[0.9, 0.7, 0.5, 0.3].map((size, i) => (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${size * 100}%`,
                  height: `${size * 100}%`,
                  borderColor: `${accent}${10 + i * 5}`,
                }}
              />
            ))}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl"
              style={{
                background: `radial-gradient(circle, ${accent}25 0%, transparent 70%)`,
                border: `2px solid ${accent}35`,
                color: accent,
              }}
            >
              {letters}
            </div>
          </div>

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span
              className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
            >
              {release.type}
            </span>
          </div>

          {/* Hover overlay */}
          <div className="album-overlay">
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-full btn-gold flex items-center justify-center">
                <Play size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-black text-sm text-white group-hover:text-gold transition-colors duration-300 leading-tight mb-0.5 truncate">
            {release.title}
          </h3>
          <p className="text-white/40 text-xs mb-3">{release.artist} · {release.year}</p>

          {/* Genre & tracks */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/30">{release.tracks} tracks</span>
            <span className="text-[10px] font-semibold" style={{ color: accent }}>{release.genre}</span>
          </div>

          {/* Streaming icons */}
          <div className="flex items-center gap-2">
            {platformLabels.filter(p => hasUrl(urls[p.platform])).map(p => (
              <button
                key={p.platform}
                onClick={() => setActivePlatform(v => v === p.platform ? null : p.platform)}
                className={`flex-1 text-center py-1.5 glass rounded-lg text-[10px] font-semibold transition-colors border ${activePlatform === p.platform ? 'text-gold border-gold/30' : 'text-white/40 hover:text-white border-transparent hover:border-white/10'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {activePlatform && hasUrl(urls[activePlatform]) && (
            <div className="mt-3">
              <StreamingPlayer platform={activePlatform} url={urls[activePlatform]!} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedReleases({ releases }: { releases: UIRelease[] }) {
  const featured = releases.filter(r => r.featured)
  const recent = releases.filter(r => !r.featured).slice(0, 4)

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-deep-green/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeader
            label="Music Catalog"
            title={<>Latest <span className="text-gold-gradient">Releases</span></>}
            subtitle="Fresh music from the YardStyle roster. Stream on all major platforms."
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/catalog"
              className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap"
            >
              Full Catalog <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Featured albums - large */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featured.map((release, i) => (
            <AlbumCard key={release.id} release={release} index={i} />
          ))}
        </div>

        {/* Recent singles - compact list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl overflow-hidden border border-white/5"
        >
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Disc size={14} className="text-gold" />
              <span className="text-white/50 text-xs font-bold tracking-widest uppercase">Recent Releases</span>
            </div>
            <Link href="/catalog" className="text-gold text-xs font-semibold hover:text-gold-light transition-colors">
              View all →
            </Link>
          </div>
          {recent.map((release, i) => {
            const accent = genreColors[release.genre] || '#d4af37'
            return (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0"
                  style={{ background: `${accent}20`, border: `1px solid ${accent}30`, color: accent }}>
                  {release.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate group-hover:text-gold transition-colors">{release.title}</p>
                  <p className="text-white/35 text-xs truncate">{release.artist} · {release.type} · {release.year}</p>
                </div>
                <span
                  className="text-[10px] font-semibold hidden md:block whitespace-nowrap"
                  style={{ color: accent }}
                >
                  {release.genre}
                </span>
                <div className="flex items-center gap-2">
                  {hasUrl(release.streaming.spotify) ? (
                    <a href={release.streaming.spotify!} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="text-white/10 cursor-not-allowed opacity-40">
                      <ExternalLink size={13} />
                    </span>
                  )}
                  <button className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <Play size={12} className="ml-0.5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
