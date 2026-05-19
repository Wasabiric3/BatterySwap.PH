'use client';

import { create } from 'zustand';

export type BatteryType = '48V' | '60V' | '72V';
export type PaymentMethod = 'gcash' | 'maya' | 'card' | 'cash';

export interface BookingStation {
  id: number;
  name: string;
  address: string;
  availableSlots: number;
}

export interface BookingVehicle {
  id: string;
  nickname: string;
  type: string;
  plateOrSerial: string;
}

interface BookingStore {
  step: number;
  station: BookingStation | null;
  batteryType: BatteryType | null;
  slotTime: Date | null;
  vehicle: BookingVehicle | null;
  paymentMethod: PaymentMethod | null;
  bookingId: string | null;
  qrToken: string | null;

  setStation: (s: BookingStation) => void;
  setBatteryType: (t: BatteryType) => void;
  setSlotTime: (d: Date) => void;
  setVehicle: (v: BookingVehicle) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  confirmBooking: () => void;
  next: () => void;
  back: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  step: 1,
  station: null,
  batteryType: null,
  slotTime: null,
  vehicle: null,
  paymentMethod: null,
  bookingId: null,
  qrToken: null,

  setStation: (s) => set({ station: s }),
  setBatteryType: (t) => set({ batteryType: t }),
  setSlotTime: (d) => set({ slotTime: d }),
  setVehicle: (v) => set({ vehicle: v }),
  setPaymentMethod: (m) => set({ paymentMethod: m }),
  confirmBooking: () => {
    const id = `BSW-${Date.now().toString(36).toUpperCase()}`;
    set({ bookingId: id, qrToken: id });
  },
  next: () => set((s) => ({ step: Math.min(s.step + 1, 6) })),
  back: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  reset: () =>
    set({
      step: 1, station: null, batteryType: null, slotTime: null,
      vehicle: null, paymentMethod: null, bookingId: null, qrToken: null,
    }),
}));
