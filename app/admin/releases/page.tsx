'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save, Disc } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { releases as initialReleases, artists } from '@/lib/data'

type Release = typeof initialReleases[0]

const typeOptions = ['Album', 'Single', 'EP', 'Live Album', 'Compilation']
const genreOptions = ['Dancehall', 'Reggae', 'Roots Reggae', 'Dub / Reggae', 'Afrobeats / Reggae', 'Caribbean Fusion', 'Sound System']

const genreColors: Record<string, string> = {
  Dancehall: '#d4af37',
  'Roots Reggae': '#00ffcc',
  'Afrobeats / Reggae': '#ff0077',
  'Caribbean Fusion': '#ff0077',
  'Dub / Reggae': '#39ff14',
  'Sound System': '#39ff14',
}

function ReleaseModal({ release, onSave, onClose }: {
  release: Partial<Release> | null
  onSave: (r: Release) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    title: release?.title ?? '',
    artist: release?.artist ?? '',
    type: release?.type ?? 'Album',
    year: release?.year ?? new Date().getFullYear(),
    genre: release?.genre ?? '',
    tracks: release?.tracks ?? 1,
    featured: release?.featured ?? false,
  })
  const update = (k: string, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title || !form.artist) return
    const artistData = artists.find(a => a.name === form.artist)
    onSave({
      ...release,
      id: release?.id ?? Date.now(),
      title: form.title,
      artist: form.artist,
      artistSlug: artistData?.slug ?? form.artist.toLowerCase().replace(/\s+/g, '-'),
      type: form.type,
      year: Number(form.year),
      genre: form.genre,
      tracks: Number(form.tracks),
      label: 'YardStyle Entertainment',
      featured: form.featured,
      streaming: release?.streaming ?? { spotify: '#', apple: '#', youtube: '#', tidal: '#' },
    } as Release)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass rounded-2xl border border-white/10 w-full max-w-lg shadow-glass"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-black text-lg">{release?.title ? 'Edit Release' : 'Add Release'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Title *</label>
            <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Release title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Artist *</label>
              <select className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.artist} onChange={e => update('artist', e.target.value)}>
                <option value="">Select artist...</option>
                {artists.map(a => <option key={a.slug} value={a.name}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Type</label>
              <select className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.type} onChange={e => update('type', e.target.value)}>
                {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Year</label>
              <input type="number" className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.year} onChange={e => update('year', e.target.value)} min={2000} max={2030} />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Track Count</label>
              <input type="number" className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.tracks} onChange={e => update('tracks', e.target.value)} min={1} />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Genre</label>
              <select className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.genre} onChange={e => update('genre', e.target.value)}>
                <option value="">Select genre...</option>
                {genreOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="w-4 h-4 accent-yellow-500" />
                <span className="text-sm text-white/60">Feature on homepage</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
          <button onClick={onClose} className="btn-glass px-5 py-2.5 rounded-xl text-sm font-bold">Cancel</button>
          <button onClick={handleSave} disabled={!form.title || !form.artist} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40">
            <Save size={14} /> Save Release
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminReleasesPage() {
  const [releases, setReleases] = useState<Release[]>(initialReleases)
  const [search, setSearch] = useState('')
  const [editingRelease, setEditingRelease] = useState<Partial<Release> | null | undefined>(undefined)

  const filtered = releases.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.artist.toLowerCase().includes(search.toLowerCase()) ||
    r.genre.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (release: Release) => {
    setReleases(prev => {
      const idx = prev.findIndex(r => r.id === release.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = release
        return updated
      }
      return [...prev, release]
    })
    setEditingRelease(undefined)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Delete this release?')) return
    setReleases(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      <AdminHeader
        title="Releases"
        subtitle={`${releases.length} releases in catalog`}
        actions={
          <button
            onClick={() => setEditingRelease({})}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2"
          >
            <Plus size={14} /> Add Release
          </button>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input type="text" placeholder="Search releases..." value={search} onChange={e => setSearch(e.target.value)} className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Release', 'Artist', 'Type', 'Year', 'Genre', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((release, i) => {
                const accent = genreColors[release.genre] || '#d4af37'
                const letters = release.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <motion.tr
                    key={release.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
                          style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}>
                          {letters}
                        </div>
                        <p className="font-bold text-sm text-white truncate max-w-36">{release.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white/60 text-sm">{release.artist}</td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold glass px-2 py-1 rounded-full text-white/50 border border-white/8">{release.type}</span>
                    </td>
                    <td className="px-4 py-4 text-white/50 text-sm">{release.year}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
                        {release.genre}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${release.featured ? 'bg-gold/15 text-gold border border-gold/25' : 'bg-white/5 text-white/25 border border-white/8'}`}>
                        {release.featured ? 'Featured' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingRelease(release)} className="p-1.5 text-white/30 hover:text-gold transition-colors rounded-lg hover:bg-gold/10">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(release.id)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10">
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
        {editingRelease !== undefined && (
          <ReleaseModal release={editingRelease} onSave={handleSave} onClose={() => setEditingRelease(undefined)} />
        )}
      </AnimatePresence>
    </div>
  )
}
