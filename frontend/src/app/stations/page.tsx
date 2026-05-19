'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin, BatteryCharging, Clock, Filter, Search,
  ArrowUpRight, CheckCircle2, XCircle, AlertCircle,
  Zap, ChevronRight, Navigation,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp } from '@/components/animations/FadeUp';
import dynamic from 'next/dynamic';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { useComingSoon } from '@/components/ui/coming-soon-modal';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false, loading: () => <div className="dotted-surface-loading" aria-hidden="true" /> }
);

const StationMap = dynamic(
  () => import('@/components/stations/StationMap').then((m) => ({ default: m.StationMap })),
  { ssr: false, loading: () => <div className="w-full h-full rounded-3xl bg-card border border-border animate-pulse" /> }
);
import Link from 'next/link';

// Haversine distance utility
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const STATIONS = [
  {
    id: 1,
    name: 'SwapHub BGC Central',
    address: 'Bonifacio High Street Central, BGC, Taguig',
    area: 'High Street',
    totalSlots: 12,
    availableSlots: 9,
    batteryTypes: ['48V', '60V', '72V'],
    status: 'open' as const,
    hours: '06:00 – 22:00',
    lat: 14.5507,
    lng: 121.0494,
    distance: '0.3 km',
    waitTime: '< 2 min',
  },
  {
    id: 2,
    name: 'SwapPoint BHS South',
    address: 'Bonifacio High Street South, BGC, Taguig',
    area: 'BHS South',
    totalSlots: 8,
    availableSlots: 3,
    batteryTypes: ['48V', '60V'],
    status: 'busy' as const,
    hours: '06:00 – 22:00',
    lat: 14.5493,
    lng: 121.0483,
    distance: '0.5 km',
    waitTime: '5–10 min',
  },
  {
    id: 3,
    name: 'EcoCharge Fort Strip',
    address: 'Fort Strip, 5th Ave, BGC, Taguig',
    area: 'Fort Strip',
    totalSlots: 5,
    availableSlots: 5,
    batteryTypes: ['48V', '60V', '72V'],
    status: 'open' as const,
    hours: '08:00 – 22:00',
    lat: 14.5523,
    lng: 121.0512,
    distance: '0.8 km',
    waitTime: '< 2 min',
  },
  {
    id: 4,
    name: 'GreenRide SM Aura',
    address: 'SM Aura Premier, McKinley Pkwy, Taguig',
    area: 'SM Aura',
    totalSlots: 15,
    availableSlots: 11,
    batteryTypes: ['48V', '60V', '72V'],
    status: 'open' as const,
    hours: '10:00 – 21:00',
    lat: 14.5477,
    lng: 121.0540,
    distance: '1.2 km',
    waitTime: '< 2 min',
  },
  {
    id: 5,
    name: 'VoltBase McKinley Hill',
    address:    'Upper McKinley Rd, McKinley Hill, Taguig',
    area: 'McKinley Hill',
    totalSlots: 6,
    availableSlots: 0,
    batteryTypes: ['48V', '60V'],
    status: 'full' as const,
    hours: '07:00 – 21:00',
    lat: 14.5441,
    lng: 121.0562,
    distance: '1.9 km',
    waitTime: '15–20 min',
  },
  {
    id: 6,
    name: 'SwapDock Uptown Mall',
    address: 'Uptown Bonifacio, 9th Ave, BGC, Taguig',
    area: 'Uptown BGC',
    totalSlots: 10,
    availableSlots: 7,
    batteryTypes: ['48V', '60V', '72V'],
    status: 'open' as const,
    hours: '10:00 – 22:00',
    lat: 14.5561,
    lng: 121.0468,
    distance: '2.1 km',
    waitTime: '< 2 min',
  },
  {
    id: 7,
    name: 'ChargeNode Market! Market!',
    address: 'Market! Market!, 26th St, BGC, Taguig',
    area: 'Market! Market!',
    totalSlots: 20,
    availableSlots: 14,
    batteryTypes: ['48V', '60V', '72V'],
    status: 'open' as const,
    hours: '08:00 – 22:00',
    lat: 14.5538,
    lng: 121.0450,
    distance: '2.4 km',
    waitTime: '< 2 min',
  },
];

