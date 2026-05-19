# add-station

Add a new battery swap station to the BatterySwap PH project — seed data, type definitions, and map marker config.

## Usage
`/add-station`

Claude will ask for: station name, area/landmark, address, coordinates (lat/lng), and supported battery types (48V / 60V / 72V).

## What to build

### 1. Seed record in `backend/prisma/seed.ts`
Add the station to the `stations` array following the existing BGC prototype format:
```typescript
{
  name: "<Station Name>",
  area: "<Area / Landmark>",
  address: "<Full street address, Barangay, City>",
  lat: <latitude>,
  lng: <longitude>,
  batteryTypes: ["48V", "60V", "72V"], // only supported types
  totalSlots: 8,                        // default; adjust if user specifies
  status: "ACTIVE",
  operatingHours: { open: "06:00", close: "22:00" }, // default; adjust if user specifies
}
```

### 2. Prisma schema check
Confirm `schema.prisma` has a `Station` model with `lat Float`, `lng Float`, `batteryTypes String[]`. If not, generate and apply a migration.

### 3. Frontend map config `frontend/src/lib/constants/stations.ts`
If a static fallback list exists, add the station there too so the map renders even before the API loads.

### 4. Re-run the seed
After editing `seed.ts`, remind the user to run:
```bash
cd backend && npx prisma db seed
```

## Validation rules
- Coordinates must be within the Philippines bounding box: lat 4.5–21.1, lng 116.9–126.6
- Station name must be unique (check existing seeds)
- At least one battery type required
- If the user gives a landmark without coordinates, use your knowledge of Philippine geography to estimate — but clearly state you estimated and ask them to verify in Google Maps

## BGC prototype stations already seeded (do not duplicate)
1. SwapHub BGC Central — High Street, BGC
2. SwapPoint Bonifacio High Street — BHS South
3. EcoCharge Fort Strip — Fort Strip
4. GreenRide SM Aura — SM Aura Taguig
5. VoltBase McKinley Hill — McKinley Hill
6. SwapDock Uptown Mall — Uptown BGC
7. ChargeNode Market! Market! — Market! Market!
