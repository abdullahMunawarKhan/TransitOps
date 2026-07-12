import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Fuel, ArrowUpRight } from 'lucide-react';

export default function TripDetailDrawer({
  selectedTrip,
  onClose,
  onMarkCompleted,
  onCancelTrip
}) {
  if (!selectedTrip) return null;

  return (
    <AnimatePresence>
      {selectedTrip && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-45"
          />
          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl border-l border-[#E5E7EB] z-50 flex flex-col"
          >
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2563EB] tracking-tight">{selectedTrip.id}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-500">{selectedTrip.region} Ops</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-1">{selectedTrip.cargo}</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/50 border border-slate-200 text-[#6B7280] flex items-center justify-center transition"
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Telemetry Header */}
              <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wide">Route Telemetry</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    Live GPS Syncing
                  </span>
                </div>
                
                {/* Visual Route Progress */}
                <div className="relative pt-2.5 flex items-center justify-between text-xs font-medium">
                  <div className="text-left w-1/3">
                    <div className="text-[10px] text-slate-400 uppercase">Origin</div>
                    <div className="font-bold text-slate-900 truncate">{selectedTrip.origin}</div>
                  </div>
                  
                  <div className="flex-1 px-4 relative flex flex-col items-center">
                    <div className="h-0.5 bg-slate-200 w-full relative">
                      <motion.div 
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedTrip.routeProgress}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                      <motion.div 
                        className="absolute w-2 h-2 rounded-full bg-blue-600 -top-0.5 border border-white"
                        initial={{ left: 0 }}
                        animate={{ left: `${selectedTrip.routeProgress}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1.5">{selectedTrip.routeProgress}% complete</span>
                  </div>

                  <div className="text-right w-1/3">
                    <div className="text-[10px] text-slate-400 uppercase">Destination</div>
                    <div className="font-bold text-slate-900 truncate">{selectedTrip.destination}</div>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-[#E5E7EB] rounded-xl">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Speed Status</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Activity size={14} className="text-blue-500 animate-pulse" /> {selectedTrip.speed}
                  </span>
                </div>
                <div className="p-3 border border-[#E5E7EB] rounded-xl">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Fuel Status</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Fuel size={14} className="text-[#F59E0B]" /> {selectedTrip.fuelStatus}
                  </span>
                </div>
                <div className="p-3 border border-[#E5E7EB] rounded-xl">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Temp Target</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedTrip.temperature}
                  </span>
                </div>
                <div className="p-3 border border-[#E5E7EB] rounded-xl">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">ETA Threshold</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedTrip.eta}
                  </span>
                </div>
              </div>

              {/* Driver Specs */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Driver Information</span>
                <div className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-xl bg-slate-50/20">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
                    {selectedTrip.driver.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900 leading-tight">{selectedTrip.driver}</div>
                    <span className="text-xs text-slate-500">Rating: {selectedTrip.driverRating}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-slate-700">{selectedTrip.driverPhone}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase">On Duty</span>
                  </div>
                </div>
              </div>

              {/* Specs Details */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle Specifications</span>
                <div className="p-4 border border-[#E5E7EB] rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model Name:</span>
                    <span className="font-bold text-slate-800">{selectedTrip.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telemetry ID:</span>
                    <span className="font-mono text-slate-800">VT-0492-CS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Classification:</span>
                    <span className="font-semibold text-slate-800">{selectedTrip.type}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Logs */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Audit log</span>
                <div className="space-y-4 relative pl-4.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <span className="absolute -left-4 w-2 h-2 rounded-full bg-blue-600 outline outline-4 outline-blue-50" />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-850">GPS checkpoint reached</span>
                      <span className="text-slate-400 ml-2">2h ago</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Passed waypoint station #14 (I-85 North)</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-4 w-2 h-2 rounded-full bg-blue-600 outline outline-4 outline-blue-50" />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-850">Telemetry synced</span>
                      <span className="text-slate-400 ml-2">4h ago</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Reefer temperature locked at 68°F</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-4 w-2 h-2 rounded-full bg-emerald-600 outline outline-4 outline-emerald-50" />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-850">Trip initiated</span>
                      <span className="text-slate-400 ml-2">6h ago</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Departed Atlanta Depot, load secured by J. Jenkins</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Actions */}
            <div className="p-4 border-t border-[#E5E7EB] bg-slate-50/50 flex gap-3">
              <button 
                onClick={onMarkCompleted}
                disabled={selectedTrip.status === 'Completed'}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Completed
              </button>
              <button 
                onClick={onCancelTrip}
                disabled={selectedTrip.status === 'Cancelled' || selectedTrip.status === 'Completed'}
                className="flex-1 border border-red-200 bg-white hover:bg-red-50 text-red-600 font-semibold py-2.5 px-4 rounded-xl text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Trip
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
