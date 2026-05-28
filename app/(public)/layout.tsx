import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingPlayer } from '@/components/layout/FloatingPlayer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/layout/PageTransition'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <FloatingPlayer />
    </>
  )
}
