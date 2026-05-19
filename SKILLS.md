# ⚡ BatterySwap PH — Master Skills Reference

> **Project**: Battery Swapping Platform for E-Bikes and Electric Vehicles  
> **Location Focus**: BGC, Taguig, Philippines (expanding nationwide)  
> **Stack**: Next.js 14 · TypeScript · Prisma · PostgreSQL · Tailwind CSS · Google Maps API  

---

## 🗂️ Skills Index

| File | What it covers |
|---|---|
| `skills/FRONTEND_SKILLS.md` | React, Next.js, Tailwind, Maps, UI/UX |
| `skills/BACKEND_SKILLS.md` | Node.js, API design, Auth, Payments |
| `skills/DATABASE_SKILLS.md` | Prisma, PostgreSQL, schema design |
| `skills/SENIOR_DEV_SKILLS.md` | Architecture, DevOps, code review, system design |

---

## ⚡ Project Feature Modules

### 1. 📍 Station Finder
Find nearby battery swapping stations on an interactive map.
- Google Maps / Mapbox integration  
- Real-time station availability  
- Filter by battery type, compatibility  
- Distance & ETA calculation  

### 2. 📅 Booking System
Reserve a battery swap slot in advance.
- Slot scheduling (time-based)  
- QR code generation for check-in  
- Push/SMS notification reminders  
- Cancellation & rescheduling  

### 3. 🔋 Battery Swap (Core)
The main transaction — swap a depleted battery for a charged one.
- RFID / QR-based vehicle & battery pairing  
- Swap session logging  
- Multi-vehicle profile support  
- Battery tracking (which unit you have)  

### 4. 🔬 Diagnostic Check
On-device battery health analysis.
- Charge cycle count  
- Capacity degradation (%)  
- Cell voltage balance  
- Estimated remaining lifespan  
- Full diagnostic report PDF export  

### 5. ✅ Legit Check / Battery Verification
Verify authenticity and origin of batteries.
- Serial number lookup (manufacturer DB)  
- Tamper detection flags  
- Warranty validity check  
- Stolen battery registry lookup  

### 6. 👤 User Dashboard
Rider/fleet management portal.
- Swap history  
- Subscription management  
- Payment & invoicing  
- E-bike/EV profile management  

---

## 🛠️ Core Tech Decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, API routes, streaming |
| Language | TypeScript strict | Safety + DX |
| Styling | Tailwind CSS + shadcn/ui | Speed + consistency |
| ORM | Prisma | Type-safe DB access |
| Database | PostgreSQL (Supabase) | Relational + realtime |
| Auth | NextAuth.js v5 | Social + phone OTP |
| Maps | Google Maps JS API | PH coverage + Places |
| Payments | PayMongo + GCash | PH-native payments |
| Notifications | Firebase Cloud Messaging | Push + SMS fallback |
| Deployment | Vercel (frontend) + Railway (backend) | Fast PH edge |

---

## 🌐 BGC Prototype Stations (7 Locations)

See `docs/stations/bgc-stations.md` for full details.

| # | Station Name | Area |
|---|---|---|
| 1 | SwapHub BGC Central | High Street, BGC |
| 2 | SwapPoint Bonifacio High Street | BHS South |
| 3 | EcoCharge Fort Strip | Fort Strip |
| 4 | GreenRide SM Aura | SM Aura Taguig |
| 5 | VoltBase Mckinley Hill | McKinley Hill |
| 6 | SwapDock Uptown Mall | Uptown BGC |
| 7 | ChargeNode Market! Market! | Market! Market! |

---

## 📋 Quick Start

```bash
# Clone and enter project
cd battery-swap-ph

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Set environment variables
cp .env.example .env.local   # frontend
cp .env.example .env         # backend

# Run DB migrations
cd backend && npx prisma migrate dev

# Start development servers
npm run dev          # frontend on :3000
npm run dev:api      # backend on :4000
```

---

*Last updated: 2026 — BatterySwap PH Team*
