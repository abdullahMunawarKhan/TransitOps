import React from 'react';
import { motion } from 'framer-motion';

export default function VehicleStatusCard({
  availableCount = 18,
  availablePercent = '30%',
  onTripCount = 42,
  onTripPercent = '60%',
  inShopCount = 5,
  inShopPercent = '8%',
  retiredCount = 2,
  retiredPercent = '2%',
  totalCapacity = 65
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 flex flex-col h-full justify-between">
      <div className="mb-4">
        <h2 className="font-bold text-base text-slate-900">Vehicle Status</h2>
        <p className="text-xs text-slate-500 mt-0.5">Real-time allocation map of the TransitOps fleet.</p>
      </div>

      {/* Horizontal Progress Bars */}
      <div className="space-y-4 flex-1 flex flex-col justify-center py-2">
        
        {/* Available */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="text-slate-900">{availableCount} Vehicles ({availablePercent})</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: availablePercent }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-[#22C55E]"
            />
          </div>
        </div>

        {/* On Trip */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-blue-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> On Trip
            </span>
            <span className="text-slate-900">{onTripCount} Vehicles ({onTripPercent})</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: onTripPercent }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-[#2563EB]"
            />
          </div>
        </div>

        {/* In Shop */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-amber-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> In Shop
            </span>
            <span className="text-slate-900">{inShopCount} Vehicles ({inShopPercent})</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: inShopPercent }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-[#F59E0B]"
            />
          </div>
        </div>

        {/* Retired */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" /> Retired
            </span>
            <span className="text-slate-900">{retiredCount} Vehicles ({retiredPercent})</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: retiredPercent }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full bg-slate-400"
            />
          </div>
        </div>

      </div>

      <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-slate-500">
        <span>Total Registered Fleet Capacity:</span>
        <span className="font-bold text-slate-800">{totalCapacity} Units</span>
      </div>
    </div>
  );
}
