'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Bike, Car, Zap, CheckCircle2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp } from '@/components/animations/FadeUp';

interface Vehicle {
  id: string;
  nickname: string;
  type: 'E-Bike' | 'E-Scooter' | 'E-Motorcycle' | 'Electric Car';
  brand: string;
  model: string;
  plateOrSerial: string;
  batteryType: '48V' | '60V' | '72V';
  isPrimary: boolean;
}

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'v1', nickname: 'My E-Bike',    type: 'E-Bike',     brand: 'TNTREK', model: 'City Pro 48',  plateOrSerial: 'EB-2024-0012', batteryType: '48V', isPrimary: true  },
  { id: 'v2', nickname: 'Work Scooter', type: 'E-Scooter',  brand: 'Inokim', model: 'OX',           plateOrSerial: 'ABC-1234',     batteryType: '48V', isPrimary: false },
];

const VEHICLE_TYPE_ICONS: Record<string, React.ElementType> = {
  'E-Bike': Bike, 'E-Scooter': Bike, 'E-Motorcycle': Bike, 'Electric Car': Car,
};

const VEHICLE_TYPES = ['E-Bike', 'E-Scooter', 'E-Motorcycle', 'Electric Car'] as const;
const BATTERY_TYPES = ['48V', '60V', '72V'] as const;

function VehicleForm({ onSave, onClose }: { onSave: (v: Omit<Vehicle, 'id' | 'isPrimary'>) => void; onClose: () => void }) {
  const [nickname, setNickname] = useState('');
  const [type, setType] = useState<Vehicle['type']>('E-Bike');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [plateOrSerial, setPlateOrSerial] = useState('');
  const [batteryType, setBatteryType] = useState<Vehicle['batteryType']>('48V');

  const save = () => {
    if (!nickname || !brand || !model || !plateOrSerial) return;
    onSave({ nickname, type, brand, model, plateOrSerial, batteryType });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close" />
      <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        <h2 className="font-display text-2xl uppercase tracking-tight text-foreground mb-6">Add Vehicle</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Nickname</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="My E-Bike"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Vehicle Type</label>
            <div className="grid grid-cols-2 gap-2">
              {VEHICLE_TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-xl border transition-all ${
                    type === t ? 'border-brand-green/50 bg-brand-green/10 text-brand-green' : 'border-border text-muted-foreground hover:border-border/80'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Brand</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="TNTREK"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Model</label>
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="City Pro"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Plate / Serial No.</label>
            <input type="text" value={plateOrSerial} onChange={(e) => setPlateOrSerial(e.target.value)} placeholder="ABC-1234"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green/50 focus:outline-none font-mono transition-colors" />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Battery Voltage</label>
            <div className="flex gap-2">
              {BATTERY_TYPES.map((b) => (
                <button key={b} onClick={() => setBatteryType(b)}
                  className={`flex-1 text-xs font-bold uppercase tracking-wide py-2 rounded-xl border transition-all ${
                    batteryType === b ? 'border-brand-green/50 bg-brand-green/10 text-brand-green' : 'border-border text-muted-foreground hover:border-border/80'
                  }`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card/80 transition-colors">Cancel</button>
          <button onClick={save}
            className="flex-1 py-3 rounded-full bg-brand-green text-background text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
            Save Vehicle
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const addVehicle = (v: Omit<Vehicle, 'id' | 'isPrimary'>) => {
    setVehicles((prev) => [...prev, { ...v, id: `v${Date.now()}`, isPrimary: false }]);
    setShowForm(false);
  };

  const removeVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setDeleteId(null);
  };

  const setPrimary = (id: string) => {
    setVehicles((prev) => prev.map((v) => ({ ...v, isPrimary: v.id === id })));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <FadeUp>
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-foreground mb-2">My Vehicles</h1>
            <p className="text-muted-foreground text-sm font-light">Manage your e-bikes and EVs registered to your account.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity shrink-0">
            <Plus className="h-4 w-4" /> Add Vehicle
          </button>
        </div>
      </FadeUp>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {vehicles.map((v, idx) => {
            const VehicleIcon = VEHICLE_TYPE_ICONS[v.type] ?? Bike;
            return (
              <motion.div key={v.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }}>
                <div className={`card-brutal rounded-2xl p-5 transition-all ${v.isPrimary ? 'ring-1 ring-brand-green/30' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                      <VehicleIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">{v.nickname}</h3>
                        {v.isPrimary && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border border-brand-green/30 bg-brand-green/10 text-brand-green">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-light mb-3">
                        {v.brand} {v.model} · {v.type}
                      </p>
                      <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{v.batteryType}</span>
                        <span className="font-mono">{v.plateOrSerial}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!v.isPrimary && (
                        <button onClick={() => setPrimary(v.id)}
                          className="text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                          Set Primary
                        </button>
                      )}
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(v.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-brand-red hover:bg-brand-red/10 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {vehicles.length === 0 && (
          <div className="card-brutal rounded-2xl p-10 text-center">
            <Bike className="h-8 w-8 text-muted-foreground mx-auto mb-3" strokeWidth={1} />
            <p className="text-muted-foreground text-sm font-light mb-4">No vehicles added yet.</p>
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
              <Plus className="h-3.5 w-3.5" /> Add your first vehicle
            </button>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <button type="button" onClick={() => setDeleteId(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-2xl text-center">
              <Trash2 className="h-8 w-8 text-brand-red mx-auto mb-4" strokeWidth={1.5} />
              <h2 className="font-display text-2xl uppercase tracking-tight text-foreground mb-2">Remove Vehicle?</h2>
              <p className="text-muted-foreground text-sm font-light mb-6">This will remove the vehicle from your account.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-full border border-border text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card transition-colors">Cancel</button>
                <button onClick={() => removeVehicle(deleteId!)} className="flex-1 py-3 rounded-full bg-brand-red text-white text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add form */}
      <AnimatePresence>
        {showForm && <VehicleForm onSave={addVehicle} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}
