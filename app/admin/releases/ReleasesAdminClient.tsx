'use client'
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { createRelease, updateRelease, deleteRelease } from '@/lib/actions/releases'
import { useRouter } from 'next/navigation'
import type { UIRelease, UIArtist } from '@/lib/queries'

const typeOptions = ['Album', 'Single', 'EP', 'Live Album', 'Compilation']
const genreOptions = ['Dancehall', 'Reggae', 'Roots Reggae', 'Dub / Reggae', 'Afrobeats / Reggae', 'Caribbean Fusion', 'Sound System']
const genreColors: Record<string, string> = {
  Dancehall: '#d4af37', 'Roots Reggae': '#00ffcc', 'Afrobeats / Reggae': '#ff0077',
  'Caribbean Fusion': '#ff0077', 'Dub / Reggae': '#39ff14', 'Sound System': '#39ff14',
}

type FormData = {
  title: string; artist: string; type: string; year: number; genre: string
  tracks: number; featured: boolean
  spotifyUrl: string; appleUrl: string; youtubeUrl: string; tidalUrl: string
}

function ReleaseModal({ release, artists, onSave, onClose, saving }: {
  release: Partial<UIRelease> | null
  artists: UIArtist[]
  onSave: (f: FormData) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<FormData>({
    title: release?.title ?? '', artist: release?.artist ?? '', type: release?.type ?? 'Album',
    year: release?.year ?? new Date().getFullYear(), genre: release?.genre ?? '',
    tracks: release?.tracks ?? 1, featured: release?.featured ?? false,
    spotifyUrl: release?.streaming?.spotify !== '#' ? (release?.streaming?.spotify ?? '') : '',
    appleUrl:   release?.streaming?.apple   !== '#' ? (release?.streaming?.apple   ?? '') : '',
    youtubeUrl: release?.streaming?.youtube !== '#' ? (release?.streaming?.youtube ?? '') : '',
    tidalUrl:   release?.streaming?.tidal   !== '#' ? (release?.streaming?.tidal   ?? '') : '',
  })
  const update = (k: keyof FormData, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }))

  const streamingFields: { key: keyof FormData; label: string; placeholder: string }[] = [
    { key: 'spotifyUrl',  label: 'Spotify URL',     placeholder: 'https://open.spotify.com/album/...' },
    { key: 'appleUrl',    label: 'Apple Music URL', placeholder: 'https://music.apple.com/...' },
    { key: 'youtubeUrl',  label: 'YouTube URL',     placeholder: 'https://youtube.com/playlist/...' },
    { key: 'tidalUrl',    label: 'Tidal URL',       placeholder: 'https://tidal.com/browse/album/...' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass rounded-2xl border border-white/10 w-full max-w-lg shadow-glass max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/5 flex-shrink-0">
          <h2 className="font-black text-lg">{release?.title ? 'Edit Release' : 'Add Release'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
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
              <input type="number" className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.year} onChange={e => update('year', Number(e.target.value))} min={2000} max={2030} />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Track Count</label>
              <input type="number" className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.tracks} onChange={e => update('tracks', Number(e.target.value))} min={1} />
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

          {/* Streaming links */}
          <div className="pt-2 border-t border-white/5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-3">Streaming Links</p>
            <div className="space-y-3">
              {streamingFields.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-white/25 mb-1.5">{label}</label>
                  <input
                    type="url"
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    value={form[key] as string}
                    onChange={e => update(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5 flex-shrink-0">
          <button onClick={onClose} className="btn-glass px-5 py-2.5 rounded-xl text-sm font-bold">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.title || !form.artist || saving}
            className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40">
            <Save size={14} /> {saving ? 'Saving…' : 'Save Release'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function ReleasesAdminClient({ initialReleases, artists }: { initialReleases: UIRelease[]; artists: UIArtist[] }) {
  const [releases, setReleases] = useState<UIRelease[]>(initialReleases)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Partial<UIRelease> | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()

  const filtered = releases.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.artist.toLowerCase().includes(search.toLowerCase()) ||
    r.genre.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (form: FormData) => {
    setSaving(true)
    startTransition(async () => {
      const artist = artists.find(a => a.name === form.artist)
      const artistSlug = artist?.slug ?? form.artist.toLowerCase().replace(/\s+/g, '-')
      const payload = {
        ...form,
        artistSlug,
        spotifyUrl:  form.spotifyUrl  || undefined,
        appleUrl:    form.appleUrl    || undefined,
        youtubeUrl:  form.youtubeUrl  || undefined,
        tidalUrl:    form.tidalUrl    || undefined,
      }
      if (editing?.id) {
        await updateRelease(editing.id, payload)
      } else {
        await createRelease(payload)
      }
      router.refresh()
      setEditing(undefined)
      setSaving(false)
    })
  }

  const handleDelete = (id: number) => {
    if (!confirm('Delete this release?')) return
    setReleases(prev => prev.filter(r => r.id !== id))
    startTransition(async () => {
      await deleteRelease(id)
      router.refresh()
    })
  }

  return (
    <div>
      <AdminHeader
        title="Releases"
        subtitle={`${releases.length} releases in catalog`}
        actions={
          <button onClick={() => setEditing({})}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2">
            <Plus size={14} /> Add Release
          </button>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input type="text" placeholder="Search releases..." value={search} onChange={e => setSearch(e.target.value)}
          className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
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
                  <motion.tr key={release.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
                          style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}>{letters}</div>
                        <p className="font-bold text-sm text-white truncate max-w-36">{release.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white/60 text-sm">{release.artist}</td>
                    <td className="px-4 py-4"><span className="text-[10px] font-bold glass px-2 py-1 rounded-full text-white/50 border border-white/8">{release.type}</span></td>
                    <td className="px-4 py-4 text-white/50 text-sm">{release.year}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>{release.genre}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${release.featured ? 'bg-gold/15 text-gold border border-gold/25' : 'bg-white/5 text-white/25 border border-white/8'}`}>
                        {release.featured ? 'Featured' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(release)} className="p-1.5 text-white/30 hover:text-gold transition-colors rounded-lg hover:bg-gold/10"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(release.id)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"><Trash2 size={13} /></button>
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
        {editing !== undefined && (
          <ReleaseModal release={editing} artists={artists} onSave={handleSave} onClose={() => setEditing(undefined)} saving={saving} />
        )}
      </AnimatePresence>
    </div>
  )
}
