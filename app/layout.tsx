'use client'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingPlayer } from '@/components/layout/FloatingPlayer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <html lang="en" className="dark">
      <head>
        <title>YardStyle Entertainment | Powering Music. Elevating Culture.</title>
        <meta name="description" content="YardStyle Entertainment — Jamaica's premier music record label and sound system. Artists, bookings, sound rentals, and event production." />
        <meta name="theme-color" content="#060606" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-yse-dark text-white antialiased">
        <CustomCursor />
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
        <FloatingPlayer />
      </body>
    </html>
  )
}
