import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import Booking from './pages/Booking'
import Dining from './pages/Dining'
import Amenities from './pages/Amenities'
import About from './pages/About'
import Contact from './pages/Contact'
import HowToReach from './pages/HowToReach'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBookings from './pages/MyBookings'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Jost, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#c9a227', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
          <Route path="/rooms/:id" element={<Layout><RoomDetail /></Layout>} />
          <Route path="/booking/:roomId" element={<Layout><Booking /></Layout>} />
          <Route path="/dining" element={<Layout><Dining /></Layout>} />
          <Route path="/amenities" element={<Layout><Amenities /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/how-to-reach" element={<Layout><HowToReach /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
