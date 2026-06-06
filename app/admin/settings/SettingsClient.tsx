'use client'
import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Save, Shield, Globe, Key, Check, Eye, EyeOff, AlertCircle, Plus, Trash2, Video } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { logout } from '@/lib/actions/auth'
import { saveSettings, changePassword } from '@/lib/actions/settings'
import type { TikTokVideo } from '@/lib/actions/settings'

interface Props {
  settings: {
    siteName: string
    tagline: string
    contactEmail: string
    contactPhone: string
    whatsapp: string
    address: string
    tiktokHandle?: string
    tiktokProfileUrl?: string
    tiktokLiveUrl?: string | null
    livePageEnabled?: boolean | null
    tiktokVideos?: TikTokVideo[]
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
    tiktokHandle: settings.tiktokHandle ?? '@jjwizzle876',
    tiktokProfileUrl: settings.tiktokProfileUrl ?? 'https://www.tiktok.com/@jjwizzle876',
    tiktokLiveUrl: settings.tiktokLiveUrl ?? '',
    livePageEnabled: settings.livePageEnabled ?? true,
    tiktokVideos: settings.tiktokVideos ?? [] as TikTokVideo[],
  })

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const addVideo = () =>
    setForm(f => ({ ...f, tiktokVideos: [...f.tiktokVideos, { id: '', label: '' }] }))

  const removeVideo = (i: number) =>
    setForm(f => ({ ...f, tiktokVideos: f.tiktokVideos.filter((_, idx) => idx !== i) }))

  const updateVideo = (i: number, k: keyof TikTokVideo, v: string) =>
    setForm(f => ({
      ...f,
      tiktokVideos: f.tiktokVideos.map((vid, idx) => idx === i ? { ...vid, [k]: v } : vid),
    }))

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
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">TikTok Handle</label>
                  <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.tiktokHandle} onChange={e => update('tiktokHandle', e.target.value)} placeholder="@jjwizzle876" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">TikTok Profile URL</label>
                  <input className="input-dark w-full px-4 py-3 rounded-xl text-sm" value={form.tiktokProfileUrl} onChange={e => update('tiktokProfileUrl', e.target.value)} placeholder="https://www.tiktok.com/@jjwizzle876" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1.5">TikTok Live URL</label>
                  <input
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    value={form.tiktokLiveUrl}
                    onChange={e => update('tiktokLiveUrl', e.target.value)}
                    placeholder="https://www.tiktok.com/@yse1876/live"
                  />
                  <p className="text-[10px] text-white/25 mt-1.5">When set, a "Watch Live" banner appears on the /live page. Clear to hide it.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-white">Live Page Enabled</p>
                      <p className="text-[10px] text-white/25 mt-0.5">Show the "Live Now" banner on the /live page. Requires a TikTok Live URL to be set above.</p>
                    </div>
                    <div className="relative flex-shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={form.livePageEnabled}
                        onChange={e => update('livePageEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 rounded-full border border-white/10 bg-white/5 peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white/40 peer-checked:bg-black peer-checked:translate-x-5 transition-all duration-200" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TikTok Videos */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="glass rounded-2xl overflow-hidden border border-white/5 mb-6">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Video size={15} className="text-gold" />
                <span className="font-bold text-sm">TikTok Videos</span>
              </div>
              <button
                type="button"
                onClick={addVideo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-bold hover:bg-gold/20 transition-colors"
              >
                <Plus size={12} /> Add Video
              </button>
            </div>
            <div className="p-5 space-y-3">
              {form.tiktokVideos.length === 0 && (
                <p className="text-white/30 text-xs text-center py-4">No videos added yet. Click &ldquo;Add Video&rdquo; to get started.</p>
              )}
              {form.tiktokVideos.map((vid, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1">Video ID</label>
                      <input
                        className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
                        value={vid.id}
                        onChange={e => updateVideo(i, 'id', e.target.value)}
                        placeholder="7645145813613595925"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1">Label</label>
                      <input
                        className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
                        value={vid.label}
                        onChange={e => updateVideo(i, 'label', e.target.value)}
                        placeholder="Highlights 2026-05-29"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(i)}
                    className="mt-6 p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                    aria-label="Remove video"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <p className="text-[10px] text-white/25 pt-1">Find the Video ID in a TikTok URL: tiktok.com/@user/video/<strong className="text-white/40">VIDEO_ID</strong></p>
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
                <button
                  type="button"
                  onClick={() => startTransition(() => logout())}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-400/8 border border-red-400/15 hover:bg-red-400/15 transition-colors"
                >
                  Sign Out of All Sessions
                </button>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
