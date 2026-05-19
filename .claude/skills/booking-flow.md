# booking-flow

Build or modify a step in the BatterySwap PH multi-step booking wizard.

## Usage
`/booking-flow <step-number|step-name> [description of change]`

Examples:
- `/booking-flow 3 "Add a 'fastest available' auto-pick option to the slot picker"`
- `/booking-flow payment "Integrate Maya as a payment option alongside GCash"`
- `/booking-flow new "Add a fleet booking step for multiple vehicles"`

## Booking wizard steps reference

| Step | Component | Description |
|------|-----------|-------------|
| 1 | `StationSelector` | Map or list — pick a station |
| 2 | `BatteryTypeSelector` | Choose 48V / 60V / 72V, must match vehicle profile |
| 3 | `SlotPicker` | 30-min time slots, real-time availability via Socket.io |
| 4 | `VehicleConfirm` | Confirm which vehicle, show battery compatibility warning |
| 5 | `PaymentStep` | GCash / Maya / Card via PayMongo, or cash-at-station |
| 6 | `BookingQRCode` | Final QR code + booking summary |

## Architecture

The wizard lives in `frontend/src/components/booking/BookingWizard.tsx`.

State is managed with **Zustand** (`useBookingStore`). Each step reads and writes to the store. Server mutations use **Server Actions** or TanStack Query mutations (POST `/api/v1/bookings`).

```typescript
// Zustand store shape (do not break this contract)
interface BookingStore {
  step: number;
  stationId: string | null;
  batteryType: "48V" | "60V" | "72V" | null;
  slotTime: Date | null;
  vehicleId: string | null;
  paymentMethod: "gcash" | "maya" | "card" | "cash" | null;
  bookingId: string | null;   // set after POST /api/v1/bookings
  qrToken: string | null;     // set after confirmation
  next: () => void;
  back: () => void;
  reset: () => void;
}
```

## Component conventions
- Each step is its own component file: `frontend/src/components/booking/<StepName>.tsx`
- Steps are `"use client"` components (they're interactive)
- Progress indicator uses `step` from store — do not duplicate progress state
- Mobile: use bottom Sheet (shadcn) for step panels on small screens
- Show skeleton while async data loads (slot availability, payment intent)
- On error: surface `AppError.code` in a toast (shadcn `useToast`) — never raw error messages
- Slot availability polling: `useQuery({ queryKey: ["slots", stationId], refetchInterval: 10_000 })`
- PayMongo payment intent: create on entering Step 5, not on final confirm (avoids double-charge)

## After making changes
1. Verify TypeScript: `cd frontend && npx tsc --noEmit`
2. Check the booking E2E spec: `frontend/e2e/home.spec.ts` — update or add Playwright assertions if the step UI changed
3. List any new env vars needed (PAYMONGO_PUBLIC_KEY, etc.) and add them to `frontend/.env.example`
