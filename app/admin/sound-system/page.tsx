'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Volume2, Star } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { soundPackages as initialPackages } from '@/lib/data'

type Package = typeof initialPackages[0]

function PackageModal({ pkg, onSave, onClose }: {
  pkg: Partial<Package> | null
  onSave: (p: Package) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    name: pkg?.name ?? '',
    tagline: pkg?.tagline ?? '',
    priceRange: pkg?.priceRange ?? '',
    capacity: pkg?.capacity ?? '',
    duration: pkg?.duration ?? '',
    features: (pkg?.features ?? []).join('\n'),
    popular: pkg?.popular ?? false,
  })
  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.name || !form.priceRange) return
    onSave({
      ...pkg,
      id: pkg?.id ?? Date.now(),
      name: form.name,
      tagline: form.tagline,
      priceRange: form.priceRange,
      capacity: form.capacity,
      duration: form.duration,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      popular: form.popular,
      color: pkg?.color ?? 'rgba(255,255,255,0.05)',
    } as Package)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-glass"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-black text-lg">{pkg?.name ? 'Edit Package' : 'Add Package'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Package Name *</label>
            <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Sound System Royale" />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Tagline</label>
            <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.tagline} onChange={e => update('tagline', e.target.value)} placeholder="Short description..." />
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
              <textarea rows={6} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none font-mono text-xs" value={form.features} onChange={e => update('features', e.target.value)} placeholder="4x 15&quot; Sub Bass Speakers&#10;Professional Amplification&#10;DJ Booth Setup..." />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.popular} onChange={e => update('popular', e.target.checked)} className="w-4 h-4 accent-yellow-500" />
                <span className="text-sm text-white/60">Mark as Most Popular</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
          <button onClick={onClose} className="btn-glass px-5 py-2.5 rounded-xl text-sm font-bold">Cancel</button>
          <button onClick={handleSave} disabled={!form.name || !form.priceRange} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40">
            <Save size={14} /> Save Package
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminSoundSystemPage() {
  const [packages, setPackages] = useState<Package[]>(initialPackages)
  const [editingPkg, setEditingPkg] = useState<Partial<Package> | null | undefined>(undefined)

  const handleSave = (pkg: Package) => {
    setPackages(prev => {
      const idx = prev.findIndex(p => p.id === pkg.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = pkg
        return updated
      }
      return [...prev, pkg]
    })
    setEditingPkg(undefined)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Delete this package?')) return
    setPackages(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <AdminHeader
        title="Sound System"
        subtitle="Manage rental packages and pricing"
        actions={
          <button
            onClick={() => setEditingPkg({})}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2"
          >
            <Plus size={14} /> Add Package
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass rounded-2xl overflow-hidden border ${pkg.popular ? 'border-gold/30' : 'border-white/5'}`}
          >
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
                  <button onClick={() => setEditingPkg(pkg)} className="p-1.5 text-white/30 hover:text-gold transition-colors rounded-lg hover:bg-gold/10">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="glass-gold rounded-xl p-3 mb-4 border border-gold/15">
                <p className="text-gold font-black text-xl">{pkg.priceRange}</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/40 mb-4 pb-4 border-b border-white/5">
                <span>{pkg.capacity}</span>
                <span className="text-white/15">·</span>
                <span>{pkg.duration}</span>
              </div>

              <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                {pkg.features.slice(0, 6).map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/40">
                    <span className="text-gold/50 mt-0.5 flex-shrink-0">·</span>
                    {f}
                  </li>
                ))}
                {pkg.features.length > 6 && (
                  <li className="text-xs text-gold/40">+{pkg.features.length - 6} more features...</li>
                )}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editingPkg !== undefined && (
          <PackageModal pkg={editingPkg} onSave={handleSave} onClose={() => setEditingPkg(undefined)} />
        )}
      </AnimatePresence>
    </div>
  )
}
