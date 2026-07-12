import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Info, Wrench, Fuel, Navigation, Shield, User, 
  TrendingUp, Calendar, Compass, ShieldAlert, Sparkles, Activity
} from 'lucide-react';

export default function VehicleDrawer({ vehicle, onClose }) {
  if (!vehicle) return null;

  // Render SVG illustration representing the vehicle category
  const renderVehicleIllustration = (type) => {
    switch (type) {
      case 'Electric Truck':
        return (
          <div className="w-full h-32 bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 rounded-xl relative flex items-center justify-center overflow-hidden border border-indigo-950 shadow-inner">
            <div className="absolute top-1.5 right-2 text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 animate-pulse">
              ⚡ EV ACTIVE
            </div>
            {/* Minimal SVG Electric Semi illustration */}
            <svg viewBox="0 0 200 80" className="w-40 h-20 text-indigo-400 opacity-90 drop-shadow-md">
              <path d="M20 45h60v15H20z" fill="currentColor" opacity="0.3"/>
              <path d="M80 40h70v20H80z" fill="currentColor"/>
              <path d="M125 25h20l12 18h-32z" fill="currentColor" opacity="0.8"/>
              <circle cx="40" cy="60" r="8" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
              <circle cx="70" cy="60" r="8" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
              <circle cx="120" cy="60" r="8" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
              <circle cx="140" cy="60" r="8" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
              {/* Lightning plug bolt */}
              <path d="M10 30l8-8-5 12h8l-8 8" stroke="#10b981" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        );
      case 'Cargo Van':
        return (
          <div className="w-full h-32 bg-gradient-to-tr from-slate-800 via-slate-900 to-indigo-950 rounded-xl relative flex items-center justify-center overflow-hidden border border-slate-700 shadow-inner">
            <div className="absolute top-1.5 right-2 text-[9px] font-mono text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-900">
              CLASS-B VAN
            </div>
            {/* Cargo Van illustration */}
            <svg viewBox="0 0 200 80" className="w-40 h-20 text-slate-300 opacity-90 drop-shadow-md">
              <path d="M30 48h110v12H30z" fill="currentColor" opacity="0.3"/>
              <path d="M40 30h90v25H40z" fill="currentColor"/>
              <path d="M130 35h15l10 12v8h-25z" fill="currentColor" opacity="0.95"/>
              <circle cx="60" cy="58" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="125" cy="58" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            </svg>
          </div>
        );
      case 'Semi-Truck':
      default:
        return (
          <div className="w-full h-32 bg-gradient-to-tr from-blue-950 via-slate-900 to-slate-900 rounded-xl relative flex items-center justify-center overflow-hidden border border-slate-700 shadow-inner">
            <div className="absolute top-1.5 right-2 text-[9px] font-mono text-amber-500 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-900">
              CLASS-8 HEAVY
            </div>
            {/* Semi Truck and Trailer illustration */}
            <svg viewBox="0 0 200 80" className="w-44 h-22 text-blue-400 opacity-90 drop-shadow-md">
              <path d="M10 25h110v30H10z" fill="#3b82f6" opacity="0.75"/>
              <path d="M120 38h45v17h-45z" fill="#60a5fa"/>
              <path d="M142 28h15l10 10v17h-25z" fill="#2563eb"/>
              <circle cx="28" cy="56" r="7" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="48" cy="56" r="7" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="95" cy="56" r="7" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="110" cy="56" r="7" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="148" cy="56" r="7" fill="#1e293b" stroke="#2563eb" strokeWidth="2" />
            </svg>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-45 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
        />

        {/* Panel wrapper */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="w-screen max-w-md bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E2E8F0] bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                  {vehicle.regNumber}
                </span>
                <h3 className="font-bold text-base text-[#111827] mt-1">{vehicle.name}</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/50 border border-slate-200 text-[#64748B] flex items-center justify-center transition outline-none"
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Image Illustration */}
              {renderVehicleIllustration(vehicle.type)}

              {/* Core Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Odometer</span>
                  <span className="text-sm font-bold text-[#111827] font-mono mt-0.5 block">{vehicle.odometer}</span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Acquisition Cost</span>
                  <span className="text-sm font-bold text-[#111827] font-mono mt-0.5 block">{vehicle.cost}</span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Max Load Capacity</span>
                  <span className="text-sm font-bold text-[#111827] mt-0.5 block">{vehicle.capacity}</span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Current Driver</span>
                  <span className="text-sm font-bold text-[#111827] mt-0.5 flex items-center gap-1 block">
                    <User size={13} className="text-[#2563EB]" /> {vehicle.driver || 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Insurance Info Card */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <Shield size={14} className="text-slate-400" />
                  <span>Insurance Details</span>
                </div>
                <div className="p-3.5 border border-[#E2E8F0] rounded-xl bg-slate-50/20 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Policy Carrier:</span>
                    <span className="font-semibold text-slate-800">State Farm Cargo Fleet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Policy Number:</span>
                    <span className="font-mono text-slate-800">INS-0948-TX-22</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Expiration Date:</span>
                    <span className="font-semibold text-emerald-600">2027-04-18 (Active)</span>
                  </div>
                </div>
              </div>

              {/* Operational Stats summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <TrendingUp size={14} className="text-slate-400" />
                  <span>Operations Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                    <div className="text-lg font-bold text-slate-800 font-space">45</div>
                    <span className="text-[10px] text-slate-500">Trips Completed</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                    <div className="text-lg font-bold text-slate-800 font-space">8.2k</div>
                    <span className="text-[10px] text-slate-500">Gallons Fuel</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                    <div className="text-lg font-bold text-slate-800 font-space">98%</div>
                    <span className="text-[10px] text-slate-500">On-Time Rate</span>
                  </div>
                </div>
              </div>

              {/* Maintenance Timeline logs */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <Wrench size={14} className="text-slate-400" />
                  <span>Maintenance History</span>
                </div>
                <div className="p-3.5 border border-[#E2E8F0] rounded-xl bg-slate-50/20 divide-y divide-slate-100 text-xs">
                  {vehicle.maintenanceLogs && vehicle.maintenanceLogs.length > 0 ? (
                    vehicle.maintenanceLogs.map((log, idx) => (
                      <div key={idx} className={`py-2 ${idx === 0 ? 'pt-0' : ''} ${idx === vehicle.maintenanceLogs.length - 1 ? 'pb-0' : ''}`}>
                        <div className="flex justify-between font-semibold text-[#111827]">
                          <span>{log.type}</span>
                          <span className="font-mono text-slate-500">{log.cost}</span>
                        </div>
                        <div className="text-[10px] text-[#64748B] mt-0.5 flex justify-between">
                          <span>{log.description}</span>
                          <span>{log.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-center text-slate-400">
                      No maintenance records registered.
                    </div>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <Activity size={14} className="text-slate-400" />
                  <span>Recent Status Timeline</span>
                </div>
                <div className="space-y-4 pl-4 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-blue-600 outline outline-4 outline-blue-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Status changed to On Trip</span>
                      <span className="text-[#64748B] ml-2 font-mono">10:15 AM</span>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Assigned to Route TRIP-8402 (Atlanta Depot)</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-emerald-600 outline outline-4 outline-emerald-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Maintenance release</span>
                      <span className="text-[#64748B] ml-2 font-mono">Yesterday</span>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Approved by Inspector Marcus Vance after oil service</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-amber-500 outline outline-4 outline-amber-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Entered Shop</span>
                      <span className="text-[#64748B] ml-2 font-mono">3 days ago</span>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Scheduled 100k-mile standard engine lube service</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
