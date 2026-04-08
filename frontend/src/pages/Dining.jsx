import PageHero from '../components/PageHero'
import ChatbotWidget from '../components/ChatbotWidget'

const menus = [
  {
    name: 'The Grand Palate',
    type: 'All-Day Dining Restaurant',
    desc: 'Our flagship multi-cuisine restaurant serves breakfast, lunch, and dinner. Featuring authentic Indian, Continental, and regional Maharashtrian specialities with farm-to-table freshness.',
    hours: '7:00 AM – 11:00 PM',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80',
    items: ['Indian Thali', 'Continental Buffet', 'Live Counter', 'Dessert Station'],
  },
  {
    name: 'Rooftop Lounge & Bar',
    type: 'Sky Dining Experience',
    desc: 'Dine under the stars with panoramic views of Akola. The Rooftop Lounge offers signature cocktails, premium mocktails, and an elevated à la carte menu perfect for sunset evenings.',
    hours: '5:00 PM – 12:00 AM',
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=700&q=80',
    items: ['Signature Cocktails', 'Tapas & Snacks', 'BBQ Nights', 'Sunset Happy Hours'],
  },
  {
    name: 'Banquet Catering',
    type: 'Events & Celebrations',
    desc: 'World-class catering for all events hosted at TNG — weddings, corporate dinners, receptions, and private celebrations. Customised menus crafted by our executive chef.',
    hours: 'As per event schedule',
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=700&q=80',
    items: ['Wedding Spreads', 'Corporate Buffets', 'Live Stations', 'Custom Menus'],
  },
]

const specialities = [
  { name: 'Maharashtrian Thali', desc: 'Authentic flavours of Vidarbha', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  { name: 'Grilled Tiger Prawns', desc: 'Coastal-style with garlic butter', img: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=400&q=80' },
  { name: 'Artisan Desserts', desc: 'Crafted by our pâtisserie chef', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
  { name: 'Signature Breakfast', desc: 'Start your day the TNG way', img: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80' },
]

export default function Dining() {
  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
        label="Culinary Experiences"
        title="Dining at TNG"
        subtitle="Where every meal is a memory"
      />

      {/* Restaurants */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {menus.map((m, i) => (
            <div key={m.name} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <img src={m.img} alt={m.name} className="w-full h-80 object-cover shadow-lg" />
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <p className="section-label mb-2">{m.type}</p>
                <h2 className="font-display text-charcoal-950 text-4xl font-light mb-3">{m.name}</h2>
                <div className="gold-divider mx-0 mb-5" />
                <p className="font-body text-charcoal-500 leading-relaxed mb-5">{m.desc}</p>
                <p className="font-body text-xs tracking-widest text-charcoal-400 uppercase mb-4">
                  Hours: <span className="text-gold-600">{m.hours}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {m.items.map(it => (
                    <span key={it} className="font-body text-xs tracking-wide bg-gold-50 text-gold-700 border border-gold-200 px-3 py-1.5">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specialities */}
      <section className="py-20 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <p className="section-label text-gold-400 mb-3">Chef's Picks</p>
          <h2 className="section-title-white">Signature Dishes</h2>
          <div className="gold-divider" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialities.map(s => (
            <div key={s.name} className="group overflow-hidden">
              <div className="overflow-hidden h-52">
                <img src={s.img} alt={s.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="bg-charcoal-900 p-4 border-t border-gold-500/20">
                <h3 className="font-display text-white text-lg font-light">{s.name}</h3>
                <p className="font-body text-white/40 text-xs mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dietary note */}
      <section className="py-12 bg-gold-50 border-y border-gold-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-display text-charcoal-800 text-2xl font-light mb-2">Dietary Preferences Welcome</p>
          <p className="font-body text-charcoal-500 text-sm">
            We cater to vegetarian, vegan, Jain, gluten-free, and all other dietary requirements. Please inform us at booking.
          </p>
        </div>
      </section>
      <ChatbotWidget />
    </>
  )
}
