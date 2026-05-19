# 🗺️ Implementation Plan — BatterySwap PH

> **Timeline**: 20 Weeks (5 Months) — MVP to Production  
> **Team**: 1 Tech Lead + 2 Full-Stack Devs + 1 UI/UX Designer  
> **Methodology**: Agile Sprints (2-week cycles)

---

## 🎯 Project Goals

| Goal | Target | Metric |
|---|---|---|
| BGC Pilot Launch | Week 12 | 7 stations live |
| Registered Users | Month 3 | 500 users |
| Monthly Swaps | Month 5 | 2,000 swaps |
| Uptime | Post-launch | 99.5% |
| Swap Completion | Post-launch | < 90 seconds |

---

## 📅 Phase Roadmap

```
Phase 0   │ Foundation & Setup         │ Weeks 01–02
Phase 1   │ Core Station + Booking     │ Weeks 03–06
Phase 2   │ Battery + Diagnostics      │ Weeks 07–10
Phase 3   │ Payments + Notifications   │ Weeks 11–12
Phase 4   │ BGC Pilot Launch           │ Weeks 13–14
Phase 5   │ Feedback + Hardening       │ Weeks 15–17
Phase 6   │ EV Expansion Prep          │ Weeks 18–20
```

---

## 📋 Phase 0 — Foundation & Setup (Weeks 1–2)

### Sprint 0A: Project Scaffolding

**Developer Tasks:**
- [ ] Initialize Next.js 14 app with App Router + TypeScript strict
- [ ] Set up Tailwind CSS + shadcn/ui component library
- [ ] Configure ESLint + Prettier + Husky pre-commit hooks
- [ ] Set up Express/Hono backend with TypeScript
- [ ] Initialize Prisma with base schema (User, Station, Vehicle)
- [ ] Provision Supabase project (staging + production)
- [ ] Set up Railway project for backend
- [ ] Configure GitHub Actions CI pipeline (lint → test → build)

**Designer Tasks:**
- [ ] Finalize brand identity (logo, colors, typography)
- [ ] Create Figma design system (tokens, components)
- [ ] Wireframes: Landing, Station Map, Booking Flow, Dashboard

**Deliverable:** Running dev environment, deployed staging URLs

---

### Sprint 0B: Auth + User Foundation

- [ ] NextAuth.js v5 setup (Google OAuth + phone OTP via Semaphore SMS)
- [ ] User registration + login flows
- [ ] JWT refresh token strategy
- [ ] User profile API (GET/PATCH /api/v1/users/me)
- [ ] Vehicle management API (CRUD)
- [ ] Protected route middleware
- [ ] Basic dashboard shell (authenticated layout)

**Deliverable:** Users can register, login, add vehicles

---

## 🏗️ Phase 1 — Core Station + Booking (Weeks 3–6)

### Sprint 1A: Station System (Week 3–4)

**Backend:**
- [ ] Station model + PostGIS extension setup
- [ ] Station CRUD API (admin-only create/update)
- [ ] Geospatial proximity endpoint (`/stations/nearby?lat=&lng=&radius=`)
- [ ] Station slot generation (auto-generate 30-min slots)
- [ ] Real-time availability via Socket.io
- [ ] Seed 7 BGC prototype stations

**Frontend:**
- [ ] Google Maps integration (custom styled map)
- [ ] Station markers with availability color coding
- [ ] Marker clustering
- [ ] Station detail panel/sheet
- [ ] Station list with distance sort
- [ ] StationCard component with battery type badges

**Deliverable:** Interactive map showing BGC stations with live availability

---

### Sprint 1B: Booking System (Week 5–6)

**Backend:**
- [ ] Booking creation endpoint (with slot reservation logic)
- [ ] Conflict detection (prevent double-booking same slot)
- [ ] QR token generation on booking confirm
- [ ] Booking status state machine (PENDING → CONFIRMED → CHECKED_IN → COMPLETED)
- [ ] QR check-in endpoint (validate + mark checked-in)
- [ ] Booking cancellation (15-min grace period rule)
- [ ] Booking history endpoint

