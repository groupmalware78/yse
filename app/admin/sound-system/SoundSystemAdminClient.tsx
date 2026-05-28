'use client'
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Volume2, Star } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { createSoundPackage, updateSoundPackage, deleteSoundPackage } from '@/lib/actions/soundPackages'
import { useRouter } from 'next/navigation'
import type { getSoundPackagesForUI } from '@/lib/queries'

type Package = Awaited<ReturnType<typeof getSoundPackagesForUI>>[0]
type FormData = { name: string; tagline: string; priceRange: string; capacity: string; duration: string; features: string; popular: boolean }

function PackageModal({ pkg, onSave, onClose, saving }: {
  pkg: Partial<Package> | null
  onSave: (f: FormData) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<FormData>({
    name: pkg?.name ?? '', tagline: pkg?.tagline ?? '', priceRange: pkg?.priceRange ?? '',
    capacity: pkg?.capacity ?? '', duration: pkg?.duration ?? '',
    features: (pkg?.features ?? []).join('\n'), popular: pkg?.popular ?? false,
  })
  const update = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-glass">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-black text-lg">{pkg?.name ? 'Edit Package' : 'Add Package'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Package Name *</label>
            <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Yard Starter" />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Tagline</label>
            <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.tagline} onChange={e => update('tagline', e.target.value)} placeholder="Short description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Price Range *</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.priceRange} onChange={e => update('priceRange', e.target.value)} placeholder="$500 – $1,200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Capacity</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.capacity} onChange={e => update('capacity', e.target.value)} placeholder="Up to 200 people" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Duration</label>
              <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="Up to 6 hours" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Features (one per line)</label>
              <textarea rows={6} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" value={form.features} onChange={e => update('features', e.target.value)} placeholder="4x 15&quot; Sub Bass Speakers&#10;DJ Booth Setup&#10;..." />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.popular} onChange={e => update('popular', e.target.checked)} className="w-4 h-4 accent-yellow-500" />
                <span className="text-sm text-white/60">Mark as most popular</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
          <button onClick={onClose} className="btn-glass px-5 py-2.5 rounded-xl text-sm font-bold">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name || !form.priceRange || saving}
            className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40">
            <Save size={14} /> {saving ? 'Saving…' : 'Save Package'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function SoundSystemAdminClient({ initialPackages }: { initialPackages: Package[] }) {
  const [packages, setPackages] = useState<Package[]>(initialPackages)
  const [editing, setEditing] = useState<Partial<Package> | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()

  const handleSave = (form: FormData) => {
    setSaving(true)
    const features = form.features.split('\n').map(f => f.trim()).filter(Boolean)
    startTransition(async () => {
      if (editing?.id) {
        await updateSoundPackage(editing.id, { ...form, features })
      } else {
        await createSoundPackage({ ...form, features })
      }
      router.refresh()
      setEditing(undefined)
      setSaving(false)
    })
  }

  const handleDelete = (id: number) => {
    if (!confirm('Delete this package?')) return
    setPackages(prev => prev.filter(p => p.id !== id))
    startTransition(async () => {
      await deleteSoundPackage(id)
      router.refresh()
    })
  }

  return (
    <div>
      <AdminHeader
        title="Sound System"
        subtitle="Manage rental packages and pricing"
        actions={
          <button onClick={() => setEditing({})}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2">
            <Plus size={14} /> Add Package
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {packages.map((pkg, i) => (
          <motion.div key={pkg.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`glass rounded-2xl overflow-hidden border ${pkg.popular ? 'border-gold/30' : 'border-white/5'}`}>
            {pkg.popular && <div className="h-0.5 bg-gold-gradient" />}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Volume2 size={14} className="text-gold" />
                    <h3 className="font-black text-base text-white">{pkg.name}</h3>
                    {pkg.popular && <Star size={12} className="text-gold fill-gold" />}
                  </div>
                  <p className="text-white/35 text-xs">{pkg.tagline}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditing(pkg)} className="p-1.5 text-white/30 hover:text-gold transition-colors rounded-lg hover:bg-gold/10"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="glass-gold rounded-xl p-3 mb-4 border border-gold/15">
                <p className="text-gold font-black text-xl">{pkg.priceRange}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/40 mb-4 pb-4 border-b border-white/5">
                <span>{pkg.capacity}</span><span className="text-white/15">·</span><span>{pkg.duration}</span>
              </div>
              <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                {pkg.features.slice(0, 6).map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/40">
                    <span className="text-gold/50 mt-0.5 flex-shrink-0">·</span>{f}
                  </li>
                ))}
                {pkg.features.length > 6 && <li className="text-xs text-gold/40">+{pkg.features.length - 6} more…</li>}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing !== undefined && (
          <PackageModal pkg={editing} onSave={handleSave} onClose={() => setEditing(undefined)} saving={saving} />
        )}
      </AnimatePresence>
    </div>
  )
}
