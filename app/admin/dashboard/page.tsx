import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, Disc, Calendar, BookOpen, ArrowRight, Clock } from 'lucide-react'
import { AdminHeader, StatCard } from '@/components/admin/AdminHeader'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/actions/auth'

const statusColors: Record<string, string> = {
  pending: '#d4af37',
  confirmed: '#39ff14',
  completed: '#00ffcc',
  cancelled: '#ff0077',
}

const statusBg: Record<string, string> = {
  pending: 'rgba(212,175,55,0.12)',
  confirmed: 'rgba(57,255,20,0.12)',
  completed: 'rgba(0,255,204,0.12)',
  cancelled: 'rgba(255,0,119,0.12)',
}

export default async function DashboardPage() {
  const session = await getSession()

  const [artistCount, releaseCount, eventCount, bookingStats, recentBookings, upcomingEvents] =
    await Promise.all([
      prisma.artist.count(),
      prisma.release.count(),
      prisma.event.count(),
      Promise.all([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: 'pending' } }),
        prisma.booking.count({ where: { status: 'confirmed' } }),
        prisma.booking.count({ where: { status: 'completed' } }),
        prisma.booking.count({ where: { status: 'cancelled' } }),
      ]).then(([total, pending, confirmed, completed, cancelled]) => ({
        total, pending, confirmed, completed, cancelled,
      })),
      prisma.booking.findMany({ orderBy: { submittedAt: 'desc' }, take: 5 }),
      prisma.event.findMany({ orderBy: { date: 'asc' }, take: 3 }),
    ])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <AdminHeader
        title={`${greeting}, ${session?.name ?? 'Admin'}`}
        subtitle="Here's what's happening with YardStyle today."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard label="Total Artists" value={artistCount} icon={Users} color="#d4af37" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard label="Releases" value={releaseCount} icon={Disc} color="#00ffcc" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard label="Upcoming Events" value={eventCount} icon={Calendar} color="#39ff14" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard label="Pending Bookings" value={bookingStats.pending} icon={BookOpen} color="#d4af37" />
        </motion.div>
      </div>

      {/* Booking breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Bookings', val: bookingStats.total, color: '#fff' },
          { label: 'Confirmed', val: bookingStats.confirmed, color: '#39ff14' },
          { label: 'Completed', val: bookingStats.completed, color: '#00ffcc' },
          { label: 'Cancelled', val: bookingStats.cancelled, color: '#ff0077' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.04 }}
            className="glass rounded-xl p-4 border border-white/5 text-center"
          >
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
            <p className="text-white/30 text-[10px] tracking-widest uppercase mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="xl:col-span-2 glass rounded-2xl overflow-hidden border border-white/5"
        >
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-gold" />
              <span className="font-bold text-sm">Recent Bookings</span>
            </div>
            <Link href="/admin/bookings" className="text-gold text-xs font-semibold hover:text-gold-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentBookings.map(booking => (
              <div key={booking.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {booking.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{booking.eventName}</p>
                  <p className="text-white/35 text-xs truncate">{booking.name} · {booking.service}</p>
                </div>
                <div className="hidden md:block text-white/25 text-xs flex-shrink-0">{booking.budget}</div>
                <span
                  className="flex-shrink-0 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full capitalize"
                  style={{
                    background: statusBg[booking.status] ?? 'rgba(255,255,255,0.08)',
                    color: statusColors[booking.status] ?? '#fff',
                    border: `1px solid ${statusColors[booking.status] ?? '#fff'}25`,
                  }}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions + upcoming events */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-5 border border-white/5"
          >
            <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-4">Quick Actions</p>
            <div className="space-y-2">
              {[
                { href: '/admin/artists', icon: Users, label: 'Manage Artists', color: '#d4af37' },
                { href: '/admin/releases', icon: Disc, label: 'Add Release', color: '#00ffcc' },
                { href: '/admin/events', icon: Calendar, label: 'Add Event', color: '#39ff14' },
                { href: '/admin/bookings', icon: BookOpen, label: 'Review Bookings', color: '#d4af37' },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/8"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">{label}</span>
                  <ArrowRight size={12} className="ml-auto text-white/20 group-hover:text-white/50 transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-2xl p-5 border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">Next Events</p>
              <Link href="/admin/events" className="text-gold text-[10px] font-semibold">View all</Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-gold/12 border border-gold/20 flex flex-col items-center justify-center text-gold text-center">
                    <span className="text-sm font-black leading-none">{new Date(event.date).getDate()}</span>
                    <span className="text-[8px] font-bold">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight truncate">{event.title}</p>
                    <p className="text-white/30 text-xs flex items-center gap-1">
                      <Clock size={9} /> {event.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
