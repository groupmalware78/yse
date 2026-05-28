'use client'
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash2, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { updateBookingStatus, deleteBooking } from '@/lib/actions/bookings'
import { useRouter } from 'next/navigation'
import type { Booking } from '@prisma/client'

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

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

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full capitalize"
      style={{ background: statusBg[status] ?? 'rgba(255,255,255,0.08)', color: statusColors[status] ?? '#fff', border: `1px solid ${statusColors[status] ?? '#fff'}30` }}
    >
      {status}
    </span>
  )
}

function BookingRow({ booking, onStatusChange, onDelete }: {
  booking: Booking
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  return (
    <>
      <tr
        className={`border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer ${expanded ? 'bg-white/3' : ''}`}
        onClick={() => setExpanded(v => !v)}
      >
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>
              {booking.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-white truncate">{booking.name}</p>
              <p className="text-white/30 text-xs truncate">{booking.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 hidden md:table-cell">
          <p className="font-semibold text-sm text-white truncate max-w-48">{booking.eventName}</p>
          <p className="text-white/30 text-xs">{booking.service}</p>
        </td>
        <td className="px-4 py-4 hidden lg:table-cell">
          <p className="text-sm text-white/70">{booking.eventDate}</p>
          <p className="text-white/30 text-xs">{booking.city}</p>
        </td>
        <td className="px-4 py-4 hidden xl:table-cell">
          <p className="text-sm text-white/60">{booking.budget}</p>
        </td>
        <td className="px-4 py-4"><StatusBadge status={booking.status} /></td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={() => setChangingStatus(v => !v)}
                className="px-2.5 py-1.5 glass rounded-lg text-[10px] font-bold text-white/50 hover:text-white transition-colors border border-white/8 flex items-center gap-1"
              >
                Status <ChevronDown size={10} />
              </button>
              {changingStatus && (
                <div className="absolute right-0 top-full mt-1 z-50 glass rounded-xl overflow-hidden border border-white/10 shadow-glass min-w-32">
                  {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => { onStatusChange(booking.id, s); setChangingStatus(false) }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold capitalize hover:bg-white/8 transition-colors text-left"
                      style={{ color: statusColors[s] }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[s] }} />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => onDelete(booking.id)}
              className="p-1.5 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
            >
              <Trash2 size={13} />
            </button>
            <div className="text-white/20">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-white/5 bg-white/2">
          <td colSpan={6} className="px-5 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Booking Ref</p>
                <p className="text-gold font-bold text-sm">{booking.ref}</p>
              </div>
              <div>
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Phone</p>
                <p className="text-white/70 text-sm">{booking.phone}</p>
              </div>
              {booking.organization && (
                <div>
                  <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Organization</p>
                  <p className="text-white/70 text-sm">{booking.organization}</p>
                </div>
              )}
              <div>
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Guest Count</p>
                <p className="text-white/70 text-sm">{booking.guestCount}</p>
              </div>
              <div>
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Genre</p>
                <p className="text-white/70 text-sm">{booking.genre ?? '—'}</p>
              </div>
              <div>
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Submitted</p>
                <p className="text-white/70 text-sm">{new Date(booking.submittedAt).toLocaleDateString()}</p>
              </div>
              {booking.notes && (
                <div className="col-span-2 md:col-span-4">
                  <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Notes</p>
                  <p className="text-white/60 text-sm leading-relaxed bg-white/3 p-3 rounded-lg border border-white/5">{booking.notes}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              <button
                onClick={() => onStatusChange(booking.id, 'confirmed')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
              >
                <CheckCircle size={12} /> Confirm
              </button>
              <button
                onClick={() => onStatusChange(booking.id, 'cancelled')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <XCircle size={12} /> Cancel
              </button>
              <a
                href={`mailto:${booking.email}?subject=Re: ${booking.eventName} - YardStyle Entertainment`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold glass border border-white/8 text-white/60 hover:text-white transition-colors"
              >
                Reply via Email
              </a>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all')
  const [, startTransition] = useTransition()
  const router = useRouter()

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.eventName.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.ref.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || b.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleStatusChange = (id: string, status: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    startTransition(async () => {
      await updateBookingStatus(id, status)
      router.refresh()
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this booking? This cannot be undone.')) return
    setBookings(prev => prev.filter(b => b.id !== id))
    startTransition(async () => {
      await deleteBooking(id)
      router.refresh()
    })
  }

  return (
    <div>
      <AdminHeader title="Bookings" subtitle="Manage and respond to incoming booking requests" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Total', val: stats.total, color: '#fff', status: 'all' as const },
          { label: 'Pending', val: stats.pending, color: '#d4af37', status: 'pending' as const },
          { label: 'Confirmed', val: stats.confirmed, color: '#39ff14', status: 'confirmed' as const },
          { label: 'Completed', val: stats.completed, color: '#00ffcc', status: 'completed' as const },
          { label: 'Cancelled', val: stats.cancelled, color: '#ff0077', status: 'cancelled' as const },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setFilterStatus(s.status)}
            className={`glass rounded-xl p-4 text-center transition-all border ${filterStatus === s.status ? 'border-gold/30 bg-gold/5' : 'border-white/5 hover:border-white/10'}`}
          >
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
            <p className="text-white/30 text-[10px] tracking-widest uppercase mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search by name, event, email, or ref..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Client', 'Event', 'Date', 'Budget', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 md:px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-white/25 text-sm">No bookings match your search</td></tr>
              ) : (
                filtered.map(booking => (
                  <BookingRow key={booking.id} booking={booking} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
