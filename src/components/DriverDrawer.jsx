import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldAlert, Ban, AlertTriangle, User, Phone, MapPin, 
  TrendingUp, Calendar, Compass, ShieldCheck, Activity, Star
} from 'lucide-react';

export default function DriverDrawer({ driver, onClose }) {
  if (!driver) return null;

  const today = new Date();
  const expiryDate = new Date(driver.licenseExpiry);
  const isExpired = expiryDate < today;

  // Rating and safety styles
  const getSafetyColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 70) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
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
                  Driver profile
                </span>
                <h3 className="font-bold text-base text-[#111827] mt-1">{driver.name}</h3>
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
              
              {/* Profile Illustration & Photo Box */}
              <div className="flex items-center gap-4.5 p-4 border border-[#E2E8F0] rounded-xl bg-slate-50/20">
                <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-white shadow flex items-center justify-center font-bold text-blue-700 text-lg flex-shrink-0">
                  {driver.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{driver.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      Class {driver.licenseCategory}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                      driver.status === 'Suspended' ? 'bg-red-50 text-red-750 border-red-100' :
                      isExpired ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      driver.status === 'On Trip' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {isExpired ? 'Expired' : driver.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* BUSINESS RULES SAFETY BANNERS */}
              {driver.status === 'Suspended' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                  <Ban size={16} className="text-red-650 flex-shrink-0 mt-0.5" />
                  <div className="text-[10px] text-red-750 leading-relaxed font-semibold">
                    🚫 Safety Alert: Driver profile suspended. Cannot receive routing assignments due to open disciplinary case.
                  </div>
                </div>
              )}

              {isExpired && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <ShieldAlert size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[10px] text-amber-750 leading-relaxed font-semibold">
                    ⚠️ Expiry warning: This driver has an expired commercial license. Licensing laws prevent dispatch assignments until renewed.
                  </div>
                </div>
              )}

              {driver.status === 'On Trip' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-blue-650 flex-shrink-0 mt-0.5" />
                  <div className="text-[10px] text-blue-750 leading-relaxed font-semibold">
                    🔷 Workload notification: Driver currently active on trip. Dispatching is restricted until completion.
                  </div>
                </div>
              )}

              {/* Core Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">License Number</span>
                  <span className="text-xs font-bold text-[#111827] font-mono mt-0.5 block">{driver.licenseNumber}</span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">License Expiry</span>
                  <span className={`text-xs font-bold mt-0.5 block ${isExpired ? 'text-red-650 font-extrabold' : 'text-slate-800'}`}>
                    {driver.licenseExpiry}
                  </span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Phone</span>
                  <span className="text-xs font-bold text-[#111827] font-mono mt-0.5 block">{driver.phone}</span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Current Vehicle</span>
                  <span className="text-xs font-bold text-[#111827] mt-0.5 flex items-center gap-1 block">
                    <Compass size={13} className="text-[#2563EB]" /> {driver.currentVehicle || 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Contact Specs */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <User size={14} className="text-slate-400" />
                  <span>Contact Information</span>
                </div>
                <div className="p-3.5 border border-[#E2E8F0] rounded-xl bg-slate-50/20 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Emergency Contact:</span>
                    <span className="font-semibold text-slate-800">{driver.emergencyContact || 'Jane Doe (Spouse)'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Emergency Phone:</span>
                    <span className="font-mono text-slate-800">{driver.emergencyPhone || '+1 (555) 012-3456'}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#64748B] flex-shrink-0">Home Address:</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]" title={driver.address || '742 Evergreen Terrace'}>
                      {driver.address || '742 Evergreen Terrace'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Score Indicators */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <TrendingUp size={14} className="text-slate-400" />
                  <span>Safety & Scoring Metrics</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                    <div className="text-lg font-bold text-slate-800 font-space">{driver.tripsCompleted}</div>
                    <span className="text-[10px] text-slate-500">Trips Completed</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                    <div className={`text-lg font-extrabold font-space rounded-lg border ${getSafetyColor(driver.safetyScore)}`}>
                      {driver.safetyScore}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Safety Score</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                    <div className="text-lg font-bold text-slate-800 font-space flex items-center justify-center gap-0.5">
                      4.9 <Star size={12} className="text-amber-500 fill-amber-500" />
                    </div>
                    <span className="text-[10px] text-slate-500">Driver Rating</span>
                  </div>
                </div>
              </div>

              {/* Violation Log */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <ShieldCheck size={14} className="text-slate-400" />
                  <span>Safety violations log</span>
                </div>
                <div className="p-3.5 border border-[#E2E8F0] rounded-xl bg-slate-50/20 text-xs">
                  {driver.violations && driver.violations.length > 0 ? (
                    driver.violations.map((v, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 first:pt-0 last:pb-0">
                        <div>
                          <span className="font-semibold text-slate-900 block">{v.type}</span>
                          <span className="text-[10px] text-slate-500">{v.details}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded px-1.5 py-0.5">
                          {v.date}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-center text-slate-400 font-medium">
                      ✅ 0 safety violations registered in past 12 months.
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline Activity */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <Activity size={14} className="text-slate-400" />
                  <span>Recent Activity Timeline</span>
                </div>
                <div className="space-y-4 pl-4 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-blue-600 outline outline-4 outline-blue-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Assigned to Route TRIP-8402</span>
                      <span className="text-[#64748B] ml-2 font-mono">10:15 AM</span>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Cargo: High Value Electronics. Vehicle: Cascadia #104</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-emerald-600 outline outline-4 outline-emerald-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Completed Standard Lube Service Log</span>
                      <span className="text-[#64748B] ml-2 font-mono">Yesterday</span>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Logged odometer check at Dallas station</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-slate-400 outline outline-4 outline-slate-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Weekly safety briefing completed</span>
                      <span className="text-[#64748B] ml-2 font-mono">3 days ago</span>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Standard fuel optimization briefing certification signed</p>
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
