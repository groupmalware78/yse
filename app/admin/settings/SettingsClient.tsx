'use client'
import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Save, Shield, Globe, Key, Check, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { logout } from '@/lib/actions/auth'
import { saveSettings, changePassword } from '@/lib/actions/settings'

interface Props {
  settings: {
    siteName: string
    tagline: string
    contactEmail: string
    contactPhone: string
    whatsapp: string
    address: string
  }
}

export function SettingsClient({ settings }: Props) {
  const [saved, setSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [, startTransition] = useTransition()

  const [form, setForm] = useState({
    siteName: settings.siteName,
    tagline: settings.tagline,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    whatsapp: settings.whatsapp,
    address: settings.address,
  })

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await saveSettings(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match')
      return
    }
    startTransition(async () => {
      const result = await changePassword(pwForm.currentPassword, pwForm.newPassword)
      if (result.error) {
        setPwError(result.error)
      } else {
        setPwSaved(true)
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setPwSaved(false), 3000)
      }
    })
  }

  return (
    <div>
      <AdminHeader title="Settings" subtitle="Manage CMS preferences and account security" />

      <div className="space-y-6 max-w-2xl">
        {/* Site settings */}
        <form onSubmit={handleSave}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl overflow-hidden border border-white/5 mb-6">
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

          <div className="flex items-center gap-4">
            <button type="submit" className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
              {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
            </button>
            {saved && <span className="text-green-400 text-sm font-semibold">Settings updated successfully.</span>}
          </div>
        </form>

        {/* Security */}
        <form onSubmit={handlePasswordChange}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass rounded-2xl overflow-hidden border border-white/5 mb-6">
            <div className="flex items-center gap-2 p-5 border-b border-white/5">
              <Shield size={15} className="text-gold" />
              <span className="font-bold text-sm">Security</span>
            </div>
            <div className="p-5 space-y-4">
              {pwError && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                  <AlertCircle size={15} className="flex-shrink-0" /> {pwError}
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">Current Password</label>
                <div className="relative">
                  <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    className="input-dark w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                    placeholder="Enter current password"
                    value={pwForm.currentPassword}
                    onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
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
                      value={pwForm.newPassword}
                      onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
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
                    value={pwForm.confirmPassword}
                    onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button type="submit" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
                  {pwSaved ? <><Check size={14} /> Updated!</> : <><Key size={14} /> Change Password</>}
                </button>
                {pwSaved && <span className="text-green-400 text-sm font-semibold">Password changed.</span>}
              </div>

              <div className="pt-2 border-t border-white/5">
                <form action={logout}>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-400/8 border border-red-400/15 hover:bg-red-400/15 transition-colors"
                  >
                    Sign Out of All Sessions
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
