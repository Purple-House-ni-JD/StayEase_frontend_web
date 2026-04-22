# StayEase — Luxury Hotel Booking App

A full-featured hotel reservation UI built with **React 18 + Tailwind CSS v4 + Vite**.

## Project Structure

```
stayease/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx          # Entry point
    ├── App.jsx           # Root router (page state)
    ├── index.css         # Global styles + Tailwind v4 + custom utilities
    ├── constants.js      # Design tokens (colors)
    ├── data/
    │   └── index.js      # Mock data (rooms, bookings, amenities)
    ├── components/
    │   ├── UI.jsx        # Shared atoms: Logo, GBar, Badge, Field
    │   ├── TopNav.jsx    # Public top navigation bar
    │   ├── RoomCard.jsx  # Room listing card
    │   └── Shell.jsx     # Dashboard sidebar layout shell
    └── pages/
        ├── Landing.jsx   # Public landing page
        ├── Login.jsx     # Login page (guest / admin toggle)
        ├── Register.jsx  # 2-step registration
        ├── UserDash.jsx  # Guest dashboard (Home, Browse, Bookings, Profile)
        └── AdminDash.jsx # Admin dashboard (Overview, Rooms, Reservations, Reports)
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Features

- **Landing Page** — Hero, featured rooms, amenities, stats, CTA
- **Auth Pages** — Login with role toggle (guest/admin), 2-step registration
- **Guest Dashboard** — Browse & filter rooms, booking history, profile
- **Admin Dashboard** — Stats overview, room management, reservations table, sales reports
- **Collapsible sidebar** in both dashboards
- **Room modal** for add/edit
- All prices in Philippine Peso (₱)

## Tech Stack

| Tool | Version |
|------|---------|
| React | 18 |
| Tailwind CSS | v4 |
| Vite | 5 |
| Fonts | Cormorant Garamond + DM Sans |
