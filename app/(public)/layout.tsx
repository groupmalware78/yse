export const dynamic = 'force-dynamic'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingPlayer } from '@/components/layout/FloatingPlayer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/layout/PageTransition'
import { getSettings } from '@/lib/actions/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <>
      <CustomCursor />
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer settings={settings} />
      <FloatingPlayer />
    </>
  )
}
