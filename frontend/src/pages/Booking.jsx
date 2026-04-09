import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays, differenceInCalendarDays, format } from 'date-fns'
import {
  CheckCircle2, CreditCard, AlertCircle, ArrowLeft,
  Users, Calendar, BedDouble, Wifi, Shield, Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Booking() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [availability, setAvailability] = useState(null)
  const [checkingAvail, setCheckingAvail] = useState(false)
  const [step, setStep] = useState(1) // 1=form, 2=success
  const [bookingResult, setBookingResult] = useState(null)

  const [form, setForm] = useState({
    guest_name: user?.name || '',
    guest_email: user?.email || '',
    guest_phone: user?.phone || '',
    num_guests: 1,
    special_requests: '',
  })
  const [checkIn, setCheckIn] = useState(addDays(new Date(), 1))
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 2))

  useEffect(() => {
    api.get(`/rooms/${roomId}`)
      .then(r => setRoom(r.data.room))
      .catch(() => { toast.error('Room not found'); navigate('/rooms') })
      .finally(() => setLoading(false))
  }, [roomId])

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        guest_name: f.guest_name || user.name,
        guest_email: f.guest_email || user.email,
        guest_phone: f.guest_phone || user.phone || '',
      }))
    }
  }, [user])

  // Check availability when dates change
  useEffect(() => {
    if (!room) return
    setCheckingAvail(true)
    setAvailability(null)
    const timer = setTimeout(() => {
      api.post('/rooms/check-availability', {
        room_id: parseInt(roomId),
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
      })
        .then(r => setAvailability(r.data))
        .catch(() => setAvailability({ available: true, available_count: room.total_rooms }))
        .finally(() => setCheckingAvail(false))
    }, 600)
    return () => clearTimeout(timer)
  }, [checkIn, checkOut, room])

  const nights = Math.max(1, differenceInCalendarDays(checkOut, checkIn))
  const subtotal = room ? Number(room.price_per_night) * nights : 0
  const tax = Math.round(subtotal * 0.12)
  const total = subtotal + tax

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.guest_name || !form.guest_email || !form.guest_phone) {
      toast.error('Please fill all required fields'); return
    }
    if (availability && !availability.available) {
      toast.error('Room not available for selected dates'); return
    }
    setSubmitting(true)
    try {
      // 1. Create booking in DB
      const bookingRes = await api.post('/bookings', {
        room_id: parseInt(roomId),
        ...form,
        num_guests: parseInt(form.num_guests),
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
      })
      const booking = bookingRes.data.booking

      // 2. Try Razorpay payment if configured
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
      let paymentDone = false

      if (razorpayKey && razorpayKey !== 'your_razorpay_key_id' && window.Razorpay) {
        try {
          const orderRes = await api.post('/payment/create-order', {
            amount: total,
            booking_id: booking.id,
          })
          const order = orderRes.data.order

          await new Promise((resolve) => {
            const rzp = new window.Razorpay({
              key: razorpayKey,
              amount: order.amount,
              currency: 'INR',
              name: 'TNG Hotels & Banquets',
              description: `Booking #${booking.id} — ${room.name}`,
              image: '/tng-logo.png',
              order_id: order.id,
              prefill: {
                name: form.guest_name,
                email: form.guest_email,
                contact: form.guest_phone,
              },
              theme: { color: '#c9a227' },
              handler: async (response) => {
                try {
                  await api.put(`/bookings/${booking.id}/payment`, {
                    payment_id: response.razorpay_payment_id,
                    status: 'paid',
                  })
                  paymentDone = true
                } catch {}
                resolve()
              },
              modal: { ondismiss: resolve },
            })
            rzp.open()
          })
        } catch {
          // Payment failed, booking still saved as pending
        }
      }

      // 3. Send confirmation email via EmailJS (if configured)
      await sendConfirmationEmail(booking, paymentDone)

      setBookingResult({ ...booking, payment_done: paymentDone })
      setStep(2)
      toast.success('Booking confirmed!')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Booking failed. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // EmailJS free email confirmation
  const sendConfirmationEmail = async (booking, paid) => {
    try {
      // EmailJS free tier — 200 emails/month
      // To enable: create account at emailjs.com, get your IDs, add to frontend/.env
      // VITE_EMAILJS_SERVICE_ID=service_xxx
      // VITE_EMAILJS_TEMPLATE_ID=template_xxx
      // VITE_EMAILJS_PUBLIC_KEY=xxx
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) return // not configured, skip silently

      const { default: emailjs } = await import('@emailjs/browser')
      await emailjs.send(serviceId, templateId, {
        to_name: form.guest_name,
        to_email: form.guest_email,
        booking_id: booking.id,
        room_name: room.name,
        check_in: format(checkIn, 'dd MMM yyyy'),
        check_out: format(checkOut, 'dd MMM yyyy'),
        nights,
        guests: form.num_guests,
        total_amount: `₹${total.toLocaleString('en-IN')}`,
        payment_status: paid ? 'Paid' : 'Pending',
        hotel_phone: '+91 98765 43210',
        hotel_email: 'reservations@tnghotels.com',
      }, publicKey)
    } catch {
      // Email failed silently — don't block booking confirmation
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Success screen
  if (step === 2 && bookingResult) return (
    <div className="min-h-screen bg-cream pt-28 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow-lg overflow-hidden">
          {/* Green header */}
          <div className="bg-charcoal-950 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-400" />
            </div>
            <p className="font-accent text-gold-400 tracking-widest text-xs uppercase mb-1">Booking Confirmed</p>
            <h2 className="font-display text-white text-3xl font-light">
              Thank you, {form.guest_name.split(' ')[0]}!
            </h2>
          </div>

          <div className="p-8">
            {/* Booking ID badge */}
            <div className="text-center mb-6">
              <div className="inline-block bg-gold-50 border border-gold-200 px-6 py-2">
                <p className="font-body text-[10px] tracking-widest uppercase text-gold-600 mb-0.5">Booking Reference</p>
                <p className="font-accent text-gold-700 text-xl font-bold">TNG-{String(bookingResult.id).padStart(5, '0')}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                ['Room', room.name],
                ['Check-in', format(checkIn, 'dd MMM yyyy, EEE')],
                ['Check-out', format(checkOut, 'dd MMM yyyy, EEE')],
                ['Duration', `${nights} Night${nights > 1 ? 's' : ''}`],
                ['Guests', `${form.num_guests} Guest${form.num_guests > 1 ? 's' : ''}`],
                ['Total Amount', `₹${total.toLocaleString('en-IN')}`],
                ['Payment', bookingResult.payment_done ? '✅ Paid' : '⏳ Pending at check-in'],
                ['Status', 'Confirmed'],
              ].map(([k, v]) => (
                <div key={k} className="bg-charcoal-50 px-4 py-3">
                  <p className="font-body text-[10px] tracking-widest uppercase text-charcoal-400 mb-0.5">{k}</p>
                  <p className="font-body text-sm text-charcoal-800 font-medium">{v}</p>
                </div>
              ))}
            </div>

            {/* Special requests */}
            {form.special_requests && (
              <div className="bg-blue-50 border border-blue-100 px-4 py-3 mb-6">
                <p className="font-body text-xs text-blue-600 tracking-wider uppercase mb-1">Special Requests</p>
                <p className="font-body text-sm text-blue-800">{form.special_requests}</p>
              </div>
            )}

            {/* Contact info */}
            <div className="bg-gold-50 border border-gold-200 px-5 py-4 mb-6">
              <p className="font-body text-xs text-gold-700 tracking-wider uppercase mb-2">What Happens Next?</p>
              <ul className="space-y-1.5">
                {[
                  'Our team will call you within 2 hours to confirm',
                  `Confirmation sent to ${form.guest_email}`,
                  'Present this booking ID at check-in',
                  'Free cancellation up to 24 hours before check-in',
                ].map(s => (
                  <li key={s} className="flex items-start gap-2 font-body text-xs text-gold-800">
                    <span className="text-gold-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact hotel */}
            <div className="flex gap-3 mb-6">
              <a href="tel:+919876543210"
                className="flex-1 text-center border border-charcoal-200 hover:border-gold-400 py-3 font-body text-xs tracking-widest uppercase text-charcoal-600 hover:text-gold-600 transition-all">
                📞 Call Us
              </a>
              <a href="https://wa.me/919876543210?text=Hi, my booking reference is TNG-{String(bookingResult.id).padStart(5,'0')}"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center border border-green-200 hover:border-green-400 py-3 font-body text-xs tracking-widest uppercase text-green-700 hover:text-green-800 transition-all bg-green-50">
                💬 WhatsApp
              </a>
            </div>

            <div className="flex flex-col gap-3">
              {user && (
                <Link to="/my-bookings" className="btn-gold w-full justify-center">
                  View My Bookings
                </Link>
              )}
              <Link to="/" className="btn-outline-gold w-full justify-center">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Booking form
  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <Link to={`/rooms/${roomId}`}
          className="inline-flex items-center gap-2 text-charcoal-400 hover:text-gold-500 font-body text-xs tracking-widest uppercase mb-8 transition-colors">
          <ArrowLeft size={13} /> Back to Room
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form — 3 cols */}
          <div className="lg:col-span-3">
            <p className="section-label mb-2">Step 1 of 1</p>
            <h1 className="font-display text-3xl text-charcoal-950 font-light mb-6">Complete Your Reservation</h1>

            {!user && (
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 p-4 mb-6">
                <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-blue-700">
                  <Link to="/login" className="font-semibold underline">Sign in</Link> to auto-fill your details and track bookings in your profile.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dates */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Check-in *</label>
                  <DatePicker
                    selected={checkIn}
                    onChange={d => { setCheckIn(d); if (d >= checkOut) setCheckOut(addDays(d, 1)) }}
                    minDate={addDays(new Date(), 1)}
                    dateFormat="dd MMM yyyy"
                    className="input-luxury w-full"
                    placeholderText="Select check-in"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Check-out *</label>
                  <DatePicker
                    selected={checkOut}
                    onChange={d => setCheckOut(d)}
                    minDate={addDays(checkIn, 1)}
                    dateFormat="dd MMM yyyy"
                    className="input-luxury w-full"
                    placeholderText="Select check-out"
                  />
                </div>
              </div>

              {/* Availability indicator */}
              <div className={`flex items-center gap-2 px-4 py-3 border text-xs font-body transition-all ${
                checkingAvail ? 'bg-charcoal-50 border-charcoal-200 text-charcoal-400' :
                availability?.available ? 'bg-green-50 border-green-200 text-green-700' :
                'bg-red-50 border-red-200 text-red-600'
              }`}>
                {checkingAvail ? (
                  <><span className="w-3 h-3 border-2 border-charcoal-400 border-t-transparent rounded-full animate-spin" /> Checking availability...</>
                ) : availability?.available ? (
                  <><CheckCircle2 size={14} className="text-green-500" /> {availability.available_count} room{availability.available_count > 1 ? 's' : ''} available for selected dates</>
                ) : (
                  <><AlertCircle size={14} /> Not available for these dates — please select different dates</>
                )}
              </div>

              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Number of Guests *</label>
                <select name="num_guests" value={form.num_guests} onChange={handleChange} className="input-luxury">
                  {Array.from({ length: room?.max_occupancy || 4 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-charcoal-100 pt-5">
                <h3 className="font-display text-xl text-charcoal-800 font-light mb-4">Guest Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Full Name *</label>
                    <input name="guest_name" value={form.guest_name} onChange={handleChange} required
                      className="input-luxury" placeholder="As on ID proof" />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Phone *</label>
                    <input name="guest_phone" value={form.guest_phone} onChange={handleChange} required
                      className="input-luxury" placeholder="+91 XXXXX XXXXX" type="tel" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Email Address *</label>
                  <input name="guest_email" value={form.guest_email} onChange={handleChange} required
                    className="input-luxury" placeholder="your@email.com" type="email" />
                </div>
                <div className="mt-4">
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Special Requests</label>
                  <textarea name="special_requests" value={form.special_requests} onChange={handleChange} rows={3}
                    className="input-luxury resize-none"
                    placeholder="Early check-in, dietary preferences, room floor preference, anniversary arrangements..." />
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, text: 'Free Cancellation' },
                  { icon: Clock, text: '24hr Confirmation' },
                  { icon: Wifi, text: 'Best Rate Guaranteed' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1 py-3 border border-charcoal-100 text-center">
                    <Icon size={14} className="text-gold-500" />
                    <span className="font-body text-[9px] tracking-wider uppercase text-charcoal-400">{text}</span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting || (availability && !availability.available)}
                className="btn-gold w-full justify-center text-xs py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing your booking...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard size={15} />
                    Confirm Booking — ₹{total.toLocaleString('en-IN')}
                  </span>
                )}
              </button>

              <p className="font-body text-charcoal-300 text-xs text-center">
                By confirming you agree to our cancellation policy. Secure booking powered by TNG Hotels.
              </p>
            </form>
          </div>

          {/* Summary — 2 cols */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-charcoal-950 text-white overflow-hidden">
              {room?.images?.[0] && (
                <div className="relative h-44 overflow-hidden">
                  <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="bg-gold-500 text-white font-body text-[9px] tracking-widest uppercase px-2 py-0.5">
                      {room.type}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-white text-xl font-light mb-1">{room?.name}</h3>
                <div className="flex gap-4 text-xs text-white/40 font-body mb-4">
                  <span className="flex items-center gap-1"><Users size={11} /> {room?.max_occupancy} guests</span>
                  <span className="flex items-center gap-1"><BedDouble size={11} /> {room?.bed_type}</span>
                </div>

                {/* Price breakdown */}
                <div className="border-t border-white/10 pt-4 space-y-2.5">
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">Check-in</span>
                    <span className="text-white">{format(checkIn, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">Check-out</span>
                    <span className="text-white">{format(checkOut, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">{nights} night{nights > 1 ? 's' : ''} × ₹{Number(room?.price_per_night).toLocaleString('en-IN')}</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">GST (12%)</span>
                    <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-gold-500/30 pt-3 flex justify-between font-body">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-gold-400 text-xl font-semibold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Availability badge */}
                {availability && (
                  <div className={`mt-4 px-3 py-2 text-center text-xs font-body ${
                    availability.available ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {availability.available
                      ? `✓ ${availability.available_count} room${availability.available_count > 1 ? 's' : ''} available`
                      : '✗ Not available for selected dates'}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="font-body text-white/30 text-xs text-center">
                    Need help? Call us 24/7<br />
                    <a href="tel:+919876543210" className="text-gold-400 hover:underline">+91 98765 43210</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
