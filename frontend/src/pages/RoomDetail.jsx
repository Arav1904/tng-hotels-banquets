import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Users, Maximize, BedDouble, CheckCircle2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import api from '../utils/api'

export default function RoomDetail() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then(r => setRoom(r.data.room))
      .catch(() => navigate('/rooms'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!room) return null

  const imgs = room.images || ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']

  return (
    <>
      <div className="pt-20 bg-charcoal-950">
        {/* Image gallery */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={imgs[imgIdx]} alt={room.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/30 to-charcoal-950/60" />

          {imgs.length > 1 && (
            <>
              <button onClick={() => setImgIdx((imgIdx - 1 + imgs.length) % imgs.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white hover:bg-gold-500 transition-all flex items-center justify-center">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setImgIdx((imgIdx + 1) % imgs.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white hover:bg-gold-500 transition-all flex items-center justify-center">
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imgs.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`transition-all ${i === imgIdx ? 'w-6 bg-gold-500' : 'w-2 bg-white/50'} h-0.5`} />
                ))}
              </div>
            </>
          )}

          {/* Thumbnails */}
          {imgs.length > 1 && (
            <div className="absolute bottom-8 right-6 flex gap-2">
              {imgs.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-14 h-10 overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-gold-500' : 'border-white/20 hover:border-white/60'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/rooms" className="flex items-center gap-2 text-charcoal-400 hover:text-gold-500 font-body text-xs tracking-wider uppercase mb-8 transition-colors w-fit">
          <ArrowLeft size={14} /> Back to All Rooms
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <span className="bg-gold-500/10 text-gold-600 font-body text-[10px] tracking-widest uppercase px-3 py-1 border border-gold-200">{room.type}</span>
                <h1 className="font-display text-charcoal-950 text-4xl font-light mt-3">{room.name}</h1>
              </div>
              <div className="text-right">
                <p className="font-accent text-gold-600 text-3xl">₹{Number(room.price_per_night).toLocaleString('en-IN')}</p>
                <p className="font-body text-charcoal-400 text-xs tracking-wider">per night</p>
              </div>
            </div>

            <div className="gold-divider mx-0 mb-6" />

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-charcoal-600">
                <Users size={16} className="text-gold-500" />
                <span className="font-body text-sm">Up to {room.max_occupancy} Guests</span>
              </div>
              {room.floor_area_sqft && (
                <div className="flex items-center gap-2 text-charcoal-600">
                  <Maximize size={16} className="text-gold-500" />
                  <span className="font-body text-sm">{room.floor_area_sqft} sq.ft</span>
                </div>
              )}
              {room.bed_type && room.bed_type !== 'N/A' && (
                <div className="flex items-center gap-2 text-charcoal-600">
                  <BedDouble size={16} className="text-gold-500" />
                  <span className="font-body text-sm">{room.bed_type} Bed</span>
                </div>
              )}
            </div>

            <p className="font-body text-charcoal-600 leading-relaxed mb-8">{room.description}</p>

            <h2 className="font-display text-charcoal-950 text-2xl font-light mb-5">Amenities & Features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(room.amenities || []).map(a => (
                <div key={a} className="flex items-center gap-3 py-2 border-b border-charcoal-100">
                  <CheckCircle2 size={14} className="text-gold-500 shrink-0" />
                  <span className="font-body text-sm text-charcoal-600">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-charcoal-950 text-white p-8">
              <h3 className="font-display text-2xl font-light mb-1">Reserve This Room</h3>
              <p className="font-body text-white/40 text-xs tracking-wider mb-6">Secure your stay with instant confirmation</p>
              <div className="text-center py-6 border border-gold-500/30 mb-6">
                <p className="font-accent text-gold-400 text-3xl">₹{Number(room.price_per_night).toLocaleString('en-IN')}</p>
                <p className="font-body text-white/40 text-xs mt-1">per night + taxes</p>
              </div>
              <ul className="space-y-2 mb-8">
                {['Free Cancellation (24hrs)', 'Instant Confirmation', 'Best Rate Guaranteed', 'Loyalty Points Earned'].map(b => (
                  <li key={b} className="flex items-center gap-2 font-body text-xs text-white/60">
                    <CheckCircle2 size={12} className="text-gold-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link to={`/booking/${room.id}`} className="btn-gold w-full justify-center">
                Book Now
              </Link>
              <p className="text-center font-body text-white/30 text-xs mt-4">
                Or call: <a href="tel:+919082690060" className="text-gold-400 hover:underline">+91 90826 90060</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}