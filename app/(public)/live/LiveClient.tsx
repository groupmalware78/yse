'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Radio } from 'lucide-react'
import { GlassCard, SectionHeader } from '@/components/ui/GlassCard'
import type { TikTokVideo } from '@/lib/actions/settings'

function TikTokIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  )
}

interface Props {
  tiktokHandle: string
  tiktokProfileUrl: string
  tiktokLiveUrl: string | null
  livePageEnabled: boolean
  tiktokVideos: TikTokVideo[]
  iframeUrl: string
  iframeEnabled: boolean
}

export function LiveClient({ tiktokHandle, tiktokProfileUrl, tiktokLiveUrl, livePageEnabled, tiktokVideos, iframeUrl, iframeEnabled }: Readonly<Props>) {
  return (
    <main className="min-h-screen bg-yse-dark pt-24 pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <SectionHeader
            label="Follow Along"
            title={<>YSE on <span className="text-gold">TikTok</span></>}
            subtitle="Watch exclusive behind-the-scenes content, studio sessions, and live moments from YardStyle Entertainment."
            center
          />
        </div>
      </div>

      {/* Live banner — only shown when enabled and a URL is configured */}
      {livePageEnabled && tiktokLiveUrl && (
        <section className="max-w-6xl mx-auto px-6 mb-12">
          <motion.a
            href={tiktokLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between gap-6 p-6 rounded-2xl border border-neon-pink/30 bg-neon-pink/5 hover:bg-neon-pink/10 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-neon-pink" />
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-neon-pink animate-ping" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-neon-pink" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black tracking-widest uppercase text-neon-pink">Live Now</span>
                </div>
                <p className="font-bold text-white text-lg leading-tight">We&apos;re live on TikTok</p>
                <p className="text-white/50 text-sm">Tap to watch the stream</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-neon-pink font-bold text-sm tracking-wide flex-shrink-0">
              Watch Live
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.a>
        </section>
      )}

      {/* Webpage iframe */}
      {iframeEnabled && iframeUrl && (
        <section className="max-w-6xl mx-auto px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-yse-border bg-yse-card"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-yse-border bg-white/[0.03]">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">Live Stream</span>
              <a
                href={iframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
              >
                Open in tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={iframeUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; magnetometer; picture-in-picture; payment"
                allowFullScreen
                title="Live Stream"
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* Profile card */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="flex justify-center">
          <GlassCard gold className="p-8 flex flex-col items-center gap-6 w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-gold-muted border border-gold/30 flex items-center justify-center">
              <TikTokIcon className="w-9 h-9 text-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">{tiktokHandle}</h2>
              <p className="text-white/50 text-sm mt-1">YardStyle Entertainment</p>
            </div>
            <a
              href={tiktokProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-black font-bold text-sm tracking-wide hover:bg-gold-light transition-colors duration-200"
            >
              Follow on TikTok
              <ExternalLink className="w-4 h-4" />
            </a>
          </GlassCard>
        </div>
      </section>

      {/* Video embeds — only rendered when there are videos to show */}
      {tiktokVideos.length > 0 && (
        <section className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="section-label mb-4">Latest Content</p>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">Recent Videos</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tiktokVideos.map(({ id, label }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-3"
              >
                <p className="text-gold text-xs font-bold uppercase tracking-widest">{label}</p>
                <div className="rounded-2xl overflow-hidden border border-yse-border bg-yse-card aspect-[9/16]">
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${id}`}
                    className="w-full h-full"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={label}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <a
              href={tiktokProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-gold/40 text-gold font-bold tracking-wide hover:bg-gold-muted transition-colors duration-200"
            >
              <TikTokIcon className="w-5 h-5" />
              View all videos on TikTok
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </section>
      )}
    </main>
  )
}
