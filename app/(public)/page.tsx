export const dynamic = 'force-dynamic'

import { Hero } from '@/components/home/Hero'
import { FeaturedArtists } from '@/components/home/FeaturedArtists'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { FeaturedReleases } from '@/components/home/FeaturedReleases'
import { Newsletter } from '@/components/home/Newsletter'
import { SoundSystemTeaser } from '@/components/home/SoundSystemTeaser'
import { getArtistsForUI, getReleasesForUI, getEventsForUI } from '@/lib/queries'

export default async function HomePage() {
  const [artists, releases, events] = await Promise.all([
    getArtistsForUI(),
    getReleasesForUI(),
    getEventsForUI(),
  ])

  return (
    <>
      <Hero />
      <FeaturedArtists artists={artists} />
      <UpcomingEvents events={events} />
      <FeaturedReleases releases={releases} />
      <SoundSystemTeaser />
      <Newsletter />
    </>
  )
}
