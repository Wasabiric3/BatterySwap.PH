# 🎨 Frontend Skills — BatterySwap PH

> Role focus: Frontend Developer / UI Engineer  
> Stack: Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Google Maps API

---

## Core Competencies Required

### 1. React & Next.js 14 (App Router)
**Level required**: Senior

```
✅ App Router architecture (layout.tsx, page.tsx, loading.tsx, error.tsx)
✅ React Server Components (RSC) vs Client Components — know the difference
✅ Server Actions for form handling and mutations
✅ Streaming with Suspense boundaries
✅ Route groups, parallel routes, intercepting routes
✅ Metadata API for SEO
✅ Image optimization with next/image
✅ Dynamic imports and code splitting
```

**Key patterns for this project:**
- `use client` only at the leaf level (maps, interactive booking widget)
- Booking flow uses Server Actions + optimistic updates
- Station list uses RSC with streaming for fast TTFB

---

### 2. TypeScript (Strict Mode)
**Level required**: Intermediate–Senior

```typescript
// ✅ Typed component props
interface StationCardProps {
  station: SwapStation;
  onSelect: (id: string) => void;
  isAvailable: boolean;
}

// ✅ Discriminated unions for battery status
type BatteryStatus =
  | { state: "available"; charge: number; slotId: string }
  | { state: "in-use"; riderId: string; swappedAt: Date }
  | { state: "faulty"; diagnosticCode: string };

// ✅ Zod schemas mirror DB models
const BookingSchema = z.object({
  stationId: z.string().uuid(),
  slotTime: z.date().min(new Date()),
  vehicleId: z.string().uuid(),
  batteryType: z.enum(["72V", "60V", "48V"]),
});
```

---

### 3. Tailwind CSS + shadcn/ui
**Level required**: Intermediate

```
✅ Utility-first composition
✅ Responsive design (mobile-first, sm: md: lg: xl:)
✅ Dark mode with dark: variants
✅ Custom design tokens in tailwind.config.ts
✅ CVA (class-variance-authority) for variant-based components
✅ shadcn/ui: Button, Card, Dialog, Sheet, Tabs, Badge, Toast
✅ Radix UI primitives (accessible by default)
```

**Design tokens for BatterySwap PH:**
```typescript
// tailwind.config.ts
colors: {
  brand: {
    green: "#00C48C",    // primary — charged/ready
    volt: "#F5C400",     // warning — low battery
    red: "#FF4757",      // error — faulty/unavailable
    dark: "#0D1117",     // background
    slate: "#1A2332",    // card background
  }
}
```

---

### 4. Google Maps JavaScript API
**Level required**: Intermediate

```
✅ Map initialization with custom styled map
✅ Marker clustering for multiple stations
✅ Custom InfoWindow for station details
✅ Geolocation API — get user's current position
✅ Directions API — route to nearest station
✅ Places Autocomplete — address search
✅ Distance Matrix — sort by proximity
```

**Key component: StationMap**
```typescript
// Must handle:
// - 7 BGC prototype stations as initial markers
// - Real-time availability overlay (green/yellow/red)
// - Click-to-book flow from map marker
// - Mobile-responsive map height
```

---

### 5. State Management
**Level required**: Intermediate

```
✅ Zustand — global state (auth, booking cart, station selection)
✅ TanStack Query (React Query) v5 — server state, caching, polling
✅ React Hook Form + Zod — form state + validation
✅ URL state — useSearchParams for filters
```

---

### 6. Booking UI Flow
**Level required**: Senior (UX-critical)

```
Step 1: Station Map → Select station
Step 2: Battery type selector (72V / 60V / 48V)
Step 3: Time slot picker (30-min intervals)
Step 4: Vehicle profile confirm
Step 5: Payment (PayMongo / GCash / Cash)
Step 6: QR Code generation + confirmation

✅ Multi-step wizard with progress indicator
✅ Optimistic UI updates
✅ Skeleton loaders for async steps
✅ Error recovery flows
✅ Mobile-first bottom sheet on small screens
```

---

### 7. Diagnostic Dashboard UI
**Level required**: Intermediate

```
✅ Recharts / Chart.js for battery health graphs
✅ Radial progress for charge percentage
✅ Sparklines for charge history
✅ Color-coded health indicators
✅ PDF export with html2canvas + jsPDF
```

---

### 8. Accessibility (a11y)
**Level required**: Intermediate

```
✅ Semantic HTML (button, nav, main, section, article)
✅ ARIA labels on interactive elements
✅ Keyboard navigation (Tab, Enter, Esc)
✅ Focus trap in modals
✅ Screen reader-friendly status messages
✅ Color contrast WCAG AA minimum
```

---

### 9. Performance
**Level required**: Intermediate

```
✅ Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
✅ next/image for all station photos
✅ Font optimization with next/font
✅ Route-based code splitting (dynamic imports)
✅ Prefetch station data on hover
✅ Virtual list for long station lists (react-virtual)
```

---

## 📁 Frontend Folder Map

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout + providers
│   ├── page.tsx                # Landing / station finder
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── booking/
│   │   ├── page.tsx            # Booking wizard
│   │   └── [id]/page.tsx       # Booking confirmation
│   ├── dashboard/
│   │   ├── page.tsx            # User dashboard
│   │   ├── history/page.tsx    # Swap history
│   │   └── vehicles/page.tsx   # Vehicle profiles
│   ├── stations/
│   │   ├── page.tsx            # All stations map
│   │   └── [id]/page.tsx       # Station detail
│   └── diagnostics/
│       └── page.tsx            # Battery diagnostic
├── components/
│   ├── ui/                     # shadcn primitives
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── maps/
│   │   ├── StationMap.tsx      # Google Maps main component
│   │   ├── StationMarker.tsx
│   │   └── MapControls.tsx
│   ├── booking/
│   │   ├── BookingWizard.tsx
│   │   ├── SlotPicker.tsx
│   │   ├── BatteryTypeSelector.tsx
│   │   └── BookingQRCode.tsx
│   └── stations/
│       ├── StationCard.tsx
│       ├── StationList.tsx
│       ├── AvailabilityBadge.tsx
│       └── DiagnosticReport.tsx
├── lib/
│   ├── utils/
│   │   ├── cn.ts               # clsx + tailwind-merge
│   │   ├── formatDate.ts
│   │   └── distance.ts
│   ├── hooks/
│   │   ├── useGeolocation.ts
│   │   ├── useStations.ts
│   │   ├── useBooking.ts
│   │   └── useBatteryStatus.ts
│   └── types/
│       ├── station.ts
│       ├── booking.ts
│       ├── battery.ts
│       └── user.ts
└── public/
    └── images/
        ├── stations/           # Station photos
        └── icons/              # Battery, EV icons
```

---

## 🔧 Frontend Dependencies

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.0",
    "@googlemaps/js-api-loader": "^1.16.0",
    "recharts": "^2.12.0",
    "next-auth": "^5.0.0",
    "framer-motion": "^11.0.0",
    "date-fns": "^3.6.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.368.0"
  }
}
```

---

*Part of BatterySwap PH Skill Suite — see SKILLS.md for full index*
