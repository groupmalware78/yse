'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, ExternalLink, X, Save, Users } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { artists as initialArtists } from '@/lib/data'

type Artist = typeof initialArtists[0]

const genreOptions = ['Dancehall', 'Reggae', 'DJ / Selector', 'Reggae / Dub', 'Afrobeats / Reggae', 'DJ / Sound System', 'Soca', 'Afrobeats', 'Other']

const genreColors: Record<string, string> = {
  Dancehall: '#d4af37',
  Reggae: '#00ffcc',
  'DJ / Selector': '#39ff14',
  'Reggae / Dub': '#d4af37',
  'Afrobeats / Reggae': '#ff0077',
  'DJ / Sound System': '#00ffcc',
}

function ArtistModal({ artist, onSave, onClose }: {
  artist: Partial<Artist> | null
  onSave: (a: Artist) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    name: artist?.name ?? '',
    genre: artist?.genre ?? '',
    subGenre: artist?.subGenre ?? '',
    origin: artist?.origin ?? '',
    bio: artist?.bio ?? '',
    longBio: artist?.longBio ?? '',
  })
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.name || !form.genre) return
    onSave({
      ...artist,
      slug: artist?.slug ?? form.name.toLowerCase().replace(/\s+/g, '-'),
      name: form.name,
      genre: form.genre,
      subGenre: form.subGenre,
      origin: form.origin,
      bio: form.bio,
      longBio: form.longBio,
      image: null,
      color: '#d4af37',
      stats: artist?.stats ?? { streams: '0', shows: '0', albums: 0, awards: 0 },
      socials: artist?.socials ?? { instagram: '#', twitter: '#', youtube: '#', spotify: '#' },
      tracks: artist?.tracks ?? [],
      albums: artist?.albums ?? [],
      upcomingShows: artist?.upcomingShows ?? [],
    } as Artist)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass rounded-2xl border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-glass"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-black text-lg">{artist?.name ? 'Edit Artist' : 'Add Artist'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Artist Name *</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Stage name" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Genre *</label>
              <select className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.genre} onChange={e => update('genre', e.target.value)}>
                <option value="">Select genre...</option>
                {genreOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Sub-Genre</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.subGenre} onChange={e => update('subGenre', e.target.value)} placeholder="e.g. Roots Reggae" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Origin</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.origin} onChange={e => update('origin', e.target.value)} placeholder="Kingston, Jamaica" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Short Bio</label>
              <textarea rows={3} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="One paragraph overview..." />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Full Bio</label>
              <textarea rows={5} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" value={form.longBio} onChange={e => update('longBio', e.target.value)} placeholder="Detailed biography..." />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
          <button onClick={onClose} className="btn-glass px-5 py-2.5 rounded-xl text-sm font-bold">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!form.name || !form.genre}
            className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40"
          >
            <Save size={14} /> Save Artist
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [search, setSearch] = useState('')
  const [editingArtist, setEditingArtist] = useState<Partial<Artist> | null | undefined>(undefined)

  const filtered = artists.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.genre.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (artist: Artist) => {
    setArtists(prev => {
      const idx = prev.findIndex(a => a.slug === artist.slug)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = artist
        return updated
      }
      return [...prev, artist]
    })
    setEditingArtist(undefined)
  }

  const handleDelete = (slug: string) => {
    if (!confirm('Remove this artist from the CMS? This only affects the local session.')) return
    setArtists(prev => prev.filter(a => a.slug !== slug))
  }

  return (
    <div>
      <AdminHeader
        title="Artists"
        subtitle={`Managing ${artists.length} artists on the roster`}
        actions={
          <button
            onClick={() => setEditingArtist({})}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2"
          >
            <Plus size={14} /> Add Artist
          </button>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          placeholder="Search artists..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
        />
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Artist', 'Genre', 'Origin', 'Streams', 'Shows', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((artist, i) => {
                const accent = genreColors[artist.genre] || '#d4af37'
                const initials = artist.name.split(' ').map(w => w[0]).join('').slice(0, 2)
                return (
                  <motion.tr
                    key={artist.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                          style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}>
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{artist.name}</p>
                          <p className="text-white/30 text-xs">{artist.subGenre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
                        {artist.genre}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/50 text-sm hidden md:table-cell">{artist.origin}</td>
                    <td className="px-4 py-4 text-white/70 text-sm hidden lg:table-cell">{artist.stats.streams}</td>
                    <td className="px-4 py-4 text-white/70 text-sm hidden lg:table-cell">{artist.stats.shows}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingArtist(artist)}
                          className="p-1.5 text-white/30 hover:text-gold transition-colors rounded-lg hover:bg-gold/10"
                        >
                          <Edit2 size={13} />
                        </button>
                        <Link
                          href={`/artists/${artist.slug}`}
                          target="_blank"
                          className="p-1.5 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/8"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(artist.slug)}
                          className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editingArtist !== undefined && (
          <ArtistModal
            artist={editingArtist}
            onSave={handleSave}
            onClose={() => setEditingArtist(undefined)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