const STATUS_CONFIG = {
  open: { label: 'Available', color: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/30', icon: CheckCircle2 },
  busy: { label: 'Busy', color: 'text-brand-volt', bg: 'bg-brand-volt/10 border-brand-volt/30', icon: AlertCircle },
  full: { label: 'Full', color: 'text-brand-red', bg: 'bg-brand-red/10 border-brand-red/30', icon: XCircle },
};

const BATTERY_FILTERS = ['All', '48V', '60V', '72V'] as const;
const STATUS_FILTERS = ['All', 'Available', 'Busy'] as const;

export default function StationsPage() {
  const [search, setSearch] = useState('');
  const [batteryFilter, setBatteryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selected, setSelected] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { open } = useComingSoon();

  const handleFindMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  const filtered = useMemo(() => {
    let result = STATIONS.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.area.toLowerCase().includes(search.toLowerCase());
      const matchBattery = batteryFilter === 'All' || s.batteryTypes.includes(batteryFilter as '48V' | '60V' | '72V');
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Available' && s.status === 'open') ||
        (statusFilter === 'Busy' && s.status === 'busy');
      return matchSearch && matchBattery && matchStatus;
    });

    if (userLocation) {
      result = [...result].sort((a, b) => {
        const distA = getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    return result;
  }, [search, batteryFilter, statusFilter, userLocation]);

  return (
    <>
      <SiteHeader />

      <DottedSurface className="opacity-40" />

      <main className="relative isolate flex-1 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">

          {/* Header */}
          <FadeUp>
            <div className="mb-10">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-brand-green mb-4 block">
                7 Stations · BGC Pilot
              </span>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-foreground mb-3">
                    Find a Station
                  </h1>
                  <p className="text-muted-foreground text-base font-light max-w-lg">
                    Real-time slot availability across all BatterySwap PH hubs in Bonifacio Global City.
                  </p>
                </div>
                <button
                  onClick={handleFindMe}
                  disabled={isLocating}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-brand-green/30 bg-brand-green/5 text-brand-green text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-green/10 transition-colors disabled:opacity-50"
                >
                  <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-pulse' : ''}`} />
                  {isLocating ? 'Locating...' : 'Near Me'}
                </button>
              </div>
            </div>
          </FadeUp>

          {/* Filters */}
          <FadeUp delay={0.08}>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search station or area…"
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Battery type filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                {BATTERY_FILTERS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setBatteryFilter(v)}
                    className={`text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-2 rounded-lg border transition-colors ${
                      batteryFilter === v
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2">
                {STATUS_FILTERS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setStatusFilter(v)}
                    className={`text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-2 rounded-lg border transition-colors ${
                      statusFilter === v
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Map + list grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Map */}
            <FadeUp delay={0.1} className="lg:col-span-2 min-h-[420px]">
              <StationMap 
                stations={STATIONS} 
                selectedStationId={selected}
                onStationSelect={setSelected}
                userLocation={userLocation}
              />
            </FadeUp>

            {/* Station list */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card-brutal rounded-2xl p-10 text-center"
                  >
                    <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" strokeWidth={1} />
                    <p className="text-muted-foreground text-sm font-light">No stations match your filters.</p>
                  </motion.div>
                ) : (
                  filtered.map((station, idx) => {
                    const cfg = STATUS_CONFIG[station.status];
                    const StatusIcon = cfg.icon;
                    const isSelected = selected === station.id;
                    const dist = userLocation 
                      ? `${getDistance(userLocation.lat, userLocation.lng, station.lat, station.lng).toFixed(1)} km`
                      : station.distance;

                    return (
                      <motion.div
                        key={station.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <button
                          onClick={() => setSelected(isSelected ? null : station.id)}
                          className={`w-full text-left card-brutal rounded-2xl p-5 transition-all duration-300 ${
                            isSelected ? 'ring-1 ring-brand-green/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">
                                  {station.name}
                                </h3>
                                <span className={`inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                                  <StatusIcon className="h-2.5 w-2.5" />
                                  {cfg.label}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground font-light mb-3">{station.address}</p>

                              <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground font-mono">
                                <span className="flex items-center gap-1">
                                  <BatteryCharging className="h-3 w-3" />
                                  {station.availableSlots}/{station.totalSlots} slots
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {station.waitTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {dist}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className="flex gap-1">
                                {station.batteryTypes.map((bt) => (
                                  <span key={bt} className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">
                                    {bt}
                                  </span>
                                ))}
                              </div>
                              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                            </div>
                          </div>

                          {/* Expanded detail */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                                    <Clock className="h-3 w-3" />
                                    {station.hours}
                                  </div>
                                  {/* Slot bar */}
                                  <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-border overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        station.status === 'open' ? 'bg-brand-green' :
                                        station.status === 'busy' ? 'bg-brand-volt' : 'bg-brand-red'
                                      }`}
                                      style={{ width: `${(station.availableSlots / station.totalSlots) * 100}%` }}
                                    />
                                  </div>
                                  <Link
                                    href="/booking"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-lg transition-colors ${
                                      station.status === 'full'
                                        ? 'bg-card text-muted-foreground border border-border cursor-not-allowed'
                                        : 'bg-foreground text-background hover:opacity-90'
                                    }`}
                                  >
                                    <Zap className="h-3 w-3" />
                                    {station.status === 'full' ? 'Full' : 'Book Now'}
                                  </Link>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
