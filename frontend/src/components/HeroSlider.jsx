import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80',
    title: 'Where Luxury Finds Its Home',
    subtitle: "Akola's Premier Hospitality Destination",
    cta: 'Explore Rooms',
    link: '/rooms',
  },
  {
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80',
    title: 'Celebrate in Grand Style',
    subtitle: 'World-Class Banquet Halls for Every Occasion',
    cta: 'View Banquets',
    link: '/rooms',
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
    title: 'A Culinary Journey Awaits',
    subtitle: 'Exquisite Dining Experiences at Every Meal',
    cta: 'Discover Dining',
    link: '/dining',
  },
  {
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80',
    title: 'Rejuvenate, Relax, Rediscover',
    subtitle: 'Indulge in World-Class Amenities & Wellness',
    cta: 'Our Amenities',
    link: '/amenities',
  },
  {
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80',
    title: 'Memories That Last Forever',
    subtitle: 'Weddings & Events Crafted to Perfection',
    cta: 'Plan Your Event',
    link: '/contact',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((idx) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 400)
  }, [transitioning])

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: i === current ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 8s ease',
            }}
          />
          {/* Strong top gradient so navbar is always readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/60" />
          {/* Left-side gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Hero Content — pt-20 pushes content below the fixed navbar */}
      <div className="relative z-10 h-full flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className={`max-w-2xl transition-all duration-500 ${transitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
            {/* Subtitle label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold-500" />
              <p className="font-accent text-gold-400 tracking-[0.3em] uppercase text-xs font-semibold drop-shadow">
                {slides[current].subtitle}
              </p>
            </div>

            {/* Main title */}
            <h1 className="font-display text-white text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08] mb-6 drop-shadow-xl">
              {slides[current].title}
            </h1>

            <div className="w-16 h-px bg-gold-500 mb-8" />

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to={slides[current].link}
                className="bg-gold-500 hover:bg-gold-600 text-white font-body font-medium tracking-widest uppercase text-xs px-8 py-3.5 transition-all duration-300 border border-gold-500 hover:shadow-lg hover:shadow-gold-500/30 active:scale-95 inline-flex items-center gap-2">
                {slides[current].cta}
              </Link>
              <Link to="/about"
                className="bg-transparent hover:bg-white/10 text-white font-body font-medium tracking-widest uppercase text-xs px-8 py-3.5 transition-all duration-300 border border-white/60 hover:border-white active:scale-95 inline-flex items-center gap-2 backdrop-blur-sm">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <button onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/40 bg-black/30 text-white hover:bg-gold-500 hover:border-gold-500 transition-all duration-300 flex items-center justify-center backdrop-blur-sm hover:scale-105 active:scale-95">
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/40 bg-black/30 text-white hover:bg-gold-500 hover:border-gold-500 transition-all duration-300 flex items-center justify-center backdrop-blur-sm hover:scale-105 active:scale-95">
        <ChevronRight size={20} />
      </button>

      {/* Bottom bar: scroll indicator | dots | counter */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-between px-8">

        {/* Scroll indicator */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-gradient-to-b from-white/0 to-white/50" />
          <p className="font-body text-white/40 text-[9px] tracking-[0.35em] uppercase">Scroll</p>
        </div>

        {/* Dots */}
        <div className="flex gap-2 mx-auto">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-1.5 bg-gold-500'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <p className="font-body text-white/40 text-xs tracking-widest hidden md:block">
          <span className="text-white/80 font-medium">{String(current + 1).padStart(2, '0')}</span>
          {' '}/{' '}
          {String(slides.length).padStart(2, '0')}
        </p>
      </div>

    </section>
  )
}
