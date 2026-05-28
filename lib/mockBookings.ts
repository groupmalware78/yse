export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Booking {
  id: string
  ref: string
  service: string
  eventName: string
  eventDate: string
  venue: string
  city: string
  guestCount: string
  budget: string
  name: string
  email: string
  phone: string
  organization: string
  notes: string
  status: BookingStatus
  submittedAt: string
  genre?: string
}

export const mockBookings: Booking[] = [
  {
    id: '1',
    ref: 'YSE-A4K9X2',
    service: 'Artist Performance',
    eventName: 'Summer Soca Fete 2026',
    eventDate: '2026-08-01',
    venue: 'National Arena',
    city: 'Kingston, Jamaica',
    guestCount: '1,000–5,000',
    budget: '$5,000 – $15,000',
    name: 'Marcus Thompson',
    email: 'marcus@kingston-events.com',
    phone: '+1 (876) 555-0101',
    organization: 'Kingston Events Ltd.',
    notes: 'Looking to book King Yardie for headliner slot. Need 45-min set.',
    status: 'pending',
    submittedAt: '2026-05-20T14:32:00Z',
    genre: 'Dancehall',
  },
  {
    id: '2',
    ref: 'YSE-B8M3Z7',
    service: 'Sound System Rental',
    eventName: 'Carnival Village Stage',
    eventDate: '2026-08-25',
    venue: 'Ladbroke Grove',
    city: 'London, UK',
    guestCount: '5,000–10,000',
    budget: '$15,000 – $50,000',
    name: 'Alicia Brown',
    email: 'alicia@carnival-org.uk',
    phone: '+44 20 7946 0958',
    organization: 'Notting Hill Carnival Organization',
    notes: 'Full system rental with operator. Festival Command package preferred.',
    status: 'confirmed',
    submittedAt: '2026-05-15T09:12:00Z',
    genre: 'Mixed / Open Format',
  },
  {
    id: '3',
    ref: 'YSE-C2P6Y1',
    service: 'DJ / Selector',
    eventName: 'Dancehall Fridays',
    eventDate: '2026-06-14',
    venue: 'Club Privilege',
    city: 'New York, USA',
    guestCount: '100–500',
    budget: '$1,500 – $5,000',
    name: 'Damien Clarke',
    email: 'dclarke@clubpriv.com',
    phone: '+1 (718) 555-0234',
    organization: 'Club Privilege NYC',
    notes: 'Weekly residency interest. Looking for DJ Yardie Flash specifically.',
    status: 'pending',
    submittedAt: '2026-05-22T18:45:00Z',
    genre: 'Dancehall',
  },
  {
    id: '4',
    ref: 'YSE-D9H1W5',
    service: 'Full Event Production',
    eventName: 'Reggae Roots Festival',
    eventDate: '2026-09-19',
    venue: 'Riverton Meadows',
    city: 'Kingston, Jamaica',
    guestCount: '1,000–5,000',
    budget: '$15,000 – $50,000',
    name: 'Stephanie Reid',
    email: 's.reid@rootsfest.com',
    phone: '+1 (876) 555-0456',
    organization: 'Roots Festival Productions',
    notes: 'Full production needed. Artists, sound, lights, stage.',
    status: 'completed',
    submittedAt: '2026-04-10T11:20:00Z',
    genre: 'Reggae',
  },
  {
    id: '5',
    ref: 'YSE-E5R4Q8',
    service: 'Studio Session',
    eventName: 'Recording Session — 3 Days',
    eventDate: '2026-06-20',
    venue: 'YardStyle Studio',
    city: 'Kingston, Jamaica',
    guestCount: 'Under 100',
    budget: '$1,500 – $5,000',
    name: 'Christopher Mighty',
    email: 'cmighty@gmail.com',
    phone: '+1 (876) 555-0789',
    organization: '',
    notes: 'Independent artist. Need 3-day block booking for album recording.',
    status: 'confirmed',
    submittedAt: '2026-05-18T16:05:00Z',
    genre: 'Reggae',
  },
  {
    id: '6',
    ref: 'YSE-F7J2V3',
    service: 'Artist Performance',
    eventName: 'Caribbean Fusion Night',
    eventDate: '2026-07-26',
    venue: 'Jazz Cafe',
    city: 'London, UK',
    guestCount: '100–500',
    budget: '$5,000 – $15,000',
    name: 'Priya Nair',
    email: 'priya@jazzlondon.co.uk',
    phone: '+44 20 7946 0100',
    organization: 'Jazz Cafe London',
    notes: 'Interested in Sista Nova for our Caribbean Night series.',
    status: 'cancelled',
    submittedAt: '2026-05-08T10:33:00Z',
    genre: 'Afrobeats',
  },
]

const STORAGE_KEY = 'yse_bookings_v1'

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return mockBookings
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : mockBookings
  } catch {
    return mockBookings
  }
}

export function saveBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking[] {
  const bookings = getBookings()
  const updated = bookings.map(b => b.id === id ? { ...b, status } : b)
  saveBookings(updated)
  return updated
}

export function deleteBooking(id: string): Booking[] {
  const bookings = getBookings().filter(b => b.id !== id)
  saveBookings(bookings)
  return bookings
}

export function getBookingStats() {
  const bookings = getBookings()
  return {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }
}
