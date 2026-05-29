'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Instagram, Music } from 'lucide-react'
import type { UIArtist } from '@/lib/queries'
import { SectionHeader } from '@/components/ui/GlassCard'

function ArtistCard({ artist, index }: { artist: UIArtist; index: number }) {
  const genreColors: Record<string, string> = {
    Dancehall: '#d4af37',
    Reggae: '#00ffcc',
    'DJ / Selector': '#39ff14',
    'Reggae / Dub': '#d4af37',
    'Afrobeats / Reggae': '#ff0077',
    'DJ / Sound System': '#00ffcc',
  }
  const accent = genreColors[artist.genre] || '#d4af37'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/artists/${artist.slug}`} className="block group">
        <div className="glass rounded-2xl overflow-hidden card-hover border border-transparent hover:border-white/10 transition-all duration-400">
          {/* Artist image placeholder */}
          <div className="relative h-64 overflow-hidden">
            {/* Gradient background as image placeholder */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 30% 20%, ${accent}25 0%, #0f0f0f 60%, #060606 100%)`,
              }}
            />
            <div className="absolute inset-0 bg-grid opacity-40" />

            {/* Artist image or initials */}
            {artist.image
              ? <img src={artist.image} alt={artist.name} className="absolute inset-0 w-full h-full object-cover" />
              : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black"
                    style={{
                      background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
                      border: `1px solid ${accent}30`,
                      color: accent,
                    }}
                  >
                    {artist.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                </div>
              )
            }

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                  <Play size={14} className="text-gold ml-0.5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Instagram size={14} className="text-white/80" />
                </div>
              </div>
            </div>

            {/* Genre tag */}
            <div className="absolute top-3 left-3">
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: `${accent}18`,
                  border: `1px solid ${accent}35`,
                  color: accent,
                }}
              >
                {artist.genre}
              </span>
            </div>

            {/* Stream count */}
            <div className="absolute top-3 right-3">
              <div className="glass rounded-full px-2.5 py-1 flex items-center gap-1.5">
                <Music size={10} className="text-gold" />
                <span className="text-[10px] text-white/70 font-semibold">{artist.stats.streams}</span>
              </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Artist origin */}
            <div className="absolute bottom-3 left-3">
              <p className="text-white/40 text-[10px] tracking-wider">{artist.origin}</p>
            </div>
          </div>

          {/* Card body */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-black text-lg text-white group-hover:text-gold transition-colors duration-300 leading-none mb-1">
                  {artist.name}
                </h3>
                <p className="text-white/40 text-xs tracking-wider">{artist.subGenre}</p>
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
              >
                <ArrowRight size={12} style={{ color: accent }} />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 pt-3 border-t border-white/5">
              {[
                { val: artist.stats.shows, label: 'Shows' },
                { val: artist.stats.albums, label: 'Albums' },
                { val: artist.stats.awards, label: 'Awards' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="text-sm font-black text-white">{val}</p>
                  <p className="text-white/30 text-[9px] tracking-widest uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function FeaturedArtists({ artists }: { artists: UIArtist[] }) {
  const featured = artists.slice(0, 6)

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-sm opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeader
            label="The Roster"
            title={<>Our <span className="text-gold-gradient">Artists</span></>}
            subtitle="World-class talent representing the best of Caribbean music culture."
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/artists"
              className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap"
            >
              Full Roster <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((artist, i) => (
            <ArtistCard key={artist.slug} artist={artist} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
