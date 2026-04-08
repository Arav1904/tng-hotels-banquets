import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 text-white">
      {/* Top CTA strip */}
      <div className="bg-gold-500 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-display text-charcoal-950 text-lg italic">Experience Luxury Redefined in Akola</p>
          <Link to="/rooms" className="btn-white text-[10px] py-2.5 px-6 shrink-0">Reserve Your Stay</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="mb-5">
            <p className="font-accent text-gold-400 tracking-[0.3em] text-xl font-semibold">TNG</p>
            <p className="font-body text-white/50 text-[10px] tracking-[0.4em] uppercase">Hotels & Banquets</p>
          </div>
          <p className="font-body text-white/50 text-sm leading-relaxed mb-6">
            Akola's most anticipated luxury hospitality destination — where elegance meets warmth, and every moment becomes a cherished memory.
          </p>
          <div className="flex gap-3">
            {[
              { icon: Instagram, href: '#' },
              { icon: Facebook, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Youtube, href: '#' },
            ].map(({ icon: Icon, href }) => (
              <a key={href} href={href}
                className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/40 hover:text-gold-400 hover:border-gold-500 transition-all duration-300">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="section-label text-gold-400 mb-5">Quick Links</p>
          <ul className="space-y-2.5">
            {[
              ['/', 'Home'],
              ['/rooms', 'Rooms & Suites'],
              ['/dining', 'Dining'],
              ['/amenities', 'Amenities'],
              ['/about', 'About Us'],
              ['/contact', 'Contact'],
            ].map(([path, label]) => (
              <li key={path}>
                <Link to={path}
                  className="font-body text-sm text-white/50 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-3 h-px bg-gold-500/40 group-hover:w-5 transition-all duration-300" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <p className="section-label text-gold-400 mb-5">Our Services</p>
          <ul className="space-y-2.5">
            {['Luxury Accommodation', 'Wedding Banquets', 'Corporate Events', 'Fine Dining', 'Rooftop Pool', 'Spa & Wellness', 'Airport Transfers', 'Event Planning'].map(s => (
              <li key={s} className="font-body text-sm text-white/50 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold-500/60 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="section-label text-gold-400 mb-5">Get in Touch</p>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <MapPin size={15} className="text-gold-400 shrink-0 mt-0.5" />
              <p className="font-body text-sm text-white/50 leading-relaxed">
                TNG Hotels & Banquets,<br />
                Akola – 444001,<br />
                Maharashtra, India
              </p>
            </li>
            <li>
              <a href="tel:+919876543210" className="flex gap-3 text-white/50 hover:text-gold-400 transition-colors">
                <Phone size={15} className="text-gold-400 shrink-0 mt-0.5" />
                <span className="font-body text-sm">+91 98765 43210</span>
              </a>
            </li>
            <li>
              <a href="mailto:reservations@tnghotels.com" className="flex gap-3 text-white/50 hover:text-gold-400 transition-colors">
                <Mail size={15} className="text-gold-400 shrink-0 mt-0.5" />
                <span className="font-body text-sm">reservations@tnghotels.com</span>
              </a>
            </li>
          </ul>
          <div className="mt-6 p-4 border border-gold-500/20 bg-gold-500/5">
            <p className="font-body text-xs text-white/40 tracking-wider uppercase mb-1">Reservations</p>
            <p className="font-body text-sm text-white/70">24 × 7 Front Desk</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/30 text-xs font-body">
          <p>© {new Date().getFullYear()} TNG Hotels & Banquets. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
            <Link to="/how-to-reach" className="hover:text-gold-400 transition-colors">How to Reach</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
