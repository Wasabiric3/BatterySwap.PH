# 🧠 Senior Developer / Software Engineer Skills — BatterySwap PH

> For Lead Engineers, Tech Leads, and Senior Full-Stack Developers  
> This document covers architecture decisions, DevOps, code quality, and team leadership patterns.

---

## I. System Architecture

### Architecture Overview

```
                    ┌─────────────────────────────────┐
                    │         Vercel Edge CDN          │
                    │    Next.js 14 Frontend (SSR)     │
                    └────────────┬────────────────────-┘
                                 │ HTTPS / WSS
                    ┌────────────▼────────────────────-┐
                    │         API Gateway              │
                    │     (Express / Hono on Railway)  │
                    └──┬────────┬────────┬─────────────┘
                       │        │        │
              ┌────────▼┐  ┌────▼───┐ ┌──▼────────┐
              │PostgreSQL│  │ Redis  │ │ File Store │
              │(Supabase)│  │(Cache) │ │ (Cloudflare│
              └─────────┘  └────────┘ │  R2 / S3)  │
                                       └────────────┘
                       │
              ┌────────▼────────┐
              │   Background    │
              │  Jobs (BullMQ)  │
              │ Cron / Queues   │
              └────────────────-┘
```

### Microservices Readiness
The monolith is designed for **service extraction**. Each service layer maps to a future microservice:
- `station.service` → Station Availability Service
- `battery.service` → Battery Tracking Service  
- `diagnostic.service` → Diagnostic Engine (Python/ML-ready)
- `payment.service` → Billing Service

---

## II. Database Design Principles

### Key Schema Decisions

```sql
-- Stations use PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE stations
  ADD COLUMN location GEOGRAPHY(POINT, 4326);

CREATE INDEX stations_location_idx
  ON stations USING GIST (location);

-- "Find stations within 2km of user"
SELECT *, ST_Distance(location, ST_Point(lng, lat)::GEOGRAPHY) AS distance
FROM stations
WHERE ST_DWithin(location, ST_Point(lng, lat)::GEOGRAPHY, 2000)
ORDER BY distance;
```

### Transactions for Swap Completion
```typescript
// Battery swap is atomic — either all records update or none
await prisma.$transaction(async (tx) => {
  await tx.booking.update({ where: { id }, data: { status: "COMPLETED" } });
  await tx.batteryUnit.update({ where: { id: depleted }, data: { status: "CHARGING" } });
  await tx.batteryUnit.update({ where: { id: charged }, data: { status: "IN_USE" } });
  await tx.swapLog.create({ data: { bookingId, userId, stationId, ... } });
});
```

---

## III. Performance Engineering

### Caching Strategy
```
Layer 1 — CDN (Vercel Edge):      Static assets, ISR pages → 1 hour
Layer 2 — Redis:                  Station availability → 30 seconds
Layer 3 — TanStack Query:         Client-side data → staleTime: 1 minute
Layer 4 — React.memo/useMemo:     Expensive render calculations
```

### Database Query Optimization
```
✅ Index foreign keys (stationId, userId, vehicleId)
✅ Composite indexes for common filter patterns:
   (userId, createdAt) — "my bookings, newest first"
   (stationId, slotTime, status) — "available slots at station"
✅ SELECT only needed columns (never SELECT *)
✅ Cursor-based pagination for large datasets
✅ EXPLAIN ANALYZE before deploying slow queries
```

---

## IV. Security Engineering

### OWASP Top 10 Coverage
```
A01 Broken Access Control    → RBAC middleware on all routes
A02 Cryptographic Failures   → HTTPS only, bcrypt for passwords
A03 Injection               → Prisma parameterized queries (no raw SQL)
A04 Insecure Design         → Threat model for battery legit check
A05 Security Misconfiguration→ Helmet.js, CORS whitelist, env vars
A06 Outdated Components     → Dependabot + monthly audits
A07 Auth Failures            → JWT + refresh rotation, rate limits
A08 Integrity Failures       → Webhook signature verification (PayMongo)
A09 Logging Failures         → Structured logs, Sentry, audit trail
A10 SSRF                    → No user-provided URLs in server requests
```

### PH Data Privacy Act (RA 10173) Compliance
```
✅ Personal data minimization (collect only what's needed)
✅ Explicit consent on registration
✅ Right to erasure — soft delete + anonymization endpoint
✅ Data retention policy (booking records: 3 years, then anonymize)
✅ Breach notification SOP documented
```

---

## V. DevOps & CI/CD

