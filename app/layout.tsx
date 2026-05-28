import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingPlayer } from '@/components/layout/FloatingPlayer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/layout/PageTransition'

export const metadata: Metadata = {
  title: 'YardStyle Entertainment | Powering Music. Elevating Culture.',
  description: "YardStyle Entertainment — Jamaica's premier music record label and sound system. Artists, bookings, sound rentals, and event production.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#060606" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-yse-dark text-white antialiased">
        <CustomCursor />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <FloatingPlayer />
      </body>
    </html>
  )
}
