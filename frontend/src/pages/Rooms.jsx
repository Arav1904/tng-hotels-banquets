import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import RoomCard from '../components/RoomCard'
import ChatbotWidget from '../components/ChatbotWidget'
import { AlertCircle, RefreshCw } from 'lucide-react'
import api from '../utils/api'

const TYPES = ['all', 'deluxe', 'suite', 'presidential', 'banquet']

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchRooms = () => {
    setLoading(true)
    setError('')
    api.get('/rooms')
      .then(r => {
        const data = r.data.rooms || []
        setRooms(data)
        if (data.length === 0) setError('no-rooms')
      })
      .catch(err => {
        console.error('Rooms fetch error:', err)
        setError('Failed to load rooms. Please check your connection and try again.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRooms() }, [])

  const filtered = filter === 'all' ? rooms : rooms.filter(r => r.type === filter)

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80"
        label="Accommodation"
        title="Rooms & Suites"
        subtitle="Discover spaces designed for the discerning traveller"
      />

      <section className="py-16 bg-cream min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6">

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`font-body text-xs tracking-widest uppercase px-6 py-2.5 border transition-all duration-200
                  ${filter === t
                    ? 'bg-gold-500 border-gold-500 text-white'
                    : 'border-charcoal-200 text-charcoal-500 hover:border-gold-400 hover:text-gold-500'}`}>
                {t === 'all' ? 'All Rooms' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="skeleton h-96 rounded" />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && error !== 'no-rooms' && (
            <div className="text-center py-24">
              <div className="flex items-center justify-center gap-2 text-red-500 mb-4">
                <AlertCircle size={24} />
                <p className="font-body text-base">{error}</p>
              </div>
              <button onClick={fetchRooms}
                className="btn-gold flex items-center gap-2 mx-auto">
                <RefreshCw size={14} /> Try Again
              </button>
              <p className="font-body text-charcoal-400 text-xs mt-4">
                Make sure the backend server is running on port 5000
              </p>
            </div>
          )}

          {/* No rooms in DB */}
          {!loading && !error && rooms.length === 0 && (
            <div className="text-center py-24">
              <p className="font-display text-charcoal-400 text-2xl font-light mb-2">No rooms available yet</p>
              <p className="font-body text-charcoal-300 text-sm">Please run the schema.sql seed file in pgAdmin</p>
            </div>
          )}

          {/* No rooms for this filter */}
          {!loading && !error && rooms.length > 0 && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="font-display text-charcoal-400 text-2xl font-light mb-3">
                No {filter} rooms found
              </p>
              <button onClick={() => setFilter('all')} className="btn-outline-gold">
                View All Rooms
              </button>
            </div>
          )}

          {/* Room cards */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(room => <RoomCard key={room.id} room={room} />)}
            </div>
          )}

        </div>
      </section>
      <ChatbotWidget />
    </>
  )
}