### GitHub Actions Pipeline

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    - Lint (ESLint + Prettier)
    - Type check (tsc --noEmit)
    - Unit tests (Vitest)
    - Integration tests (Supertest)
    - Security scan (npm audit)

  build:
    needs: test
    - Build Docker image (backend)
    - Build Next.js (frontend)

  deploy:
    needs: build
    if: branch == main
    - Deploy frontend → Vercel (automatic)
    - Deploy backend → Railway
    - Run DB migrations (prisma migrate deploy)
    - Post deploy smoke test
```

### Environments
```
local     → .env.local (never commit)
staging   → Supabase staging project, Railway staging
production→ Supabase production, Railway production
```

---

## VI. Code Review Standards

### PR Checklist
```
Before merging any PR, verify:

Architecture
  □ No business logic in components or routes — belongs in services
  □ No direct DB calls in controllers — goes through services
  □ Shared utilities in lib/, not duplicated

TypeScript
  □ No `any` types unless documented with TODO
  □ New features have proper types in lib/types/
  □ API responses match defined schemas

Testing
  □ New services have unit tests
  □ New API endpoints have integration tests
  □ Test coverage didn't drop

Security
  □ New routes have auth middleware applied
  □ User inputs are validated with Zod
  □ No secrets in code

Performance
  □ N+1 queries checked (use Prisma include carefully)
  □ No blocking operations in request handlers
  □ New features don't regress Core Web Vitals

Database
  □ Migration created for schema changes
  □ Indexes added for new filter columns
  □ No destructive migration without backup plan
```

---

## VII. Monitoring & Observability

### Three Pillars

**Logs** (Winston → Datadog / Logtail)
```typescript
logger.info("booking.created", {
  correlationId,
  userId,
  stationId,
  slotTime,
  durationMs: Date.now() - start,
});
```

**Metrics** (Prometheus + Grafana)
```
- API response times (p50, p95, p99)
- Station availability heatmap
- Booking conversion funnel
- Battery swap success rate
- Error rate by endpoint
```

**Traces** (OpenTelemetry)
```
- End-to-end request tracing
- DB query performance per endpoint
- Queue processing times
```

### Alerting Thresholds
```
🔴 CRITICAL  — API error rate > 5% → PagerDuty
🟠 WARNING   — Station offline > 30 min → Slack #ops
🟡 INFO      — Booking drop > 20% vs previous day → Slack #product
```

---

## VIII. Git Workflow

### Branch Strategy (Git Flow adapted)
```
main          → production, protected, tagged on release
develop       → staging integration branch
feature/*     → new features (from develop)
fix/*         → bug fixes (from develop or main)
hotfix/*      → critical production fixes (from main)
chore/*       → dependency updates, tooling
```

### Commit Convention (Conventional Commits)
```
feat(booking): add GCash payment integration
fix(stations): correct geospatial proximity query
perf(battery): cache diagnostic results in Redis
docs(api): add station endpoints to README
chore(deps): update Prisma to v5.12.0
test(battery): add unit tests for legit check service
```

---

## IX. Scaling Plan

### Phase 1: BGC Prototype (Current)
- Single Railway instance, Supabase free tier
- 7 prototype stations, ~100 users
- Monolithic Next.js + Express

### Phase 2: Metro Manila Expansion
- Railway Pro (auto-scaling)
- Supabase Pro (connection pooling)
- CDN for station images (Cloudflare R2)
- Redis for session/cache (Railway Redis)

### Phase 3: Nationwide + EVs
- Kubernetes on GCP Philippines region
- Separate Battery Diagnostic Service (Python + ML)
- Event-driven with Kafka (battery telemetry stream)
- Multi-tenant architecture for fleet operators

---

## X. Technology Radar

| Adopt Now | Trial | Assess | Avoid |
|---|---|---|---|
| Next.js 14, TypeScript strict | Hono (edge API) | React Native (mobile app) | REST for real-time (use WS) |
| Prisma + PostgreSQL | Drizzle ORM | Turso (edge SQLite) | MongoDB (relational data) |
| TanStack Query v5 | Jotai (state) | Zustand v5 | Redux (overkill) |
| Google Maps API | Mapbox GL | HERE Maps | Custom tile server |
| PayMongo | Paynamics | DragonPay | Manual bank transfer |
| Tailwind CSS + shadcn | Radix Themes | Ark UI | Bootstrap/MUI |
| Vercel + Railway | Fly.io | Cloud Run | EC2 manual |

---

*Part of BatterySwap PH Skill Suite — see SKILLS.md for full index*