**Frontend:**
- [ ] Multi-step booking wizard:
  - Step 1: Station selection
  - Step 2: Battery type + vehicle selection
  - Step 3: Time slot picker (calendar + time grid)
  - Step 4: Summary + confirm
  - Step 5: QR code display
- [ ] Slot availability live update (Socket.io)
- [ ] Booking history page
- [ ] Upcoming bookings widget on dashboard

**Deliverable:** Full booking flow from map → QR code

---

## 🔋 Phase 2 — Battery System + Diagnostics (Weeks 7–10)

### Sprint 2A: Battery Tracking (Week 7–8)

**Backend:**
- [ ] BatteryUnit model + CRUD
- [ ] Battery inventory per station (GET /stations/:id/batteries)
- [ ] Battery check-in/checkout tracking
- [ ] SwapLog creation on swap completion
- [ ] Battery search by serial number
- [ ] Battery status transitions (AVAILABLE → IN_USE → CHARGING)

**Frontend:**
- [ ] Battery status panel in station detail
- [ ] My battery widget (which unit the user currently has)
- [ ] Swap history with battery serial tracking

---

### Sprint 2B: Diagnostic Check (Week 9)

**Backend:**
- [ ] DiagnosticReport model
- [ ] Diagnostic API: POST /batteries/:serial/diagnostic
- [ ] Health scoring algorithm:
  - Cycle count penalty curve
  - Capacity degradation calculation
  - Voltage balance variance
  - Temperature anomaly detection
- [ ] Recommendation engine (replace/monitor/ok)
- [ ] PDF report generation (Puppeteer / pdfkit)

**Frontend:**
- [ ] Diagnostic request flow (enter serial → scan QR)
- [ ] Health score radial gauge (0–100%)
- [ ] Charge history sparkline chart (Recharts)
- [ ] Full diagnostic detail card
- [ ] Download PDF report button
- [ ] Health status badge (EXCELLENT / GOOD / FAIR / POOR / CRITICAL)

---

### Sprint 2C: Legit Check / Battery Verification (Week 10)

**Backend:**
- [ ] Manufacturer serial number validation API
- [ ] Tamper detection flags in BatteryUnit model
- [ ] Stolen battery registry (internal + future LTO integration)
- [ ] Warranty validity endpoint
- [ ] Legit check report generation

**Frontend:**
- [ ] Legit Check screen (camera QR scan + manual serial input)
- [ ] Verification result display:
  - ✅ Authentic — green card
  - ⚠️ Unregistered — yellow warning
  - 🚨 Flagged / Stolen — red alert
- [ ] Report stolen battery form

---

## 💳 Phase 3 — Payments + Notifications (Weeks 11–12)

### Sprint 3A: Payments (Week 11)

**Backend:**
- [ ] PayMongo integration (GCash, Maya, Card)
- [ ] Payment intent creation
- [ ] Webhook handler (signature verification)
- [ ] Subscription plans model (free tier / standard / fleet)
- [ ] Invoice generation
- [ ] Refund API

**Frontend:**
- [ ] Payment step in booking wizard
- [ ] GCash/Maya redirect flow
- [ ] Credit card form (PayMongo Elements)
- [ ] Payment history + invoice download
- [ ] Subscription management page

---

### Sprint 3B: Notifications (Week 12)

**Backend:**
- [ ] Firebase Cloud Messaging setup
- [ ] Device token registration endpoint
- [ ] Notification templates:
  - Booking confirmed (immediate)
  - Reminder: swap in 15 min (scheduled)
  - Swap complete receipt (immediate)
  - Battery health alert (triggered)
- [ ] BullMQ reminder job scheduler
- [ ] SMS fallback (Semaphore)

**Frontend:**
- [ ] FCM push notification setup (service worker)
- [ ] Notification permission request flow
- [ ] In-app notification bell + feed
- [ ] Notification preferences in settings

---

## 🚀 Phase 4 — BGC Pilot Launch (Weeks 13–14)

### Pre-Launch Checklist

