'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/artists', label: 'Artists' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/sound-system', label: 'Sound System' },
  { href: '/contact', label: 'Contact' },
]

function EqAnimation() {
  return (
    <div className="eq-container" style={{ height: 16 }} aria-hidden="true">
      {[1, 2, 3, 4, 5].map(n => (
        <div
          key={n}
          className="eq-bar"
          style={{
            width: 2,
            background: '#d4af37',
            borderRadius: '2px 2px 0 0',
            animationName: `eq${n}`,
            animationDuration: `${0.5 + n * 0.1}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-dark shadow-glass border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold flex-shrink-0">
              <span className="text-black font-black text-xs tracking-wider">YSE</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-gold font-black text-base tracking-widest leading-none">YARDSTYLE</p>
              <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase font-semibold">Entertainment</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <EqAnimation />
              <span className="text-gold text-xs font-semibold tracking-widest uppercase">Live</span>
            </div>
            <Link
              href="/booking"
              className="hidden md:inline-flex items-center btn-gold px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase"
            >
              Book Us
            </Link>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden text-white/80 hover:text-white transition-colors p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu flex flex-col items-center justify-center"
          >
            {/* bg decoration */}
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

            <nav className="relative z-10 flex flex-col items-center gap-2 w-full px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                  className="w-full"
                >
                  <Link
                    href={link.href}
                    className={`block py-4 text-center text-2xl font-black tracking-widest uppercase transition-colors border-b border-white/5 ${
                      pathname === link.href ? 'text-gold' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 w-full max-w-xs"
              >
                <Link
                  href="/booking"
                  className="btn-gold block text-center py-4 rounded-full text-sm font-bold tracking-widest uppercase"
                >
                  Book Us Now
                </Link>
              </motion.div>
            </nav>

            {/* YSE logo at bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 text-center"
            >
              <p className="text-gold/30 text-xs tracking-[0.3em] uppercase font-semibold">YardStyle Entertainment</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
