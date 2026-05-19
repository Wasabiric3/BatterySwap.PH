'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronRight, Battery, MapPin, Zap, PlugZap } from 'lucide-react';

export function PricingCalculator() {
  const [dailyKm, setDailyKm] = useState(25);
  const [chargingPrice, setChargingPrice] = useState(35); // Public Fast Charging PHP/kWh
  const [bikeEfficiency, setBikeEfficiency] = useState(30); // 30km per kWh for average E-Bike
  const [daysPerMonth, setDaysPerMonth] = useState(22); // Commuting days
  
  // Battery Degradation Assumptions
  const [batteryCost, setBatteryCost] = useState(18000); // Average replacement battery cost
  const [batteryLifespan, setBatteryLifespan] = useState(18); // Average lifespan in months with heavy use

  const [currentCost, setCurrentCost] = useState(0);
  const [swapCost, setSwapCost] = useState(0);
  const [savings, setSavings] = useState(0);

  // BatterySwap plan assumption:
  // Pro Commuter Plan: PHP 1,499 for 20 swaps/month.
  // 1 swap = roughly 45km range.
  const SWAP_RANGE = 45;
  const PRO_PLAN_COST = 1499;

  useEffect(() => {
    // 1. Calculate charging cost at public stations
    const monthlyKm = dailyKm * daysPerMonth;
    const kwhNeeded = monthlyKm / bikeEfficiency;
    const calculatedChargingCost = kwhNeeded * chargingPrice;
    
    // 2. Calculate battery degradation (monthly replacement fund)
    const monthlyBatteryDepreciation = batteryCost / batteryLifespan;

    // Total current cost without BatterySwap
    const totalCurrentMonthlyCost = calculatedChargingCost + monthlyBatteryDepreciation;
    
    // Calculate BatterySwap cost
    let estimatedSwapCost = PRO_PLAN_COST;
    const swapsNeeded = Math.ceil(monthlyKm / SWAP_RANGE);
    if (swapsNeeded > 20) {
      // Add extra cost for pay-per-swap if they exceed 20 (e.g., PHP 80 per swap)
      estimatedSwapCost += (swapsNeeded - 20) * 80;
    }

    setCurrentCost(Math.round(totalCurrentMonthlyCost));
    setSwapCost(estimatedSwapCost);
    setSavings(Math.round(totalCurrentMonthlyCost - estimatedSwapCost));

  }, [dailyKm, chargingPrice, bikeEfficiency, daysPerMonth, batteryCost, batteryLifespan]);

  return (
    <div className="card-brutal rounded-3xl p-6 md:p-10 relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-[80px] pointer-events-none" />

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
         
         {/* Input Section */}
         <div className="flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-green/30 bg-brand-green/5 mb-4">
                <Calculator className="h-3 w-3 text-brand-green" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
                  Savings Calculator
                </span>
              </div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-foreground mb-2">
                Calculate Your Savings
              </h2>
              <p className="text-muted-foreground text-sm font-light">
                See how much you save by avoiding battery degradation and public fast-charging fees.
              </p>
            </div>

            <div className="space-y-6">
               {/* Slider 1: Daily KM */}
               <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-xs font-medium tracking-wide uppercase text-muted-foreground flex items-center gap-2">
                       <MapPin className="h-3.5 w-3.5" /> Daily Travel (KM)
                    </label>
                    <span className="font-mono text-brand-volt font-bold">{dailyKm} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    value={dailyKm} 
                    onChange={(e) => setDailyKm(Number(e.target.value))}
                    className="w-full h-1.5 bg-card rounded-lg appearance-none cursor-pointer accent-brand-volt"
                  />
               </div>

               {/* Slider 2: Charging Price */}
               <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-xs font-medium tracking-wide uppercase text-muted-foreground flex items-center gap-2">
                       <PlugZap className="h-3.5 w-3.5" /> Public Charge (PHP/kWh)
                    </label>
                    <span className="font-mono text-foreground">{chargingPrice} ₱</span>
                  </div>
                  <input 
                    type="range" 
                    min="15" 
                    max="60" 
                    value={chargingPrice} 
                    onChange={(e) => setChargingPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-card rounded-lg appearance-none cursor-pointer accent-white"
                  />
               </div>
               
               {/* Secondary Settings Grid */}
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="col-span-2">
                     <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-brand-volt mb-3 flex items-center gap-1.5">
                       <Battery className="h-3.5 w-3.5" /> Advanced Settings
                     </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-2">
                       Days/Month
                    </label>
                    <select 
                      value={daysPerMonth}
                      onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-volt/50"
                    >
                       <option value={15}>15 Days</option>
                       <option value={22}>22 Days (Workdays)</option>
                       <option value={30}>30 Days (Everyday)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-2">
                       E-Bike KM/kWh
                    </label>
                    <input 
                      type="number" 
                      value={bikeEfficiency}
                      onChange={(e) => setBikeEfficiency(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-volt/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-2">
                       New Battery (₱)
                    </label>
                    <input 
                      type="number" 
                      value={batteryCost}
                      onChange={(e) => setBatteryCost(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-volt/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-2">
                       Lifespan (Mo)
                    </label>
                    <input 
                      type="number" 
                      value={batteryLifespan}
                      onChange={(e) => setBatteryLifespan(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-volt/50 font-mono"
                    />
                  </div>
               </div>
            </div>
         </div>

         {/* Results Section */}
         <div className="flex flex-col justify-center">
            <div className="bg-background border border-border rounded-3xl p-8 shadow-2xl relative">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 h-8 w-8 border-t-2 border-r-2 border-brand-green/30" />
                <div className="absolute -bottom-4 -left-4 h-8 w-8 border-b-2 border-l-2 border-brand-volt/30" />

                <div className="space-y-6">
                   {/* Charging + Degradation Cost */}
                   <div className="flex justify-between items-start">
                     <div className="flex flex-col">
                       <span className="text-sm font-light text-muted-foreground">Current Monthly Cost</span>
                       <span className="text-[10px] text-muted-foreground uppercase mt-0.5 tracking-wider">Charging + Battery Deg.</span>
                     </div>
                     <span className="font-mono text-lg text-muted-foreground">₱ {currentCost.toLocaleString()}</span>
                   </div>
                   
                   {/* Swap Cost */}
                   <div className="flex justify-between items-center pb-6 border-b border-border">
                     <span className="text-sm font-light text-brand-volt flex items-center gap-2">
                        <Zap className="h-4 w-4" /> BatterySwap Cost
                     </span>
                     <span className="font-mono text-lg text-brand-volt">₱ {swapCost.toLocaleString()}</span>
                   </div>

                   {/* Total Savings */}
                   <div>
                     <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">
                        Estimated Monthly Savings
                     </span>
                     <div className="flex items-end gap-3">
                        <span className="text-2xl font-mono text-brand-green font-bold mb-1">₱</span>
                        <AnimatePresence mode="wait">
                          <motion.span 
                            key={savings}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`font-display text-6xl tracking-tight ${savings > 0 ? 'text-brand-green' : 'text-red-400'}`}
                          >
                            {Math.abs(savings).toLocaleString()}
                          </motion.span>
                        </AnimatePresence>
                     </div>
                     {savings < 0 && (
                        <p className="text-xs text-red-400/70 mt-2">
                           Your current setup might be cheaper for very low mileage.
                        </p>
                     )}
                   </div>

                   <button className="w-full mt-4 flex justify-between items-center py-4 px-6 rounded-2xl bg-foreground text-background font-bold text-sm uppercase tracking-wide hover:bg-white/90 transition-colors group">
                      Choose Pro Commuter Plan
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
            </div>
         </div>

       </div>
    </div>
  );
}
