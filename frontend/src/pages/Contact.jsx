import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHero from '../components/PageHero'
import ChatbotWidget from '../components/ChatbotWidget'
import api from '../utils/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We\'ll reply within 24 hours.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message')
    } finally { setLoading(false) }
  }

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
        label="Reach Out"
        title="Contact Us"
        subtitle="We'd love to hear from you"
      />

      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="section-label mb-3">Get in Touch</p>
              <h2 className="font-display text-charcoal-950 text-3xl font-light mb-4">We're Here for You</h2>
              <div className="gold-divider mx-0 mb-5" />
              <p className="font-body text-charcoal-500 text-sm leading-relaxed">
                Whether you're planning a stay, a grand wedding, or a corporate event, our team is ready to assist. Reach out — we respond within 24 hours.
              </p>
            </div>

            {[
              { icon: Phone, label: 'Reservations', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: Mail, label: 'Email Us', value: 'reservations@tnghotels.com', href: 'mailto:reservations@tnghotels.com' },
              { icon: MapPin, label: 'Address', value: 'TNG Hotels & Banquets, Akola – 444001, Maharashtra', href: null },
              { icon: Clock, label: 'Front Desk', value: '24 × 7, all days', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4 p-4 bg-white border border-charcoal-100 hover:border-gold-300 transition-all">
                <div className="w-10 h-10 shrink-0 border border-gold-200 flex items-center justify-center bg-gold-50">
                  <Icon size={16} className="text-gold-500" />
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-charcoal-400 mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="font-body text-sm text-charcoal-700 hover:text-gold-600 transition-colors">{value}</a>
                  ) : (
                    <p className="font-body text-sm text-charcoal-700">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-sm border border-charcoal-100 p-8">
              <h3 className="font-display text-2xl text-charcoal-950 font-light mb-6">Send Us a Message</h3>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Your Name *</label>
                    <input name="name" required value={form.name} onChange={handle} className="input-luxury" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Phone</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handle} className="input-luxury" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Email *</label>
                  <input name="email" type="email" required value={form.email} onChange={handle} className="input-luxury" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Subject</label>
                  <select name="subject" value={form.subject} onChange={handle} className="input-luxury">
                    <option value="">Select a topic</option>
                    <option>Room Booking Enquiry</option>
                    <option>Banquet / Wedding Enquiry</option>
                    <option>Corporate Event Enquiry</option>
                    <option>Dining Reservation</option>
                    <option>General Enquiry</option>
                    <option>Feedback / Complaint</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Message *</label>
                  <textarea name="message" required rows={5} value={form.message} onChange={handle}
                    className="input-luxury resize-none" placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 disabled:opacity-60">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><Send size={14} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Teaser */}
      <section className="py-12 bg-white border-t border-charcoal-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 px-5 py-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="font-body text-xs text-gold-700 tracking-wider">AI Concierge — Coming Soon</span>
          </div>
          <p className="font-body text-charcoal-400 text-sm">
            Our AI-powered chatbot assistant will soon be available 24/7 for instant answers, recommendations, and bookings. Until then, use the chat button below or call us directly.
          </p>
        </div>
      </section>
      <ChatbotWidget />
    </>
  )
}
