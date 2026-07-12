import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, CheckCircle2, Navigation, AlertTriangle, ShieldCheck, 
  MapPin, Compass, Play, DollarSign, Fuel, Users, Activity, 
  Sparkles, ShieldAlert, ArrowUpRight, TrendingUp, HelpCircle, RotateCcw,
  Wrench, Calendar, XCircle, Search, Filter, ChevronDown, X, Clock
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

// Import subcomponents
import MaintenanceTable from './MaintenanceTable';
import MaintenanceDrawer from './MaintenanceDrawer';

// Interactive Donut Chart for Service Type Distribution
const ServiceTypeDistributionChart = ({ records }) => {
  const total = records.length || 1;
  const oilChange = records.filter(r => r.serviceType === 'Oil Change').length;
  const brakes = records.filter(r => r.serviceType === 'Brake Service').length;
  const engine = records.filter(r => r.serviceType === 'Engine Repair').length;
  const other = total - (oilChange + brakes + engine);

  const segments = [
    { label: 'Oil Change', value: oilChange, percent: Math.round((oilChange/total)*100) || 0, color: '#3b82f6' },
    { label: 'Brake Service', value: brakes, percent: Math.round((brakes/total)*100) || 0, color: '#f59e0b' },
    { label: 'Engine Repair', value: engine, percent: Math.round((engine/total)*100) || 0, color: '#ef4444' },
    { label: 'Other Diagnostics', value: other, percent: Math.round((other/total)*100) || 0, color: '#10b981' }
  ];

  let accumulatedPercent = 0;

  return (
    <div className="flex items-center gap-6 py-1">
      <svg width="95" height="95" viewBox="0 0 36 36" className="transform -rotate-90 flex-shrink-0">
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f8fafc" strokeWidth="3" />
        {segments.map((seg, idx) => {
          if (seg.percent === 0) return null;
          const strokeDash = `${seg.percent} ${100 - seg.percent}`;
          const strokeOffset = 100 - accumulatedPercent;
          accumulatedPercent += seg.percent;

          return (
            <motion.circle
              key={idx}
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke={seg.color}
              strokeWidth="3.2"
              strokeDasharray={strokeDash}
              strokeDashoffset={100}
              animate={{ strokeDashoffset: strokeOffset }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          );
        })}
      </svg>
      <div className="flex-grow space-y-1.5 text-[10px] font-bold">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </span>
            <span className="text-slate-800">{seg.value} logs ({seg.percent}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Monthly Maintenance Costs SVG Bar Chart
const MonthlyCostChart = ({ records }) => {
  // Mock monthly breakdowns
  const data = [
    { month: 'Mar', cost: 3450, color: '#94a3b8' },
    { month: 'Apr', cost: 4200, color: '#94a3b8' },
    { month: 'May', cost: 6850, color: '#94a3b8' },
    { month: 'Jun', cost: 8450, color: '#2563EB' } // Current month highlighted
  ];

  const maxCost = Math.max(...data.map(d => d.cost)) || 1;

  return (
    <div className="flex h-20 items-end justify-between px-2 pt-2 gap-4">
      {data.map((item, idx) => {
        const heightPercent = `${(item.cost / maxCost) * 100}%`;
        return (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div className="w-full h-12 flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: heightPercent }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                className="w-full rounded-t-md relative cursor-pointer"
                style={{ backgroundColor: item.color }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[8px] px-1 py-0.5 rounded opacity-0 hover:opacity-100 transition duration-150 pointer-events-none mb-1 font-mono whitespace-nowrap z-10">
                  ${item.cost.toLocaleString()}
                </div>
              </motion.div>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold mt-1 truncate w-full text-center">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function MaintenanceView() {
  // 1. Initial State
  const [records, setRecords] = useState([
    {
      id: 'WO-8409',
      vehicle: 'Freightliner Cascadia #104',
      serviceType: 'Brake Service',
      workshop: 'Dallas Fleet Hub',
      mechanic: 'Arthur Dent',
      priority: 'Medium',
      estimatedCost: 1200,
      actualCost: 1150,
      startDate: '2026-07-02',
      expectedCompletion: '2026-07-03',
      status: 'Completed',
      remarks: 'OEM brake pad assembly replacement. Telematics test drive passed.'
    },
    {
      id: 'WO-8412',
      vehicle: 'Volvo VNL 860 #112',
      serviceType: 'Engine Repair',
      workshop: 'Chicago West Garage',
      mechanic: 'Tricia McMillan',
      priority: 'Critical',
      estimatedCost: 3500,
      actualCost: null,
      startDate: '2026-07-10',
      expectedCompletion: '2026-07-14',
      status: 'In Progress',
      remarks: 'Engine cylinder head gasket replacement in progress.'
    },
    {
      id: 'WO-8415',
      vehicle: 'Tesla Semi #401',
      serviceType: 'General Inspection',
      workshop: 'Houston Electric Station',
      mechanic: 'Ford Prefect',
      priority: 'Low',
      estimatedCost: 450,
      actualCost: 450,
      startDate: '2026-07-12',
      expectedCompletion: '2026-07-13',
      status: 'Completed',
      remarks: 'Standard battery thermal fluid inspection. Software version updated.'
    },
    {
      id: 'WO-8418',
      vehicle: 'Ford E-350 Cargo Van #203',
      serviceType: 'Oil Change',
      workshop: 'Dallas Fleet Hub',
      mechanic: 'Zaphod Beeblebrox',
      priority: 'Low',
      estimatedCost: 150,
      actualCost: null,
      startDate: '2026-07-15',
      expectedCompletion: '2026-07-15',
      status: 'Scheduled',
      remarks: 'Regular 10k mile maintenance checkup.'
    }
  ]);

  // 2. Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');

  // 3. UI control states
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [recordToComplete, setRecordToComplete] = useState(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formError, setFormError] = useState('');

  // Form input states
  const [formVehicle, setFormVehicle] = useState('');
  const [formService, setFormService] = useState('Oil Change');
  const [formWorkshop, setFormWorkshop] = useState('Dallas Fleet Hub');
  const [formMechanic, setFormMechanic] = useState('');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formEstCost, setFormEstCost] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCompletion, setFormCompletion] = useState('');
  const [formStatus, setFormStatus] = useState('Scheduled');
  const [formRemarks, setFormRemarks] = useState('');

  // 4. Filtering logic
  const filteredRecords = records.filter(r => {
    const matchesSearch = r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.mechanic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesService = filterService === 'All' || r.serviceType === filterService;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Calculate Metrics
  const totalInShop = records.filter(r => r.status === 'In Progress').length;
  const totalCompleted = records.filter(r => r.status === 'Completed').length;
  const totalScheduled = records.filter(r => r.status === 'Scheduled').length;
  const totalCost = records.reduce((acc, r) => acc + (r.actualCost || r.estimatedCost), 0);
  const avgRepairTime = '1.8 Days';
  const availableFleet = '84%'; // Mock buffer

  // Open Log form
  const handleOpenAdd = () => {
    setFormVehicle('');
    setFormService('Oil Change');
    setFormWorkshop('Dallas Fleet Hub');
    setFormMechanic('');
    setFormPriority('Medium');
    setFormEstCost('');
    setFormDate('');
    setFormCompletion('');
    setFormStatus('Scheduled');
    setFormRemarks('');
    setFormError('');
    setIsAddOpen(true);
  };

  // Submit Add record
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formVehicle || !formMechanic || !formEstCost || !formDate || !formCompletion) {
      setFormError('All asterisk (*) fields are required.');
      return;
    }

    const newRecord = {
      id: `WO-${Math.floor(8420 + Math.random() * 80)}`,
      vehicle: formVehicle.trim(),
      serviceType: formService,
      workshop: formWorkshop,
      mechanic: formMechanic.trim(),
      priority: formPriority,
      estimatedCost: parseInt(formEstCost, 10) || 0,
      actualCost: formStatus === 'Completed' ? parseInt(formEstCost, 10) || 0 : null,
      startDate: formDate,
      expectedCompletion: formCompletion,
      status: formStatus,
      remarks: formRemarks.trim()
    };

    setRecords([newRecord, ...records]);
    setIsAddOpen(false);
  };

  // Status transition callback
  const handleStatusChange = (record, nextStatus) => {
    if (nextStatus === 'Completed') {
      // Trigger confirmation dialog
      setRecordToComplete(record);
      setIsConfirmOpen(true);
    } else {
      updateRecordStatus(record, nextStatus);
    }
  };

  // Commit status change
  const updateRecordStatus = (record, nextStatus) => {
    const updated = records.map(r => {
      if (r.id === record.id) {
        const actualCostVal = nextStatus === 'Completed' ? r.estimatedCost : r.actualCost;
        return { 
          ...r, 
          status: nextStatus,
          actualCost: actualCostVal
        };
      }
      return r;
    });
    setRecords(updated);
    
    // Sync detailed drawer view if open
    if (selectedRecord?.id === record.id) {
      setSelectedRecord({ 
        ...selectedRecord, 
        status: nextStatus,
        actualCost: nextStatus === 'Completed' ? selectedRecord.estimatedCost : selectedRecord.actualCost
      });
    }
  };

  // Confirmation complete trigger
  const handleConfirmComplete = () => {
    updateRecordStatus(recordToComplete, 'Completed');
    setIsConfirmOpen(false);
    setRecordToComplete(null);
  };

  // Delete log entry
  const handleDeleteRecord = (record) => {
    setRecords(records.filter(r => r.id !== record.id));
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setFilterService('All');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Maintenance Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Log vehicle maintenance, monitor workshop activity, schedule repairs, and track costs ({records.length} logs total).
          </p>
        </div>

        {/* LOG MAINTENANCE RECORD ACTION */}
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition outline-none self-start"
        >
          <Plus size={15} />
          <span>Log Repair Task</span>
        </button>
      </div>

      {/* 2. SUMMARY KPI CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-6 gap-4">
        
        {/* KPI 1: Vehicles In Shop */}
        <div className="bg-white p-4 rounded-2xl border-l-4 border-[#F59E0B] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">In Shop</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={totalInShop} />
          </h3>
          <span className="text-[9px] text-[#F59E0B] font-semibold mt-1">Status lock active</span>
        </div>

        {/* KPI 2: Completed Services */}
        <div className="bg-white p-4 rounded-2xl border-l-4 border-[#22C55E] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Completed</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={totalCompleted} />
          </h3>
          <span className="text-[9px] text-emerald-600 font-semibold mt-1">Released back to fleet</span>
        </div>

        {/* KPI 3: Scheduled Services */}
        <div className="bg-white p-4 rounded-2xl border-l-4 border-[#2563EB] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Scheduled</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={totalScheduled} />
          </h3>
          <span className="text-[9px] text-blue-600 font-semibold mt-1">Pending check-in</span>
        </div>

        {/* KPI 4: Maintenance Cost */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Cost</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            ${totalCost.toLocaleString()}
          </h3>
          <span className="text-[9px] text-red-500 font-semibold mt-1">+$450 vs budget target</span>
        </div>

        {/* KPI 5: Avg Repair Time */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Avg Repair Time</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">{avgRepairTime}</h3>
          <span className="text-[9px] text-[#64748B] font-medium mt-1">Class-8 semi standard</span>
        </div>

        {/* KPI 6: Available Fleet */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Available Fleet</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">{availableFleet}</h3>
          <span className="text-[9px] text-emerald-600 font-semibold mt-1">Buffered capacity safe</span>
        </div>

      </section>

      {/* 3. CHARTS & SIDE ALERT TIMELINE */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: 2 SVG Charts */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: cost analysis */}
          <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <DollarSign size={14} className="text-[#2563EB]" />
              Monthly Maintenance Costs
            </h3>
            <MonthlyCostChart records={records} />
          </div>

          {/* Chart 2: service type distribution */}
          <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <Wrench size={14} className="text-[#2563EB]" />
              Service Category Share
            </h3>
            <ServiceTypeDistributionChart records={records} />
          </div>
        </div>

        {/* Right Column: Workshop Alerts & Reminders */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-slate-100 pb-2">
            <Sparkles size={14} className="text-violet-600" />
            Safety Alerts & Warranty Expiry
          </h3>

          <div className="space-y-3.5 max-h-[170px] overflow-y-auto pr-1">
            {/* Alert 1 */}
            <div className="p-2.5 bg-red-50/50 border border-red-200 rounded-xl flex gap-2">
              <ShieldAlert size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-700 leading-normal">
                <strong>Overdue Service:</strong> Ford Van #205 odometer exceeds limit by 1,420 miles. General Inspection scheduled.
              </p>
            </div>

            {/* Alert 2 */}
            <div className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl flex gap-2">
              <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-750 leading-normal">
                <strong>Warranty Warning:</strong> Volvo VNL #112 engine assembly warranty expires in 15 days. Inspect before case closure.
              </p>
            </div>
            
            {/* AI Insight */}
            <div className="p-2.5 bg-violet-50/40 border border-violet-200 rounded-xl flex gap-2">
              <Sparkles size={14} className="text-violet-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-violet-750 leading-normal">
                <strong>AI Prediction:</strong> Brake replacement rates on Cascadia #104 indicate tire tread replacement is due in 30 days.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* 4. ACTION BAR & FILTERS */}
      <section className="bg-white border border-[#E2E8F0] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3.5 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <Filter size={13} />
            <span>Search Workshop Logs:</span>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs flex-1 min-w-[160px]">
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Vehicle name or Mechanic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-1.5 pl-7 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* Filter Service Type */}
          <div className="relative">
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Service Types</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Brake Service">Brake Service</option>
              <option value="Engine Repair">Engine Repair</option>
              <option value="General Inspection">General Inspection</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || filterStatus !== 'All' || filterService !== 'All') && (
          <button 
            onClick={handleResetFilters}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            Clear Filters
          </button>
        )}
      </section>

      {/* 5. TABLE SECTION */}
      <section className="flex-1">
        <MaintenanceTable
          records={filteredRecords}
          onSelectRecord={setSelectedRecord}
          onStatusChange={handleStatusChange}
          onDeleteRecord={handleDeleteRecord}
        />
      </section>

      {/* 6. LOG REPAIR TASK MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative bg-white rounded-2xl max-w-md w-full border border-[#E2E8F0] shadow-2xl p-6 overflow-hidden z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Log Workshop Task</h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Vehicle Match *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tesla Semi #401"
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Service Type *</label>
                    <select
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Oil Change">Oil Change</option>
                      <option value="Brake Service">Brake Service</option>
                      <option value="Engine Repair">Engine Repair</option>
                      <option value="General Inspection">General Inspection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Workshop Station</label>
                    <select
                      value={formWorkshop}
                      onChange={(e) => setFormWorkshop(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Dallas Fleet Hub">Dallas Fleet Hub</option>
                      <option value="Chicago West Garage">Chicago West Garage</option>
                      <option value="Houston Electric Station">Houston Electric Station</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Mechanic Assigned *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arthur Dent"
                      value={formMechanic}
                      onChange={(e) => setFormMechanic(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Service Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Estimated Cost ($) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1200"
                      value={formEstCost}
                      onChange={(e) => setFormEstCost(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Log Date *</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Target Completion *</label>
                    <input
                      type="date"
                      required
                      value={formCompletion}
                      onChange={(e) => setFormCompletion(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Repair Diagnostics / Remarks</label>
                  <textarea
                    placeholder="Describe maintenance issues..."
                    value={formRemarks}
                    onChange={(e) => setFormRemarks(e.target.value)}
                    rows="2.5"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-sans"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10"
                  >
                    Log Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. DETAILED DRAWER WRAPPER */}
      <MaintenanceDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* 8. COMPLETION CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative bg-white rounded-2xl max-w-sm w-full border border-[#E2E8F0] shadow-2xl p-6 overflow-hidden z-10 space-y-4"
            >
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Close Service task?</h3>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Are you sure you want to close this repair task for <strong>{recordToComplete?.vehicle}</strong>? The vehicle status will automatically unlock and update to <strong>"Available"</strong>.
              </p>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmComplete}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/10 text-xs"
                >
                  Confirm & Release
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
