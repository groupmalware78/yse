export const dynamic = 'force-dynamic'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingPlayer } from '@/components/layout/FloatingPlayer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/layout/PageTransition'
import { getSettings } from '@/lib/actions/settings'
import { getPlayerTracks } from '@/lib/queries'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, tracks] = await Promise.all([getSettings(), getPlayerTracks()])

  return (
    <>
      <CustomCursor />
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer settings={settings} />
      <FloatingPlayer tracks={tracks} />
    </>
  )
}
