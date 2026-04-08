export default function PageHero({ image, title, subtitle, label }) {
  return (
    <section className="relative h-72 md:h-96 overflow-hidden">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/70 via-charcoal-950/50 to-charcoal-950/70" />
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="animate-slide-up">
          {label && <p className="section-label text-gold-400 mb-3">{label}</p>}
          <h1 className="section-title-white mb-3">{title}</h1>
          {subtitle && (
            <>
              <div className="gold-divider" />
              <p className="font-body text-white/60 text-sm tracking-wider mt-3">{subtitle}</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
