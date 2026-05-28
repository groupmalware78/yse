'use client'
import Link from 'next/link'
import { ExternalLink, Bell } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
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
        <button className="relative w-8 h-8 glass rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/8">
          <Bell size={14} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-black text-[9px] font-black flex items-center justify-center">3</span>
        </button>
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
