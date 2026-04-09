import axios from 'axios'

// IMPORTANT: Use /api (no host) so Vite proxy handles it → avoids CORS completely
// The proxy in vite.config.js forwards /api/* to http://localhost:5000
const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
})

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tng_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle responses globally
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