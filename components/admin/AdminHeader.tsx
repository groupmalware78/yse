'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Bell, Calendar, Mail, X } from 'lucide-react'
import { getNotifications } from '@/lib/actions/notifications'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

type Notifications = Awaited<ReturnType<typeof getNotifications>>

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Notifications | null>(null)
  const [lastSeen, setLastSeen] = useState<number>(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('notif_last_seen')
    if (stored) setLastSeen(Number(stored))
    getNotifications().then(setData)
  }, [])

  useEffect(() => {
    if (!open) return
    const now = Date.now()
    localStorage.setItem('notif_last_seen', String(now))
    setLastSeen(now)
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const isNew = (date: Date) => new Date(date).getTime() > lastSeen
  const count = [
    ...(data?.bookings.map(b => b.submittedAt) ?? []),
    ...(data?.subscribers.map(s => s.subscribedAt) ?? []),
  ].filter(isNew).length

  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
      <div>
        <h1 className="text-2xl font-black text-white">{title}</h1>
        {subtitle && <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-2 px-3 py-2 glass rounded-xl text-xs text-white/40 hover:text-white transition-colors border border-white/8"
        >
          <ExternalLink size={12} /> View Site
        </Link>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(v => !v)}
            className="relative w-8 h-8 glass rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/8"
          >
            <Bell size={14} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-black text-[9px] font-black flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-80 glass border border-white/10 rounded-2xl shadow-glass z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="text-xs font-bold tracking-widest uppercase text-white/50">Notifications</span>
                <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors"><X size={13} /></button>
              </div>

              {!data ? (
                <div className="px-4 py-6 text-center text-white/30 text-xs">Loading…</div>
              ) : count === 0 ? (
                <div className="px-4 py-6 text-center text-white/30 text-xs">No new notifications</div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {data.bookings.length > 0 && (
                    <>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-white/25">Pending Bookings</p>
                      {data.bookings.map(b => (
                        <Link
                          key={b.id}
                          href="/admin/bookings"
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Calendar size={12} className="text-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{b.name}</p>
                            <p className="text-[10px] text-white/40 truncate">{b.service} · #{b.ref}</p>
                            <p className="text-[10px] text-white/25 mt-0.5">{timeAgo(b.submittedAt)}</p>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}

                  {data.subscribers.length > 0 && (
                    <>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-white/25">New Subscribers</p>
                      {data.subscribers.map(s => (
                        <div key={s.id} className="flex items-start gap-3 px-4 py-3">
                          <div className="w-7 h-7 rounded-lg bg-deep-green/30 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Mail size={12} className="text-white/50" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{s.email}</p>
                            <p className="text-[10px] text-white/25 mt-0.5">{timeAgo(s.subscribedAt)}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  positive?: boolean
  icon: React.ElementType
  color?: string
}

export function StatCard({ label, value, change, positive = true, icon: Icon, color = '#d4af37' }: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}25` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {change && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {positive ? '+' : ''}{change}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-white mb-0.5">{value}</p>
      <p className="text-white/35 text-xs font-semibold tracking-wider uppercase">{label}</p>
    </div>
  )
}
