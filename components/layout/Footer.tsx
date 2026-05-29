'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube, Music, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

const footerLinks = {
  label: [
    { href: '/artists', label: 'Our Artists' },
    { href: '/catalog', label: 'Music Catalog' },
    { href: '/sound-system', label: 'Sound System' },
    { href: '/booking', label: 'Book Us' },
  ],
  company: [
    { href: '/contact', label: 'Contact' },
    { href: '/booking', label: 'Artist Booking' },
    { href: '/booking', label: 'Event Production' },
    { href: '/booking', label: 'Studio Sessions' },
  ],
  streaming: [
    { href: '#', label: 'Spotify', icon: '♫' },
    { href: '#', label: 'Apple Music', icon: '♪' },
    { href: '#', label: 'YouTube Music', icon: '▶' },
    { href: '#', label: 'TIDAL', icon: '~' },
  ],
}

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter / X' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Music, href: '#', label: 'Spotify' },
]

interface FooterSettings {
  contactPhone: string
  contactEmail: string
  address: string
  whatsapp: string
}

export function Footer({ settings }: { settings: FooterSettings }) {
  return (
    <footer className="relative border-t border-white/5 overflow-hidden">
      {/* background decoration */}
      <div className="absolute inset-0 bg-yse-darker" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-deep-green/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                <span className="text-black font-black text-xs tracking-wider">YSE</span>
              </div>
              <div>
                <p className="text-gold font-black text-lg tracking-widest leading-none">YARDSTYLE</p>
                <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase font-semibold">Entertainment</p>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs">
              Jamaica's premier music record label and sound system. Powering the culture from Portmore to the world.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 transition-all duration-300"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-6">Label</p>
            <ul className="space-y-3">
              {footerLinks.label.map(l => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-white/40 text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-6">Services</p>
            <ul className="space-y-3">
              {footerLinks.company.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/40 text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-6">Contact</p>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${settings.contactPhone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-white/40 hover:text-white text-sm transition-colors">
                  <Phone size={13} className="text-gold flex-shrink-0" />
                  {settings.contactPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 text-white/40 hover:text-white text-sm transition-colors">
                  <Mail size={13} className="text-gold flex-shrink-0" />
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/40 text-sm">
                  <MapPin size={13} className="text-gold flex-shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mt-2 transition-all duration-300"
                  style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}
                >
                  WhatsApp Us
                  <ExternalLink size={10} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Streaming marquee */}
        <div className="py-8 border-b border-white/5 overflow-hidden">
          <div className="flex items-center gap-4 opacity-30">
            <div className="marquee-track">
              {[...Array(3)].flatMap(() => [
                'Spotify', '♦', 'Apple Music', '♦', 'YouTube Music', '♦', 'TIDAL', '♦', 'Deezer', '♦',
                'SoundCloud', '♦', 'Amazon Music', '♦', 'Audiomack', '♦',
              ]).map((item, i) => (
                <span key={i} className="text-xs font-bold tracking-widest uppercase text-white/40">{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © 2026 YardStyle Entertainment. All rights reserved.
          </p>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Powering Music. Elevating Culture.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white/25 text-xs hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="#" className="text-white/25 text-xs hover:text-white/50 transition-colors">Terms</Link>
            <Link href="#" className="text-white/25 text-xs hover:text-white/50 transition-colors">Press</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
