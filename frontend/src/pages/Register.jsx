import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [show, setShow] = useState({ password: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handle = e => {
    setError('')
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  // Password strength checker
  const strength = (() => {
    const p = form.password
    if (!p) return null
    if (p.length < 6) return { level: 1, label: 'Too short', color: 'bg-red-500' }
    if (p.length < 8) return { level: 2, label: 'Weak', color: 'bg-orange-500' }
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { level: 3, label: 'Fair', color: 'bg-yellow-500' }
    return { level: 4, label: 'Strong', color: 'bg-green-500' }
  })()

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const user = await register(form.name, form.email, form.password, form.phone)
      toast.success(`Welcome to TNG, ${user.name.split(' ')[0]}! Your account has been created.`)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed'
      if (msg.includes('already') || err.response?.status === 409) {
        setError('An account with this email already exists. Please sign in instead.')
      } else {
        setError(msg)
      }
    } finally { setLoading(false) }
  }

  const perks = ['Exclusive member rates', 'Priority booking access', 'Loyalty rewards points', 'Event invitations & offers']

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80"
          alt="TNG Amenities"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-950/65" />
        <div className="relative z-10 h-full flex flex-col justify-between p-14">
          <Link to="/" className="flex items-center gap-3">
            <img src="/tng-logo.png" alt="TNG" className="h-12 w-12 object-contain" onError={e => e.target.style.display='none'} />
            <div>
              <p className="font-accent text-gold-400 tracking-[0.25em] text-2xl font-bold">TNG</p>
              <p className="font-body text-white/50 text-[9px] tracking-[0.4em] uppercase">Hotels & Banquets</p>
            </div>
          </Link>
          <div>
            <p className="font-accent text-gold-400 tracking-[0.3em] text-xs uppercase mb-3">Members Club</p>
            <h2 className="font-display text-white text-4xl font-light mb-6">Join the TNG<br />Family Today</h2>
            <div className="w-12 h-px bg-gold-500 mb-6" />
            <div className="space-y-3">
              {perks.map(p => (
                <div key={p} className="flex items-center gap-2 text-white/60 font-body text-sm">
                  <CheckCircle size={14} className="text-gold-400 shrink-0" /> {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <img src="/tng-logo.png" alt="TNG" className="h-12 w-12 object-contain" onError={e => e.target.style.display='none'} />
              <div>
                <p className="font-accent text-gold-500 tracking-[0.25em] text-xl font-bold">TNG</p>
                <p className="font-body text-charcoal-400 text-[9px] tracking-[0.4em] uppercase">Hotels & Banquets</p>
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-charcoal-950 text-4xl font-light">Create Account</h1>
            <p className="font-body text-charcoal-400 text-sm mt-2">Become a TNG member — it's free</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3 mb-5">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-sm text-red-600">{error}</p>
                {error.includes('already exists') && (
                  <Link to="/login" className="font-body text-xs text-gold-600 hover:underline mt-1 block">
                    Sign in to your account →
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Full Name *</label>
              <input name="name" required value={form.name} onChange={handle}
                className="input-luxury" placeholder="Your full name" />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Email Address *</label>
              <input name="email" type="email" required value={form.email} onChange={handle}
                className="input-luxury" placeholder="your@email.com" autoComplete="email" />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Phone Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handle}
                className="input-luxury" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Password *</label>
              <div className="relative">
                <input name="password" type={show.password ? 'text' : 'password'} required value={form.password} onChange={handle}
                  className="input-luxury pr-12" placeholder="Min. 6 characters" autoComplete="new-password" />
                <button type="button" onClick={() => setShow(s => ({ ...s, password: !s.password }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-gold-500">
                  {show.password ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(l => (
                      <div key={l} className={`h-1 flex-1 rounded-full transition-all duration-300 ${l <= strength.level ? strength.color : 'bg-charcoal-100'}`} />
                    ))}
                  </div>
                  <p className="font-body text-xs text-charcoal-400">{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input name="confirm" type={show.confirm ? 'text' : 'password'} required value={form.confirm} onChange={handle}
                  className={`input-luxury pr-12 ${form.confirm && form.password !== form.confirm ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                  placeholder="Repeat password" autoComplete="new-password" />
                <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-gold-500">
                  {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="font-body text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>

            <p className="font-body text-xs text-charcoal-400 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-gold-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-gold-600 hover:underline">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={loading}
              className="btn-gold w-full justify-center py-3.5 disabled:opacity-60 text-sm mt-2">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</span>
                : 'Create My Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-charcoal-100 text-center">
            <p className="font-body text-sm text-charcoal-400">
              Already a member?{' '}
              <Link to="/login" className="text-gold-600 hover:text-gold-700 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
