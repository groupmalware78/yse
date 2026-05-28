'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight, ExternalLink } from 'lucide-react'
import type { UIEvent } from '@/lib/queries'
import { SectionHeader } from '@/components/ui/GlassCard'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString('en-US', { day: '2-digit' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    year: d.getFullYear(),
    full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
  }
}

const typeColors: Record<string, string> = {
  'Sound Clash': '#d4af37',
  Festival: '#39ff14',
  Concert: '#00ffcc',
  'Club Night': '#ff0077',
}

function EventCard({ event, index, featured = false }: { event: UIEvent; index: number; featured?: boolean }) {
  const date = formatDate(event.date)
  const accent = typeColors[event.type] || '#d4af37'

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="glass rounded-2xl overflow-hidden card-hover border border-white/5 hover:border-gold/20 transition-all duration-300"
      >
        {/* Header gradient */}
        <div
          className="h-2"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
        <div className="p-6">
          <div className="flex items-start gap-5">
            {/* Date block */}
            <div
              className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-black"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
            >
              <span className="text-2xl font-black leading-none">{date.day}</span>
              <span className="text-[9px] font-bold tracking-widest">{date.month}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                >
                  {event.type}
                </span>
                <span className="text-white/30 text-[10px]">{date.year}</span>
              </div>
              <h3 className="font-black text-base text-white leading-tight mb-2">{event.title}</h3>
              <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                <MapPin size={11} className="flex-shrink-0" />
                {event.venue} · {event.city}
              </div>
              <div className="flex items-center gap-1 text-white/40 text-xs">
                <Calendar size={11} />
                {event.time}
              </div>
            </div>
          </div>

          <p className="text-white/35 text-xs leading-relaxed mt-4 mb-5">{event.description}</p>

          {/* Artists */}
          <div className="flex items-center gap-2 mb-5">
            <Users size={11} className="text-gold" />
            <div className="flex flex-wrap gap-1.5">
              {event.artists.map(a => (
                <span key={a} className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                  {a}
                </span>
              ))}
            </div>
          </div>

          <a
            href={event.tickets}
            className="btn-gold flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-widest uppercase"
          >
            Get Tickets <ExternalLink size={12} />
          </a>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="flex items-center gap-5 p-4 glass rounded-xl card-hover border border-white/5 hover:border-white/10"
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-black text-center"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}
      >
        <span className="text-lg font-black leading-none">{date.day}</span>
        <span className="text-[8px] font-bold tracking-widest">{date.month}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-white truncate">{event.title}</p>
        <p className="text-white/35 text-xs truncate flex items-center gap-1">
          <MapPin size={9} /> {event.city}
        </p>
      </div>
      <a
        href={event.tickets}
        className="flex-shrink-0 text-xs btn-glass px-3 py-1.5 rounded-lg font-semibold tracking-wider uppercase"
      >
        Tickets
      </a>
    </motion.div>
  )
}

export function UpcomingEvents({ events }: { events: UIEvent[] }) {
  const featured = events.filter(e => e.featured)
  const rest = events.filter(e => !e.featured)

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 diagonal-stripes opacity-50" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #060606 0%, #0a0808 50%, #060606 100%)' }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-72 rounded-full bg-gold/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeader
            label="Events"
            title={<>Upcoming <span className="text-gold-gradient">Shows</span></>}
            subtitle="Catch YardStyle artists and sound system at events across the globe."
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/booking"
              className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap"
            >
              Book An Event <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured events */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {featured.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} featured />
            ))}
          </div>

          {/* Side list */}
          <div className="space-y-4">
            <p className="text-white/30 text-xs tracking-widest uppercase font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gold/40" />
              More Dates
            </p>
            {rest.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <Link
                href="/booking"
                className="btn-glass w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase"
              >
                Book Us For Your Event <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
