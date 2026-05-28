'use client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, ExternalLink, Instagram, Twitter, Youtube, Music, Calendar, MapPin, Award, Mic, Download } from 'lucide-react'
import { artists } from '@/lib/data'
import { AudioVisualizer } from '@/components/ui/AudioVisualizer'

const genreColors: Record<string, string> = {
  Dancehall: '#d4af37',
  Reggae: '#00ffcc',
  'DJ / Selector': '#39ff14',
  'Reggae / Dub': '#d4af37',
  'Afrobeats / Reggae': '#ff0077',
  'DJ / Sound System': '#00ffcc',
}

export default function ArtistProfilePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const artist = artists.find(a => a.slug === slug)

  if (!artist) notFound()

  const accent = genreColors[artist.genre] || '#d4af37'
  const initials = artist.name.split(' ').map(w => w[0]).join('').slice(0, 2)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-yse-darker" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Hero ambient */}
      <div
        className="absolute top-0 left-0 right-0 h-[70vh]"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}18 0%, transparent 70%)` }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-72 rounded-full blur-[150px]"
        style={{ background: `${accent}10` }} />

      {/* Stage light beams */}
      {['-20deg', '0deg', '20deg'].map((rot, i) => (
        <div key={i} className="absolute top-0 left-1/2 w-px h-[50vh]"
          style={{
            background: `linear-gradient(180deg, ${accent}50 0%, transparent 100%)`,
            filter: 'blur(8px)',
            transform: `translateX(-50%) rotate(${rot})`,
            transformOrigin: 'top',
            opacity: 0.4,
          }} />
      ))}

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-28 pb-24">
        {/* Back link */}
        <Link
          href="/artists"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-10 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          All Artists
        </Link>

        {/* Hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20">
          {/* Artist visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30"
                style={{ background: accent, transform: 'scale(1.3)' }}
              />
              {/* Artist circle */}
              <div
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center font-black text-7xl md:text-8xl border-2"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${accent}25 0%, #111 50%, #060606 100%)`,
                  borderColor: `${accent}30`,
                  color: accent,
                }}
              >
                {initials}
                {/* Inner rings */}
                {[0.8, 0.6].map((s, i) => (
                  <div key={i} className="absolute rounded-full border inset-0 m-auto"
                    style={{ width: `${s * 100}%`, height: `${s * 100}%`, borderColor: `${accent}${i === 0 ? '12' : '08'}` }} />
                ))}
              </div>

              {/* Floating stat badges */}
              <div className="absolute -right-4 top-8 glass-gold rounded-xl px-3 py-2 border border-gold/20 text-center">
                <p className="text-gold font-black text-lg leading-none">{artist.stats.streams}</p>
                <p className="text-white/40 text-[9px] tracking-widest uppercase">Streams</p>
              </div>
              <div className="absolute -left-4 bottom-16 glass rounded-xl px-3 py-2 border border-white/8 text-center">
                <p className="text-white font-black text-lg leading-none">{artist.stats.shows}</p>
                <p className="text-white/40 text-[9px] tracking-widest uppercase">Shows</p>
              </div>
            </div>
          </motion.div>

          {/* Artist info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3 flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>
                {artist.genre}
              </span>
              <span className="text-white/25 text-xs">{artist.origin}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none mb-4 tracking-tight">
              {artist.name.split(' ').map((word, wi) => (
                <span key={wi} className={wi === 1 ? 'text-gold-gradient' : 'text-white'}>
                  {word}{' '}
                </span>
              ))}
            </h1>

            <p className="text-white/45 text-base leading-relaxed mb-8 max-w-xl">
              {artist.bio}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { icon: Music, val: artist.stats.streams, label: 'Streams' },
                { icon: Mic, val: artist.stats.shows, label: 'Shows' },
                { icon: Award, val: artist.stats.awards, label: 'Awards' },
                { icon: Calendar, val: artist.albums.length, label: 'Albums' },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={11} style={{ color: accent }} />
                    <p className="font-black text-xl text-white">{val}</p>
                  </div>
                  <p className="text-white/30 text-[9px] tracking-widest uppercase">{label}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="/booking" className="btn-gold px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase inline-flex items-center gap-2">
                Book Artist <ExternalLink size={13} />
              </Link>
              <button className="btn-glass px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase inline-flex items-center gap-2">
                <Download size={13} /> Press Kit
              </button>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Instagram, href: artist.socials.instagram, label: 'Instagram' },
                { icon: Twitter, href: artist.socials.twitter, label: 'Twitter' },
                { icon: Youtube, href: artist.socials.youtube, label: 'YouTube' },
                { icon: Music, href: artist.socials.spotify, label: 'Spotify' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all duration-300 border border-white/8">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Audio visualizer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <AudioVisualizer barCount={64} color={accent} height={60} className="opacity-40" />
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Tracks + Albums */}
          <div className="lg:col-span-2 space-y-8">
            {/* Top Tracks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl overflow-hidden border border-white/5"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music size={14} style={{ color: accent }} />
                  <span className="font-bold text-sm">Top Tracks</span>
                </div>
                <span className="text-white/25 text-xs">{artist.tracks.length} tracks</span>
              </div>
              {artist.tracks.map((track, i) => (
                <motion.div
                  key={track.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group"
                >
                  <span className="text-white/20 text-xs font-mono w-5 flex-shrink-0">{i + 1}</span>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 group-hover:text-white transition-colors flex-shrink-0 group-hover:bg-white/8">
                    <Play size={12} className="ml-0.5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate group-hover:text-gold transition-colors">{track.title}</p>
                    <p className="text-white/30 text-xs truncate">{track.album}</p>
                  </div>
                  <span className="text-white/25 text-xs font-mono">{track.plays}</span>
                  <span className="text-white/25 text-xs font-mono">{track.duration}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Albums */}
            {artist.albums.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-black text-xl mb-5 flex items-center gap-2">
                  <span>Discography</span>
                  <span className="text-white/20 text-sm font-normal">({artist.albums.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {artist.albums.map((album, i) => (
                    <motion.div
                      key={album.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="glass rounded-xl p-4 border border-white/5 hover:border-white/12 card-hover group"
                    >
                      <div className="aspect-square rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                        style={{ background: `radial-gradient(circle, ${accent}18 0%, #111 70%)` }}>
                        <span className="font-black text-2xl" style={{ color: accent }}>
                          {album.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                          <Play size={20} className="text-white ml-1" />
                        </div>
                      </div>
                      <p className="font-bold text-sm text-white truncate group-hover:text-gold transition-colors">{album.title}</p>
                      <p className="text-white/30 text-xs">{album.year} · {album.tracks} tracks</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-white/5"
            >
              <h3 className="font-black text-sm uppercase tracking-widest text-white/40 mb-4">About</h3>
              <p className="text-white/50 text-sm leading-relaxed">{artist.longBio}</p>
            </motion.div>

            {/* Upcoming shows */}
            {artist.upcomingShows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <h3 className="font-black text-sm uppercase tracking-widest text-white/40 mb-5">Upcoming Shows</h3>
                <div className="space-y-4">
                  {artist.upcomingShows.map(show => (
                    <div key={show.date} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 flex flex-col items-center justify-center text-black text-center"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}>
                        <span className="text-sm font-black leading-none">
                          {new Date(show.date).getDate()}
                        </span>
                        <span className="text-[8px] font-bold">
                          {new Date(show.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{show.venue}</p>
                        <p className="text-white/40 text-xs flex items-center gap-1">
                          <MapPin size={9} /> {show.city}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Streaming */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-gold rounded-2xl p-6 border border-gold/15"
            >
              <h3 className="font-black text-sm uppercase tracking-widest text-gold/60 mb-4">Stream</h3>
              <div className="space-y-3">
                {[
                  { platform: 'Spotify', icon: '♫', color: '#1DB954' },
                  { platform: 'Apple Music', icon: '♪', color: '#FA243C' },
                  { platform: 'YouTube Music', icon: '▶', color: '#FF0000' },
                  { platform: 'TIDAL', icon: '~', color: '#00FFFF' },
                ].map(p => (
                  <a key={p.platform} href="#"
                    className="flex items-center gap-3 p-3 glass rounded-xl text-sm font-semibold hover:bg-white/8 transition-colors group border border-transparent hover:border-white/8">
                    <span style={{ color: p.color }}>{p.icon}</span>
                    <span className="text-white/60 group-hover:text-white transition-colors flex-1">{p.platform}</span>
                    <ExternalLink size={12} className="text-white/20 group-hover:text-white/50 transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
