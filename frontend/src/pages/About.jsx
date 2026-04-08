import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ChatbotWidget from '../components/ChatbotWidget'

const team = [
  { name: 'TNG Management', role: 'Hospitality Group', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80' },
  { name: 'Chef Executive', role: 'Head of Culinary', img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80' },
  { name: 'Events Director', role: 'Banquets & Events', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80' },
]

const milestones = [
  { year: '2018', text: 'TNG Group founded with a vision to redefine hospitality in Vidarbha.' },
  { year: '2020', text: 'Acquired prime land in Akola to build our flagship luxury property.' },
  { year: '2022', text: 'Construction commenced on TNG Hotels & Banquets — 6 floors of luxury.' },
  { year: '2024', text: 'Structural work completed. Interior design and finishing underway.' },
  { year: '2025', text: 'Grand opening announced. Pre-launch bookings open to members.' },
]

export default function About() {
  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80"
        label="Our Story"
        title="About TNG"
        subtitle="Crafting extraordinary experiences since 2018"
      />

      {/* Story */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-3">Who We Are</p>
            <h2 className="section-title mb-5">Born from a Passion<br /><em className="text-gold-600 not-italic">for Excellence</em></h2>
            <div className="gold-divider mx-0 mb-6" />
            <p className="font-body text-charcoal-500 leading-relaxed mb-4">
              TNG Hotels & Banquets was born from a singular ambition — to bring genuine world-class hospitality to Akola and the heart of Vidarbha. For too long, those seeking luxury accommodation, grand wedding venues, or premium corporate event spaces had to travel to Nagpur, Pune, or Mumbai. TNG changes that.
            </p>
            <p className="font-body text-charcoal-500 leading-relaxed mb-4">
              Our flagship property in Akola is designed by leading architects and interior designers, blending neo-classical grandeur with modern sensibility. Every square foot has been thoughtfully crafted — from the sweeping entrance foyer to the rooftop pool terrace.
            </p>
            <p className="font-body text-charcoal-500 leading-relaxed mb-8">
              The TNG Group brings with it decades of combined hospitality expertise, having been associated with premium properties across Maharashtra under different brands. TNG Akola is our most ambitious project yet, and a testament to our belief that Vidarbha deserves the best.
            </p>
            <Link to="/contact" className="btn-gold">Get in Touch</Link>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&q=80"
              alt="TNG Hotel" className="w-full h-96 object-cover shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 bg-charcoal-950 p-6 text-white hidden md:block">
              <p className="font-accent text-gold-400 text-3xl font-semibold">6+</p>
              <p className="font-body text-white/50 text-xs tracking-widest uppercase mt-1">Years in Hospitality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <p className="section-label text-gold-400 mb-3">Our Philosophy</p>
          <h2 className="section-title-white">What We Stand For</h2>
          <div className="gold-divider" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Excellence', desc: 'We never compromise. Every service, every dish, every room reflects our unrelenting standard.' },
            { title: 'Warmth', desc: 'Luxury is nothing without heart. Every guest is treated as family, not a room number.' },
            { title: 'Innovation', desc: 'We blend timeless hospitality traditions with modern conveniences and design thinking.' },
            { title: 'Community', desc: 'We are proud to invest in Akola — creating jobs, celebrating culture, and growing together.' },
          ].map(v => (
            <div key={v.title} className="border border-white/10 p-7 hover:border-gold-500/40 transition-all">
              <div className="w-8 h-px bg-gold-500 mb-4" />
              <h3 className="font-display text-white text-xl font-light mb-2">{v.title}</h3>
              <p className="font-body text-white/40 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Our Journey</p>
            <h2 className="section-title">Building a Legacy</h2>
            <div className="gold-divider" />
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-charcoal-100" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <div className="w-12 shrink-0 text-right">
                    <span className="font-accent text-gold-500 text-sm font-semibold">{m.year}</span>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gold-500 -translate-x-1.5 border-2 border-white shadow" />
                    <p className="font-body text-charcoal-600 text-sm leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
          alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-950/75" />
        <div className="relative z-10 text-center max-w-xl mx-auto px-6">
          <p className="section-label text-gold-400 mb-3">Be Part of History</p>
          <h2 className="section-title-white mb-4">Opening Soon in Akola</h2>
          <div className="gold-divider" />
          <p className="font-body text-white/60 mt-5 mb-8 text-sm">Pre-book your stay and be among the first to experience TNG Hotels & Banquets.</p>
          <Link to="/rooms" className="btn-gold">Reserve Now</Link>
        </div>
      </section>
      <ChatbotWidget />
    </>
  )
}
