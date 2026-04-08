import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut, BookOpen, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Dining', path: '/dining' },
  { label: 'Amenities', path: '/amenities' },
  {
    label: 'Explore',
    children: [
      { label: 'About Us', path: '/about' },
      { label: 'How to Reach', path: '/how-to-reach' },
      { label: 'Contact', path: '/contact' },
    ],
  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [dropdown, setDropdown] = useState(null)
  const [userMenu, setUserMenu] = useState(false)
  const dropdownTimer = useRef(null)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setAtTop(y < 80)
      setScrolled(y > window.innerHeight * 0.85)
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false); setDropdown(null); setUserMenu(false) }, [location])

  // Dropdown: use a timer so moving cursor from button to menu doesn't close it
  const openDropdown = (label) => {
    clearTimeout(dropdownTimer.current)
    setDropdown(label)
  }
  const closeDropdown = () => {
    dropdownTimer.current = setTimeout(() => setDropdown(null), 150)
  }

  const handleLogout = () => { logout(); navigate('/'); setUserMenu(false) }

  let navBg
  if (!isHome) {
    navBg = 'bg-charcoal-950 shadow-xl'
  } else if (scrolled) {
    navBg = 'bg-charcoal-950 shadow-xl'
  } else if (atTop) {
    navBg = 'bg-gradient-to-b from-black/75 via-black/30 to-transparent'
  } else {
    navBg = 'bg-charcoal-950/85 backdrop-blur-md'
  }

  return (
    <>
      {/* Top info bar — only on non-home or scrolled */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        (!isHome || scrolled) ? 'translate-y-0' : '-translate-y-full'
      } bg-gold-500 py-1.5`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <p className="font-body text-charcoal-950 text-[10px] tracking-wider hidden md:block">
            Welcome to TNG Hotels & Banquets — Akola's Finest Luxury Experience
          </p>
          <a href="tel:+919876543210" className="flex items-center gap-1.5 font-body text-charcoal-950 text-[10px] tracking-wider hover:text-charcoal-700 transition-colors ml-auto">
            <Phone size={10} /> +91 98765 43210
          </a>
        </div>
      </div>

      <header className={`fixed left-0 right-0 z-50 transition-colors duration-300 ${navBg} ${
        (!isHome || scrolled) ? 'top-7' : 'top-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/tng-logo.png"
                alt="TNG Hotels & Banquets"
                className="h-12 w-12 object-contain"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="flex flex-col leading-none">
                <span className="font-accent text-gold-400 tracking-[0.2em] text-2xl font-bold group-hover:text-gold-300 transition-colors">
                  TNG
                </span>
                <span className="font-body text-white/80 text-[10px] tracking-[0.35em] uppercase font-light">
                  Hotels & Banquets
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => openDropdown(link.label)}
                    onMouseLeave={closeDropdown}
                  >
                    <button className="font-body font-medium tracking-widest uppercase text-xs text-white hover:text-gold-400 transition-colors duration-200 flex items-center gap-1">
                      {link.label}
                      <ChevronDown size={11} className={`mt-px transition-transform duration-200 ${dropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Invisible bridge between button and dropdown to prevent gap-closing */}
                    {dropdown === link.label && (
                      <div className="absolute top-full left-0 w-full h-3" />
                    )}
                    {dropdown === link.label && (
                      <div className="absolute top-full left-0 mt-3 w-52 bg-charcoal-950 border border-gold-500/30 shadow-2xl py-2 z-50">
                        {link.children.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-5 py-3 font-body text-xs tracking-widest uppercase text-white/70 hover:text-gold-400 hover:bg-gold-500/10 transition-all"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-body font-medium tracking-widest uppercase text-xs transition-colors duration-200 relative group
                      ${location.pathname === link.path ? 'text-gold-400' : 'text-white hover:text-gold-400'}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-px bg-gold-500 transition-all duration-300
                      ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                )
              )}
            </nav>

            {/* Right: Auth + Book Now */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 text-white hover:text-gold-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-500/30 border border-gold-500/60 flex items-center justify-center">
                      <User size={14} className="text-gold-300" />
                    </div>
                    <span className="font-body text-xs tracking-wider">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={11} />
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-charcoal-950 border border-gold-500/20 shadow-2xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-body text-xs text-white/50 tracking-wider">Signed in as</p>
                        <p className="font-body text-sm text-white truncate mt-0.5">{user.name}</p>
                        <p className="font-body text-xs text-white/40 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/my-bookings"
                        className="flex items-center gap-2 px-4 py-2.5 text-white/70 hover:text-gold-400 hover:bg-gold-500/10 transition-all text-xs tracking-widest uppercase font-body"
                        onClick={() => setUserMenu(false)}
                      >
                        <BookOpen size={13} /> My Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs tracking-widest uppercase font-body"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="font-body font-medium tracking-widest uppercase text-xs text-white hover:text-gold-400 transition-colors"
                >
                  Sign In
                </Link>
              )}
              <Link
                to="/rooms"
                className="bg-gold-500 hover:bg-gold-600 text-white font-body font-medium tracking-widest uppercase text-[10px] px-6 py-2.5 transition-all duration-300 border border-gold-500 hover:border-gold-600 hover:shadow-lg hover:shadow-gold-500/30 active:scale-95"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-1.5 text-white hover:text-gold-400 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="lg:hidden bg-charcoal-950 border-t border-gold-500/20 pb-6">
            <div className="px-6 pt-4 space-y-1">
              {navLinks.map(link =>
                link.children ? (
                  <div key={link.label}>
                    <p className="font-body text-xs tracking-widest uppercase text-gold-500/70 py-2 pt-4">{link.label}</p>
                    {link.children.map(c => (
                      <Link
                        key={c.path}
                        to={c.path}
                        className="block py-2.5 font-body text-sm text-white/70 hover:text-gold-400 pl-3 border-l border-gold-500/20 transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-3 font-body text-sm tracking-wider border-b border-white/5 transition-colors
                      ${location.pathname === link.path ? 'text-gold-400' : 'text-white/80 hover:text-gold-400'}`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-5 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-3 border-b border-white/10 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                        <User size={16} className="text-gold-400" />
                      </div>
                      <div>
                        <p className="font-body text-white text-sm font-medium">{user.name}</p>
                        <p className="font-body text-white/40 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/my-bookings" className="block text-center border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-white font-body text-[10px] tracking-widest uppercase w-full py-3 transition-all">
                      My Bookings
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-center font-body text-xs tracking-widest uppercase text-white/50 hover:text-red-400 py-2 transition-colors">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block text-center border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-white font-body text-[10px] tracking-widest uppercase w-full py-3 transition-all">
                    Sign In
                  </Link>
                )}
                <Link to="/rooms" className="block text-center bg-gold-500 hover:bg-gold-600 text-white font-body text-[10px] tracking-widest uppercase w-full py-3 transition-all">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
