# new-page

Scaffold a new Next.js 14 App Router page for BatterySwap PH with proper TypeScript types, Tailwind styling, and data-fetching patterns.

## Usage
`/new-page <route-path> [description]`

Example: `/new-page dashboard/analytics "Station utilization charts"`

## What to build

### File structure to create
```
frontend/src/app/<route-path>/
├── page.tsx          # RSC — fetch data here, pass to client components
├── loading.tsx       # Suspense skeleton
└── error.tsx         # Error boundary (use client)
```

Only create `layout.tsx` if the route introduces a persistent shell not shared with siblings.

### page.tsx pattern (RSC)
```typescript
import { Metadata } from "next";
// fetch on the server — no useEffect, no useState
export const metadata: Metadata = { title: "<Page Title> | BatterySwap PH" };

export default async function <PageName>Page() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/<resource>`, {
    next: { revalidate: 30 }, // or cache: "no-store" for real-time data
  }).then(r => r.json());

  return (
    <main className="min-h-screen bg-brand-dark p-6">
      {/* Pass server data to client components */}
    </main>
  );
}
```

### loading.tsx pattern
```typescript
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 w-48 rounded bg-brand-slate" />
      <div className="h-64 rounded bg-brand-slate" />
    </div>
  );
}
```

### Client component pattern (only when interactivity needed)
```typescript
"use client";
import { useQuery } from "@tanstack/react-query";
// Use TanStack Query for polling / real-time data (station availability, socket updates)
```

## Conventions
- `use client` only at leaf components — never on page.tsx unless the whole page is interactive
- Brand colors: `brand-green` (available), `brand-volt` (warning), `brand-red` (error/faulty), `brand-dark` (bg), `brand-slate` (card bg)
- Mobile-first responsive: start with base styles, layer `sm:` `md:` `lg:`
- Use shadcn/ui primitives (Button, Card, Badge, Sheet, Dialog) — do not hand-roll common UI
- Use `lucide-react` for icons
- All user-visible text must support Tagalog + English (add `lang` prop or comment for i18n later)
- After creating files, run `npx tsc --noEmit` inside `frontend/` to verify types
