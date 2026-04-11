import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays, differenceInCalendarDays, format } from 'date-fns'
import { CheckCircle2, CreditCard, AlertCircle, ArrowLeft, Users, BedDouble, Shield, Clock, Wifi, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const sendEmailJS = async (templateParams) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (!serviceId || !templateId || !publicKey ||
      serviceId === 'your_service_id') return false
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    })
    return res.ok
  } catch { return false }
}

const WHATSAPP_NUMBER = '919082690060'

export default function Booking() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [availability, setAvailability] = useState(null)
  const [checkingAvail, setCheckingAvail] = useState(false)
  const [step, setStep] = useState(1) // 1=form, 2=payment_cancelled, 3=success
  const [bookingResult, setBookingResult] = useState(null)
  const [pendingBookingId, setPendingBookingId] = useState(null)

  const [form, setForm] = useState({
    guest_name: user?.name || '',
    guest_email: user?.email || '',
    guest_phone: user?.phone || '',
    num_guests: 1,
    num_rooms: 1,
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
    if (user) setForm(f => ({
      ...f,
      guest_name: f.guest_name || user.name || '',
      guest_email: f.guest_email || user.email || '',
      guest_phone: f.guest_phone || user.phone || '',
    }))
  }, [user])

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
  const numRooms = parseInt(form.num_rooms) || 1
  const pricePerRoom = room ? Number(room.price_per_night) : 0
  const subtotal = pricePerRoom * nights * numRooms
  const gst = Math.round(subtotal * 0.12)
  const total = subtotal + gst
  const roomsNotAvailable = availability && numRooms > (availability.available_count || 0)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.guest_name || !form.guest_email || !form.guest_phone) {
      toast.error('Please fill all required fields'); return
    }
    if (roomsNotAvailable) {
      toast.error(`Only ${availability.available_count} room(s) available`); return
    }
    if (availability && !availability.available) {
      toast.error('Room not available for selected dates'); return
    }
    setSubmitting(true)
    try {
      // Step 1: Create booking as PENDING
      const bookingRes = await api.post('/bookings', {
        room_id: parseInt(roomId),
        guest_name: form.guest_name,
        guest_email: form.guest_email,
        guest_phone: form.guest_phone,
        num_guests: parseInt(form.num_guests),
        num_rooms: numRooms,
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
        special_requests: form.special_requests,
      })
      const booking = bookingRes.data.booking
      setPendingBookingId(booking.id)

      // Step 2: Try Razorpay payment
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
      if (razorpayKey && razorpayKey !== 'your_razorpay_key_id' && window.Razorpay) {
        try {
          const orderRes = await api.post('/payment/create-order', {
            amount: total,
            booking_id: booking.id,
          })
          const order = orderRes.data.order

          const paymentResult = await new Promise((resolve) => {
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
                // Payment SUCCESS
                try {
                  await api.put(`/bookings/${booking.id}/payment`, {
                    payment_id: response.razorpay_payment_id,
                    status: 'paid',
                  })
                } catch {}
                resolve({ success: true, payment_id: response.razorpay_payment_id })
              },
              modal: {
                ondismiss: () => {
                  // User CANCELLED payment
                  resolve({ success: false, cancelled: true })
                }
              },
            })
            rzp.open()
          })

          if (!paymentResult.success) {
            // Payment cancelled — cancel the pending booking too
            try {
              await api.put(`/bookings/${booking.id}/cancel`)
            } catch {}
            setStep(2) // Show payment cancelled page
            setSubmitting(false)
            return
          }

          // Payment succeeded
          const bookingRef = `TNG-${String(booking.id).padStart(5, '0')}`
          const emailSent = await sendEmailJS({
            to_name: form.guest_name,
            to_email: form.guest_email,
            booking_id: bookingRef,
            room_name: room.name,
            num_rooms: numRooms,
            check_in: format(checkIn, 'dd MMM yyyy'),
            check_out: format(checkOut, 'dd MMM yyyy'),
            nights: String(nights),
            guests: String(form.num_guests),
            subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
            gst: `₹${gst.toLocaleString('en-IN')}`,
            total_amount: `₹${total.toLocaleString('en-IN')}`,
            payment_status: 'Paid Online',
            special_requests: form.special_requests || 'None',
            hotel_phone: '+91 90826 90060',
            hotel_email: 'reservations@tnghotels.com',
            reply_to: 'reservations@tnghotels.com',
          })
          setBookingResult({ ...booking, payment_done: true, email_sent: emailSent, ref: bookingRef })
          setStep(3)
          return
        } catch (payErr) {
          // Razorpay order creation failed — proceed without payment
        }
      }

      // No Razorpay configured — confirm booking as pay-at-hotel
      await api.put(`/bookings/${booking.id}/payment`, {
        payment_id: 'pay_at_hotel',
        status: 'unpaid',
      })
      const bookingRef = `TNG-${String(booking.id).padStart(5, '0')}`
      const emailSent = await sendEmailJS({
        to_name: form.guest_name,
        to_email: form.guest_email,
        booking_id: bookingRef,
        room_name: room.name,
        num_rooms: numRooms,
        check_in: format(checkIn, 'dd MMM yyyy'),
        check_out: format(checkOut, 'dd MMM yyyy'),
        nights: String(nights),
        guests: String(form.num_guests),
        subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
        gst: `₹${gst.toLocaleString('en-IN')}`,
        total_amount: `₹${total.toLocaleString('en-IN')}`,
        payment_status: 'Pay at Check-in',
        special_requests: form.special_requests || 'None',
        hotel_phone: '+91 90826 90060',
        hotel_email: 'reservations@tnghotels.com',
        reply_to: 'reservations@tnghotels.com',
      })
      setBookingResult({ ...booking, payment_done: false, email_sent: emailSent, ref: bookingRef })
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Payment cancelled page
  if (step === 2) return (
    <div className="min-h-screen bg-cream pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white shadow-lg overflow-hidden">
        <div className="bg-charcoal-950 px-8 py-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 border-2 border-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={30} className="text-red-400" />
          </div>
          <p className="font-accent text-gold-400 tracking-widest text-xs uppercase mb-1">Payment Cancelled</p>
          <h2 className="font-display text-white text-3xl font-light">Booking Not Confirmed</h2>
        </div>
        <div className="p-8 text-center">
          <p className="font-body text-charcoal-500 text-sm leading-relaxed mb-6">
            Your payment was cancelled so your booking has not been confirmed. No charges have been made.
          </p>
          <div className="bg-gold-50 border border-gold-200 p-4 mb-6 text-left">
            <p className="font-body text-xs text-gold-700 tracking-wider uppercase mb-2">Want to complete your booking?</p>
            <p className="font-body text-xs text-gold-800 leading-relaxed">
              You can try again below or contact us directly at <strong>+91 90826 90060</strong> for assisted booking.
            </p>
          </div>

          {/* Test payment details */}
          <div className="bg-charcoal-950 p-4 mb-6 text-left">
            <p className="font-body text-xs text-gold-400 tracking-wider uppercase mb-3">Test Payment Details</p>
            <div className="space-y-2 text-xs font-body">
              <div className="flex justify-between text-white/70">
                <span>Test Card Number</span>
                <span className="text-white font-mono">4718 6009 0449 7085</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Expiry</span>
                <span className="text-white">12/26</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>CVV</span>
                <span className="text-white">123</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>OTP</span>
                <span className="text-white">1234</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-white/70">
                <span>UPI (easier)</span>
                <span className="text-white font-mono">success@razorpay</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => setStep(1)}
              className="btn-gold w-full justify-center">
              Try Again
            </button>
            <Link to="/rooms" className="btn-outline-gold w-full justify-center">
              Browse Other Rooms
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  // Success page
  if (step === 3 && bookingResult) {
    const waMessage = encodeURIComponent(
      `Hi TNG Hotels! My booking is confirmed.\n\nRef: ${bookingResult.ref}\nRoom: ${room?.name}\nCheck-in: ${format(checkIn, 'dd MMM yyyy')}\nCheck-out: ${format(checkOut, 'dd MMM yyyy')}\nRooms: ${numRooms}\nTotal: ₹${total.toLocaleString('en-IN')}\nPayment: ${bookingResult.payment_done ? 'Paid Online' : 'Pay at Check-in'}`
    )
    return (
      <div className="min-h-screen bg-cream pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white shadow-lg overflow-hidden">
            <div className="bg-charcoal-950 px-8 py-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={30} className="text-green-400" />
              </div>
              <p className="font-accent text-gold-400 tracking-widest text-xs uppercase mb-1">
                {bookingResult.payment_done ? 'Payment Successful' : 'Booking Confirmed'}
              </p>
              <h2 className="font-display text-white text-3xl font-light">
                Thank you, {form.guest_name.split(' ')[0]}!
              </h2>
            </div>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-block bg-gold-50 border border-gold-200 px-8 py-3">
                  <p className="font-body text-[10px] tracking-widest uppercase text-gold-600 mb-0.5">Booking Reference</p>
                  <p className="font-accent text-gold-700 text-2xl font-bold">{bookingResult.ref}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  ['Room', room?.name],
                  ['Check-in', format(checkIn, 'dd MMM yyyy, EEE')],
                  ['Check-out', format(checkOut, 'dd MMM yyyy, EEE')],
                  ['Duration', `${nights} Night${nights > 1 ? 's' : ''}`],
                  ['No. of Rooms', numRooms],
                  ['Guests', form.num_guests],
                  ['Subtotal', `₹${subtotal.toLocaleString('en-IN')}`],
                  ['GST (12%)', `₹${gst.toLocaleString('en-IN')}`],
                  ['Total', `₹${total.toLocaleString('en-IN')}`],
                  ['Payment', bookingResult.payment_done ? '✅ Paid Online' : '⏳ Pay at Check-in'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-charcoal-50 px-4 py-3">
                    <p className="font-body text-[9px] tracking-widest uppercase text-charcoal-400 mb-0.5">{k}</p>
                    <p className="font-body text-sm text-charcoal-800 font-medium">{v}</p>
                  </div>
                ))}
              </div>

              <div className={`px-4 py-3 mb-5 flex items-start gap-3 ${bookingResult.email_sent ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                <CheckCircle2 size={14} className={bookingResult.email_sent ? 'text-green-500 shrink-0 mt-0.5' : 'text-blue-400 shrink-0 mt-0.5'} />
                <p className="font-body text-xs">
                  {bookingResult.email_sent
                    ? `Confirmation email sent to ${form.guest_email}`
                    : `Save your ref: ${bookingResult.ref} — contact us for email confirmation`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-body text-xs tracking-widest uppercase py-3.5 transition-all">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Us
                </a>
                <a href="tel:+919082690060"
                  className="flex items-center justify-center gap-2 bg-charcoal-800 hover:bg-charcoal-700 text-white font-body text-xs tracking-widest uppercase py-3.5 transition-all">
                  📞 Call Hotel
                </a>
              </div>

              <div className="flex flex-col gap-3">
                {user && <Link to="/my-bookings" className="btn-gold w-full justify-center">View My Bookings</Link>}
                <Link to="/" className="btn-outline-gold w-full justify-center">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Booking form
  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <Link to={`/rooms/${roomId}`}
          className="inline-flex items-center gap-2 text-charcoal-400 hover:text-gold-500 font-body text-xs tracking-widest uppercase mb-8 transition-colors">
          <ArrowLeft size={13} /> Back to Room
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <p className="section-label mb-2">Reservation Details</p>
            <h1 className="font-display text-3xl text-charcoal-950 font-light mb-4">Complete Your Booking</h1>

            {/* Test payment info box */}
            <div className="bg-charcoal-950 p-4 mb-6">
              <p className="font-body text-gold-400 text-xs tracking-widest uppercase mb-3">🧪 Test Payment Details</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-body">
                <span className="text-white/50">Card Number</span>
                <span className="text-white font-mono">4718 6009 0449 7085</span>
                <span className="text-white/50">Expiry / CVV</span>
                <span className="text-white">12/26 / 123</span>
                <span className="text-white/50">OTP</span>
                <span className="text-white">1234</span>
                <span className="text-white/50">UPI (easiest)</span>
                <span className="text-white font-mono">success@razorpay</span>
                <span className="text-white/50">Netbanking</span>
                <span className="text-white">Select any bank → click Success</span>
              </div>
            </div>

            {!user && (
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 p-4 mb-6">
                <AlertCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-blue-700">
                  <Link to="/login" className="font-semibold underline">Sign in</Link> to auto-fill your details and track bookings.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Check-in *</label>
                  <DatePicker selected={checkIn}
                    onChange={d => { setCheckIn(d); if (d >= checkOut) setCheckOut(addDays(d, 1)) }}
                    minDate={addDays(new Date(), 1)} dateFormat="dd MMM yyyy"
                    className="input-luxury w-full" />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Check-out *</label>
                  <DatePicker selected={checkOut}
                    onChange={d => setCheckOut(d)} minDate={addDays(checkIn, 1)}
                    dateFormat="dd MMM yyyy" className="input-luxury w-full" />
                </div>
              </div>

              <div className={`flex items-center gap-2 px-4 py-3 border text-xs font-body ${
                checkingAvail ? 'bg-charcoal-50 border-charcoal-200 text-charcoal-400' :
                roomsNotAvailable ? 'bg-red-50 border-red-200 text-red-600' :
                availability?.available ? 'bg-green-50 border-green-200 text-green-700' :
                'bg-red-50 border-red-200 text-red-600'}`}>
                {checkingAvail ? <><span className="w-3 h-3 border-2 border-charcoal-400 border-t-transparent rounded-full animate-spin" /> Checking availability...</>
                : roomsNotAvailable ? <><AlertCircle size={13} /> Only {availability?.available_count} room(s) available</>
                : availability?.available ? <><CheckCircle2 size={13} className="text-green-500" /> {availability.available_count} room(s) available</>
                : <><AlertCircle size={13} /> Not available for these dates</>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">
                    Rooms * <span className="text-charcoal-300 normal-case">(max 5)</span>
                  </label>
                  <select name="num_rooms" value={form.num_rooms} onChange={handleChange} className="input-luxury">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Guests *</label>
                  <select name="num_guests" value={form.num_guests} onChange={handleChange} className="input-luxury">
                    {Array.from({ length: Math.min((room?.max_occupancy || 4) * numRooms, 20) }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
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
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Email *</label>
                  <input name="guest_email" value={form.guest_email} onChange={handleChange} required
                    className="input-luxury" placeholder="your@email.com" type="email" />
                  <p className="font-body text-xs text-charcoal-300 mt-1">Booking confirmation will be sent here</p>
                </div>
                <div className="mt-4">
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Special Requests</label>
                  <textarea name="special_requests" value={form.special_requests} onChange={handleChange} rows={3}
                    className="input-luxury resize-none" placeholder="Early check-in, dietary preferences..." />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[{icon: Shield, text: 'Free Cancellation'}, {icon: Clock, text: '24hr Confirmation'}, {icon: Wifi, text: 'Best Rate'}].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 py-3 border border-charcoal-100 text-center">
                    <Icon size={14} className="text-gold-500" />
                    <span className="font-body text-[9px] tracking-wider uppercase text-charcoal-400">{text}</span>
                  </div>
                ))}
              </div>

              <button type="submit"
                disabled={submitting || roomsNotAvailable || (availability && !availability.available)}
                className="btn-gold w-full justify-center text-xs py-4 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</span>
                  : <span className="flex items-center gap-2"><CreditCard size={15} />Confirm & Pay — ₹{total.toLocaleString('en-IN')}</span>}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-charcoal-950 text-white overflow-hidden">
              {room?.images?.[0] && (
                <div className="relative h-44 overflow-hidden">
                  <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="bg-gold-500 text-white font-body text-[9px] tracking-widest uppercase px-2 py-0.5">{room.type}</span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-white text-xl font-light mb-1">{room?.name}</h3>
                <div className="flex gap-4 text-xs text-white/40 font-body mb-5">
                  <span className="flex items-center gap-1"><Users size={10} /> {room?.max_occupancy} guests/room</span>
                  <span className="flex items-center gap-1"><BedDouble size={10} /> {room?.bed_type}</span>
                </div>
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
                    <span className="text-white/50">Rooms</span>
                    <span className="text-white">{numRooms}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">₹{pricePerRoom.toLocaleString('en-IN')} × {nights}N × {numRooms}R</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-white/50">GST @ 12%</span>
                    <span className="text-white">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-gold-500/30 pt-3 flex justify-between font-body">
                    <span className="text-white font-medium text-sm">Total</span>
                    <span className="text-gold-400 text-xl font-semibold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-white/30 text-[9px] font-body text-right">Incl. all taxes</p>
                </div>
                {roomsNotAvailable && (
                  <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body text-center">
                    ✗ Only {availability?.available_count} room(s) available
                  </div>
                )}
                {!roomsNotAvailable && availability?.available && (
                  <div className="mt-3 px-3 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-body text-center">
                    ✓ Available for selected dates
                  </div>
                )}
                <p className="font-body text-white/30 text-xs text-center mt-4">
                  Need help? <a href="tel:+919082690060" className="text-gold-400 hover:underline">+91 90826 90060</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}