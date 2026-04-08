import { Link } from 'react-router-dom'
import { Users, Maximize, BedDouble, ArrowRight } from 'lucide-react'

export default function RoomCard({ room }) {
  const img = room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'

  return (
    <div className="card-luxury">
      {/* Image */}
      <div className="overflow-hidden h-60 relative">
        <img src={img} alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <span className="bg-gold-500 text-white font-body text-[9px] tracking-[0.2em] uppercase px-3 py-1">
            {room.type}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display text-charcoal-950 text-2xl font-light">{room.name}</h3>
          <div className="text-right">
            <p className="font-body text-gold-600 font-semibold text-lg">
              ₹{Number(room.price_per_night).toLocaleString('en-IN')}
            </p>
            <p className="font-body text-charcoal-400 text-[10px] tracking-wider">per night</p>
          </div>
        </div>

        <p className="font-body text-charcoal-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Stats */}
        <div className="flex gap-5 mb-5 border-t border-charcoal-100 pt-4">
          <div className="flex items-center gap-1.5 text-charcoal-500">
            <Users size={13} className="text-gold-500" />
            <span className="font-body text-xs">{room.max_occupancy} Guests</span>
          </div>
          {room.floor_area_sqft && (
            <div className="flex items-center gap-1.5 text-charcoal-500">
              <Maximize size={13} className="text-gold-500" />
              <span className="font-body text-xs">{room.floor_area_sqft} sq.ft</span>
            </div>
          )}
          {room.bed_type && room.bed_type !== 'N/A' && (
            <div className="flex items-center gap-1.5 text-charcoal-500">
              <BedDouble size={13} className="text-gold-500" />
              <span className="font-body text-xs">{room.bed_type}</span>
            </div>
          )}
        </div>

        {/* Amenity tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(room.amenities || []).slice(0, 4).map(a => (
            <span key={a} className="font-body text-[10px] tracking-wide bg-charcoal-50 text-charcoal-500 px-2.5 py-1 border border-charcoal-100">
              {a}
            </span>
          ))}
          {(room.amenities || []).length > 4 && (
            <span className="font-body text-[10px] tracking-wide bg-gold-50 text-gold-600 px-2.5 py-1 border border-gold-200">
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <Link to={`/rooms/${room.id}`} className="btn-outline-gold flex-1 justify-center text-[10px] py-2.5">
            View Details
          </Link>
          <Link to={`/booking/${room.id}`} className="btn-gold flex-1 justify-center text-[10px] py-2.5">
            Book Now <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
