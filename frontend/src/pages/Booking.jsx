import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays, differenceInCalendarDays, format } from 'date-fns'
import { CheckCircle2, CreditCard, AlertCircle, ArrowLeft } from 'lucide-react'
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
  const [step, setStep] = useState(1) // 1=form, 2=success
  const [bookingResult, setBookingResult] = useState(null)

  const [form, setForm] = useState({
    guest_name: user?.name || '',
    guest_email: user?.email || '',
    guest_phone: '',
    num_guests: 1,
    special_requests: '',
  })
  const [checkIn, setCheckIn] = useState(addDays(new Date(), 1))
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 2))

  useEffect(() => {
    api.get(`/rooms/${roomId}`)
      .then(r => setRoom(r.data.room))
      .catch(() => navigate('/rooms'))
      .finally(() => setLoading(false))
  }, [roomId])

  useEffect(() => {
    if (user) setForm(f => ({ ...f, guest_name: user.name, guest_email: user.email }))
  }, [user])

  const nights = Math.max(1, differenceInCalendarDays(checkOut, checkIn))
  const subtotal = room ? Number(room.price_per_night) * nights : 0
  const tax = Math.round(subtotal * 0.12)
  const total = subtotal + tax

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.guest_name || !form.guest_email || !form.guest_phone) {
      toast.error('Please fill all required fields')
      return
    }
    setSubmitting(true)
    try {
      // 1. Create booking
      const bookingRes = await api.post('/bookings', {
        room_id: parseInt(roomId),
        ...form,
        num_guests: parseInt(form.num_guests),
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
      })
      const booking = bookingRes.data.booking

      // 2. Try Razorpay payment
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
      if (razorpayKey && razorpayKey !== 'your_razorpay_key_id' && window.Razorpay) {
        try {
          const orderRes = await api.post('/payment/create-order', {
            amount: total,
            booking_id: booking.id,
          })
          const order = orderRes.data.order

          await new Promise((resolve, reject) => {
            const rzp = new window.Razorpay({
              key: razorpayKey,
              amount: order.amount,
              currency: 'INR',
              name: 'TNG Hotels & Banquets',
              description: `Booking #${booking.id} — ${room.name}`,
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
                  resolve()
                } catch { resolve() }
              },
              modal: { ondismiss: () => resolve() },
            })
            rzp.open()
          })
        } catch {
          // Payment gateway not configured, continue as pending
        }
      }

      setBookingResult(booking)
      setStep(2)
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Booking failed'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (step === 2 && bookingResult) return (
    <div className="min-h-screen bg-cream pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-lg w-full mx-4 text-center">
        <div className="bg-white shadow-lg p-10">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <p className="section-label text-gold-500 mb-2">Booking Confirmed</p>
          <h2 className="font-display text-3xl text-charcoal-950 font-light mb-3">Thank You, {form.guest_name.split(' ')[0]}!</h2>
          <div className="gold-divider mb-6" />
          <div className="bg-charcoal-50 p-5 text-left mb-6 space-y-2.5">
            {[
              ['Booking ID', `#${bookingResult.id}`],
              ['Room', room.name],
              ['Check-in', format(checkIn, 'dd MMM yyyy')],
              ['Check-out', format(checkOut, 'dd MMM yyyy')],
              ['Nights', nights],
              ['Total Paid', `₹${total.toLocaleString('en-IN')}`],
              ['Status', bookingResult.status?.toUpperCase()],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm font-body border-b border-charcoal-100 pb-2">
                <span className="text-charcoal-400">{k}</span>
                <span className="text-charcoal-800 font-medium">{v}</span>
              </div>
            ))}
          </div>
          <p className="font-body text-charcoal-400 text-xs mb-6">
            A confirmation will be sent to <strong>{form.guest_email}</strong>. Our team will reach out within 2 hours.
          </p>
          <div className="flex flex-col gap-3">
            {user && <Link to="/my-bookings" className="btn-gold justify-center">View My Bookings</Link>}
            <Link to="/" className="btn-outline-gold justify-center">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <Link to={`/rooms/${roomId}`} className="inline-flex items-center gap-2 text-charcoal-400 hover:text-gold-500 font-body text-xs tracking-widest uppercase mb-8 transition-colors">
          <ArrowLeft size={13} /> Back to Room
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form — 3 cols */}
          <div className="lg:col-span-3">
            <p className="section-label mb-2">Complete Your Reservation</p>
            <h1 className="font-display text-3xl text-charcoal-950 font-light mb-6">Book Your Stay</h1>

            {!user && (
              <div className="flex items-start gap-3 bg-gold-50 border border-gold-200 p-4 mb-6">
                <AlertCircle size={16} className="text-gold-600 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-gold-700">
                  <Link to="/login" className="font-semibold underline">Sign in</Link> to earn loyalty points and manage your bookings easily.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dates */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Check-in Date *</label>
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
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Check-out Date *</label>
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
                    <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Phone Number *</label>
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
                    className="input-luxury resize-none" placeholder="Early check-in, dietary preferences, room preferences..." />
                </div>
              </div>

              <div className="bg-charcoal-50 p-4 border border-charcoal-100">
                <p className="font-body text-xs text-charcoal-500 leading-relaxed">
                  By confirming this booking, you agree to our cancellation policy. Free cancellation up to 24 hours before check-in. Payment is processed securely via Razorpay.
                </p>
              </div>

              <button type="submit" disabled={submitting}
                className="btn-gold w-full justify-center text-xs py-4 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard size={15} />
                    Confirm & Pay ₹{total.toLocaleString('en-IN')}
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Summary — 2 cols */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-charcoal-950 text-white">
              {room?.images?.[0] && (
                <img src={room.images[0]} alt={room.name} className="w-full h-44 object-cover" />
              )}
              <div className="p-6">
                <p className="font-body text-white/40 text-[10px] tracking-widest uppercase mb-1">{room?.type}</p>
                <h3 className="font-display text-white text-xl font-light mb-4">{room?.name}</h3>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">Check-in</span>
                    <span className="text-white">{format(checkIn, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">Check-out</span>
                    <span className="text-white">{format(checkOut, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">Duration</span>
                    <span className="text-white">{nights} Night{nights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">Guests</span>
                    <span className="text-white">{form.num_guests}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">₹{Number(room?.price_per_night).toLocaleString('en-IN')} × {nights} nights</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">GST (12%)</span>
                    <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-body border-t border-gold-500/30 pt-3 mt-2">
                    <span className="text-white text-sm font-medium">Total</span>
                    <span className="text-gold-400 text-lg font-semibold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {['Best Rate Guaranteed', 'Free Cancellation (24hrs)', 'Instant Confirmation'].map(b => (
                    <div key={b} className="flex items-center gap-2 text-white/50 text-xs font-body">
                      <CheckCircle2 size={11} className="text-gold-400 shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
