'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Volume2, Zap, Star, Calendar } from 'lucide-react'
import { SectionHeader } from '@/components/ui/GlassCard'
import { AudioVisualizer } from '@/components/ui/AudioVisualizer'
import type { getSoundPackagesForUI } from '@/lib/queries'

type SoundPackage = Awaited<ReturnType<typeof getSoundPackagesForUI>>[0]

const techSpecs = [
  { category: 'Subwoofers', items: ['18" – 21" heavy-duty woofers', 'Dual voice coil technology', 'Neodymium magnet design', 'Up to 5,000W per cabinet'] },
  { category: 'Mid-Range', items: ['12" – 15" mid drivers', 'Birch ply cabinets', 'Bass-reflex ported design', 'Horn-loaded mid-high'] },
  { category: 'High Frequency', items: ['1" compression drivers', 'Custom waveguides', 'Exponential horn loading', 'Neodymium tweeters'] },
  { category: 'Amplification', items: ['Crown & Lab Gruppen amps', 'Lake DSP processing', 'Dante digital networking', 'Redundant power systems'] },
]

const galleryItems = [
  { label: 'Main Stage Rig', desc: 'Full speaker wall at Reggae Sunsplash 2025', tag: 'Festival' },
  { label: 'Sound Clash Setup', desc: 'Battle configuration with custom dub panels', tag: 'Clash' },
  { label: 'Club Configuration', desc: 'Intimate club setup with 360° coverage', tag: 'Club' },
  { label: 'DJ Booth', desc: 'Custom YSE CDJ/mixer setup', tag: 'DJ Setup' },
  { label: 'Bass Stacks', desc: '18x 18" subwoofer array for the low end', tag: 'Equipment' },
  { label: 'Lighting Rig', desc: 'Full LED and laser production', tag: 'Lighting' },
]

function SpeakerStackVisual({ scale = 1, glow = false }: { scale?: number; glow?: boolean }) {
  return (
    <div className="flex gap-2 justify-center" style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }} aria-hidden="true">
      {/* Left sub stack */}
      <div className="flex flex-col gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            animate={glow ? {
              boxShadow: ['0 0 6px rgba(212,175,55,0.1)', '0 0 20px rgba(212,175,55,0.4)', '0 0 6px rgba(212,175,55,0.1)'],
            } : {}}
            transition={{ duration: 1.5 + i * 0.1, repeat: Infinity, delay: i * 0.1 }}
            className="speaker-cone rounded-full"
            style={{ width: 44, height: 44 }}
          />
        ))}
        <div style={{ width: 44, height: 8, background: 'linear-gradient(90deg, #1a1a1a, #111)', border: '1px solid #2a2a2a', borderRadius: 2 }} />
      </div>

      {/* Center column */}
      <div className="flex flex-col gap-1.5 justify-between">
        {/* Big subs */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={glow ? {
              boxShadow: ['0 0 12px rgba(212,175,55,0.15)', '0 0 40px rgba(212,175,55,0.5)', '0 0 12px rgba(212,175,55,0.15)'],
            } : {}}
            transition={{ duration: 1.2 + i * 0.12, repeat: Infinity, delay: i * 0.15 + 0.3 }}
            className="speaker-cone rounded-full"
            style={{ width: 72, height: 72 }}
          />
        ))}
        {/* DJ deck strip */}
        <div className="w-full h-10 glass rounded-lg border border-white/8 flex items-center justify-between px-2 mt-1">
          <div className="w-7 h-7 rounded-full glass border border-white/10" />
          <div className="flex gap-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-0.5 rounded-full" style={{ height: 4 + (i % 4) * 4, background: '#d4af37' }} />
            ))}
          </div>
          <div className="w-7 h-7 rounded-full glass border border-white/10" />
        </div>
      </div>

      {/* Right sub stack */}
      <div className="flex flex-col gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            animate={glow ? {
              boxShadow: ['0 0 6px rgba(212,175,55,0.1)', '0 0 20px rgba(212,175,55,0.4)', '0 0 6px rgba(212,175,55,0.1)'],
            } : {}}
            transition={{ duration: 1.4 + i * 0.09, repeat: Infinity, delay: i * 0.12 + 0.5 }}
            className="speaker-cone rounded-full"
            style={{ width: 44, height: 44 }}
          />
        ))}
        <div style={{ width: 44, height: 8, background: 'linear-gradient(90deg, #111, #1a1a1a)', border: '1px solid #2a2a2a', borderRadius: 2 }} />
      </div>
    </div>
  )
}

