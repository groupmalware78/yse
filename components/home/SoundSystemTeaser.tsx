'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Volume2, ArrowRight, Zap } from 'lucide-react'

function SpeakerWall() {
  const cols = 5
  const rows = 7
  return (
    <div className="flex gap-3" aria-hidden="true">
      {/* Left stack */}
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: rows }).map((_, ri) => (
          <div key={ri} className="flex flex-col gap-1">
            {Array.from({ length: 3 }).map((_, ci) => (
              <motion.div
                key={ci}
                animate={{
                  boxShadow: [
                    '0 0 4px rgba(212,175,55,0.05)',
                    '0 0 12px rgba(212,175,55,0.25)',
                    '0 0 4px rgba(212,175,55,0.05)',
                  ],
                }}
                transition={{ duration: 0.8 + ri * 0.1 + ci * 0.07, repeat: Infinity, delay: ri * 0.08 }}
                className="speaker-cone rounded-full"
                style={{ width: 28, height: 28 }}
              />
            ))}
            <div style={{ width: 28, height: 5, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 2 }} />
          </div>
        ))}
      </div>

      {/* Center big sub */}
      <div className="flex flex-col justify-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              boxShadow: [
                '0 0 10px rgba(212,175,55,0.1)',
                '0 0 30px rgba(212,175,55,0.4)',
                '0 0 10px rgba(212,175,55,0.1)',
              ],
            }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
            className="speaker-cone rounded-full"
            style={{ width: 64, height: 64 }}
          />
        ))}
      </div>

      {/* Right stack */}
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: rows }).map((_, ri) => (
          <div key={ri} className="flex flex-col gap-1">
            {Array.from({ length: 3 }).map((_, ci) => (
              <motion.div
                key={ci}
                animate={{
                  boxShadow: [
                    '0 0 4px rgba(212,175,55,0.05)',
                    '0 0 12px rgba(212,175,55,0.25)',
                    '0 0 4px rgba(212,175,55,0.05)',
                  ],
                }}
                transition={{ duration: 0.9 + ri * 0.08 + ci * 0.06, repeat: Infinity, delay: ri * 0.1 + 0.3 }}
                className="speaker-cone rounded-full"
                style={{ width: 28, height: 28 }}
              />
            ))}
            <div style={{ width: 28, height: 5, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 2 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SoundSystemTeaser() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #030303 0%, #0a0f05 50%, #030303 100%)' }} />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 diagonal-stripes opacity-30" />

      {/* Gold horizontal line accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Glow behind speakers */}
              <div className="absolute inset-0 rounded-3xl bg-gold/10 blur-3xl scale-110" />

              {/* Speaker wall */}
              <div className="relative glass-gold rounded-3xl p-8 border border-gold/15">
                <SpeakerWall />

                {/* DJ Booth strip */}
                <div className="mt-4 h-12 glass rounded-xl border border-white/5 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, 30 + Math.random() * 10, 8] }}
                        transition={{ duration: 0.4 + i * 0.05, repeat: Infinity }}
                        className="w-1.5 bg-gold rounded-full"
                        style={{ height: 8 }}
                      />
                    ))}
                  </div>
                  <div className="w-20 h-6 rounded-full bg-white/5 border border-white/10 flex items-center px-2">
                    <div className="w-4 h-4 rounded-full bg-gold/30 border border-gold/50" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < 3 ? '#39ff14' : '#333' }} />
                    ))}
                  </div>
                </div>

                {/* Power indicator */}
                <div className="absolute -top-3 -right-3 flex items-center gap-1.5 glass-gold rounded-full px-3 py-1 border border-gold/30">
                  <Zap size={10} className="text-gold" />
                  <span className="text-gold text-[9px] font-bold tracking-widest">LIVE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="section-label mb-6">
              <Volume2 size={12} className="inline mr-1 text-gold" />
              Sound System
            </p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              <span className="text-white">The Most</span>{' '}
              <span className="text-gold-gradient">Powerful</span>
              <br />
              <span className="text-white">Sound in</span>{' '}
              <span className="text-gold-gradient">The Yard</span>
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-8">
              Our professional-grade sound system setup delivers concert-quality audio at any scale — from intimate events to massive festival stages. Built on authentic Jamaican sound system culture.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-10">
              {[
                'Multi-stack speaker arrays up to 50,000W RMS',
                'Custom-built sub bass cabinets (18"–21")',
                'Professional CDJ/mixer setups',
                'Full LED lighting and laser rigs',
                'Expert selectors and sound engineers',
              ].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-white/60 text-sm">
                  <div className="w-4 h-4 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sound-system"
                className="btn-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2"
              >
                View Packages <ArrowRight size={16} />
              </Link>
              <Link
                href="/booking"
                className="btn-outline-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase"
              >
                Rent Our Sound
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
