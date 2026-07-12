import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Plus, RotateCcw, Filter, CheckCircle2, Navigation, 
  Wrench, AlertTriangle, Search, X, Shield, Calendar, DollarSign, Users, PieChart, TrendingUp, ChevronDown
} from 'lucide-react';

// Import sub-components
import VehicleTable from './VehicleTable';
import VehicleDrawer from './VehicleDrawer';
import DeleteDialog from './DeleteDialog';
import AnimatedCounter from './AnimatedCounter';

// Custom Donut Chart (Vehicle Type Distribution)
const DonutChart = ({ vehicles }) => {
  const total = vehicles.length || 1;
  const trucks = vehicles.filter(v => v.type === 'Semi-Truck').length;
  const vans = vehicles.filter(v => v.type === 'Cargo Van').length;
  const evs = vehicles.filter(v => v.type === 'Electric Truck').length;
  
  const pctTrucks = Math.round((trucks / total) * 100) || 0;
  const pctVans = Math.round((vans / total) * 100) || 0;
  const pctEvs = Math.round((evs / total) * 100) || 0;

  const segments = [
    { label: 'Semi-Trucks', value: trucks, percent: pctTrucks, color: '#2563EB' },
    { label: 'Cargo Vans', value: vans, percent: pctVans, color: '#7C3AED' },
    { label: 'Electric Trucks', value: evs, percent: pctEvs, color: '#22C55E' }
  ];
  
  let accumulatedPercent = 0;
  
  return (
    <div className="flex items-center gap-6 py-2">
      <svg width="100" height="100" viewBox="0 0 36 36" className="transform -rotate-95 flex-shrink-0">
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
      <div className="flex-grow space-y-1.5 text-xs font-semibold">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </span>
            <span className="text-slate-800">{seg.value} units ({seg.percent}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom Gauge Chart (Fleet Utilization)
const GaugeChart = ({ vehicles }) => {
  const total = vehicles.length || 1;
  const onTrip = vehicles.filter(v => v.status === 'On Trip').length;
  const pct = Math.round((onTrip / total) * 100) || 0;
  
  const targetOffset = 37.7 - (pct / 100) * 37.7;
  
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative w-28 h-14 flex items-center justify-center overflow-hidden">
        <svg width="112" height="112" viewBox="0 0 36 36" className="absolute top-0 transform -rotate-180">
          <path
            d="M 6,18 A 12,12 0 1,1 30,18"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <motion.path
            d="M 6,18 A 12,12 0 1,1 30,18"
            fill="none"
            stroke="#2563EB"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="37.7"
            strokeDashoffset={37.7}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute bottom-0 text-center">
          <div className="text-xl font-bold font-space text-slate-800">{pct}%</div>
          <span className="text-[9px] font-semibold text-emerald-600 block leading-none">Utilization</span>
        </div>
      </div>
      <div className="text-[10px] text-slate-500 font-semibold text-center mt-2 flex items-center gap-1">
        <span>{onTrip} of {total} operational vehicles active</span>
      </div>
    </div>
  );
};

// Custom Mileage Usage Chart
const MileageChart = () => {
  const data = [
    { month: 'Jan', miles: 120 },
    { month: 'Feb', miles: 145 },
    { month: 'Mar', miles: 130 },
    { month: 'Apr', miles: 165 },
    { month: 'May', miles: 155 },
    { month: 'Jun', miles: 180 }
  ];
  
  const maxMiles = 200;
  
  return (
    <div className="flex h-24 items-end justify-between px-2 pt-2">
      {data.map((item, idx) => {
        const heightPercent = `${(item.miles / maxMiles) * 100}%`;
        
        return (
          <div key={idx} className="flex flex-col items-center flex-1 group">
            <div className="w-full px-2.5 h-16 flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: heightPercent }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                className="w-full bg-[#7C3AED] rounded-t-md hover:bg-violet-700 transition duration-150 relative cursor-pointer"
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-150 pointer-events-none mb-1 font-mono whitespace-nowrap z-10">
                  {item.miles}k mi
                </div>
              </motion.div>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold mt-1">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function FleetView() {
  // 1. Initial State
  const [vehicles, setVehicles] = useState([
    { 
      regNumber: 'TX-1042-CS', 
      name: 'Freightliner Cascadia #104', 
      type: 'Semi-Truck', 
      capacity: '45,000 lbs', 
      odometer: '124,500 mi', 
      cost: '$145,000', 
      status: 'On Trip', 
      driver: 'Sarah Jenkins',
      maintenanceLogs: [
        { type: 'Engine Oil Service', cost: '$380', date: '2026-05-10', description: 'Replaced full engine oil and filters' },
        { type: 'Brake Pad Replacement', cost: '$650', date: '2026-03-12', description: 'Rear wheels brake pads replacement' }
      ]
    },
    { 
      regNumber: 'CA-2038-VN', 
      name: 'Ford E-350 Cargo Van #203', 
      type: 'Cargo Van', 
      capacity: '9,500 lbs', 
      odometer: '85,200 mi', 
      cost: '$48,500', 
      status: 'Available', 
      driver: 'Michael Chang',
      maintenanceLogs: [
        { type: 'Standard Tune-up', cost: '$120', date: '2026-04-01', description: 'General fluid top-up and tyre inspection' }
      ]
    },
    { 
      regNumber: 'CA-4010-EV', 
      name: 'Tesla Semi #401', 
      type: 'Electric Truck', 
      capacity: '40,000 lbs', 
      odometer: '12,400 mi', 
      cost: '$180,000', 
      status: 'Pending', 
      driver: 'David Miller',
      maintenanceLogs: []
    },
    { 
      regNumber: 'FL-1120-VV', 
      name: 'Volvo VNL 860 #112', 
      type: 'Semi-Truck', 
      capacity: '45,000 lbs', 
      odometer: '210,350 mi', 
      cost: '$152,000', 
      status: 'In Shop', 
      driver: 'Elena Rostova',
      maintenanceLogs: [
        { type: 'Alternator Repair', cost: '$820', date: '2026-07-09', description: 'Replaced failed alternator and battery unit' }
      ]
    },
    { 
      regNumber: 'TX-1528-PB', 
      name: 'Peterbilt 579 #152', 
      type: 'Semi-Truck', 
      capacity: '44,500 lbs', 
      odometer: '198,400 mi', 
      cost: '$138,000', 
      status: 'Draft', 
      driver: 'Marcus Vance',
      maintenanceLogs: []
    },
    { 
      regNumber: 'MA-2059-VN', 
      name: 'Ford E-350 Cargo Van #205', 
      type: 'Cargo Van', 
      capacity: '9,500 lbs', 
      odometer: '94,150 mi', 
      cost: '$49,000', 
      status: 'On Trip', 
      driver: 'James O\'Connor',
      maintenanceLogs: [
        { type: 'Wheel Alignment', cost: '$180', date: '2026-02-28', description: 'Realigned front axles' }
      ]
    }
  ]);

  // 2. Filter states
  const [searchReg, setSearchReg] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // 3. UI control states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Add/Edit Modals states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formReg, setFormReg] = useState('');
  const [formType, setFormType] = useState('Semi-Truck');
  const [formCapacity, setFormCapacity] = useState('');
  const [formOdometer, setFormOdometer] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formStatus, setFormStatus] = useState('Available');
  const [formDriver, setFormDriver] = useState('');
  const [formError, setFormError] = useState('');

  // 4. Filtering logic
  const filteredVehicles = vehicles.filter(v => {
    const matchesReg = v.regNumber.toLowerCase().includes(searchReg.toLowerCase());
    const matchesName = v.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesType = filterType === 'All' || v.type === filterType;
    const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
    
    return matchesReg && matchesName && matchesType && matchesStatus;
  });

  // Calculate summary counts
  const totalVehicles = vehicles.length;
  const countAvailable = vehicles.filter(v => v.status === 'Available').length;
  const countOnTrip = vehicles.filter(v => v.status === 'On Trip').length;
  const countInShop = vehicles.filter(v => v.status === 'In Shop').length;
  const countRetired = vehicles.filter(v => v.status === 'Retired').length;

  // Open Edit form
  const handleOpenEdit = (vehicle) => {
    setVehicleToEdit(vehicle);
    setFormName(vehicle.name);
    setFormReg(vehicle.regNumber);
    setFormType(vehicle.type);
    setFormCapacity(vehicle.capacity);
    setFormOdometer(vehicle.odometer);
    setFormCost(vehicle.cost);
    setFormStatus(vehicle.status);
    setFormDriver(vehicle.driver || '');
    setFormError('');
    setIsEditOpen(true);
  };

  // Open Add form
  const handleOpenAdd = () => {
    setFormName('');
    setFormReg('');
    setFormType('Semi-Truck');
    setFormCapacity('');
    setFormOdometer('');
    setFormCost('');
    setFormStatus('Available');
    setFormDriver('');
    setFormError('');
    setIsAddOpen(true);
  };

  // Submit Add Vehicle
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formReg || !formName || !formCapacity || !formOdometer || !formCost) {
      setFormError('All asterisk (*) fields are required.');
      return;
    }
    if (vehicles.some(v => v.regNumber.toLowerCase() === formReg.trim().toLowerCase())) {
      setFormError('A vehicle with this Registration Number already exists.');
      return;
    }

    const newVehicle = {
      regNumber: formReg.trim().toUpperCase(),
      name: formName.trim(),
      type: formType,
      capacity: formCapacity.trim().toLowerCase().includes('lbs') ? formCapacity.trim() : `${formCapacity.trim()} lbs`,
      odometer: formOdometer.trim().toLowerCase().includes('mi') ? formOdometer.trim() : `${formOdometer.trim()} mi`,
      cost: formCost.trim().startsWith('$') ? formCost.trim() : `$${formCost.trim()}`,
      status: formStatus,
      driver: formDriver.trim(),
      maintenanceLogs: []
    };

    setVehicles([newVehicle, ...vehicles]);
    setIsAddOpen(false);
  };

  // Submit Edit Vehicle
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formCapacity || !formOdometer || !formCost) {
      setFormError('All asterisk (*) fields are required.');
      return;
    }

    const updated = vehicles.map(v => {
      if (v.regNumber === vehicleToEdit.regNumber) {
        return {
          ...v,
          name: formName.trim(),
          type: formType,
          capacity: formCapacity.trim().toLowerCase().includes('lbs') ? formCapacity.trim() : `${formCapacity.trim()} lbs`,
          odometer: formOdometer.trim().toLowerCase().includes('mi') ? formOdometer.trim() : `${formOdometer.trim()} mi`,
          cost: formCost.trim().startsWith('$') ? formCost.trim() : `$${formCost.trim()}`,
          status: formStatus,
          driver: formDriver.trim()
        };
      }
      return v;
    });

    setVehicles(updated);
    setIsEditOpen(false);
  };

  // Trigger Delete vehicle warning
  const handleDeleteTrigger = (vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteOpen(true);
  };

  // Confirm delete vehicle
  const handleDeleteConfirm = () => {
    setVehicles(vehicles.filter(v => v.regNumber !== vehicleToDelete.regNumber));
    setIsDeleteOpen(false);
    setVehicleToDelete(null);
    if (selectedVehicle?.regNumber === vehicleToDelete.regNumber) {
      setSelectedVehicle(null);
    }
  };

  const handleResetFilters = () => {
    setSearchReg('');
    setSearchName('');
    setFilterType('All');
    setFilterStatus('All');
  };

  return (
    <div className="space-y-6">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Vehicle Registry</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage all fleet vehicles, monitor status, and track operational details ({totalVehicles} registered units).
          </p>
        </div>
        
        {/* ADD VEHICLE ACTION */}
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition outline-none self-start"
        >
          <Plus size={15} />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* SUMMARY STAT CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Card 1: Total */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Fleet</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={totalVehicles} />
          </h3>
          <span className="text-[9px] text-emerald-600 font-semibold mt-1">100% Registered</span>
        </div>

        {/* Card 2: Available */}
        <div className="bg-white p-4.5 rounded-2xl border-l-4 border-[#22C55E] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Available</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={countAvailable} />
          </h3>
          <span className="text-[9px] text-[#64748B] font-medium mt-1">Ready for deploy</span>
        </div>

        {/* Card 3: On Trip */}
        <div className="bg-white p-4.5 rounded-2xl border-l-4 border-[#2563EB] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">On Trip</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={countOnTrip} />
          </h3>
          <span className="text-[9px] text-[#64748B] font-medium mt-1">Active transit workload</span>
        </div>

        {/* Card 4: Maintenance */}
        <div className="bg-white p-4.5 rounded-2xl border-l-4 border-[#F59E0B] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">In Maintenance</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={countInShop} />
          </h3>
          <span className="text-[9px] text-red-500 font-semibold mt-1">Awaiting service release</span>
        </div>

        {/* Card 5: Retired */}
        <div className="bg-white p-4.5 rounded-2xl border-l-4 border-slate-400 border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Retired</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={countRetired} />
          </h3>
          <span className="text-[9px] text-slate-400 font-medium mt-1">Out of service</span>
        </div>

      </section>

      {/* CHARTS CONTAINER GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Chart 1: Vehicle Type Distribution */}
        <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-3.5 flex items-center gap-1.5 uppercase tracking-wide">
            <PieChart size={14} className="text-[#2563EB]" />
            Vehicle Type Distribution
          </h3>
          <DonutChart vehicles={vehicles} />
        </div>

        {/* Chart 2: Fleet Utilization */}
        <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-3.5 flex items-center gap-1.5 uppercase tracking-wide">
            <Navigation size={14} className="text-[#2563EB]" />
            Live Workload Utilization
          </h3>
          <GaugeChart vehicles={vehicles} />
        </div>

        {/* Chart 3: Monthly Mileage Usage */}
        <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-3.5 flex items-center gap-1.5 uppercase tracking-wide">
            <TrendingUp size={14} className="text-[#2563EB]" />
            Monthly Mileage Trend
          </h3>
          <MileageChart />
        </div>

      </section>

      {/* FILTER BAR SECTION */}
      <section className="bg-white border border-[#E2E8F0] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3.5 flex-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-[#64748B]">
            <Filter size={13} />
            <span>Search Fleet:</span>
          </div>

          {/* Search by Registration Number */}
          <div className="relative max-w-xs flex-1 min-w-[140px]">
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Reg. Number..."
              value={searchReg}
              onChange={(e) => setSearchReg(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-1.5 pl-7 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Search by Vehicle Model Name */}
          <div className="relative max-w-xs flex-1 min-w-[140px]">
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Vehicle Model/Name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-1.5 pl-7 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Vehicle Type Dropdown */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Semi-Truck">Semi-Truck</option>
              <option value="Cargo Van">Cargo Van</option>
              <option value="Electric Truck">Electric Truck</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* Vehicle Status Dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
              <option value="Draft">Draft</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* Clear Filters button */}
        {(searchReg || searchName || filterType !== 'All' || filterStatus !== 'All') && (
          <button 
            onClick={handleResetFilters}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            Clear Filters
          </button>
        )}
      </section>

      {/* REGISTRY DATA TABLE */}
      <section className="flex-1">
        <VehicleTable
          vehicles={filteredVehicles}
          onSelectVehicle={setSelectedVehicle}
          onEditVehicle={handleOpenEdit}
          onDeleteVehicle={handleDeleteTrigger}
          onLogMaintenance={(v) => console.log('maintenance log:', v)}
          onViewHistory={(v) => console.log('trip history:', v)}
        />
      </section>

      {/* 5. ADD VEHICLE MODAL DIALOG */}
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
                <h3 className="font-bold text-slate-900 text-sm">Add Registered Fleet Unit</h3>
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
                  <label className="block text-slate-600 font-semibold mb-1">Vehicle Name / Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Freightliner Cascadia #106"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Reg. Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TX-1064-CS"
                      value={formReg}
                      onChange={(e) => setFormReg(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Vehicle Type *</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Semi-Truck">Semi-Truck</option>
                      <option value="Cargo Van">Cargo Van</option>
                      <option value="Electric Truck">Electric Truck</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Capacity *</label>
                    <input
                      type="text"
                      required
                      placeholder="45,000 lbs"
                      value={formCapacity}
                      onChange={(e) => setFormCapacity(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Odometer *</label>
                    <input
                      type="text"
                      required
                      placeholder="10,000 mi"
                      value={formOdometer}
                      onChange={(e) => setFormOdometer(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Cost *</label>
                    <input
                      type="text"
                      required
                      placeholder="$120,000"
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Initial Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="In Shop">In Shop</option>
                      <option value="Retired">Retired</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Assigned Driver</label>
                    <input
                      type="text"
                      placeholder="e.g. David Miller"
                      value={formDriver}
                      onChange={(e) => setFormDriver(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
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
                    Register Unit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. EDIT VEHICLE MODAL DIALOG */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative bg-white rounded-2xl max-w-md w-full border border-[#E2E8F0] shadow-2xl p-6 overflow-hidden z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Edit Vehicle Specs ({vehicleToEdit?.regNumber})</h3>
                <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
                  {formError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Vehicle Name / Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Freightliner Cascadia #104"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Vehicle Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Semi-Truck">Semi-Truck</option>
                    <option value="Cargo Van">Cargo Van</option>
                    <option value="Electric Truck">Electric Truck</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Capacity *</label>
                    <input
                      type="text"
                      required
                      placeholder="45,000 lbs"
                      value={formCapacity}
                      onChange={(e) => setFormCapacity(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Odometer *</label>
                    <input
                      type="text"
                      required
                      placeholder="124,500 mi"
                      value={formOdometer}
                      onChange={(e) => setFormOdometer(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Cost *</label>
                    <input
                      type="text"
                      required
                      placeholder="$145,000"
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="In Shop">In Shop</option>
                      <option value="Retired">Retired</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Assigned Driver</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={formDriver}
                      onChange={(e) => setFormDriver(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. RIGHT SIDE DRAWER VIEW DETAILS */}
      <VehicleDrawer
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />

      {/* 8. DELETE WARNING DIALOG */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        vehicleName={vehicleToDelete?.name}
        regNumber={vehicleToDelete?.regNumber}
      />

    </div>
  );
}
