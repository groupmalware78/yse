'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Play, Users, Music, Award } from 'lucide-react'
import type { UIArtist } from '@/lib/queries'

const genreColors: Record<string, string> = {
  Dancehall: '#d4af37',
  Reggae: '#00ffcc',
  'DJ / Selector': '#39ff14',
  'Reggae / Dub': '#d4af37',
  'Afrobeats / Reggae': '#ff0077',
  'DJ / Sound System': '#00ffcc',
}

export function ArtistsClient({ artists }: { artists: UIArtist[] }) {
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('All')

  const allGenres = ['All', ...Array.from(new Set(artists.map(a => a.genre)))]

  const filtered = artists.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.genre.toLowerCase().includes(search.toLowerCase())
    const matchGenre = activeGenre === 'All' || a.genre === activeGenre
    return matchSearch && matchGenre
  })

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-yse-darker" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-deep-green/30 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <p className="section-label mb-4">The Roster</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-3">
                Our <span className="text-gold-gradient">Artists</span>
              </h1>
              <p className="text-white/45 max-w-lg">
                World-class talent. Authentic Caribbean music culture. Every artist on the YardStyle roster is handpicked for their artistry and impact.
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <Users size={14} className="text-gold" />
              <span className="font-bold">{artists.length}</span> artists
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search artists..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark w-full pl-12 pr-4 py-3.5 rounded-full text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allGenres.map(g => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
                  activeGenre === g ? 'bg-gold text-black shadow-gold' : 'glass text-white/50 hover:text-white border border-white/8'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeGenre + search} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((artist, i) => {
              const accent = genreColors[artist.genre] || '#d4af37'
              const initials = artist.name.split(' ').map(w => w[0]).join('').slice(0, 2)
              return (
                <motion.div key={artist.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link href={`/artists/${artist.slug}`} className="block group">
                    <div className="glass rounded-3xl overflow-hidden card-hover border border-white/5 hover:border-white/12">
                      <div className="relative h-56 overflow-hidden">
                        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 40% 30%, ${accent}25 0%, #0f0f0f 55%, #060606 100%)` }} />
                        <div className="absolute inset-0 bg-grid opacity-40" />
                        <div className="absolute top-0 left-1/3 w-px h-full" style={{ background: `linear-gradient(180deg, ${accent}40 0%, transparent 100%)`, filter: 'blur(4px)' }} />
                        <div className="absolute top-0 right-1/3 w-px h-full" style={{ background: `linear-gradient(180deg, ${accent}25 0%, transparent 100%)`, filter: 'blur(4px)' }} />
                        {artist.image
                          ? <img src={artist.image} alt={artist.name} className="absolute inset-0 w-full h-full object-cover" />
                          : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                                <div className="w-28 h-28 rounded-full flex items-center justify-center font-black text-4xl"
                                  style={{ background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`, border: `2px solid ${accent}30`, color: accent }}>
                                  {initials}
                                </div>
                              </motion.div>
                            </div>
                          )
                        }
                        <div className="absolute top-4 left-4">
                          <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                            style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>
                            {artist.genre}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="w-9 h-9 rounded-full btn-gold flex items-center justify-center">
                            <Play size={13} className="ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <p className="text-white/35 text-[10px] tracking-wider">{artist.origin}</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="font-black text-xl text-white group-hover:text-gold transition-colors duration-300">{artist.name}</h2>
                            <p className="text-white/40 text-xs tracking-wider mt-0.5">{artist.subGenre}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                            style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
                            <ArrowRight size={13} style={{ color: accent }} />
                          </div>
                        </div>
                        <p className="text-white/35 text-xs leading-relaxed mb-5 line-clamp-2">{artist.bio}</p>
                        <div className="flex items-center gap-0 border-t border-white/5 pt-4">
                          {[
                            { icon: Music, val: artist.stats.streams, label: 'Streams' },
                            { icon: Users, val: artist.stats.shows, label: 'Shows' },
                            { icon: Award, val: artist.stats.awards, label: 'Awards' },
                          ].map(({ icon: Icon, val, label }, idx) => (
                            <div key={label} className={`flex-1 text-center ${idx > 0 ? 'border-l border-white/5' : ''}`}>
                              <p className="font-black text-sm text-white">{val}</p>
                              <p className="text-white/25 text-[9px] tracking-widest uppercase mt-0.5">{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 font-bold text-lg">No artists found</p>
            <p className="text-white/20 text-sm mt-1">Try a different search or filter</p>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-20 glass-gold rounded-3xl p-10 text-center border border-gold/20">
          <p className="section-label justify-center mb-4">Artist Booking</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Want to Book One of <span className="text-gold-gradient">Our Artists?</span>
          </h2>
          <p className="text-white/45 mb-8 max-w-md mx-auto">
            Fill out our booking form and our team will get back to you within 24 hours with availability and rates.
          </p>
          <Link href="/booking" className="btn-gold px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
            Submit a Booking Request <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
