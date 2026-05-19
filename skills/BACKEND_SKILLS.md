# 🔧 Backend Skills — BatterySwap PH

> Role focus: Backend Developer / API Engineer  
> Stack: Node.js · Express / Hono · TypeScript · Prisma · PostgreSQL · Redis

---

## Core Competencies Required

### 1. Node.js + TypeScript
**Level required**: Senior

```
✅ Async/await patterns, error propagation
✅ Stream handling (diagnostic reports, large exports)
✅ Worker threads for CPU-heavy tasks (battery analytics)
✅ Environment variable management (dotenv + zod validation)
✅ Process signals (SIGTERM, SIGINT) for graceful shutdown
✅ Clustering for multi-core utilization
```

---

### 2. REST API Design
**Level required**: Senior

```
✅ RESTful resource naming conventions
✅ HTTP status codes used correctly (200, 201, 204, 400, 401, 403, 404, 409, 422, 500)
✅ Versioned endpoints: /api/v1/...
✅ Consistent response envelope:
```

```typescript
// ✅ Standard success response
{
  "success": true,
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 }
}

// ✅ Standard error response
{
  "success": false,
  "error": {
    "code": "STATION_NOT_AVAILABLE",
    "message": "Selected station has no available slots",
    "details": { "stationId": "uuid", "nextAvailable": "2026-04-23T10:00:00Z" }
  }
}
```

---

### 3. Authentication & Authorization
**Level required**: Senior

```
✅ JWT access tokens (15 min) + refresh tokens (30 days)
✅ OTP via SMS (Philippine numbers — Semaphore / Vonage)
✅ OAuth 2.0 — Google, Facebook sign-in
✅ Role-based access control (RBAC):
   - rider      → book, view own data
   - operator   → manage station, view logs
   - admin      → full access
   - mechanic   → diagnostic access only
✅ Token blacklisting on logout (Redis)
✅ Rate limiting per user/IP (express-rate-limit)
```

---

### 4. API Endpoints — Core Modules

```
📍 STATIONS
GET    /api/v1/stations              — List all stations (filter: lat,lng,radius)
GET    /api/v1/stations/:id          — Station detail + live availability
GET    /api/v1/stations/:id/slots    — Available time slots
GET    /api/v1/stations/nearby       — Geospatial nearest-station query

📅 BOOKINGS
POST   /api/v1/bookings              — Create booking
GET    /api/v1/bookings/:id          — Get booking detail
PATCH  /api/v1/bookings/:id          — Update (reschedule, cancel)
POST   /api/v1/bookings/:id/checkin  — QR scan check-in
POST   /api/v1/bookings/:id/complete — Mark swap complete

🔋 BATTERY
GET    /api/v1/batteries/:serial     — Battery lookup by serial
POST   /api/v1/batteries/verify      — Legit check (manufacturer verify)
GET    /api/v1/batteries/:serial/diagnostic — Full diagnostic report
POST   /api/v1/batteries/report-stolen — Flag stolen battery

👤 USERS
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/me/history

🚗 VEHICLES
GET    /api/v1/vehicles              — User's vehicles
POST   /api/v1/vehicles              — Add vehicle
PATCH  /api/v1/vehicles/:id          — Update vehicle
DELETE /api/v1/vehicles/:id          — Remove vehicle

💳 PAYMENTS
POST   /api/v1/payments/intent       — Create PayMongo payment intent
POST   /api/v1/payments/webhook      — PayMongo webhook handler
GET    /api/v1/payments/history      — Transaction history

🔔 NOTIFICATIONS
POST   /api/v1/notifications/register — Register FCM device token
GET    /api/v1/notifications          — Notification history
```

---

### 5. Database — PostgreSQL + Prisma
**Level required**: Senior

```
✅ Schema design with proper relations and indexes
✅ Prisma migrations (never edit schema without migrating)
✅ Transaction handling (swap completion is atomic)
✅ Connection pooling (PgBouncer or Supabase pooler)
✅ Geospatial queries (PostGIS extension for station proximity)
✅ Soft deletes (deletedAt timestamps, never hard-delete)
✅ Audit logging (createdBy, updatedBy, timestamps)
```

---

### 6. Caching — Redis
**Level required**: Intermediate

```
✅ Cache station availability (TTL: 30 seconds)
✅ Cache user sessions and refresh tokens
✅ Rate limiting counters
✅ QR code validation tokens (TTL: 5 minutes)
✅ Battery diagnostic results (TTL: 1 hour)
```

---

### 7. Real-time (WebSockets / SSE)
**Level required**: Intermediate

```
✅ Socket.io for real-time station availability updates
✅ Room-based broadcasting: station:{id} channel
✅ SSE fallback for battery status polling
✅ Heartbeat/ping-pong for connection health
```

---

### 8. Background Jobs
**Level required**: Intermediate

```
✅ Bull/BullMQ queue (Redis-backed):
   - Send booking reminders (15 min before slot)
   - Expire unclaimed reservations (auto-cancel)
   - Nightly battery health report generation
   - Daily station inventory sync
✅ Cron jobs (node-cron):
   - Cleanup expired tokens
   - Aggregate analytics
```

---

### 9. Error Handling & Logging
**Level required**: Senior

```
✅ Global error middleware catches all unhandled errors
✅ Custom AppError class with codes + HTTP status
✅ Winston logger with structured JSON output
✅ Correlation IDs (x-request-id header, trace through logs)
✅ Sentry for exception tracking
✅ Never leak stack traces to API responses in production
```

---

## 📁 Backend Folder Map

```
backend/
├── src/
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # HTTP server + Socket.io
│   ├── routes/
│   │   ├── index.ts
│   │   ├── stations.ts
│   │   ├── bookings.ts
│   │   ├── batteries.ts
│   │   ├── users.ts
│   │   ├── vehicles.ts
│   │   ├── payments.ts
│   │   └── notifications.ts
│   ├── controllers/
│   │   ├── station.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── battery.controller.ts
│   │   ├── user.controller.ts
│   │   └── payment.controller.ts
│   ├── services/
│   │   ├── station.service.ts
│   │   ├── booking.service.ts
│   │   ├── battery.service.ts
│   │   ├── diagnostic.service.ts
│   │   ├── legit-check.service.ts
│   │   ├── notification.service.ts
│   │   ├── payment.service.ts
│   │   └── qr.service.ts
│   ├── models/                 # Prisma-generated + custom types
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── errorHandler.middleware.ts
│   └── lib/
│       ├── prisma.ts           # Prisma client singleton
│       ├── redis.ts            # Redis client
│       ├── socket.ts           # Socket.io setup
│       ├── queue.ts            # BullMQ setup
│       └── logger.ts           # Winston logger
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                 # BGC prototype station seeds
│   └── migrations/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 🔧 Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.19.0",
    "typescript": "^5.4.0",
    "@prisma/client": "^5.12.0",
    "prisma": "^5.12.0",
    "redis": "^4.6.0",
    "bullmq": "^5.4.0",
    "socket.io": "^4.7.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "winston": "^3.13.0",
    "express-rate-limit": "^7.2.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "node-cron": "^3.0.3",
    "qrcode": "^1.5.3",
    "paymongo": "^1.0.0",
    "firebase-admin": "^12.0.0",
    "@sentry/node": "^7.109.0"
  }
}
```

---

*Part of BatterySwap PH Skill Suite — see SKILLS.md for full index*
