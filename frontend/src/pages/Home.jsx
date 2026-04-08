import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Award, Users, Coffee, Wifi, Car, Waves, ChevronRight, Quote } from 'lucide-react'
import HeroSlider from '../components/HeroSlider'
import RoomCard from '../components/RoomCard'
import ChatbotWidget from '../components/ChatbotWidget'
import api from '../utils/api'

const stats = [
  { value: '50+', label: 'Luxury Rooms' },
  { value: '500', label: 'Event Capacity' },
  { value: '5★', label: 'Service Rating' },
  { value: '24/7', label: 'Concierge' },
]

const highlights = [
  { icon: Award, title: 'Akola\'s Finest', desc: 'Setting new benchmarks in luxury hospitality for Vidarbha region.' },
  { icon: Coffee, title: 'Exquisite Dining', desc: 'Multi-cuisine restaurant serving authentic flavours with a gourmet twist.' },
  { icon: Waves, title: 'Rooftop Pool', desc: 'A stunning infinity-style pool with panoramic views of the city.' },
  { icon: Car, title: 'Complimentary Parking', desc: 'Secured valet and self-parking for all guests and event attendees.' },
  { icon: Wifi, title: 'High-Speed Wi-Fi', desc: 'Blazing-fast internet throughout the property for business & leisure.' },
  { icon: Users, title: 'Grand Banquets', desc: 'Magnificent halls for weddings, corporate events & social celebrations.' },
]

export default function Home() {
  const [rooms, setRooms] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [tIdx, setTIdx] = useState(0)

  useEffect(() => {
    api.get('/rooms').then(r => setRooms(r.data.rooms?.slice(0, 3) || []))
    api.get('/testimonials').then(r => setTestimonials(r.data.testimonials || []))
  }, [])

  useEffect(() => {
    if (!testimonials.length) return
    const t = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [testimonials])

  return (
    <>
      <HeroSlider />

      {/* Stats bar */}
      <section className="bg-charcoal-950 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map(s => (
              <div key={s.label} className="text-center py-3 px-4">
                <p className="font-accent text-gold-400 text-2xl md:text-3xl font-semibold">{s.value}</p>
                <p className="font-body text-white/40 text-xs tracking-widest uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome / About */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-3">Welcome to TNG</p>
            <h2 className="section-title mb-4">
              A New Chapter in<br />
              <em className="text-gold-600 not-italic">Akola's Luxury</em>
            </h2>
            <div className="gold-divider mx-0 mb-6" />
            <p className="font-body text-charcoal-500 leading-relaxed mb-4">
              TNG Hotels & Banquets is Akola's most anticipated luxury hospitality destination. Built with a vision to bring world-class comforts to the heart of Vidarbha, every detail has been crafted to deliver an experience that transcends expectations.
            </p>
            <p className="font-body text-charcoal-500 leading-relaxed mb-8">
              From intimate business stays to grand wedding celebrations, TNG offers an unmatched setting where elegance meets genuine warmth. Our commitment is simple — to make every guest feel like royalty.
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="btn-gold">Discover Our Story</Link>
              <Link to="/rooms" className="btn-outline-gold">View Rooms</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80" alt="Room" className="h-56 w-full object-cover shadow-lg" />
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80" alt="Hotel" className="h-56 w-full object-cover shadow-lg mt-8" />
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80" alt="Dining" className="h-56 w-full object-cover shadow-lg -mt-4" />
            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&q=80" alt="Pool" className="h-56 w-full object-cover shadow-lg mt-4" />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-6 text-center mb-14">
          <p className="section-label text-gold-400 mb-3">Why Choose TNG</p>
          <h2 className="section-title-white mb-4">The TNG Experience</h2>
          <div className="gold-divider" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border border-white/10 p-8 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-400 group">
              <div className="w-12 h-12 border border-gold-500/30 group-hover:border-gold-500 flex items-center justify-center mb-5 transition-all duration-300">
                <Icon size={20} className="text-gold-400" />
              </div>
              <h3 className="font-display text-white text-xl font-light mb-2">{title}</h3>
              <p className="font-body text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="section-label mb-3">Accommodation</p>
              <h2 className="section-title">Rooms & Suites</h2>
              <div className="gold-divider mx-0 mt-4" />
            </div>
            <Link to="/rooms" className="btn-outline-gold text-[10px] shrink-0 flex items-center gap-2">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          {rooms.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map(room => <RoomCard key={room.id} room={room} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton h-96 rounded" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banquet CTA */}
      <section className="relative py-32 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80" alt="Banquet"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-950/75" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="section-label text-gold-400 mb-4">Events & Celebrations</p>
          <h2 className="section-title-white mb-5">Your Dream Celebration<br />Begins Here</h2>
          <div className="gold-divider" />
          <p className="font-body text-white/60 mt-6 mb-8 leading-relaxed">
            From intimate gatherings to extravagant weddings for 500+ guests, our Royal Banquet Hall offers a breathtaking backdrop for every milestone moment in your life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking/4" className="btn-gold">Book Banquet Hall</Link>
            <Link to="/contact" className="btn-white border-white/30">Enquire Now</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-6 text-center mb-12">
            <p className="section-label mb-3">Guest Experiences</p>
            <h2 className="section-title">What Our Guests Say</h2>
            <div className="gold-divider" />
          </div>
          <div className="max-w-3xl mx-auto px-6">
            <div className="relative bg-white shadow-lg p-10 text-center overflow-hidden">
              <Quote size={40} className="text-gold-200 absolute top-6 left-6" />
              <div className="flex justify-center gap-1 mb-5">
                {[...Array(testimonials[tIdx]?.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="font-display text-charcoal-700 text-xl italic leading-relaxed mb-6">
                "{testimonials[tIdx]?.review}"
              </p>
              <div className="w-10 h-px bg-gold-500 mx-auto mb-4" />
              <div className="flex items-center justify-center gap-3">
                <img src={testimonials[tIdx]?.avatar_url || `https://i.pravatar.cc/60?img=${tIdx}`}
                  alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="text-left">
                  <p className="font-body font-medium text-charcoal-800 text-sm">{testimonials[tIdx]?.name}</p>
                  <p className="font-body text-charcoal-400 text-xs">{testimonials[tIdx]?.location}</p>
                </div>
              </div>
              {/* Dots */}
              <div className="flex justify-center gap-1.5 mt-6">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTIdx(i)}
                    className={`transition-all ${i === tIdx ? 'w-6 bg-gold-500' : 'w-2 bg-charcoal-200'} h-0.5`} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-48 md:h-64">
        {[
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
        ].map((img, i) => (
          <div key={i} className="overflow-hidden relative group cursor-pointer">
            <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-charcoal-950/30 group-hover:bg-charcoal-950/10 transition-all duration-300" />
          </div>
        ))}
      </section>

      {/* Newsletter / Contact CTA */}
      <section className="py-16 bg-gold-500">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="font-display text-charcoal-950 text-3xl font-light mb-3">Stay Connected with TNG</h3>
          <p className="font-body text-charcoal-800/70 text-sm mb-6">Get exclusive offers, event updates, and early-bird booking privileges.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Your email address"
              className="flex-1 px-5 py-3 bg-white/90 font-body text-sm text-charcoal-800 placeholder-charcoal-400 focus:outline-none border-0" />
            <button className="bg-charcoal-950 hover:bg-charcoal-800 text-white font-body text-xs tracking-widest uppercase px-7 py-3 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <ChatbotWidget />
    </>
  )
}
