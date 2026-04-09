import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tng_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // On app load, verify token is still valid
  useEffect(() => {
    const token = localStorage.getItem('tng_token')
    if (token) {
      api.get('/auth/me')
        .then(r => {
          setUser(r.data.user)
          localStorage.setItem('tng_user', JSON.stringify(r.data.user))
        })
        .catch(() => {
          localStorage.removeItem('tng_token')
          localStorage.removeItem('tng_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    localStorage.setItem('tng_token', r.data.token)
    localStorage.setItem('tng_user', JSON.stringify(r.data.user))
    setUser(r.data.user)
    // Show welcome toast ONLY once — flag in sessionStorage clears on browser close
    if (!sessionStorage.getItem('tng_welcomed')) {
      sessionStorage.setItem('tng_welcomed', '1')
      toast.success(`Welcome back, ${r.data.user.name.split(' ')[0]}!`, {
        duration: 3000,
        icon: '👋',
      })
    }
    return r.data.user
  }

  const register = async (name, email, password, phone) => {
    const r = await api.post('/auth/register', { name, email, password, phone })
    localStorage.setItem('tng_token', r.data.token)
    localStorage.setItem('tng_user', JSON.stringify(r.data.user))
    setUser(r.data.user)
    if (!sessionStorage.getItem('tng_welcomed')) {
      sessionStorage.setItem('tng_welcomed', '1')
      toast.success(`Welcome to TNG, ${r.data.user.name.split(' ')[0]}!`, {
        duration: 3000,
        icon: '🎉',
      })
    }
    return r.data.user
  }

  const logout = () => {
    localStorage.removeItem('tng_token')
    localStorage.removeItem('tng_user')
    sessionStorage.removeItem('tng_welcomed') // reset so next login shows welcome
    setUser(null)
    toast.success('Signed out successfully', { duration: 2000 })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
