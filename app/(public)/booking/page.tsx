'use client'
import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, DollarSign, Upload, Check, ArrowRight, Phone, Mail, ChevronRight } from 'lucide-react'
import { createBooking } from '@/lib/actions/bookings'

const services = [
  { id: 'artist', label: 'Artist Performance', icon: '🎤', desc: 'Book a YardStyle artist for your event' },
  { id: 'dj', label: 'DJ / Selector', icon: '🎧', desc: 'Professional selector and DJ services' },
  { id: 'sound', label: 'Sound System Rental', icon: '🔊', desc: 'Full sound system package rental' },
  { id: 'production', label: 'Full Event Production', icon: '🎪', desc: 'Complete event management package' },
  { id: 'studio', label: 'Studio Session', icon: '🎙️', desc: 'Professional recording studio time' },
]

const budgetRanges = [
  '$500 – $1,500',
  '$1,500 – $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000+',
]

const genres = ['Dancehall', 'Reggae', 'Afrobeats', 'Soca', 'Hip Hop', 'R&B', 'Mixed / Open Format', 'Other']

const steps = ['Service', 'Details', 'Contact', 'Confirm']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-12">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all duration-300 ${
                i < current
                  ? 'bg-gold border-gold text-black'
                  : i === current
                  ? 'border-gold text-gold glass'
                  : 'border-white/15 text-white/25 glass'
              }`}
            >
              {i < current ? <Check size={15} /> : i + 1}
            </div>
            <span
              className={`text-[9px] font-bold tracking-widest uppercase mt-1.5 ${
                i <= current ? 'text-gold' : 'text-white/25'
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-px w-12 md:w-20 mx-1 mb-5 transition-all duration-300"
              style={{ background: i < current ? '#d4af37' : 'rgba(255,255,255,0.08)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BookingPage() {
  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [, startTransition] = useTransition()
  const [form, setForm] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventDuration: '',
    venue: '',
    city: '',
    guestCount: '',
    budget: '',
    genre: '',
    notes: '',
    name: '',
    email: '',
    phone: '',
    organization: '',
  })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ref = 'YSE-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    setBookingRef(ref)
    setSubmitted(true)
    startTransition(async () => {
      await createBooking({
        service: selectedService,
        eventName: form.eventName,
        eventDate: form.eventDate,
        venue: form.venue,
        city: form.city,
        guestCount: form.guestCount,
        budget: form.budget,
        name: form.name,
        email: form.email,
        phone: form.phone,
        organization: form.organization,
        notes: form.notes,
        genre: form.genre,
      })
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 pt-24">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="glass-gold rounded-3xl p-12 border border-gold/20">
            <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-gold" />
            </div>
            <h2 className="text-3xl font-black text-gold mb-4">Booking Received!</h2>
            <p className="text-white/50 leading-relaxed mb-8">
              Thank you for your booking request. Our team will review your details and reach out within 24 hours with a confirmation and quote.
            </p>
            <div className="glass rounded-2xl p-5 text-left mb-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={14} className="text-gold flex-shrink-0" />
                <span className="text-white/50">Confirmation sent to <span className="text-white">{form.email || 'your email'}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <span className="text-white/50">We'll call within <span className="text-white">24 hours</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={14} className="text-gold flex-shrink-0" />
                <span className="text-white/50">Reference: <span className="text-gold font-bold">{bookingRef}</span></span>
              </div>
            </div>
            <button
              onClick={() => { setSubmitted(false); setStep(0); setSelectedService('') }}
              className="btn-outline-gold px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase"
            >
              New Booking
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-yse-darker" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-72 rounded-full bg-deep-green/30 blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-5 md:px-8 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="section-label justify-center mb-4">Professional Booking</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Book <span className="text-gold-gradient">YardStyle</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Artists, DJs, sound systems, and full event production — all in one booking.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex justify-center mb-4">
          <StepIndicator current={step} />
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Step 0: Service selection */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-black mb-2">What do you need?</h2>
              <p className="text-white/40 text-sm mb-8">Select the type of booking you'd like to make</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                      selectedService === service.id
                        ? 'border-gold bg-gold/10 shadow-gold'
                        : 'glass border-white/8 hover:border-white/20'
                    }`}
                  >
                    <span className="text-3xl mb-4 block">{service.icon}</span>
                    <p className="font-black text-base text-white mb-1">{service.label}</p>
                    <p className="text-white/40 text-xs">{service.desc}</p>
                    {selectedService === service.id && (
                      <div className="mt-3 flex items-center gap-1 text-gold text-xs font-bold">
                        <Check size={12} /> Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => selectedService && setStep(1)}
                  disabled={!selectedService}
                  className={`btn-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 ${!selectedService ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Event details */}
          {step === 1 && (
            <form onSubmit={e => { e.preventDefault(); setStep(2) }}>
              <h2 className="text-2xl font-black mb-2">Event Details</h2>
              <p className="text-white/40 text-sm mb-8">Tell us about your event</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Event Name *</label>
                  <input
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    placeholder="e.g. Annual Summer Clash 2026"
                    value={form.eventName}
                    onChange={e => update('eventName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                    <Calendar size={11} className="inline mr-1" /> Event Date *
                  </label>
                  <input
                    type="date"
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    value={form.eventDate}
                    onChange={e => update('eventDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                    <Clock size={11} className="inline mr-1" /> Start Time
                  </label>
                  <input
                    type="time"
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    value={form.eventTime}
                    onChange={e => update('eventTime', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Venue / Location *</label>
                  <input
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    placeholder="Venue name"
                    value={form.venue}
                    onChange={e => update('venue', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">City / Country *</label>
                  <input
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    placeholder="Kingston, Jamaica"
                    value={form.city}
                    onChange={e => update('city', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                    <Users size={11} className="inline mr-1" /> Expected Guests
                  </label>
                  <select
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    value={form.guestCount}
                    onChange={e => update('guestCount', e.target.value)}
                  >
                    <option value="">Select range...</option>
                    {['Under 100', '100–500', '500–1,000', '1,000–5,000', '5,000–10,000', '10,000+'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                    <DollarSign size={11} className="inline mr-1" /> Budget Range *
                  </label>
                  <select
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    value={form.budget}
                    onChange={e => update('budget', e.target.value)}
                    required
                  >
                    <option value="">Select budget...</option>
                    {budgetRanges.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Music Genre / Format</label>
                  <select
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    value={form.genre}
                    onChange={e => update('genre', e.target.value)}
                  >
                    <option value="">Select genre...</option>
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Additional Notes</label>
                  <textarea
                    rows={4}
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm resize-none"
                    placeholder="Special requirements, artist preferences, technical rider details..."
                    value={form.notes}
                    onChange={e => update('notes', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                    <Upload size={11} className="inline mr-1" /> Event Brief (Optional)
                  </label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-gold/30 transition-colors cursor-pointer group">
                    <Upload size={24} className="mx-auto mb-3 text-white/20 group-hover:text-gold/40 transition-colors" />
                    <p className="text-white/30 text-sm mb-1">Drop files here or click to upload</p>
                    <p className="text-white/20 text-xs">PDF, DOC, images up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setStep(0)} className="btn-glass px-6 py-3 rounded-full text-sm font-bold">
                  Back
                </button>
                <button type="submit" className="btn-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Contact */}
          {step === 2 && (
            <form onSubmit={e => { e.preventDefault(); setStep(3) }}>
              <h2 className="text-2xl font-black mb-2">Your Details</h2>
              <p className="text-white/40 text-sm mb-8">How should we reach you?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Full Name *</label>
                  <input
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Organization</label>
                  <input
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    placeholder="Company / promoter name"
                    value={form.organization}
                    onChange={e => update('organization', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                    <Mail size={11} className="inline mr-1" /> Email Address *
                  </label>
                  <input
                    type="email"
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                    <Phone size={11} className="inline mr-1" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="input-dark w-full px-4 py-3.5 rounded-xl text-sm"
                    placeholder="+1 (876) 000-0000"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setStep(1)} className="btn-glass px-6 py-3 rounded-full text-sm font-bold">
                  Back
                </button>
                <button type="submit" className="btn-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
                  Review Booking <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-black mb-2">Confirm Booking</h2>
              <p className="text-white/40 text-sm mb-8">Review your details before submitting</p>

              <div className="glass rounded-2xl divide-y divide-white/5 mb-8 overflow-hidden border border-white/8">
                {[
                  { label: 'Service', value: services.find(s => s.id === selectedService)?.label },
                  { label: 'Event', value: form.eventName },
                  { label: 'Date', value: form.eventDate },
                  { label: 'Location', value: `${form.venue}, ${form.city}` },
                  { label: 'Guest Count', value: form.guestCount },
                  { label: 'Budget', value: form.budget },
                  { label: 'Contact', value: `${form.name} · ${form.email}` },
                  { label: 'Phone', value: form.phone },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="flex items-center gap-4 px-6 py-4">
                    <span className="text-white/30 text-xs font-bold tracking-widest uppercase w-24 flex-shrink-0">{row.label}</span>
                    <span className="text-white text-sm flex-1">{row.value}</span>
                    <ChevronRight size={14} className="text-white/20" />
                  </div>
                ))}
              </div>

              {/* Payment info */}
              <div className="glass-gold rounded-2xl p-6 mb-8 border border-gold/15">
                <h3 className="font-black text-gold mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Deposit Information
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  A 25–50% deposit is required to secure your booking date. Payment details and invoice will be sent after we review and confirm availability. We accept bank transfer, PayPal, and Stripe.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setStep(2)} className="btn-glass px-6 py-3 rounded-full text-sm font-bold">
                  Back
                </button>
                <button type="submit" className="btn-gold px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
                  Submit Booking <Check size={16} />
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Contact strip */}
        <div className="mt-20 glass rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 border border-white/5">
          <div className="flex-1">
            <p className="font-black text-white mb-1">Prefer to talk directly?</p>
            <p className="text-white/40 text-sm">Our booking team is available Mon–Sat, 9AM–7PM EST</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+18761234567"
              className="btn-glass px-5 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
            >
              <Phone size={14} /> Call Us
            </a>
            <a
              href="https://wa.me/18761234567"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold"
              style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
