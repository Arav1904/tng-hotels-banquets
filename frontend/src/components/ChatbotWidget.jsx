import { useState } from 'react'
import { MessageCircle, X, Sparkles } from 'lucide-react'

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gold-500 hover:bg-gold-600 text-white shadow-2xl shadow-gold-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Open Chat"
      >
        {open ? <X size={20} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-charcoal-950 border border-gold-500/20 shadow-2xl animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="bg-gold-500 px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="font-accent text-white text-sm font-semibold tracking-wider">TNG Concierge</p>
              <p className="font-body text-white/70 text-[10px] tracking-wider">AI-Powered Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-center">
            {/* Animated pulse */}
            <div className="relative mx-auto mb-5 w-16 h-16">
              <div className="absolute inset-0 bg-gold-500/20 rounded-full animate-ping" />
              <div className="absolute inset-2 bg-gold-500/30 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
              <div className="relative w-full h-full bg-gold-500/20 rounded-full flex items-center justify-center border border-gold-500/40">
                <Sparkles size={24} className="text-gold-400" />
              </div>
            </div>

            <p className="font-accent text-gold-400 tracking-widest text-xs uppercase mb-2">Coming Soon</p>
            <h3 className="font-display text-white text-2xl font-light mb-3">AI Concierge</h3>
            <div className="w-10 h-px bg-gold-500 mx-auto mb-4" />
            <p className="font-body text-white/50 text-sm leading-relaxed mb-6">
              Our intelligent concierge assistant is being crafted to provide you with instant answers, personalised recommendations, and seamless booking support — 24 × 7.
            </p>

            <div className="space-y-2 mb-6">
              {['Instant booking assistance', 'Room recommendations', 'Local attractions guide', 'Event & banquet queries'].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-left px-3 py-2 bg-white/5 border border-white/10">
                  <div className="w-1 h-1 rounded-full bg-gold-500 shrink-0" />
                  <span className="font-body text-white/60 text-xs">{f}</span>
                </div>
              ))}
            </div>

            <p className="font-body text-white/30 text-[10px] tracking-wider">
              For immediate assistance, call us at{' '}
              <a href="tel:+919082690060" className="text-gold-400 hover:underline">+91 90826 90060</a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}