'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Play, ExternalLink, LayoutGrid, List, Filter, Music, Disc } from 'lucide-react'
import type { UIRelease } from '@/lib/queries'
import { AudiomackPlayer } from '@/components/ui/AudiomackPlayer'

const genreColors: Record<string, string> = {
  Dancehall: '#d4af37',
  'Roots Reggae': '#00ffcc',
  'Afrobeats / Reggae': '#ff0077',
  'Caribbean Fusion': '#ff0077',
  'Dub / Reggae': '#39ff14',
  'Sound System': '#39ff14',
}

const hasUrl = (url: string | null | undefined) => !!url && url.trim() !== '' && url.trim() !== '#'

const streamingPlatforms = [
  { name: 'Spotify', icon: '♫', color: '#1DB954' },
  { name: 'Apple Music', icon: '♪', color: '#FA243C' },
  { name: 'YouTube', icon: '▶', color: '#FF0000' },
  { name: 'TIDAL', icon: '~', color: '#00FFFF' },
  { name: 'Audiomack', icon: '▲', color: '#FFA200' },
]

function AlbumGridCard({ release }: { release: UIRelease }) {
  const accent = genreColors[release.genre] || '#d4af37'
  const letters = release.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const [showAudiomack, setShowAudiomack] = useState(false)
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
      className="group glass rounded-2xl overflow-hidden card-hover border border-white/5 hover:border-white/12">
      <div className="relative aspect-square">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 35% 25%, ${accent}30 0%, #111 45%, #080808 100%)` }} />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          {[0.85, 0.65, 0.45, 0.25].map((s, i) => (
            <div key={i} className="absolute rounded-full border" style={{ width: `${s * 100}%`, height: `${s * 100}%`, borderColor: `${accent}${10 + i * 7}` }} />
          ))}
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg z-10"
            style={{ background: `${accent}20`, border: `2px solid ${accent}40`, color: accent }}>{letters}</div>
        </div>
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>{release.type}</span>
        </div>
        <div className="album-overlay z-10">
          <button className="w-14 h-14 rounded-full btn-gold flex items-center justify-center shadow-gold-lg">
            <Play size={20} className="ml-1" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-black text-sm text-white group-hover:text-gold transition-colors truncate mb-0.5">{release.title}</h3>
        <p className="text-white/40 text-xs mb-1">{release.artist}</p>
        <p className="text-white/25 text-[10px] mb-4">{release.year} · {release.tracks} tracks · {release.genre}</p>
        <div className="flex gap-1.5">
          {[
            { href: release.streaming.spotify, label: '♫' },
            { href: release.streaming.apple, label: '♪' },
            { href: release.streaming.youtube, label: '▶' },
            { href: release.streaming.tidal, label: '~' },
          ].map((p, i) => hasUrl(p.href) ? (
            <a key={i} href={p.href!} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 glass rounded-lg text-xs text-white/40 hover:text-white transition-colors border border-transparent hover:border-white/10">
              {p.label}
            </a>
          ) : (
            <span key={i} className="flex-1 text-center py-2 glass rounded-lg text-xs text-white/15 border border-transparent cursor-not-allowed opacity-40">
              {p.label}
            </span>
          ))}
          {hasUrl(release.streaming.audiomack) ? (
            <button onClick={() => setShowAudiomack(v => !v)} className={`flex-1 text-center py-2 glass rounded-lg text-xs transition-colors border ${showAudiomack ? 'text-gold border-gold/30' : 'text-white/40 hover:text-white border-transparent hover:border-white/10'}`}>
              ▲
            </button>
          ) : (
            <span className="flex-1 text-center py-2 glass rounded-lg text-xs text-white/15 border border-transparent cursor-not-allowed opacity-40">
              ▲
            </span>
          )}
        </div>
        {showAudiomack && hasUrl(release.streaming.audiomack) && (
          <div className="mt-3">
            <AudiomackPlayer url={release.streaming.audiomack!} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function AlbumListRow({ release, index }: { release: UIRelease; index: number }) {
  const accent = genreColors[release.genre] || '#d4af37'
  const letters = release.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-center gap-5 p-4 glass rounded-xl border border-white/5 hover:border-white/10 card-hover group">
      <span className="text-white/20 text-xs w-5 flex-shrink-0 font-mono">{(index + 1).toString().padStart(2, '0')}</span>
      <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-sm"
        style={{ background: `${accent}20`, border: `1px solid ${accent}30`, color: accent }}>{letters}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-white group-hover:text-gold transition-colors truncate">{release.title}</p>
        <p className="text-white/35 text-xs">{release.artist} · {release.year}</p>
      </div>
      <div className="hidden md:block">
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
          {release.genre}
        </span>
      </div>
      <span className="hidden lg:block text-white/30 text-xs">{release.tracks} tracks</span>
      <div className="flex items-center gap-2">
        {[release.streaming.spotify, release.streaming.apple].map((href, i) => hasUrl(href) ? (
          <a key={i} href={href!} target="_blank" rel="noopener noreferrer" className="text-white/25 hover:text-white transition-colors"><ExternalLink size={13} /></a>
        ) : (
          <span key={i} className="text-white/10 cursor-not-allowed opacity-40"><ExternalLink size={13} /></span>
        ))}
        <button className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-colors">
          <Play size={12} className="ml-0.5" />
        </button>
      </div>
    </motion.div>
  )
}

export function CatalogClient({ releases }: { releases: UIRelease[] }) {
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('All')
  const [activeType, setActiveType] = useState('All')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const genres = ['All', ...Array.from(new Set(releases.map(r => r.genre)))]
  const releaseTypes = ['All', ...Array.from(new Set(releases.map(r => r.type)))]

  const filtered = releases.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.artist.toLowerCase().includes(search.toLowerCase())
    const matchGenre = activeGenre === 'All' || r.genre === activeGenre
    const matchType = activeType === 'All' || r.type === activeType
    return matchSearch && matchGenre && matchType
  })

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-yse-darker" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <p className="section-label mb-4">Discography</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-3">Music <span className="text-gold-gradient">Catalog</span></h1>
              <p className="text-white/45">All releases from the YardStyle Entertainment roster</p>
            </div>
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <Disc size={14} className="text-gold" />
              <span className="font-bold">{releases.length}</span> releases
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3 mb-10">
          {streamingPlatforms.map(p => (
            <a key={p.name} href="#" className="glass px-4 py-2 rounded-full text-xs font-bold tracking-wider flex items-center gap-2 hover:bg-white/8 transition-colors border border-white/5 hover:border-white/12" style={{ color: p.color }}>
              {p.icon} {p.name}
            </a>
          ))}
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" placeholder="Search releases, artists..." value={search} onChange={e => setSearch(e.target.value)} className="input-dark w-full pl-12 pr-4 py-3.5 rounded-full text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(v => !v)} className={`btn-glass px-4 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2 ${showFilters ? 'border-gold/30 text-gold' : ''}`}>
              <Filter size={14} /> Filters
            </button>
            <div className="glass rounded-full p-1 flex gap-1">
              <button onClick={() => setView('grid')} className={`p-2.5 rounded-full transition-all ${view === 'grid' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}><LayoutGrid size={15} /></button>
              <button onClick={() => setView('list')} className={`p-2.5 rounded-full transition-all ${view === 'list' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}><List size={15} /></button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="glass rounded-2xl p-6 mb-8 border border-white/5">
                <div className="mb-5">
                  <p className="text-white/30 text-xs font-bold tracking-widest uppercase mb-3">Genre</p>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(g => (
                      <button key={g} onClick={() => setActiveGenre(g)} className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${activeGenre === g ? 'bg-gold text-black shadow-gold' : 'glass text-white/50 hover:text-white border border-white/8'}`}>{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/30 text-xs font-bold tracking-widest uppercase mb-3">Type</p>
                  <div className="flex flex-wrap gap-2">
                    {releaseTypes.map(t => (
                      <button key={t} onClick={() => setActiveType(t)} className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${activeType === t ? 'bg-gold text-black shadow-gold' : 'glass text-white/50 hover:text-white border border-white/8'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 mb-6">
          <Music size={13} className="text-gold" />
          <span className="text-white/30 text-sm">Showing <span className="text-white font-bold">{filtered.length}</span> releases</span>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4"><Search size={28} className="text-white/20" /></div>
              <p className="text-white/40 font-bold text-lg mb-2">No releases found</p>
              <p className="text-white/20 text-sm">Try different search terms or filters</p>
            </motion.div>
          ) : view === 'grid' ? (
            <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(r => <AlbumGridCard key={r.id} release={r} />)}
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-3">
              {filtered.map((r, i) => <AlbumListRow key={r.id} release={r} index={i} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
