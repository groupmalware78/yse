'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Shield, Bell, Globe, Key, Check, Eye, EyeOff } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { logout } from '@/lib/adminAuth'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [form, setForm] = useState({
    siteName: 'YardStyle Entertainment',
    tagline: 'Powering Music. Elevating Culture.',
    contactEmail: 'info@yardstylement.com',
    contactPhone: '+1 (876) 123-4567',
    whatsapp: '+18761234567',
    address: '13 Studio Lane, Kingston 6, Jamaica',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifyBookings: true,
    notifyMessages: true,
    notifyNewsletter: false,
  })

  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <AdminHeader title="Settings" subtitle="Manage CMS preferences and account security" />

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* Site settings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden border border-white/5"
        >
          <div className="flex items-center gap-2 p-5 border-b border-white/5">
            <Globe size={15} className="text-gold" />
            <span className="font-bold text-sm">Site Settings</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Site Name</label>
                <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.siteName} onChange={e => update('siteName', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Tagline</label>
                <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.tagline} onChange={e => update('tagline', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Contact Email</label>
                <input type="email" className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Contact Phone</label>
                <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">WhatsApp Number</label>
                <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} placeholder="+18761234567" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Address</label>
                <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.address} onChange={e => update('address', e.target.value)} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass rounded-2xl overflow-hidden border border-white/5"
        >
          <div className="flex items-center gap-2 p-5 border-b border-white/5">
            <Bell size={15} className="text-gold" />
            <span className="font-bold text-sm">Notifications</span>
          </div>
          <div className="p-5 space-y-3">
            {[
              { key: 'notifyBookings', label: 'New booking requests', desc: 'Get notified when a booking form is submitted' },
              { key: 'notifyMessages', label: 'Contact messages', desc: 'Get notified when contact form is submitted' },
              { key: 'notifyNewsletter', label: 'Newsletter signups', desc: 'Get notified for each newsletter subscription' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/3 transition-colors cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-white/80">{label}</p>
                  <p className="text-white/30 text-xs mt-0.5">{desc}</p>
                </div>
                <div
                  onClick={() => update(key, !(form as Record<string, boolean | string>)[key])}
                  className={`w-10 h-5.5 rounded-full transition-all relative flex-shrink-0 ${
                    (form as Record<string, boolean | string>)[key] ? 'bg-gold' : 'bg-white/10'
                  }`}
                  style={{ height: 22, width: 40 }}
                >
                  <div
                    className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-sm"
                    style={{
                      width: 18,
                      height: 18,
                      transform: (form as Record<string, boolean | string>)[key] ? 'translateX(20px)' : 'translateX(2px)',
                    }}
                  />
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="glass rounded-2xl overflow-hidden border border-white/5"
        >
          <div className="flex items-center gap-2 p-5 border-b border-white/5">
            <Shield size={15} className="text-gold" />
            <span className="font-bold text-sm">Security</span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Current Password</label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  className="input-dark w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                  placeholder="Enter current password"
                  value={form.currentPassword}
                  onChange={e => update('currentPassword', e.target.value)}
                />
                <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                  {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    className="input-dark w-full pr-10 px-4 py-3 rounded-xl text-sm"
                    placeholder="New password"
                    value={form.newPassword}
                    onChange={e => update('newPassword', e.target.value)}
                  />
                  <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                    {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  placeholder="Repeat new password"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                />
              </div>
            </div>
            <p className="text-white/25 text-xs">Password changes only affect this local session demo.</p>

            <div className="pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-400/8 border border-red-400/15 hover:bg-red-400/15 transition-colors"
              >
                Sign Out of All Sessions
              </button>
            </div>
          </div>
        </motion.div>

        {/* Save button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2"
          >
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
          </button>
          {saved && <span className="text-green-400 text-sm font-semibold">Settings updated successfully.</span>}
        </div>
      </form>
    </div>
  )
}
