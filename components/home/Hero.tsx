'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { AudioVisualizer } from '@/components/ui/AudioVisualizer'

function SpotlightBeam({ left, delay, duration, color = '#d4af37' }: {
  left: string; delay: number; duration: number; color?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: [0, 0.6, 0.3, 0.7, 0.3], scaleY: 1 }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDuration: duration, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        top: 0,
        left,
        width: '2px',
        height: '60vh',
        background: `linear-gradient(180deg, ${color}88 0%, ${color}33 50%, transparent 100%)`,
        filter: 'blur(6px)',
        transformOrigin: 'top center',
      }}
    />
  )
}

function StageLights() {
  const lights = [
    { left: '15%', delay: 0, duration: 3, color: '#d4af37' },
    { left: '28%', delay: 0.5, duration: 4, color: '#00ffcc' },
    { left: '42%', delay: 1, duration: 3.5, color: '#d4af37' },
    { left: '58%', delay: 0.8, duration: 4.5, color: '#39ff14' },
    { left: '72%', delay: 0.3, duration: 3, color: '#d4af37' },
    { left: '85%', delay: 1.2, duration: 4, color: '#00ffcc' },
  ]
  return (
    <>
      {lights.map((l, i) => <SpotlightBeam key={i} {...l} />)}
    </>
  )
}

function SpeakerStack({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`hidden xl:flex flex-col gap-1.5 absolute ${side === 'left' ? 'left-8' : 'right-8'} bottom-24`}
      style={{ opacity: 0.35 }}
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          {Array.from({ length: 3 }).map((_, j) => (
            <div
              key={j}
              className="speaker-cone rounded-full"
              style={{
                width: i < 2 ? 48 : i < 4 ? 38 : 28,
                height: i < 2 ? 48 : i < 4 ? 38 : 28,
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8), 0 0 4px rgba(212,175,55,0.1)',
              }}
            />
          ))}
          <div
            style={{
              width: i < 2 ? 48 : i < 4 ? 38 : 28,
              height: 6,
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 2,
            }}
          />
        </div>
      ))}
      <div
        style={{
          width: 60,
          height: 80,
          background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
          border: '1px solid #2a2a2a',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 40, height: 40 }} className="speaker-cone rounded-full" />
      </div>
    </div>
  )
}

function VinylRecord() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className="vinyl absolute"
      style={{ width: 180, height: 180, opacity: 0.15, bottom: 80, right: '25%' }}
      aria-hidden="true"
    />
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Dark background with atmospheric gradients */}
      <div className="absolute inset-0 bg-yse-darker" />
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-deep-green/40 blur-[120px]" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-gold/8 blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-neon-cyan/5 blur-[80px]" />

      {/* Stage spotlight beams */}
      <StageLights />

      {/* Speaker stacks */}
      <SpeakerStack side="left" />
      <SpeakerStack side="right" />

      {/* Vinyl */}
      <VinylRecord />

      {/* Main content */}
      <div className="relative z-10 text-center px-5 max-w-5xl mx-auto pt-24 pb-16">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
          <span className="tag">Est. 2018 · Kingston, Jamaica</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <h1 className="font-black leading-none mb-2 tracking-tight">
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white">
              YARD
            </span>
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gold-gradient">
              STYLE
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-[0.3em] text-white/60 uppercase mt-3">
            Entertainment
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-base md:text-xl text-white/50 font-light tracking-wide max-w-lg mx-auto"
        >
          Powering Music.{' '}
          <span className="text-gold font-semibold">Elevating Culture.</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <Link
            href="/booking"
            className="btn-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 z-10"
          >
            Book Us
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/catalog"
            className="btn-outline-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 z-10"
          >
            Explore Catalog
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-12 border-t border-white/5"
        >
          {[
            { val: '500+', label: 'Events' },
            { val: '15+', label: 'Artists' },
            { val: '50M+', label: 'Streams' },
            { val: '30+', label: 'Countries' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-black text-gold-gradient">{val}</p>
              <p className="text-white/35 text-xs tracking-widest uppercase mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Audio visualizer — bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute bottom-20 md:bottom-24 left-0 right-0 px-8 flex justify-center"
      >
        <AudioVisualizer barCount={48} height={50} className="max-w-2xl w-full opacity-60" />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} className="text-gold/40" />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yse-dark to-transparent" />
    </section>
  )
}
