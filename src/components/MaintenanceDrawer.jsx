import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Wrench, ShieldAlert, Calendar, DollarSign, User, Activity, 
  MapPin, Compass, ArrowUpRight, CheckCircle2, FileText, ClipboardList
} from 'lucide-react';

export default function MaintenanceDrawer({ record, onClose }) {
  if (!record) return null;

  // Status mapping
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Cancelled':
        return 'bg-red-50 text-red-750 border-red-100';
      case 'Scheduled':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-100';
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
                  Service record details
                </span>
                <h3 className="font-bold text-base text-[#111827] mt-1">{record.vehicle}</h3>
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
              
              {/* Service Type Identification Card */}
              <div className="flex items-center gap-4.5 p-4 border border-[#E2E8F0] rounded-xl bg-slate-50/20">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-750 flex-shrink-0">
                  <Wrench size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{record.serviceType}</h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      ID: {record.id}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getStatusStyle(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business Status Synchronization Banner */}
              {record.status === 'In Progress' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <Activity size={16} className="text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-[10px] text-amber-750 leading-relaxed font-semibold">
                    ⚡ Status Lock: This vehicle is currently locked in workshop ("In Shop") and is temporarily removed from the routing dispatcher board.
                  </div>
                </div>
              )}

              {record.status === 'Completed' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-650 flex-shrink-0 mt-0.5" />
                  <div className="text-[10px] text-emerald-750 leading-relaxed font-semibold">
                    ✅ Service Finalized: Maintenance completed. Vehicle status has successfully updated to "Available" and released back for dispatch.
                  </div>
                </div>
              )}

              {/* Core Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Mechanic Assigned</span>
                  <span className="text-xs font-bold text-[#111827] mt-0.5 block">{record.mechanic}</span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Service Priority</span>
                  <span className={`text-xs font-bold mt-0.5 block ${
                    record.priority === 'Critical' ? 'text-red-650' : 'text-slate-800'
                  }`}>
                    {record.priority || 'Medium'} Priority
                  </span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Est. Completion</span>
                  <span className="text-xs font-bold text-[#111827] font-mono mt-0.5 block">{record.expectedCompletion}</span>
                </div>
                <div className="p-3 border border-[#E2E8F0] rounded-xl bg-slate-50/10">
                  <span className="block text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Start Date</span>
                  <span className="text-xs font-bold text-[#111827] font-mono mt-0.5 block">{record.startDate}</span>
                </div>
              </div>

              {/* Cost Specifications */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <DollarSign size={14} className="text-slate-400" />
                  <span>Cost breakdown</span>
                </div>
                <div className="p-3.5 border border-[#E2E8F0] rounded-xl bg-slate-50/20 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Estimated Budget Cost:</span>
                    <span className="font-semibold font-mono text-slate-800">${record.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Actual Service Cost:</span>
                    <span className="font-bold font-mono text-slate-900">
                      {record.actualCost ? `$${record.actualCost.toLocaleString()}` : 'TBD (In Progress)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Replaced Parts Log */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <ClipboardList size={14} className="text-slate-400" />
                  <span>Replaced Parts & Audit Checklist</span>
                </div>
                <div className="p-3.5 border border-[#E2E8F0] rounded-xl bg-slate-50/20 text-xs">
                  {record.status === 'Completed' ? (
                    <ul className="space-y-1.5 list-disc pl-4 font-semibold text-slate-800">
                      <li>OEM Replacement Front Brake Rotors</li>
                      <li>Ceramic Brake Pad Set</li>
                      <li>Standard Synthetic Engine Lube</li>
                      <li>New Fluid Seals & Core Gaskets</li>
                    </ul>
                  ) : (
                    <div className="py-2 text-center text-slate-400 font-medium">
                      🛠️ Pending diagnostics summary reports.
                    </div>
                  )}
                </div>
              </div>

              {/* Maintenance Notes */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <FileText size={14} className="text-slate-400" />
                  <span>Mechanic Workshop Notes</span>
                </div>
                <div className="p-3.5 border border-[#E2E8F0] rounded-xl bg-slate-50/20 text-xs text-slate-650 leading-relaxed font-semibold italic">
                  "{record.remarks || 'Standard fleet service interval checks. Telematics checks cleared with zero diagnostic codes.'}"
                </div>
              </div>

              {/* Workshop Timeline */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <Activity size={14} className="text-slate-400" />
                  <span>Maintenance lifecycle timeline</span>
                </div>
                <div className="space-y-4 pl-4 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-emerald-600 outline outline-4 outline-emerald-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Vehicle Released & Available</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Post-service test drive cleared. Odometer check: 142,504 mi.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-blue-600 outline outline-4 outline-blue-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Parts installed & diagnostic verification</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Brake pads and rotors aligned. Lube replacement checked.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[16px] w-2 h-2 rounded-full bg-slate-400 outline outline-4 outline-slate-50" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">Vehicle scheduled and checked into shop</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Scheduled lubes and regular inspection interval.</p>
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