**QA & Testing:**
- [ ] End-to-end Cypress tests for booking flow
- [ ] Load testing: 100 concurrent users (k6)
- [ ] Mobile responsive QA (iPhone 14, Samsung S24, Redmi)
- [ ] Payment sandbox → production cutover test
- [ ] QR scan test on actual station hardware

**Infrastructure:**
- [ ] Production Supabase with connection pooling
- [ ] Vercel Pro deployment with Analytics
- [ ] Railway production environment
- [ ] Cloudflare CDN for static assets
- [ ] Uptime monitoring (Better Uptime)
- [ ] Error tracking (Sentry)
- [ ] Backup strategy (daily DB snapshots)

**Legal / Ops:**
- [ ] Terms of Service + Privacy Policy (RA 10173)
- [ ] Station operator onboarding documentation
- [ ] Rider user guide (Tagalog + English)
- [ ] Support channel setup (Viber / Messenger)

**Deliverable:** 🎉 Public launch of BGC pilot with 7 stations

---

## 🔧 Phase 5 — Feedback + Hardening (Weeks 15–17)

### Post-Launch Activities

- [ ] Collect user feedback (in-app survey + NPS)
- [ ] Performance monitoring — identify slow queries
- [ ] Fix critical bugs from production feedback
- [ ] Implement feature requests from pilot users
- [ ] Add admin operator dashboard
- [ ] Station management portal for operators
- [ ] Analytics dashboard (swaps per station, peak hours, revenue)
- [ ] A/B test booking flow improvements

---

## ⚡ Phase 6 — EV Expansion Prep (Weeks 18–20)

### Extending for Electric Vehicles

**Technical Changes:**
- [ ] Vehicle model: expand to EV cars (96V, Type 2 charging)
- [ ] Station model: add charger_type field (swap / AC / DC fast)
- [ ] Booking duration: variable (swap = 5min, AC charge = 1–4 hours)
- [ ] Battery compatibility matrix API
- [ ] Larger battery diagnostics (BMS telemetry integration)

**Business Features:**
- [ ] Fleet management portal (business accounts)
- [ ] Multi-vehicle booking
- [ ] Corporate invoice billing
- [ ] LTO vehicle registration lookup integration
- [ ] OEM partnership API (battery manufacturer data)

---

## 👥 Team Roles & Responsibilities

| Role | Responsibilities |
|---|---|
| **Tech Lead** | Architecture, code review, system design, DevOps, technical decisions |
| **Full-Stack Dev 1** | Frontend (Next.js, Maps, Booking UI), Auth flows |
| **Full-Stack Dev 2** | Backend (APIs, DB, Battery logic, Payments, Background jobs) |
| **UI/UX Designer** | Figma designs, user research, usability testing, design system |

### Escalation Matrix
```
Bug Severity 1 (Production down)   → Tech Lead → immediate response
Bug Severity 2 (Feature broken)    → Assigned Dev → fix within 4 hours
Bug Severity 3 (Minor issue)       → Sprint backlog → next available slot
Feature Request                    → Product discussion → prioritize in backlog
```

---

## 🛠️ Tools & Workflow

| Category | Tool |
|---|---|
| Version Control | GitHub (private org repo) |
| Project Management | Linear / Jira |
| Design | Figma |
| Communication | Slack / Discord |
| API Testing | Insomnia / Postman |
| Monitoring | Sentry + Better Uptime + Datadog |
| CI/CD | GitHub Actions |
| Documentation | Notion + this skills folder |
| IDE | VS Code / Antigravity IDE |

---

## 📊 Success Metrics (KPIs)

### Technical
```
API Response Time    p95 < 300ms
Error Rate           < 0.5%
Uptime               > 99.5%
Core Web Vitals      All "Good"
Swap Completion Rate > 95%
```

### Business
```
Weekly Active Users  Target: 200 by Month 2
Bookings per Day     Target: 50 by Month 2
Swap Success Rate    Target: > 98%
User NPS             Target: > 50
Station Utilization  Target: > 60% peak hours
```

---

*BatterySwap PH — Implementation Plan v1.0*  
*Review and update at each phase gate.*
