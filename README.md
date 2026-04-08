<div align="center">

# TNG Hotels & Banquets
### Akola's Premier Luxury Hospitality Destination

[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel)](https://tng-hotelsandbanquets.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat&logo=react)](https://react.dev)
[![Node](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat&logo=postgresql)](https://postgresql.org)

**SY Web Programming Lab — Mini Project**

</div>

---

## 🏨 About

TNG Hotels & Banquets is a full-stack luxury hotel website built for a real hotel under construction in Akola, Maharashtra. This project was developed as a Web Programming Lab mini project for SY Engineering, demonstrating a complete production-ready hospitality web application.

**Live Demo:** [tng-hotelsandbanquets.vercel.app](https://tng-hotelsandbanquets.vercel.app)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎠 Hero Slider | 5-image auto-sliding hero with arrows, dots, ken-burns effect |
| 🛏️ Rooms & Booking | Real-time availability, full booking form, date picker |
| 💳 Payments | Razorpay payment gateway integration |
| 🔐 Authentication | JWT-based login/register, member profiles |
| 📊 Database | PostgreSQL with 5 tables — users, rooms, bookings, testimonials, contacts |
| 🍽️ Dining | Multi-restaurant showcase with menu highlights |
| 🏊 Amenities | Full amenities showcase with gallery |
| 📍 How to Reach | Google Maps embed, all transport modes |
| 💬 Chatbot | AI Concierge "Coming Soon" widget |
| 📱 Responsive | Fully mobile-responsive across all devices |
| 🌟 Testimonials | Auto-rotating guest reviews from database |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **Tailwind CSS** — custom luxury design system
- **React Router v6** — client-side routing
- **Axios** — API communication
- **react-datepicker** — booking date selection
- **react-hot-toast** — notifications
- **Lucide React** — icons
- **Fonts:** Cormorant Garamond + Cinzel + Jost (Google Fonts)

### Backend
- **Node.js** + Express
- **PostgreSQL** + node-postgres (pg)
- **JWT** — authentication
- **bcryptjs** — password hashing
- **Helmet** — security headers
- **express-rate-limit** — API rate limiting
- **Razorpay** — payment processing

---

## 🚀 Local Setup

### Prerequisites
- Node.js v20+
- PostgreSQL 15+

### 1. Clone
```bash
git clone https://github.com/Arav1904/SY_WPL-Mini_Project.git
cd SY_WPL-Mini_Project
```

### 2. Database
Create a PostgreSQL database named `tng_hotel`, then run:
```bash
psql -U postgres -d tng_hotel -f backend/config/schema.sql
```

### 3. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials
npm run dev
# Runs on http://localhost:5000
```

### 4. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# Runs on http://localhost:5173
```

---

## 📁 Project Structure

```
SY_WPL-Mini_Project/
├── backend/
│   ├── config/
│   │   ├── db.js              # PostgreSQL connection pool
│   │   └── schema.sql         # Database schema + seed data
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Login, register, profile
│   │   ├── rooms.js           # Room listing + availability
│   │   ├── bookings.js        # Booking CRUD
│   │   ├── testimonials.js    # Guest reviews
│   │   ├── contact.js         # Contact form
│   │   └── payment.js         # Razorpay integration
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/        # Navbar, Footer, HeroSlider, etc.
    │   ├── context/           # Auth context
    │   ├── pages/             # All page components
    │   └── utils/             # Axios instance
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

---

## 🗄️ Database Schema

```sql
users        — Member accounts (id, name, email, password_hash, phone, role)
rooms        — Room types (id, name, type, price, amenities, images, availability)
bookings     — Reservations (id, user_id, room_id, dates, guests, payment_status)
testimonials — Guest reviews (id, name, rating, review, is_approved)
contacts     — Contact form submissions
```

---

## 🌐 Deployment

- **Frontend** → Vercel (auto-deploy from GitHub)
- **Backend** → Railway.app
- **Database** → Railway PostgreSQL

---

## 👨‍💻 Developer

**Arav Ghiya** — SY Computer Engineering, Web Programming Lab  
Mini Project — TNG Hotels & Banquets

---

<div align="center">
  <sub>Built with ❤️ for TNG Hotels & Banquets, Akola, Maharashtra</sub>
</div>
