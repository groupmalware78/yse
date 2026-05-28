import { Hero } from '@/components/home/Hero'
import { FeaturedArtists } from '@/components/home/FeaturedArtists'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { FeaturedReleases } from '@/components/home/FeaturedReleases'
import { Newsletter } from '@/components/home/Newsletter'
import { SoundSystemTeaser } from '@/components/home/SoundSystemTeaser'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedArtists />
      <UpcomingEvents />
      <FeaturedReleases />
      <SoundSystemTeaser />
      <Newsletter />
    </>
  )
}
