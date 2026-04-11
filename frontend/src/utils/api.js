import axios from 'axios'

// This URL is baked in at build time by Vite
// On Vercel: VITE_API_URL must be set in Environment Variables BEFORE building
// On localhost: uses Vite proxy via /api
const API_URL = import.meta.env.VITE_API_URL || 'https://sywpl-miniproject-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tng_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tng_token')
      localStorage.removeItem('tng_user')
      sessionStorage.removeItem('tng_welcomed')
    }
    return Promise.reject(err)
  }
)

export default api