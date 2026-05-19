# BatterySwap PH

**SWAP. CHARGE. RIDE.**

BatterySwap PH is a battery swapping platform for e-bikes and electric motorcycles in the Philippines. Instead of waiting hours to charge, riders can swap their depleted battery for a fully charged one in under 2 minutes at designated stations across Bonifacio Global City (BGC), Taguig.

---

## Features

- **Station Finder** — Live map of swap stations with real-time availability, filtering by battery type (48V / 60V / 72V), and geolocation support
- **Booking System** — Reserve a battery swap slot at your preferred station in advance
- **Battery Diagnostics** — Full health scan by serial number: health score, cycle count, capacity, internal resistance, cell balance, and temperature profile
- **Legit Check** — Verify battery authenticity, check for recalls, stolen status, tampering, and warranty validity
- **Dashboard** — QR code for swaps, active subscription overview, battery health, swap history, and remaining swaps
- **Subscription Plans** — Basic Commuter (₱1,499/mo), Pro Commuter (₱3,999/mo), and Fleet & Business (custom)
- **Dark Mode** — Full dark theme UI out of the box

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS, Framer Motion |
| Maps | Leaflet / React Leaflet, Google Maps |
| 3D Graphics | Three.js |
| State Management | Zustand |
| Testing | Jest, Playwright |
| Linting | ESLint, Prettier, Husky |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/battery-swap-ph.git
cd battery-swap-ph/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in the required values in .env.local
```

### Running the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the `frontend/` directory with the following:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY=your_paymongo_key
NEXT_PUBLIC_GCASH_CLIENT_ID=your_gcash_client_id

NEXT_PUBLIC_ENABLE_DIAGNOSTICS=true

PLAYWRIGHT_BASE_URL=http://localhost:3000
```

> Never commit `.env.local` to version control.

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format code with Prettier
npm run test         # Run unit tests (Jest)
npm run test:watch   # Run Jest in watch mode
npm run test:e2e     # Run end-to-end tests (Playwright)
```

---

## Project Structure

```
frontend/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── page.tsx       # Landing page
│   │   ├── auth/          # Login & Register
│   │   ├── dashboard/     # User dashboard & history
│   │   ├── stations/      # Station finder & map
│   │   ├── booking/       # Swap booking wizard
│   │   ├── diagnostics/   # Battery health scanner
│   │   ├── legit-check/   # Battery verification
│   │   ├── pricing/       # Subscription plans
│   │   └── partners/      # Brand partnerships
│   ├── components/        # Reusable React components
│   └── lib/store/         # Zustand state stores
├── public/                # Static assets
├── e2e/                   # Playwright E2E tests
└── next.config.mjs        # Next.js configuration
```

---

## Deployment

This project is ready to deploy on [Vercel](https://vercel.com):

1. Push this repo to GitHub
2. Import the project on Vercel
3. Set the **root directory** to `frontend`
4. Add your environment variables in the Vercel dashboard
5. Deploy

---

## Current Coverage

- **7 active stations** in BGC, Taguig
- **Phase 2** expansion planned for Makati

---

## License

This project is private and not open for redistribution.
