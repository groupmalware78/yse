'use client'
import { useState, useEffect, useTransition, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save, Music, Radio, Upload, CheckCircle, Loader2 } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { createTrack, updateTrack, deleteTrack } from '@/lib/actions/tracks'
import { useRouter } from 'next/navigation'
import type { UIArtist } from '@/lib/queries'

type Track = {
  id: number; title: string; duration: string; plays: string
  album: string; url: string | null; featured: boolean
  artist: { name: string; slug: string }
  artistId: number
}

type FormData = {
  title: string; album: string; duration: string
  artistId: number; url: string; featured: boolean
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

function Mp3Uploader({ url, onChange }: { url: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [fileName, setFileName] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setUploadState('uploading')
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('folder', 'tracks')
      const res = await fetch('/api/upload', { method: 'POST', body })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Upload failed')
      }
      const { url: uploaded } = await res.json()
      onChange(uploaded)
      setUploadState('done')
    } catch (err) {
      console.error(err)
      setUploadState('error')
    }
  }

  return (
    <div>
      <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Audio File *</label>

      {/* Upload button row */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => fileRef.current?.click()}
          className="btn-glass px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 flex-shrink-0">
          {uploadState === 'uploading'
            ? <><Loader2 size={13} className="animate-spin" /> Uploading…</>
            : <><Upload size={13} /> {url ? 'Replace File' : 'Upload MP3'}</>
          }
        </button>
        {uploadState === 'done' && (
          <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
            <CheckCircle size={13} /> Uploaded
          </span>
        )}
        {uploadState === 'error' && (
          <span className="text-red-400 text-xs">Upload failed — try again</span>
        )}
        {uploadState === 'idle' && fileName && (
          <span className="text-white/30 text-xs truncate">{fileName}</span>
        )}
      </div>

      {/* Existing / uploaded URL display */}
      {url && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-white/20 text-[10px] truncate flex-1">{url}</span>
          <audio src={url} controls className="h-7 w-48 flex-shrink-0" />
        </div>
      )}

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept=".mp3,.wav,.ogg,.aac,audio/*"
        className="hidden" onChange={handleFile} />
    </div>
  )
}

function TrackModal({ track, artists, onSave, onClose, saving }: {
  track: Partial<Track> | null
  artists: UIArtist[]
  onSave: (f: FormData) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<FormData>({
    title: track?.title ?? '',
    album: track?.album ?? '',
    duration: track?.duration ?? '',
    artistId: track?.artistId ?? (artists[0]?.id ?? 0),
    url: track?.url ?? '',
    featured: track?.featured ?? false,
  })
  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass rounded-2xl border border-white/10 w-full max-w-lg shadow-glass">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-black text-lg">{track?.id ? 'Edit Track' : 'Add Track'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Track Title *</label>
            <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.title}
              onChange={e => update('title', e.target.value)} placeholder="Track name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Artist *</label>
              <select className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.artistId}
                onChange={e => update('artistId', Number(e.target.value))}>
                {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Album / Release</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.album}
                onChange={e => update('album', e.target.value)} placeholder="Album name" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Duration</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.duration}
                onChange={e => update('duration', e.target.value)} placeholder="3:42" />
            </div>
          </div>

          <Mp3Uploader url={form.url} onChange={url => update('url', url)} />

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)}
                className="w-4 h-4 accent-yellow-500" />
              <span className="text-sm text-white/60">Show in floating player</span>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
          <button onClick={onClose} className="btn-glass px-5 py-2.5 rounded-xl text-sm font-bold">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.title || !form.artistId || saving}
            className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40">
            <Save size={14} /> {saving ? 'Saving…' : 'Save Track'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function TracksAdminClient({ initialTracks, artists }: { initialTracks: Track[]; artists: UIArtist[] }) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  useEffect(() => { setTracks(initialTracks) }, [initialTracks])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Partial<Track> | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()

  const filtered = tracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.name.toLowerCase().includes(search.toLowerCase()) ||
    t.album.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (form: FormData) => {
    setSaving(true)
    startTransition(async () => {
      const payload = { ...form, url: form.url || undefined }
      if (editing?.id) {
        await updateTrack(editing.id, payload)
      } else {
        await createTrack(payload)
      }
      router.refresh()
      setEditing(undefined)
      setSaving(false)
    })
  }

  const handleDelete = (id: number) => {
    if (!confirm('Delete this track?')) return
    setTracks(prev => prev.filter(t => t.id !== id))
    startTransition(async () => { await deleteTrack(id); router.refresh() })
  }

  const toggleFeatured = (track: Track) => {
    startTransition(async () => {
      await updateTrack(track.id, { featured: !track.featured })
      router.refresh()
    })
  }

  const inPlayer = tracks.filter(t => t.featured && t.url).length

  return (
    <div>
      <AdminHeader
        title="Tracks"
        subtitle={`${tracks.length} tracks · ${inPlayer} in floating player`}
        actions={
          <button onClick={() => setEditing({})}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2">
            <Plus size={14} /> Add Track
          </button>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input type="text" placeholder="Search tracks..." value={search} onChange={e => setSearch(e.target.value)}
          className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Track', 'Artist', 'Album', 'Duration', 'Player', 'MP3', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((track, i) => (
                <motion.tr key={track.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                        <Music size={12} className="text-gold" />
                      </div>
                      <p className="font-bold text-sm text-white truncate max-w-36">{track.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-white/60 text-sm">{track.artist.name}</td>
                  <td className="px-4 py-4 text-white/40 text-sm truncate max-w-28">{track.album || '—'}</td>
                  <td className="px-4 py-4 text-white/40 text-sm">{track.duration || '—'}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => toggleFeatured(track)}
                      className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                        track.featured && track.url
                          ? 'bg-gold/15 text-gold border-gold/25'
                          : 'bg-white/5 text-white/25 border-white/8 hover:border-white/20'
                      }`}>
                      <Radio size={9} /> {track.featured ? 'On' : 'Off'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      track.url
                        ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                        : 'bg-white/5 text-white/20 border border-white/8'
                    }`}>
                      {track.url ? 'Set' : 'No URL'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditing(track)} className="p-1.5 text-white/30 hover:text-gold transition-colors rounded-lg hover:bg-gold/10"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(track.id)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-white/25 text-sm">No tracks yet. Add your first track.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editing !== undefined && (
          <TrackModal track={editing} artists={artists} onSave={handleSave} onClose={() => setEditing(undefined)} saving={saving} />
        )}
      </AnimatePresence>
    </div>
  )
}
