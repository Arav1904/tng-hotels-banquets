import { Car, Train, Plane, Bus } from 'lucide-react'
import PageHero from '../components/PageHero'
import ChatbotWidget from '../components/ChatbotWidget'

const routes = [
  {
    icon: Plane, title: 'By Air',
    desc: 'The nearest airport is Akola Airport (AKD), just 8 km from TNG Hotels. Nagpur International Airport (NAG) is 220 km away with frequent flights from major cities. We offer pre-arranged airport pickup for all guests.',
    detail: 'Transfer: 15 mins from Akola Airport',
  },
  {
    icon: Train, title: 'By Train',
    desc: 'Akola Junction is a major railway station on the Mumbai–Howrah main line. Trains from Mumbai (7 hrs), Nagpur (3 hrs), and Hyderabad (5 hrs) run daily. We are just 3 km from Akola Junction.',
    detail: '3 km from Akola Junction',
  },
  {
    icon: Bus, title: 'By Bus',
    desc: 'Maharashtra State Road Transport Corporation (MSRTC) operates regular AC and luxury buses to Akola from Mumbai, Pune, Nagpur, Aurangabad, and Amravati. MSRTC bus stand is 2 km from the hotel.',
    detail: '2 km from MSRTC Bus Stand',
  },
  {
    icon: Car, title: 'By Road / Car',
    desc: 'Akola is well-connected via NH-53 (Nagpur–Mumbai) and NH-161. From Nagpur: 3 hrs (220 km). From Amravati: 1 hr (75 km). From Aurangabad: 4 hrs (280 km). Ample parking is available at the hotel.',
    detail: 'NH-53 & NH-161 connectivity',
  },
]

export default function HowToReach() {
  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80"
        label="Directions"
        title="How to Reach"
        subtitle="TNG Hotels & Banquets, Akola, Maharashtra"
      />

      {/* Map */}
      <section className="bg-charcoal-950">
        <div className="w-full h-80 md:h-[450px]">
          <iframe
            title="TNG Hotels Location - Akola"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60082.43!2d77.0082!3d20.7069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd7261234567890%3A0xabc123def456!2sAkola%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          />
        </div>
      </section>

      {/* Address Banner */}
      <section className="bg-gold-500 py-5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-charcoal-950 text-sm">
            <strong>TNG Hotels & Banquets</strong> — Akola, Maharashtra 444001 &nbsp;|&nbsp; GPS: 20.7069° N, 77.0082° E
          </p>
        </div>
      </section>

      {/* Routes */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Getting Here</p>
            <h2 className="section-title">Travel Options</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {routes.map(({ icon: Icon, title, desc, detail }) => (
              <div key={title} className="bg-white border border-charcoal-100 p-7 hover:border-gold-400 hover:shadow-md transition-all group">
                <div className="w-12 h-12 border border-gold-200 group-hover:border-gold-500 group-hover:bg-gold-50 flex items-center justify-center mb-5 transition-all">
                  <Icon size={20} className="text-gold-500" />
                </div>
                <h3 className="font-display text-charcoal-900 text-xl font-light mb-2">{title}</h3>
                <p className="font-body text-charcoal-400 text-sm leading-relaxed mb-4">{desc}</p>
                <div className="border-t border-gold-100 pt-3">
                  <p className="font-body text-[10px] tracking-widest uppercase text-gold-600">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby landmarks */}
      <section className="py-16 bg-charcoal-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="section-label text-gold-400 mb-3">Nearby Landmarks</p>
          <h2 className="section-title-white text-3xl mb-8">Easy to Find</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ['Akola Junction Railway Station', '3 km'],
              ['Akola Airport', '8 km'],
              ['MSRTC Bus Stand', '2 km'],
              ['Akola City Centre', '4 km'],
              ['Raj Rajeshwar Temple', '5 km'],
              ['Akola District Court', '3 km'],
            ].map(([place, dist]) => (
              <div key={place} className="flex justify-between items-center border border-white/10 px-4 py-3 hover:border-gold-500/30 transition-all">
                <span className="font-body text-white/60 text-xs text-left">{place}</span>
                <span className="font-body text-gold-400 text-xs shrink-0 ml-2">{dist}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transfer booking */}
      <section className="py-12 bg-gold-50 border-y border-gold-200">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="font-display text-charcoal-900 text-2xl font-light mb-2">Need a Transfer?</p>
          <p className="font-body text-charcoal-500 text-sm mb-5">
            We arrange luxury vehicle pickups from Akola Airport, Railway Station, or any Akola location for all hotel guests.
          </p>
          <a href="tel:+919082690060" className="btn-gold">Call to Book Transfer</a>
        </div>
      </section>
      <ChatbotWidget />
    </>
  )
} 