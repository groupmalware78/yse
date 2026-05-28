'use client'
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save, MapPin, Calendar } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { createEvent, updateEvent, deleteEvent } from '@/lib/actions/events'
import { useRouter } from 'next/navigation'
import type { UIEvent } from '@/lib/queries'

const typeOptions = ['Sound Clash', 'Festival', 'Concert', 'Club Night', 'Private Event', 'Corporate']
const typeColors: Record<string, string> = {
  'Sound Clash': '#d4af37', Festival: '#39ff14', Concert: '#00ffcc',
  'Club Night': '#ff0077', 'Private Event': '#d4af37', Corporate: '#00ffcc',
}

type FormData = { title: string; date: string; time: string; venue: string; city: string; type: string; description: string; featured: boolean }

function EventModal({ event, onSave, onClose, saving }: {
  event: Partial<UIEvent> | null
  onSave: (f: FormData) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<FormData>({
    title: event?.title ?? '', date: event?.date ?? '', time: event?.time ?? '',
    venue: event?.venue ?? '', city: event?.city ?? '', type: event?.type ?? 'Concert',
    description: event?.description ?? '', featured: event?.featured ?? false,
  })
  const update = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass rounded-2xl border border-white/10 w-full max-w-lg shadow-glass">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-black text-lg">{event?.title ? 'Edit Event' : 'Add Event'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Event Title *</label>
            <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Event name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Date *</label>
              <input type="date" className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.date} onChange={e => update('date', e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Time</label>
              <input type="time" className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.time} onChange={e => update('time', e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Venue</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.venue} onChange={e => update('venue', e.target.value)} placeholder="Venue name" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">City / Country</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.city} onChange={e => update('city', e.target.value)} placeholder="Kingston, Jamaica" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Event Type</label>
              <select className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.type} onChange={e => update('type', e.target.value)}>
                {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Description</label>
              <textarea rows={3} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" value={form.description} onChange={e => update('description', e.target.value)} />
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
          <button onClick={() => onSave(form)} disabled={!form.title || !form.date || saving}
            className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40">
            <Save size={14} /> {saving ? 'Saving…' : 'Save Event'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function EventsAdminClient({ initialEvents }: { initialEvents: UIEvent[] }) {
  const [events, setEvents] = useState<UIEvent[]>(initialEvents)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Partial<UIEvent> | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.city.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (form: FormData) => {
    setSaving(true)
    startTransition(async () => {
      if (editing?.id) {
        await updateEvent(editing.id, { ...form, artists: editing.artists ?? [] })
      } else {
        await createEvent({ ...form, artists: [] })
      }
      router.refresh()
      setEditing(undefined)
      setSaving(false)
    })
  }

  const handleDelete = (id: number) => {
    if (!confirm('Delete this event?')) return
    setEvents(prev => prev.filter(e => e.id !== id))
    startTransition(async () => {
      await deleteEvent(id)
      router.refresh()
    })
  }

  return (
    <div>
      <AdminHeader
        title="Events"
        subtitle={`${events.length} events scheduled`}
        actions={
          <button onClick={() => setEditing({})}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2">
            <Plus size={14} /> Add Event
          </button>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
          className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Event', 'Date & Time', 'Location', 'Type', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, i) => {
                const accent = typeColors[event.type] || '#d4af37'
                return (
                  <motion.tr key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-sm text-white truncate max-w-48">{event.title}</p>
                      <p className="text-white/30 text-xs">{event.artists.slice(0, 2).join(', ')}{event.artists.length > 2 ? ` +${event.artists.length - 2}` : ''}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-white/60 text-sm"><Calendar size={12} />{event.date}</div>
                      <p className="text-white/30 text-xs mt-0.5">{event.time}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-white/60 text-sm"><MapPin size={11} /><span className="truncate max-w-32">{event.city}</span></div>
                      <p className="text-white/25 text-xs mt-0.5 truncate max-w-32">{event.venue}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>{event.type}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${event.featured ? 'bg-gold/15 text-gold border border-gold/25' : 'bg-white/5 text-white/25 border border-white/8'}`}>
                        {event.featured ? 'Featured' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(event)} className="p-1.5 text-white/30 hover:text-gold transition-colors rounded-lg hover:bg-gold/10"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(event.id)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"><Trash2 size={13} /></button>
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
          <EventModal event={editing} onSave={handleSave} onClose={() => setEditing(undefined)} saving={saving} />
        )}
      </AnimatePresence>
    </div>
  )
}
