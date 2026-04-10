import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { format, isPast, parseISO } from 'date-fns'
import { Calendar, BedDouble, Users, XCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import PageHero from '../components/PageHero'

const WHATSAPP_NUMBER = '919082690060'

const STATUS_STYLE = {
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-charcoal-50 text-charcoal-600 border-charcoal-200',
}

// EmailJS via REST — no npm package needed
const sendCancellationEmail = async (params) => {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_CANCEL_TEMPLATE_ID
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (!serviceId || !templateId || !publicKey ||
      serviceId === 'your_service_id' || templateId === 'your_cancel_template_id') return
  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: params,
      }),
    })
  } catch {
    // Silent fail — cancellation still completes
  }
}

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login', { state: { from: '/my-bookings' } })
  }, [user, authLoading])

  useEffect(() => {
    if (!user) return
    api.get('/bookings/my')
      .then(r => setBookings(r.data.bookings || []))
      .finally(() => setLoading(false))
  }, [user])

  const canCancel = (b) => {
    if (b.status !== 'pending' && b.status !== 'confirmed') return false
    try { return !isPast(parseISO(b.check_in)) } catch { return true }
  }

  const doCancel = async () => {
    const b = showConfirm
    setShowConfirm(null)
    setCancelling(b.id)
    try {
      await api.put(`/bookings/${b.id}/cancel`)
      setBookings(bs => bs.map(bk => bk.id === b.id ? { ...bk, status: 'cancelled' } : bk))

      const bookingRef = `TNG-${String(b.id).padStart(5, '0')}`

      // Send cancellation email
      await sendCancellationEmail({
        to_name:      user.name,
        to_email:     user.email,
        booking_id:   bookingRef,
        room_name:    b.room_name,
        check_in:     format(parseISO(b.check_in), 'dd MMM yyyy'),
        check_out:    format(parseISO(b.check_out), 'dd MMM yyyy'),
        total_amount: `₹${Number(b.total_amount).toLocaleString('en-IN')}`,
        hotel_phone:  '+91 90826 90060',
        hotel_email:  'reservations@tnghotels.com',
        reply_to:     'reservations@tnghotels.com',
      })

      toast.success('Booking cancelled successfully')
    } catch {
      toast.error('Cancellation failed. Please call us at +91 90826 90060.')
    } finally {
      setCancelling(null)
    }
  }

  const getWAMessage = (b) => {
    const ref = `TNG-${String(b.id).padStart(5, '0')}`
    return encodeURIComponent(
      `Hi TNG Hotels, I need to cancel my booking.\n\nRef: ${ref}\nName: ${user?.name}\nRoom: ${b.room_name}\nCheck-in: ${format(parseISO(b.check_in), 'dd MMM yyyy')}\n\nPlease process my cancellation. Thank you.`
    )
  }

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80"
        label="Member Portal"
        title="My Bookings"
        subtitle="Manage your reservations"
      />

      <section className="py-14 bg-cream min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-6">

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-40 rounded" />)}
            </div>

          ) : bookings.length === 0 ? (
            <div className="text-center py-24">
              <BedDouble size={40} className="text-charcoal-200 mx-auto mb-4" />
              <h3 className="font-display text-2xl text-charcoal-400 font-light mb-3">No bookings yet</h3>
              <p className="font-body text-charcoal-300 text-sm mb-6">Your reservation history will appear here.</p>
              <Link to="/rooms" className="btn-gold">Explore Rooms</Link>
            </div>

          ) : (
            <div className="space-y-5">
              {bookings.map(b => {
                const ref = `TNG-${String(b.id).padStart(5, '0')}`
                return (
                  <div key={b.id} className="bg-white shadow-sm border border-charcoal-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">

                      {/* Room image */}
                      {b.room_images?.[0] && (
                        <img
                          src={b.room_images[0]}
                          alt={b.room_name}
                          className="sm:w-44 h-36 sm:h-auto object-cover shrink-0"
                        />
                      )}

                      <div className="flex-1 p-5">
                        {/* Header row */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-body text-charcoal-400 text-[10px] tracking-widest uppercase mb-0.5">
                              Ref: <span className="text-gold-600 font-semibold">{ref}</span>
                            </p>
                            <h3 className="font-display text-charcoal-900 text-xl font-light">{b.room_name}</h3>
                          </div>
                          <span className={`font-body text-[10px] tracking-widest uppercase px-3 py-1 border ${STATUS_STYLE[b.status] || STATUS_STYLE.pending}`}>
                            {b.status}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap gap-4 text-xs font-body text-charcoal-500 mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-gold-500" />
                            {format(parseISO(b.check_in), 'dd MMM yyyy')} → {format(parseISO(b.check_out), 'dd MMM yyyy')}
                          </div>
                          {b.num_guests && (
                            <div className="flex items-center gap-1.5">
                              <Users size={12} className="text-gold-500" />
                              {b.num_guests} Guest{b.num_guests > 1 ? 's' : ''}
                            </div>
                          )}
                          <span className="font-medium text-charcoal-700">
                            ₹{Number(b.total_amount).toLocaleString('en-IN')}
                          </span>
                          <span className={b.payment_status === 'paid' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                            {b.payment_status === 'paid' ? '✅ Paid' : '⏳ Pay at Check-in'}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2">
                          {canCancel(b) && (
                            <>
                              <button
                                onClick={() => setShowConfirm(b)}
                                disabled={cancelling === b.id}
                                className="flex items-center gap-1.5 font-body text-xs tracking-widest uppercase text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-1.5 transition-all disabled:opacity-50"
                              >
                                {cancelling === b.id
                                  ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                  : <XCircle size={12} />}
                                Cancel Booking
                              </button>

                              <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWAMessage(b)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 font-body text-xs tracking-widest uppercase text-green-700 border border-green-200 hover:border-green-400 px-4 py-1.5 transition-all bg-green-50"
                              >
                                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-green-700">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                WhatsApp
                              </a>
                            </>
                          )}

                          {b.status === 'cancelled' && (
                            <div className="flex items-center gap-1.5 font-body text-xs text-charcoal-400">
                              <XCircle size={12} className="text-red-400" /> Booking cancelled
                            </div>
                          )}
                          {b.status === 'completed' && (
                            <div className="flex items-center gap-1.5 font-body text-xs text-green-600">
                              <CheckCircle2 size={12} /> Stay completed — Thank you!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cancellation confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-sm w-full shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="bg-charcoal-950 px-6 py-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <XCircle size={20} className="text-red-400" />
              </div>
              <div>
                <p className="font-accent text-gold-400 text-[10px] tracking-widest uppercase">Confirm Action</p>
                <h3 className="font-display text-white text-xl font-light">Cancel Booking?</h3>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <p className="font-body text-charcoal-600 text-sm mb-1">
                You are about to cancel your reservation for:
              </p>
              <p className="font-display text-charcoal-900 text-lg font-light mb-1">{showConfirm.room_name}</p>
              <p className="font-body text-charcoal-400 text-xs mb-4">
                Ref: TNG-{String(showConfirm.id).padStart(5, '0')} &nbsp;|&nbsp;
                {format(parseISO(showConfirm.check_in), 'dd MMM')} – {format(parseISO(showConfirm.check_out), 'dd MMM yyyy')}
              </p>

              <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 mb-5">
                <p className="font-body text-xs text-yellow-700 leading-relaxed">
                  A cancellation confirmation will be sent to your registered email address. For refund queries, contact us at <strong>+91 90826 90060</strong>.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 border border-charcoal-200 hover:border-charcoal-400 py-3 font-body text-xs tracking-widest uppercase text-charcoal-600 transition-all"
                >
                  Keep Booking
                </button>
                <button
                  onClick={doCancel}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 font-body text-xs tracking-widest uppercase transition-all"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}