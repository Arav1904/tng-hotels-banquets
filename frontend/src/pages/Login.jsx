import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Login() {
  const [tab, setTab] = useState('login') // 'login' | 'forgot'
  const [form, setForm] = useState({ email: '', password: '' })
  const [forgotEmail, setForgotEmail] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const handle = e => { setError(''); setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      // Show welcome ONCE per session
      if (!sessionStorage.getItem('tng_welcomed')) {
        sessionStorage.setItem('tng_welcomed', '1')
        toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`, { duration: 3000 })
      }
      navigate(from, { replace: true })
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.error || ''
      if (status === 404 || msg.includes('No account')) {
        setError('No account found with this email. Please register first.')
      } else if (status === 401 || msg.includes('Incorrect') || msg.includes('password')) {
        setError('Incorrect password. Please try again.')
      } else {
        setError(msg || 'Login failed. Please try again.')
      }
    } finally { setLoading(false) }
  }

  const submitForgot = async e => {
    e.preventDefault()
    if (!forgotEmail) { setError('Please enter your email address'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail })
      setForgotSent(true); setError('')
    } catch (err) {
      const status = err.response?.status
      if (status === 404) {
        setError('No account found with this email address.')
      } else {
        setForgotSent(true) // Show success anyway for UX
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80"
          alt="TNG Hotel" className="absolute inset-0 w-full h-full object-cover" />
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
            <h2 className="font-display text-white text-4xl font-light leading-tight mb-4">
              Your home away<br />from home in Akola.
            </h2>
            <div className="w-12 h-px bg-gold-500 mb-5" />
            {['Exclusive member rates & early access', 'Manage bookings anytime, anywhere', 'Earn loyalty points on every stay', 'Priority concierge support'].map(p => (
              <div key={p} className="flex items-center gap-2 text-white/60 font-body text-sm mb-2">
                <CheckCircle size={13} className="text-gold-400 shrink-0" /> {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <img src="/tng-logo.png" alt="TNG" className="h-10 w-10 object-contain" onError={e => e.target.style.display='none'} />
              <div>
                <p className="font-accent text-gold-500 text-xl font-bold">TNG</p>
                <p className="font-body text-charcoal-400 text-[9px] tracking-[0.4em] uppercase">Hotels & Banquets</p>
              </div>
            </Link>
          </div>

          {tab === 'login' ? (
            <>
              <div className="mb-8">
                <h1 className="font-display text-charcoal-950 text-4xl font-light">Welcome Back</h1>
                <p className="font-body text-charcoal-400 text-sm mt-2">Sign in to your TNG member account</p>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3 mb-5 rounded-sm">
                  <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-red-600">{error}</p>
                    {error.includes('register') && (
                      <Link to="/register" className="font-body text-xs text-gold-600 hover:underline mt-1 block">
                        Create an account →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Email Address</label>
                  <input name="email" type="email" required value={form.email} onChange={handle}
                    className="input-luxury" placeholder="your@email.com" autoComplete="email" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-body text-xs tracking-widest uppercase text-charcoal-500">Password</label>
                    <button type="button" onClick={() => { setTab('forgot'); setError('') }}
                      className="font-body text-xs text-gold-600 hover:text-gold-700 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input name="password" type={show ? 'text' : 'password'} required value={form.password} onChange={handle}
                      className="input-luxury pr-12" placeholder="••••••••" autoComplete="current-password" />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-gold-500">
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="btn-gold w-full justify-center py-3.5 disabled:opacity-60">
                  {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</span> : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-charcoal-100 text-center">
                <p className="font-body text-sm text-charcoal-400">
                  New to TNG?{' '}
                  <Link to="/register" className="text-gold-600 hover:text-gold-700 font-semibold">Create a free account</Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => { setTab('login'); setError(''); setForgotSent(false) }}
                className="flex items-center gap-1 text-charcoal-400 hover:text-gold-500 font-body text-xs tracking-widest uppercase mb-8 transition-colors">
                ← Back to Sign In
              </button>
              <div className="mb-8">
                <h1 className="font-display text-charcoal-950 text-4xl font-light">Reset Password</h1>
                <p className="font-body text-charcoal-400 text-sm mt-2">We'll send you reset instructions</p>
              </div>
              {forgotSent ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={26} className="text-green-500" />
                  </div>
                  <h3 className="font-display text-2xl text-charcoal-900 font-light mb-2">Check Your Email</h3>
                  <p className="font-body text-charcoal-400 text-sm mb-4">
                    Instructions sent to <strong>{forgotEmail}</strong>
                  </p>
                  <p className="font-body text-charcoal-300 text-xs mb-6">
                    Or contact us directly:<br />
                    <a href="tel:+919082690060" className="text-gold-600 hover:underline">+91 90826 90060</a>
                    {' '}|{' '}
                    <a href="mailto:reservations@tnghotels.com" className="text-gold-600 hover:underline">reservations@tnghotels.com</a>
                  </p>
                  <button onClick={() => { setTab('login'); setForgotSent(false); setForgotEmail('') }}
                    className="btn-gold w-full justify-center py-3">Back to Sign In</button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3 mb-5">
                      <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="font-body text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  <form onSubmit={submitForgot} className="space-y-5">
                    <div>
                      <label className="font-body text-xs tracking-widest uppercase text-charcoal-500 block mb-1.5">Email Address</label>
                      <input type="email" required value={forgotEmail}
                        onChange={e => { setForgotEmail(e.target.value); setError('') }}
                        className="input-luxury" placeholder="your@email.com" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 disabled:opacity-60">
                      {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</span> : 'Send Reset Instructions'}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}