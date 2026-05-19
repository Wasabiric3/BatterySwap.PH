# 🗄️ Database Skills — BatterySwap PH

> Role focus: Database Engineer / Backend Developer  
> Stack: PostgreSQL · Prisma ORM · PostGIS · Redis · Supabase

---

## Prisma Schema — Core Models

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [postgis]
}

// ─── User ────────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  phone         String?   @unique
  name          String
  role          Role      @default(RIDER)
  passwordHash  String?
  avatarUrl     String?
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  vehicles      Vehicle[]
  bookings      Booking[]
  payments      Payment[]
  notifications Notification[]

  @@index([phone])
  @@index([email])
}

enum Role {
  RIDER
  OPERATOR
  MECHANIC
  ADMIN
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────

model Vehicle {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  type          VehicleType
  make          String
  model         String
  plateNumber   String?     @unique
  batteryType   BatteryType
  year          Int?
  isActive      Boolean     @default(true)
  createdAt     DateTime    @default(now())

  bookings      Booking[]

  @@index([userId])
}

enum VehicleType { EBIKE EV_CAR EV_TRICYCLE }
enum BatteryType { V48 V60 V72 V96 }

// ─── Station ─────────────────────────────────────────────────────────────────

model Station {
  id              String    @id @default(cuid())
  name            String
  address         String
  latitude        Float
  longitude       Float
  operatingHours  Json      // { mon: "07:00-22:00", ... }
  contactNumber   String?
  photoUrl        String?
  isActive        Boolean   @default(true)
  managedByUserId String?   // Operator user ID
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  batteryUnits    BatteryUnit[]
  bookings        Booking[]
  slots           StationSlot[]

  @@index([isActive])
}

// ─── BatteryUnit ─────────────────────────────────────────────────────────────

model BatteryUnit {
  id              String        @id @default(cuid())
  serialNumber    String        @unique
  stationId       String?
  station         Station?      @relation(fields: [stationId], references: [id])
  type            BatteryType
  status          BatteryStatus @default(AVAILABLE)
  chargePercent   Int           @default(100)
  cycleCount      Int           @default(0)
  healthPercent   Float         @default(100)
  manufacturer    String
  manufacturedAt  DateTime?
  isAuthentic     Boolean       @default(true)
  isStolenFlag    Boolean       @default(false)
  lastCheckedAt   DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  swapLogs        SwapLog[]
  diagnostics     DiagnosticReport[]

  @@index([stationId, status])
  @@index([serialNumber])
}

enum BatteryStatus { AVAILABLE CHARGING IN_USE FAULTY QUARANTINE }

// ─── Booking ─────────────────────────────────────────────────────────────────

model Booking {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  stationId   String
  station     Station       @relation(fields: [stationId], references: [id])
  vehicleId   String
  vehicle     Vehicle       @relation(fields: [vehicleId], references: [id])
  slotTime    DateTime
  status      BookingStatus @default(PENDING)
  qrToken     String?       @unique
  checkedInAt DateTime?
  completedAt DateTime?
  cancelledAt DateTime?
  notes       String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  swapLog     SwapLog?
  payment     Payment?

  @@index([userId, createdAt(sort: Desc)])
  @@index([stationId, slotTime, status])
}

enum BookingStatus { PENDING CONFIRMED CHECKED_IN COMPLETED CANCELLED NO_SHOW }

// ─── SwapLog ─────────────────────────────────────────────────────────────────

model SwapLog {
  id              String      @id @default(cuid())
  bookingId       String      @unique
  booking         Booking     @relation(fields: [bookingId], references: [id])
  depletedBatteryId String
  chargedBatteryId  String
  chargedBattery  BatteryUnit @relation(fields: [chargedBatteryId], references: [id])
  operatorId      String?
  durationSeconds Int?
  createdAt       DateTime    @default(now())
}

// ─── Payment ─────────────────────────────────────────────────────────────────

model Payment {
  id              String        @id @default(cuid())
  bookingId       String        @unique
  booking         Booking       @relation(fields: [bookingId], references: [id])
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  amount          Int           // in centavos (PHP)
  currency        String        @default("PHP")
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  referenceId     String?       // PayMongo reference
  paidAt          DateTime?
  createdAt       DateTime      @default(now())
}

enum PaymentMethod { GCASH MAYA CARD CASH FREE_SUBSCRIPTION }
enum PaymentStatus { PENDING PAID FAILED REFUNDED }

// ─── DiagnosticReport ────────────────────────────────────────────────────────

model DiagnosticReport {
  id              String      @id @default(cuid())
  batteryId       String
  battery         BatteryUnit @relation(fields: [batteryId], references: [id])
  performedById   String?
  cycleCount      Int
  healthPercent   Float
  capacityAh      Float
  voltageBalance  Float
  temperatureC    Float?
  estimatedLifeMonths Int?
  failureCodes    String[]
  recommendation  String?
  reportUrl       String?     // PDF URL
  createdAt       DateTime    @default(now())

  @@index([batteryId, createdAt(sort: Desc)])
}

// ─── StationSlot ─────────────────────────────────────────────────────────────

model StationSlot {
  id          String    @id @default(cuid())
  stationId   String
  station     Station   @relation(fields: [stationId], references: [id])
  startTime   DateTime
  capacity    Int       @default(3)  // max bookings per slot
  booked      Int       @default(0)
  isBlocked   Boolean   @default(false)
  createdAt   DateTime  @default(now())

  @@unique([stationId, startTime])
  @@index([stationId, startTime])
}
```

---

## Seed Data — BGC Prototype Stations

```typescript
// prisma/seed.ts
const bgcStations = [
  {
    name: "SwapHub BGC Central",
    address: "Bonifacio High Street Central, BGC, Taguig",
    latitude: 14.5507,
    longitude: 121.0494,
  },
  {
    name: "SwapPoint BHS South",
    address: "Bonifacio High Street South, BGC, Taguig",
    latitude: 14.5482,
    longitude: 121.0481,
  },
  {
    name: "EcoCharge Fort Strip",
    address: "Fort Strip, BGC, Taguig",
    latitude: 14.5523,
    longitude: 121.0516,
  },
  {
    name: "GreenRide SM Aura",
    address: "SM Aura Premier, BGC, Taguig",
    latitude: 14.5460,
    longitude: 121.0530,
  },
  {
    name: "VoltBase McKinley Hill",
    address: "McKinley Hill, BGC, Taguig",
    latitude: 14.5368,
    longitude: 121.0540,
  },
  {
    name: "SwapDock Uptown Mall",
    address: "Uptown Bonifacio Mall, BGC, Taguig",
    latitude: 14.5545,
    longitude: 121.0460,
  },
  {
    name: "ChargeNode Market! Market!",
    address: "Market! Market!, BGC, Taguig",
    latitude: 14.5505,
    longitude: 121.0454,
  },
];
```

---

## Common Queries Reference

```typescript
// Find available stations near user
const nearbyStations = await prisma.$queryRaw`
  SELECT s.*, 
    ST_Distance(
      ST_Point(${lng}::float, ${lat}::float)::GEOGRAPHY,
      ST_Point(s.longitude, s.latitude)::GEOGRAPHY
    ) AS distance_meters
  FROM stations s
  WHERE s."isActive" = true
  ORDER BY distance_meters ASC
  LIMIT 10
`;

// Get booking with full relations
const booking = await prisma.booking.findUnique({
  where: { id },
  include: {
    user: { select: { name: true, phone: true } },
    station: true,
    vehicle: true,
    swapLog: {
      include: { chargedBattery: true }
    },
    payment: true,
  },
});

// Available slots for a station on a date
const slots = await prisma.stationSlot.findMany({
  where: {
    stationId,
    startTime: { gte: startOfDay, lt: endOfDay },
    isBlocked: false,
    booked: { lt: prisma.stationSlot.fields.capacity }, // booked < capacity
  },
  orderBy: { startTime: "asc" },
});
```

---

*Part of BatterySwap PH Skill Suite — see SKILLS.md for full index*
