import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Calendar, BedDouble, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import PageHero from '../components/PageHero'

const STATUS_STYLE = {
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-charcoal-50 text-charcoal-600 border-charcoal-200',
}

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login', { state: { from: '/my-bookings' } })
  }, [user, authLoading])

  useEffect(() => {
    if (!user) return
    api.get('/bookings/my')
      .then(r => setBookings(r.data.bookings || []))
      .finally(() => setLoading(false))
  }, [user])

  const cancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    try {
      await api.put(`/bookings/${id}/cancel`)
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
      toast.success('Booking cancelled')
    } catch { toast.error('Cancellation failed') }
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
              {[1,2,3].map(i => <div key={i} className="skeleton h-36" />)}
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
              {bookings.map(b => (
                <div key={b.id} className="bg-white shadow-sm border border-charcoal-100 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {b.room_images?.[0] && (
                      <img src={b.room_images[0]} alt={b.room_name}
                        className="sm:w-44 h-36 sm:h-auto object-cover shrink-0" />
                    )}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-body text-charcoal-400 text-[10px] tracking-widest uppercase mb-0.5">Booking #{b.id}</p>
                          <h3 className="font-display text-charcoal-900 text-xl font-light">{b.room_name}</h3>
                        </div>
                        <span className={`font-body text-[10px] tracking-widest uppercase px-3 py-1 border ${STATUS_STYLE[b.status] || STATUS_STYLE.pending}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-5 text-sm font-body text-charcoal-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gold-500" />
                          {format(new Date(b.check_in), 'dd MMM yyyy')} → {format(new Date(b.check_out), 'dd MMM yyyy')}
                        </div>
                        <span>₹{Number(b.total_amount).toLocaleString('en-IN')}</span>
                        <span className={`text-xs ${b.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {b.payment_status?.toUpperCase()}
                        </span>
                      </div>
                      {b.status === 'pending' || b.status === 'confirmed' ? (
                        <button onClick={() => cancel(b.id)}
                          className="font-body text-xs tracking-widest uppercase text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-1.5 transition-all">
                          Cancel Booking
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
