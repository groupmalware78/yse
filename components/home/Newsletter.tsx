'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Mail, Instagram, Twitter, Youtube, Music } from 'lucide-react'

const socials = [
  { icon: Instagram, label: 'Instagram', handle: '@YardStyleEnt', href: '#' },
  { icon: Twitter, label: 'Twitter', handle: '@YardStyleEnt', href: '#' },
  { icon: Youtube, label: 'YouTube', handle: 'YardStyle Ent', href: '#' },
  { icon: Music, label: 'Spotify', handle: 'YardStyle Entertainment', href: '#' },
]

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #060606 0%, #050e07 50%, #060606 100%)' }} />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-72 rounded-full bg-deep-green/40 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: newsletter */}
          <motion.div
            initial={{ x: -30 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label mb-6">Stay Connected</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Join the{' '}
              <span className="text-gold-gradient">Movement</span>
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-10">
              Get first access to new releases, exclusive events, artist news, and behind-the-scenes content from the YardStyle family.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-gold rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-gold" />
                </div>
                <h3 className="text-xl font-black text-gold mb-2">Welcome to the Yard!</h3>
                <p className="text-white/50 text-sm">You're now on the list. Expect fire in your inbox.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-dark w-full pl-12 pr-4 py-4 rounded-full text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold px-7 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 whitespace-nowrap"
                >
                  Subscribe <ArrowRight size={15} />
                </button>
              </form>
            )}

            <p className="text-white/20 text-xs mt-4">
              No spam, ever. Unsubscribe anytime. Your privacy is respected.
            </p>
          </motion.div>

          {/* Right: social links */}
          <motion.div
            initial={{ x: 30 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-white/30 text-xs font-bold tracking-widest uppercase mb-8">
              Follow Us
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socials.map(({ icon: Icon, label, handle, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ y: 15 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="glass rounded-2xl p-5 flex items-center gap-4 card-hover border border-white/5 hover:border-gold/20 group"
                >
                  <div className="w-10 h-10 rounded-full glass-gold flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white group-hover:text-gold transition-colors">{label}</p>
                    <p className="text-white/30 text-xs">{handle}</p>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-white/20 group-hover:text-gold/60 transition-colors" />
                </motion.a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/18761234567"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 10 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              transformTemplate={({ y }) => `translateY(${y})`}
              className="mt-4 flex items-center gap-3 p-5 rounded-2xl card-hover border"
              style={{
                background: 'rgba(37,211,102,0.06)',
                borderColor: 'rgba(37,211,102,0.2)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)' }}
              >
                💬
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: '#25d366' }}>WhatsApp</p>
                <p className="text-white/30 text-xs">Chat directly with the team</p>
              </div>
              <ArrowRight size={14} className="ml-auto" style={{ color: 'rgba(37,211,102,0.5)' }} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
