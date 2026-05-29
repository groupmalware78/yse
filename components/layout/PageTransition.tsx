'use client'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Store the pathname present on first render. useRef(value) only uses
  // the argument on mount, so this is stable across re-renders and safe
  // under React strict-mode's double-invoke.
  const initialPath = useRef(pathname)

  return (
    <motion.main
      key={pathname}
      initial={pathname === initialPath.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}
