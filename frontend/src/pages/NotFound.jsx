import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center text-center px-6 pt-20">
      <div>
        <p className="font-accent text-gold-400/30 text-9xl font-bold select-none">404</p>
        <h1 className="font-display text-white text-4xl font-light -mt-4 mb-3">Page Not Found</h1>
        <div className="gold-divider mb-5" />
        <p className="font-body text-white/40 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-gold">Back to Home</Link>
      </div>
    </div>
  )
}