export function SoundSystemClient({ soundPackages }: { soundPackages: SoundPackage[] }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-yse-darker" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Green atmospheric glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-deep-green/40 blur-[150px]" />

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20">
        {/* Stage lights */}
        {['-30%', '-10%', '10%', '30%'].map((left, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
            className="absolute top-0 w-px h-[60vh]"
            style={{
              left: `calc(50% + ${left})`,
              background: 'linear-gradient(180deg, rgba(212,175,55,0.6) 0%, transparent 100%)',
              filter: 'blur(6px)',
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="section-label mb-6">
                <Volume2 size={12} className="inline mr-1 text-gold" />
                Professional Audio
              </p>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-none mb-6">
                <span className="text-white">The</span>{' '}
                <span className="text-gold-gradient">YardStyle</span>
                <br />
                <span className="text-white">Sound</span>{' '}
                <span className="text-gold-gradient">System</span>
              </h1>
              <p className="text-white/45 text-base leading-relaxed mb-8 max-w-lg">
                Built on authentic Jamaican sound system culture. Engineered for elite performance. From Kingston dancehalls to international festival stages, our system delivers incomparable power and clarity.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                {[
                  { val: '50,000W+', label: 'RMS Power' },
                  { val: '500+', label: 'Events' },
                  { val: '30+', label: 'Countries' },
                ].map(({ val, label }) => (
                  <div key={label} className="glass-gold rounded-xl px-5 py-3 border border-gold/15 text-center">
                    <p className="text-gold font-black text-xl">{val}</p>
                    <p className="text-white/35 text-[10px] tracking-widest uppercase">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Link href="/booking" className="btn-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
                  Rent Our Sound <ArrowRight size={16} />
                </Link>
                <a href="#packages" className="btn-outline-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase">
                  View Packages
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gold/8 blur-3xl scale-110" />
                <div className="relative glass-gold rounded-3xl p-8 border border-gold/15">
                  <SpeakerStackVisual glow />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Waveform separator */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-16">
        <AudioVisualizer barCount={80} height={40} className="opacity-25" />
      </div>

      {/* ─── PACKAGES ─── */}
      <section id="packages" className="py-20 relative">
        <div className="absolute inset-0 diagonal-stripes opacity-30" />
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              label="Rental Packages"
              title={<>Choose Your <span className="text-gold-gradient">Package</span></>}
              subtitle="Every package includes professional delivery, setup, breakdown, and on-site support."
              center
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {soundPackages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`package-card rounded-3xl overflow-hidden relative ${pkg.popular ? 'featured' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient" />
                )}
                {pkg.popular && (
                  <div className="absolute top-5 right-5">
                    <div className="flex items-center gap-1 glass-gold rounded-full px-3 py-1 border border-gold/30">
                      <Star size={10} className="text-gold" />
                      <span className="text-gold text-[9px] font-bold tracking-widest uppercase">Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2">{pkg.name}</p>
                  <p className="text-white/25 text-xs mb-6 leading-relaxed">{pkg.tagline}</p>
                  <div className="mb-2">
                    <p className="text-gold font-black text-2xl">{pkg.priceRange}</p>
                    <p className="text-white/25 text-xs mt-1">Starting price range</p>
                  </div>

                  <div className="flex items-center gap-4 my-6 py-4 border-y border-white/5">
                    <div>
                      <p className="text-white text-sm font-bold">{pkg.capacity}</p>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase">Capacity</p>
                    </div>
                    <div className="w-px h-8 bg-white/8" />
                    <div>
                      <p className="text-white text-sm font-bold">{pkg.duration}</p>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase">Duration</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                        <Check size={13} className="text-gold flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/booking"
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                      pkg.popular
                        ? 'btn-gold'
                        : 'btn-outline-gold'
                    }`}
                  >
                    Book This Package <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10 text-white/30 text-sm"
          >
            All packages customizable. <Link href="/contact" className="text-gold hover:text-gold-light transition-colors">Contact us</Link> for custom quotes on large-scale events.
          </motion.div>
        </div>
      </section>

      {/* ─── TECH SPECS ─── */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <SectionHeader
              label="Technical Specs"
              title={<>Built for <span className="text-gold-gradient">Performance</span></>}
              subtitle="Premium equipment chosen for maximum impact in any environment."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {techSpecs.map((spec, i) => (
              <motion.div
                key={spec.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-gold/15 transition-all duration-300 card-hover"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 size={14} className="text-gold" />
                  <span className="font-bold text-sm text-gold">{spec.category}</span>
                </div>
                <ul className="space-y-2">
                  {spec.items.map(item => (
                    <li key={item} className="text-white/45 text-xs flex items-start gap-2">
                      <span className="text-gold/50 mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <SectionHeader
              label="Gallery"
              title={<>Sound in <span className="text-gold-gradient">Action</span></>}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-gold/20 card-hover cursor-pointer"
              >
                {/* Placeholder gallery visual */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse at ${30 + i * 10}% ${20 + i * 8}%, rgba(212,175,55,${0.1 + i * 0.03}) 0%, #111 50%, #080808 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-grid opacity-40" />

                  {/* Speaker visual */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                    {i % 3 === 0 ? (
                      <div className="flex gap-2">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="speaker-cone rounded-full" style={{ width: 40, height: 40 }} />
                        ))}
                      </div>
                    ) : i % 3 === 1 ? (
                      <div className="speaker-cone rounded-full" style={{ width: 80, height: 80 }} />
                    ) : (
                      <div className="flex flex-col gap-1">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="flex gap-1">
                            {[...Array(4)].map((_, k) => (
                              <div key={k} className="speaker-cone rounded-full" style={{ width: 24, height: 24 }} />
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="tag">{item.tag}</span>
                  </div>

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm text-white group-hover:text-gold transition-colors">{item.label}</p>
                  <p className="text-white/35 text-xs mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-gold rounded-3xl p-12 text-center border border-gold/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 diagonal-stripes opacity-20" />
            <div className="relative z-10">
              <Zap size={40} className="text-gold mx-auto mb-6 opacity-60" />
              <h2 className="text-4xl font-black mb-4">
                Ready to <span className="text-gold-gradient">Power Your Event?</span>
              </h2>
              <p className="text-white/45 mb-8 max-w-md mx-auto text-base">
                Get a custom quote for your event. Tell us the size, location, and date, and we'll build a package that fits.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/booking" className="btn-gold px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
                  <Calendar size={15} /> Book Your Date
                </Link>
                <Link href="/contact" className="btn-outline-gold px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase">
                  Get a Custom Quote
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
