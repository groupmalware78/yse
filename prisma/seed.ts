import { config } from 'dotenv'
config()

import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { hash } from 'bcryptjs'

const url = process.env.DATABASE_URL!
const isSQLite = url.startsWith('file:')
const adapter = isSQLite
  ? new PrismaLibSql({ url })
  : new PrismaPg({ connectionString: url })
const prisma = new PrismaClient({ adapter })

const arr = (v: string[]) => isSQLite ? JSON.stringify(v) as unknown as string[] : v

async function main() {
  console.log('🌱 Seeding database...')

  // Admin users
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: await hash('YardStyle2026!', 12),
      name: 'Admin',
      role: 'superadmin',
    },
  })
  await prisma.adminUser.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      passwordHash: await hash('YSEManager!', 12),
      name: 'Label Manager',
      role: 'manager',
    },
  })

  // Artists
  const artistData = [
    {
      slug: 'king-yardie',
      name: 'King Yardie',
      genre: 'Dancehall',
      subGenre: 'Afro-Dancehall',
      origin: 'Kingston, Jamaica',
      bio: "King Yardie is the flagship artist of YardStyle Entertainment, known for his commanding stage presence and hard-hitting dancehall anthems.",
      longBio: "Born in the heart of Kingston's Arnett Gardens community, King Yardie grew up surrounded by the sound system culture that would define his artistic identity.",
      color: '#d4af37',
      streams: '12M+',
      shows: '200+',
      albums: 3,
      awards: 8,
      tracks: [
        { title: 'Crown Pon Mi Head', duration: '3:42', plays: '2.1M', album: 'Crown Pon Mi Head' },
        { title: 'Yardie Anthem', duration: '4:01', plays: '1.8M', album: 'Yard Vibes Vol.1' },
        { title: 'Rise & Shine', duration: '3:28', plays: '1.4M', album: 'Elevation' },
        { title: 'One Love Movement', duration: '3:55', plays: '980K', album: 'Crown Pon Mi Head' },
        { title: 'Sound System God', duration: '4:12', plays: '760K', album: 'Yard Vibes Vol.1' },
      ],
      artistAlbums: [
        { title: 'Crown Pon Mi Head', year: 2023, tracks: 12 },
        { title: 'Yard Vibes Vol.1', year: 2022, tracks: 10 },
        { title: 'Elevation', year: 2021, tracks: 8 },
      ],
      artistShows: [
        { date: '2026-06-14', venue: 'Usain Bolt Tracks & Records', city: 'Kingston, JA' },
        { date: '2026-07-03', venue: 'O2 Arena', city: 'London, UK' },
        { date: '2026-08-22', venue: 'Barclays Center', city: 'New York, USA' },
      ],
    },
    {
      slug: 'empress-zara',
      name: 'Empress Zara',
      genre: 'Reggae',
      subGenre: 'Roots Reggae',
      origin: 'Trench Town, Jamaica',
      bio: "Empress Zara brings the timeless spirit of roots reggae into the modern era.",
      longBio: "Growing up in the legendary Trench Town neighborhood of Kingston, Empress Zara absorbed the rich musical heritage that produced many of reggae's greatest artists.",
      color: '#00ffcc',
      streams: '8M+',
      shows: '150+',
      albums: 2,
      awards: 5,
      tracks: [
        { title: 'Natural Mystic Rising', duration: '4:15', plays: '1.5M', album: 'Natural Mystic Rising EP' },
        { title: 'Zion Gates', duration: '3:58', plays: '1.2M', album: 'Earth & Fire' },
        { title: 'Empress Calling', duration: '4:33', plays: '890K', album: 'Earth & Fire' },
        { title: 'Roots & Culture', duration: '3:47', plays: '650K', album: 'Natural Mystic Rising EP' },
      ],
      artistAlbums: [
        { title: 'Earth & Fire', year: 2024, tracks: 11 },
        { title: 'Natural Mystic Rising EP', year: 2022, tracks: 6 },
      ],
      artistShows: [
        { date: '2026-06-28', venue: 'Reggae Sunsplash', city: 'Montego Bay, JA' },
        { date: '2026-09-12', venue: 'Rototom Sunsplash', city: 'Benicàssim, Spain' },
      ],
    },
    {
      slug: 'dj-yardie-flash',
      name: 'DJ Yardie Flash',
      genre: 'DJ / Selector',
      subGenre: 'Sound System',
      origin: 'Spanish Town, Jamaica',
      bio: "The most electrifying selector in the YardStyle sound system, DJ Yardie Flash commands dance floors across three continents.",
      longBio: "DJ Yardie Flash began his career at age 15, cutting his teeth on the legendary sound system circuit of Spanish Town.",
      color: '#39ff14',
      streams: '5M+',
      shows: '350+',
      albums: 1,
      awards: 12,
      tracks: [
        { title: 'Clash Mix Vol.1 (Live)', duration: '45:00', plays: '500K', album: 'Sound Clashes' },
        { title: 'Dubplate Special 2024', duration: '32:00', plays: '380K', album: 'Dubplate Specials' },
      ],
      artistAlbums: [
        { title: 'Sound Clashes: Live Recordings', year: 2023, tracks: 5 },
      ],
      artistShows: [
        { date: '2026-07-19', venue: 'Dub Club LA', city: 'Los Angeles, USA' },
        { date: '2026-08-08', venue: 'Fabric', city: 'London, UK' },
        { date: '2026-10-04', venue: 'Oath', city: 'Tokyo, Japan' },
      ],
    },
    {
      slug: 'ras-marcus',
      name: 'Ras Marcus',
      genre: 'Reggae / Dub',
      subGenre: 'Dub Poetry',
      origin: 'Clarendon, Jamaica',
      bio: "Ras Marcus blends dub production mastery with spoken word poetry, creating immersive sonic journeys.",
      longBio: "Raised in the rural parish of Clarendon, Ras Marcus developed a deep connection to the land and its stories.",
      color: '#d4af37',
      streams: '3.5M+',
      shows: '100+',
      albums: 4,
      awards: 3,
      tracks: [
        { title: 'Dub Philosophy', duration: '6:22', plays: '450K', album: 'Earthworks' },
        { title: 'Version Consciousness', duration: '5:48', plays: '320K', album: 'Earthworks' },
      ],
      artistAlbums: [
        { title: 'Earthworks', year: 2023, tracks: 9 },
        { title: 'Dub Sessions Vol.3', year: 2022, tracks: 7 },
        { title: 'Dub Sessions Vol.2', year: 2021, tracks: 7 },
        { title: 'Dub Sessions Vol.1', year: 2020, tracks: 8 },
      ],
      artistShows: [],
    },
    {
      slug: 'sista-nova',
      name: 'Sista Nova',
      genre: 'Afrobeats / Reggae',
      subGenre: 'Caribbean Fusion',
      origin: 'Montego Bay, Jamaica',
      bio: "Sista Nova is the sound of the Caribbean's global future — fusing Afrobeats rhythms with reggae soul.",
      longBio: "Born in Montego Bay to Jamaican-Nigerian parents, Sista Nova grew up navigating multiple musical worlds.",
      color: '#ff0077',
      streams: '6M+',
      shows: '80+',
      albums: 1,
      awards: 4,
      tracks: [
        { title: 'Caribbean Queen', duration: '3:28', plays: '2.8M', album: 'Nova Rising' },
        { title: 'Afro Yardie', duration: '3:55', plays: '1.9M', album: 'Nova Rising' },
        { title: 'Island Fire', duration: '4:02', plays: '890K', album: 'Nova Rising' },
      ],
      artistAlbums: [
        { title: 'Nova Rising', year: 2024, tracks: 13 },
      ],
      artistShows: [
        { date: '2026-06-21', venue: 'Afropunk', city: 'Brooklyn, USA' },
        { date: '2026-07-26', venue: 'WOMAD', city: 'Charlton Park, UK' },
      ],
    },
    {
      slug: 'selector-mighty',
      name: 'Selector Mighty',
      genre: 'DJ / Sound System',
      subGenre: 'Dancehall / Soca',
      origin: 'Kingston, Jamaica',
      bio: "Selector Mighty is the energy architect of YardStyle's live events.",
      longBio: "A Kingston native who grew up in the shadow of the famous Stone Love sound system, Selector Mighty learned the craft from the legends.",
      color: '#00ffcc',
      streams: '2M+',
      shows: '400+',
      albums: 0,
      awards: 6,
      tracks: [
        { title: 'Summer Fête Mix 2024', duration: '60:00', plays: '200K', album: 'Live Mixes' },
      ],
      artistAlbums: [],
      artistShows: [
        { date: '2026-07-12', venue: 'Notting Hill Carnival', city: 'London, UK' },
        { date: '2026-08-31', venue: 'Miami Carnival', city: 'Miami, USA' },
      ],
    },
  ]

  if (await prisma.artist.count() === 0) {
    for (const { tracks, artistAlbums, artistShows, ...artist } of artistData) {
      const created = await prisma.artist.create({
        data: {
          ...artist,
          tracks: { create: tracks },
          artistAlbums: { create: artistAlbums },
          artistShows: { create: artistShows },
        },
      })
      console.log(`  ✓ Artist: ${created.name}`)
    }
  } else {
    console.log('  – Artists already seeded, skipping')
  }

  // Releases
  const releasesData = [
    { title: 'Crown Pon Mi Head', artist: 'King Yardie', artistSlug: 'king-yardie', type: 'Album', year: 2023, genre: 'Dancehall', tracks: 12, featured: true, youtubeUrl: 'https://www.youtube.com/watch?v=Ko3Vd8MRnIc' },
    { title: 'Earth & Fire', artist: 'Empress Zara', artistSlug: 'empress-zara', type: 'Album', year: 2024, genre: 'Roots Reggae', tracks: 11, featured: true },
    { title: 'Nova Rising', artist: 'Sista Nova', artistSlug: 'sista-nova', type: 'Album', year: 2024, genre: 'Afrobeats / Reggae', tracks: 13, featured: true },
    { title: 'Caribbean Queen', artist: 'Sista Nova', artistSlug: 'sista-nova', type: 'Single', year: 2024, genre: 'Afrobeats / Reggae', tracks: 1, featured: false },
    { title: 'Earthworks', artist: 'Ras Marcus', artistSlug: 'ras-marcus', type: 'Album', year: 2023, genre: 'Reggae / Dub', tracks: 9, featured: false },
    { title: 'Yardie Anthem', artist: 'King Yardie', artistSlug: 'king-yardie', type: 'Single', year: 2024, genre: 'Dancehall', tracks: 1, featured: false },
    { title: 'Zion Gates', artist: 'Empress Zara', artistSlug: 'empress-zara', type: 'Single', year: 2024, genre: 'Roots Reggae', tracks: 1, featured: false },
    { title: 'Sound Clashes: Live Recordings', artist: 'DJ Yardie Flash', artistSlug: 'dj-yardie-flash', type: 'Live Album', year: 2023, genre: 'Sound System', tracks: 5, featured: false },
  ]

  if (await prisma.release.count() === 0) {
    await prisma.release.createMany({ data: releasesData })
    console.log(`  ✓ ${releasesData.length} releases`)
  } else {
    console.log('  – Releases already seeded, skipping')
  }

  // Events
  const eventsData = [
    { title: 'YardStyle Summer Clash 2026', date: '2026-07-05', time: '8:00 PM', venue: 'National Stadium', city: 'Kingston, Jamaica', type: 'Sound Clash', artists: ['King Yardie', 'DJ Yardie Flash', 'Selector Mighty'], tickets: '#', featured: true, description: 'The biggest sound clash of the year.' },
    { title: 'Notting Hill Carnival 2026', date: '2026-08-25', time: '10:00 AM', venue: 'Ladbroke Grove', city: 'London, UK', type: 'Festival', artists: ['King Yardie', 'Empress Zara', 'Selector Mighty'], tickets: '#', featured: true, description: "YardStyle brings the full sound system experience to the world's greatest Caribbean street festival." },
    { title: 'Reggae Sunsplash 2026', date: '2026-06-28', time: '6:00 PM', venue: 'Catherine Hall Complex', city: 'Montego Bay, Jamaica', type: 'Festival', artists: ['Empress Zara', 'Ras Marcus'], tickets: '#', featured: true, description: 'Empress Zara headlines the reggae stage at the legendary Sunsplash festival.' },
    { title: 'YSE London Showcase', date: '2026-09-18', time: '9:00 PM', venue: 'O2 Academy Brixton', city: 'London, UK', type: 'Concert', artists: ['King Yardie', 'Empress Zara', 'Sista Nova', 'DJ Yardie Flash'], tickets: '#', featured: false, description: 'Full YardStyle roster live in Brixton.' },
    { title: 'Miami Carnival 2026', date: '2026-10-10', time: '12:00 PM', venue: 'Miami-Dade County Park', city: 'Miami, USA', type: 'Festival', artists: ['Sista Nova', 'Selector Mighty'], tickets: '#', featured: false, description: 'Sista Nova and Selector Mighty bring Caribbean vibes to South Florida.' },
    { title: 'Tokyo Sound System Experience', date: '2026-10-04', time: '8:00 PM', venue: 'Oath', city: 'Tokyo, Japan', type: 'Club Night', artists: ['DJ Yardie Flash'], tickets: '#', featured: false, description: 'YardStyle Sound brings authentic Jamaican sound system culture to the heart of Tokyo.' },
  ]

  if (await prisma.event.count() === 0) {
    await prisma.event.createMany({ data: eventsData.map(e => ({ ...e, artists: arr(e.artists) })) })
    console.log(`  ✓ ${eventsData.length} events`)
  } else {
    console.log('  – Events already seeded, skipping')
  }

  // Sound packages
  const packagesData = [
    {
      name: 'Yard Starter',
      tagline: 'Perfect for house parties & small events',
      priceRange: '$500 – $1,200',
      capacity: 'Up to 200 people',
      duration: 'Up to 6 hours',
      popular: false,
      color: 'rgba(255,255,255,0.05)',
      features: ['4x 15" Sub Bass Speakers', '4x Mid-Range Cabinets', '2x High-Frequency Horns', 'Professional Amplification', 'DJ Booth Setup', 'Basic Lighting Package', 'Professional Selector', 'Setup & Breakdown Included'],
    },
    {
      name: 'Sound System Royale',
      tagline: 'The full YardStyle experience',
      priceRange: '$2,500 – $5,000',
      capacity: 'Up to 1,000 people',
      duration: 'Up to 10 hours',
      popular: true,
      color: 'rgba(212,175,55,0.06)',
      features: ['12x 18" Heavy Duty Sub Bass', '8x Mid-Range Stack Cabinets', '6x High-Frequency Arrays', 'Custom YardStyle Speaker Walls', 'Professional DJ Booth & CDJs', 'Full Lighting Rig (LED + Lasers)', 'Lead Selector (DJ Yardie Flash)', 'Sound Engineer On-Site', 'Custom Dubplate Selection', 'Setup 6 Hours Before Event', 'Marketing Materials Included'],
    },
    {
      name: 'Festival Command',
      tagline: 'Massive scale. Uncompromising power.',
      priceRange: '$8,000+',
      capacity: '5,000+ people',
      duration: 'Full Event Coverage',
      popular: false,
      color: 'rgba(255,255,255,0.05)',
      features: ['24x 21" Subwoofer Array', '16x Mid-Range Tower Stacks', '12x High-Frequency Line Arrays', 'Delay Speaker Systems', 'Full Stage Production', 'Concert-Grade Amplification', 'Professional Sound Engineer Team', 'Full Lighting Production', 'LED Video Walls', 'Multiple DJ / Selector Team', 'VIP Artist Management', 'Event Planning Consultation', 'Pre/Post Event Support'],
    },
  ]

  if (await prisma.soundPackage.count() === 0) {
    await prisma.soundPackage.createMany({ data: packagesData.map(p => ({ ...p, features: arr(p.features) })) })
    console.log(`  ✓ ${packagesData.length} sound packages`)
  } else {
    console.log('  – Sound packages already seeded, skipping')
  }

  // Sample bookings
  const bookingsData = [
    { ref: 'YSE-A4K9X2', service: 'Artist Performance', eventName: 'Summer Soca Fete 2026', eventDate: '2026-08-01', city: 'Kingston, Jamaica', guestCount: '1,000–5,000', budget: '$5,000 – $15,000', name: 'Marcus Thompson', email: 'marcus@kingston-events.com', phone: '+1 (876) 555-0101', organization: 'Kingston Events Ltd.', notes: 'Looking to book King Yardie for headliner slot.', status: 'pending', genre: 'Dancehall' },
    { ref: 'YSE-B8M3Z7', service: 'Sound System Rental', eventName: 'Carnival Village Stage', eventDate: '2026-08-25', city: 'London, UK', guestCount: '5,000–10,000', budget: '$15,000 – $50,000', name: 'Alicia Brown', email: 'alicia@carnival-org.uk', phone: '+44 20 7946 0958', organization: 'Notting Hill Carnival Organization', notes: 'Full system rental with operator.', status: 'confirmed', genre: 'Mixed / Open Format' },
    { ref: 'YSE-C2P6Y1', service: 'DJ / Selector', eventName: 'Dancehall Fridays', eventDate: '2026-06-14', city: 'New York, USA', guestCount: '100–500', budget: '$1,500 – $5,000', name: 'Damien Clarke', email: 'dclarke@clubpriv.com', phone: '+1 (718) 555-0234', organization: 'Club Privilege NYC', notes: 'Weekly residency interest.', status: 'pending', genre: 'Dancehall' },
  ]

  if (await prisma.booking.count() === 0) {
    await prisma.booking.createMany({ data: bookingsData })
    console.log(`  ✓ ${bookingsData.length} sample bookings`)
  } else {
    console.log('  – Bookings already exist, skipping')
  }

  console.log('\n✅ Database seeded successfully!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
