import PageHero from '../components/PageHero'
import ChatbotWidget from '../components/ChatbotWidget'

const amenities = [
  { title: 'Rooftop Infinity Pool', desc: 'A stunning heated pool on our rooftop terrace with panoramic views of Akola city. Open daily from 7 AM to 9 PM.', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80', tag: 'Wellness' },
  { title: 'Spa & Wellness Centre', desc: 'Indulge in traditional Ayurvedic treatments, Swedish massages, aromatherapy, and body scrubs by certified therapists.', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', tag: 'Wellness' },
  { title: 'State-of-the-art Gym', desc: 'Fully equipped fitness centre with cardio machines, free weights, and personal trainer services. Open 24 hours.', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', tag: 'Fitness' },
  { title: 'Royal Banquet Hall', desc: 'A magnificent 5,000 sq.ft hall accommodating 500+ guests. Perfect for weddings, receptions, and grand corporate events.', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80', tag: 'Events' },
  { title: 'Business Centre', desc: 'Fully equipped meeting rooms, boardroom facilities, high-speed internet, printing, and secretarial services.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', tag: 'Business' },
  { title: 'Valet & Parking', desc: 'Complimentary secured parking with valet service for guests. Multi-level parking available for event attendees.', img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80', tag: 'Convenience' },
  { title: 'Concierge Services', desc: '24/7 front desk and concierge for travel bookings, local sightseeing, ticketing, and personal assistance.', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', tag: 'Service' },
  { title: 'Airport Transfers', desc: 'Pre-arranged luxury vehicle transfers to and from Akola Airport. Book at time of reservation for seamless travel.', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80', tag: 'Transport' },
]

const quickList = ['Free High-Speed Wi-Fi', 'Room Service 24/7', 'Laundry & Dry Cleaning', 'Currency Exchange', 'Doctor on Call', 'Kids Play Area', 'Pet-Friendly Rooms', 'EV Charging Station', 'Gift Shop', 'ATM on Premises', 'Newspaper Delivery', 'Babysitting Services']

export default function Amenities() {
  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80"
        label="World-Class Facilities"
        title="Amenities"
        subtitle="Everything you need, and more"
      />

      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Hotel Facilities</p>
            <h2 className="section-title">Designed for the Discerning</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {amenities.map(a => (
              <div key={a.title} className="card-luxury">
                <div className="overflow-hidden h-44">
                  <img src={a.img} alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="font-body text-[9px] tracking-widest uppercase text-gold-600 bg-gold-50 border border-gold-200 px-2.5 py-0.5">{a.tag}</span>
                  <h3 className="font-display text-charcoal-900 text-lg font-light mt-2 mb-1">{a.title}</h3>
                  <p className="font-body text-charcoal-400 text-xs leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick list */}
      <section className="py-16 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="section-label text-gold-400 mb-2">At Your Service</p>
            <h2 className="section-title-white text-3xl">And Much More</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickList.map(item => (
              <div key={item} className="flex items-center gap-3 border border-white/10 px-4 py-3 hover:border-gold-500/40 transition-all">
                <div className="w-1 h-1 rounded-full bg-gold-500 shrink-0" />
                <span className="font-body text-white/60 text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ChatbotWidget />
    </>
  )
}
