'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Disc, Calendar, BookOpen,
  Volume2, LogOut, Settings, ChevronRight, Menu, X
} from 'lucide-react'
import { logout, getAdminInfo } from '@/lib/adminAuth'
import { useState } from 'react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/bookings', icon: BookOpen, label: 'Bookings', badge: true },
  { href: '/admin/artists', icon: Users, label: 'Artists' },
  { href: '/admin/releases', icon: Disc, label: 'Releases' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/sound-system', icon: Volume2, label: 'Sound System' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

function NavItem({ item, collapsed }: { item: typeof navItems[0]; collapsed: boolean }) {
  const pathname = usePathname()
  const active = pathname === item.href
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
        active
          ? 'bg-gold/12 text-gold border border-gold/20'
          : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      <Icon size={17} className={`flex-shrink-0 ${active ? 'text-gold' : 'text-white/40 group-hover:text-white/70'}`} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && active && <ChevronRight size={13} className="ml-auto text-gold/60" />}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2 py-1 bg-[#111] border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
          {item.label}
        </div>
      )}
    </Link>
  )
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const admin = getAdminInfo()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
          <span className="text-black font-black text-[10px]">YSE</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-gold font-black text-sm tracking-widest leading-none">YARDSTYLE</p>
            <p className="text-white/30 text-[9px] tracking-[0.2em]">CMS Admin</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="ml-auto text-white/30 hover:text-white transition-colors hidden lg:block flex-shrink-0"
        >
          <Menu size={15} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-white/5">
        {!collapsed && admin && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-[10px] font-black">{admin.name[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{admin.name}</p>
              <p className="text-white/30 text-[10px] capitalize">{admin.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-400/8 transition-all duration-200 border border-transparent ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#080808] border-r border-white/5 h-screen sticky top-0 flex-shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/8"
      >
        <Menu size={17} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-56 bg-[#080808] border-r border-white/5 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
