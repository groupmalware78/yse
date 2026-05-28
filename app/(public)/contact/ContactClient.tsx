'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, Check, ExternalLink, Instagram, Twitter, Youtube, Music } from 'lucide-react'

const departments = [
  { id: 'booking', label: 'Artist Booking' },
  { id: 'sound', label: 'Sound System Rental' },
  { id: 'management', label: 'Artist Management' },
  { id: 'press', label: 'Press & Media' },
  { id: 'studio', label: 'Studio Sessions' },
  { id: 'general', label: 'General Inquiry' },
]

const socials = [
  { icon: Instagram, label: 'Instagram', handle: '@YardStyleEnt', color: '#E1306C', href: '#' },
  { icon: Twitter, label: 'Twitter / X', handle: '@YardStyleEnt', color: '#1DA1F2', href: '#' },
  { icon: Youtube, label: 'YouTube', handle: 'YardStyle Entertainment', color: '#FF0000', href: '#' },
  { icon: Music, label: 'Spotify', handle: 'YardStyle Entertainment', color: '#1DB954', href: '#' },
]

interface Props {
  settings: {
    contactPhone: string
    contactEmail: string
    address: string
    whatsapp: string
  }
}

export function ContactClient({ settings }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', message: '' })
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: settings.contactPhone, detail: 'Mon – Sat, 9AM – 7PM EST', href: `tel:${settings.contactPhone.replace(/\D/g, '')}` },
    { icon: Mail, label: 'Email', value: settings.contactEmail, detail: 'We reply within 24 hours', href: `mailto:${settings.contactEmail}` },
    { icon: MapPin, label: 'Studio Office', value: settings.address, detail: 'Jamaica, West Indies', href: '#map' },
    { icon: Clock, label: 'Office Hours', value: 'Mon – Sat: 9AM – 8PM', detail: 'Sunday: By appointment', href: null },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-yse-darker" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-72 rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-deep-green/25 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="section-label mb-4">Get In Touch</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">Contact <span className="text-gold-gradient">Us</span></h1>
          <p className="text-white/45 text-lg max-w-lg">Have a booking inquiry, press request, or just want to connect? We're here for it.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="glass-gold rounded-3xl p-12 text-center border border-gold/20">
                <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-gold" />
                </div>
                <h2 className="text-2xl font-black text-gold mb-3">Message Received!</h2>
                <p className="text-white/50 leading-relaxed mb-6">
                  Thank you for reaching out. A member of our team will get back to you at <strong className="text-white">{form.email}</strong> within 24 hours.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', department: '', message: '' }) }}
                  className="btn-outline-gold px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass rounded-3xl p-8 border border-white/5">
                <h2 className="font-black text-xl mb-6">Send us a message</h2>
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-white/35 mb-2">Full Name *</label>
                      <input className="input-dark w-full px-4 py-3.5 rounded-xl text-sm" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-white/35 mb-2">Email *</label>
                      <input type="email" className="input-dark w-full px-4 py-3.5 rounded-xl text-sm" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-white/35 mb-2">Phone</label>
                      <input type="tel" className="input-dark w-full px-4 py-3.5 rounded-xl text-sm" placeholder="+1 (000) 000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-white/35 mb-2">Department *</label>
                      <select className="input-dark w-full px-4 py-3.5 rounded-xl text-sm" value={form.department} onChange={e => update('department', e.target.value)} required>
                        <option value="">Select department...</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-white/35 mb-2">Message *</label>
                    <textarea rows={6} className="input-dark w-full px-4 py-3.5 rounded-xl text-sm resize-none" placeholder="Tell us about your inquiry..." value={form.message} onChange={e => update('message', e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-gold w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase inline-flex items-center justify-center gap-2">
                    Send Message <Send size={15} />
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-5">
            {contactInfo.map(({ icon: Icon, label, value, detail, href }, i) => (
              <motion.div key={label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                className="glass rounded-2xl p-5 border border-white/5 hover:border-gold/15 transition-all duration-300 card-hover">
                {href ? (
                  <a href={href} className="flex items-start gap-4">
                    <div className="w-10 h-10 glass-gold rounded-full flex items-center justify-center flex-shrink-0 border border-gold/20"><Icon size={16} className="text-gold" /></div>
                    <div>
                      <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-0.5">{label}</p>
                      <p className="font-bold text-sm text-white">{value}</p>
                      <p className="text-white/35 text-xs mt-0.5">{detail}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 glass-gold rounded-full flex items-center justify-center flex-shrink-0 border border-gold/20"><Icon size={16} className="text-gold" /></div>
                    <div>
                      <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-0.5">{label}</p>
                      <p className="font-bold text-sm text-white">{value}</p>
                      <p className="text-white/35 text-xs mt-0.5">{detail}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            <motion.a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="flex items-center gap-4 p-5 rounded-2xl card-hover border cursor-pointer"
              style={{ background: 'rgba(37,211,102,0.06)', borderColor: 'rgba(37,211,102,0.25)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)' }}>💬</div>
              <div>
                <p className="font-bold text-sm" style={{ color: '#25d366' }}>WhatsApp Direct</p>
                <p className="text-white/35 text-xs">Click to start a chat now</p>
              </div>
              <ExternalLink size={14} className="ml-auto" style={{ color: 'rgba(37,211,102,0.5)' }} />
            </motion.a>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-4">Follow Us</p>
              <div className="space-y-2">
                {socials.map(({ icon: Icon, label, handle, color, href }) => (
                  <a key={label} href={href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                    <Icon size={16} style={{ color }} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">{label}</p>
                      <p className="text-white/25 text-[10px]">{handle}</p>
                    </div>
                    <ExternalLink size={12} className="text-white/20 group-hover:text-white/40 transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div id="map" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
          <h2 className="font-black text-2xl mb-6">Find <span className="text-gold-gradient">Us</span></h2>
          <div className="glass rounded-3xl overflow-hidden border border-white/5 h-80 relative">
            <div className="absolute inset-0 bg-grid opacity-50" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(5,46,22,0.4) 0%, transparent 70%)' }} />
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="absolute left-0 right-0 border-t border-gold/10" style={{ top: `${i * 12.5}%` }} />)}
              {Array.from({ length: 12 }).map((_, i) => <div key={i} className="absolute top-0 bottom-0 border-l border-gold/10" style={{ left: `${i * 8.33}%` }} />)}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div animate={{ y: [-4, 0, -4] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center">
                <div className="glass-gold rounded-2xl px-5 py-3 border border-gold/30 text-center mb-2">
                  <p className="font-black text-gold text-sm">YardStyle Entertainment</p>
                  <p className="text-white/45 text-xs">{settings.address}</p>
                </div>
                <div className="w-4 h-4 rounded-full bg-gold shadow-gold" />
                <div className="w-px h-6 bg-gold/40" />
              </motion.div>
            </div>
            <div className="absolute bottom-4 right-4">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-glass px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2">
                Open in Maps <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
