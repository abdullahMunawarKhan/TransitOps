import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle2, Navigation, Ban, AlertTriangle, TrendingUp, 
  Plus, Search, Filter, X, ChevronDown, Download, Upload, ShieldAlert,
  Sparkles, Calendar, Activity, Phone, ArrowUpRight
} from 'lucide-react';

// Import subcomponents
import DriverTable from './DriverTable';
import DriverDrawer from './DriverDrawer';
import DeleteDialog from './DeleteDialog';
import AnimatedCounter from './AnimatedCounter';

// Availability Pie/Donut Chart
const AvailabilityChart = ({ drivers }) => {
  const total = drivers.length || 1;
  const avail = drivers.filter(d => d.status === 'Available').length;
  const ontrip = drivers.filter(d => d.status === 'On Trip').length;
  const offduty = drivers.filter(d => d.status === 'Off Duty').length;

  const segments = [
    { label: 'Available', value: avail, percent: Math.round((avail/total)*100) || 0, color: '#22C55E' },
    { label: 'On Trip', value: ontrip, percent: Math.round((ontrip/total)*100) || 0, color: '#2563EB' },
    { label: 'Off Duty', value: offduty, percent: Math.round((offduty/total)*100) || 0, color: '#64748B' }
  ];

  let accumulatedPercent = 0;

  return (
    <div className="flex items-center gap-6 py-1">
      <svg width="90" height="90" viewBox="0 0 36 36" className="transform -rotate-90 flex-shrink-0">
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
            <span className="text-slate-800">{seg.value} drivers ({seg.percent}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Safety Distribution Chart (SVG bar chart)
const SafetyDistributionChart = ({ drivers }) => {
  const excellent = drivers.filter(d => d.safetyScore >= 90).length;
  const good = drivers.filter(d => d.safetyScore >= 70 && d.safetyScore < 90).length;
  const critical = drivers.filter(d => d.safetyScore < 70).length;
  const maxVal = Math.max(excellent, good, critical) || 1;

  const data = [
    { label: 'Excel (90-100)', count: excellent, color: '#22C55E' },
    { label: 'Good (70-89)', count: good, color: '#f59e0b' },
    { label: 'Critical (<70)', count: critical, color: '#ef4444' }
  ];

  return (
    <div className="flex h-20 items-end justify-between px-2 pt-2 gap-4">
      {data.map((item, idx) => {
        const heightPercent = `${(item.count / maxVal) * 100}%`;
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
                  {item.count} drivers
                </div>
              </motion.div>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold mt-1 truncate w-full text-center">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function DriversView() {
  // 1. Initial State
  const defaultDrivers = [
    {
      name: 'Sarah Jenkins',
      licenseNumber: 'DL-84092-TX',
      licenseCategory: 'A',
      licenseExpiry: '2027-08-12',
      phone: '+1 (555) 234-5678',
      tripsCompleted: '142',
      safetyScore: 94,
      status: 'On Trip',
      currentVehicle: 'Freightliner Cascadia #104',
      emergencyContact: 'Robert Jenkins (Spouse)',
      emergencyPhone: '+1 (555) 234-5679',
      address: '104 Oakwood Ave, Dallas, TX',
      violations: []
    },
    {
      name: 'Michael Chang',
      licenseNumber: 'DL-20385-CA',
      licenseCategory: 'B',
      licenseExpiry: '2028-01-20',
      phone: '+1 (555) 876-5432',
      tripsCompleted: '85',
      safetyScore: 89,
      status: 'Available',
      currentVehicle: 'Ford E-350 Cargo Van #203',
      emergencyContact: 'May Chang (Mother)',
      emergencyPhone: '+1 (555) 876-5433',
      address: '742 Broadway St, San Francisco, CA',
      violations: [
        { type: 'Speeding Warning', details: 'Clocked at 72 mph in 65 mph zone', date: '2026-03-05' }
      ]
    },
    {
      name: 'David Miller',
      licenseNumber: 'DL-40104-IL',
      licenseCategory: 'A',
      licenseExpiry: '2026-07-24', // Expiring soon
      phone: '+1 (555) 345-6789',
      tripsCompleted: '124',
      safetyScore: 92,
      status: 'Available',
      currentVehicle: 'Tesla Semi #401',
      emergencyContact: 'Sarah Miller (Wife)',
      emergencyPhone: '+1 (555) 345-6780',
      address: '904 Maple Dr, Chicago, IL',
      violations: []
    },
    {
      name: 'Elena Rostova',
      licenseNumber: 'DL-11204-FL',
      licenseCategory: 'A',
      licenseExpiry: '2025-05-18', // Expired
      phone: '+1 (555) 456-7890',
      tripsCompleted: '210',
      safetyScore: 68, // Critical safety
      status: 'Available',
      currentVehicle: 'Volvo VNL 860 #112',
      emergencyContact: 'Dimitri Rostov (Brother)',
      emergencyPhone: '+1 (555) 456-7891',
      address: '320 Sunshine Blvd, Miami, FL',
      violations: [
        { type: 'Hard Braking Alert', details: 'Triggered 3 telemetry warnings on highway', date: '2026-06-15' },
        { type: 'Hours of Service Violation', details: 'Exceeded daily maximum driving hours limit', date: '2025-11-20' }
      ]
    },
    {
      name: 'Marcus Vance',
      licenseNumber: 'DL-15284-TX',
      licenseCategory: 'A',
      licenseExpiry: '2026-10-15',
      phone: '+1 (555) 901-2345',
      tripsCompleted: '56',
      safetyScore: 95,
      status: 'Suspended',
      currentVehicle: 'Peterbilt 579 #152',
      emergencyContact: 'Theresa Vance (Wife)',
      emergencyPhone: '+1 (555) 901-2346',
      address: '522 Pecan St, San Antonio, TX',
      violations: [
        { type: 'Administrative Suspension', details: 'Open verification pending on standard license audit', date: '2026-07-01' }
      ]
    },
    {
      name: 'James O\'Connor',
      licenseNumber: 'DL-20594-NY',
      licenseCategory: 'B',
      licenseExpiry: '2027-11-05',
      phone: '+1 (555) 789-0123',
      tripsCompleted: '45',
      safetyScore: 84,
      status: 'On Trip',
      currentVehicle: 'Ford E-350 Cargo Van #205',
      emergencyContact: 'Mary O\'Connor (Sister)',
      emergencyPhone: '+1 (555) 789-0124',
      address: '430 E 86th St, New York, NY',
      violations: []
    }
  ];

  const [drivers, setDrivers] = useState(() => {
    const stored = localStorage.getItem('transitops.drivers');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('transitops.drivers', JSON.stringify(defaultDrivers));
    return defaultDrivers;
  });

  useEffect(() => {
    localStorage.setItem('transitops.drivers', JSON.stringify(drivers));
  }, [drivers]);

  // 2. Filter states
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSafety, setFilterSafety] = useState('All');

  // 3. UI control states
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formLicense, setFormLicense] = useState('');
  const [formCategory, setFormCategory] = useState('A');
  const [formExpiry, setFormExpiry] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTrips, setFormTrips] = useState('');
  const [formScore, setFormScore] = useState('');
  const [formStatus, setFormStatus] = useState('Available');
  const [formVehicle, setFormVehicle] = useState('');
  const [formError, setFormError] = useState('');

  // 4. Filtering logic
  const filteredDrivers = drivers.filter(d => {
    const matchesName = d.name.toLowerCase().includes(searchName.toLowerCase()) || 
                        d.licenseNumber.toLowerCase().includes(searchName.toLowerCase());
    const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || d.licenseCategory === filterCategory;
    
    let matchesSafety = true;
    if (filterSafety === 'Excellent') matchesSafety = d.safetyScore >= 90;
    else if (filterSafety === 'Good') matchesSafety = d.safetyScore >= 70 && d.safetyScore < 90;
    else if (filterSafety === 'Critical') matchesSafety = d.safetyScore < 70;

    return matchesName && matchesStatus && matchesCategory && matchesSafety;
  });

  // Calculate metrics
  const totalDrivers = drivers.length;
  const countAvailable = drivers.filter(d => d.status === 'Available').length;
  const countOnTrip = drivers.filter(d => d.status === 'On Trip').length;
  const countSuspended = drivers.filter(d => d.status === 'Suspended').length;

  // Licensing warning checks
  const today = new Date();
  const countExpiringSoon = drivers.filter(d => {
    const expiry = new Date(d.licenseExpiry);
    const timeDiff = expiry.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff >= 0 && dayDiff <= 30; // expiring within 30 days
  }).length;

  const countExpired = drivers.filter(d => new Date(d.licenseExpiry) < today).length;

  // Average safety score
  const avgSafetyScore = Math.round(drivers.reduce((acc, d) => acc + d.safetyScore, 0) / totalDrivers) || 0;

  // Open Edit profile
  const handleOpenEdit = (driver) => {
    setDriverToEdit(driver);
    setFormName(driver.name);
    setFormLicense(driver.licenseNumber);
    setFormCategory(driver.licenseCategory);
    setFormExpiry(driver.licenseExpiry);
    setFormPhone(driver.phone);
    setFormTrips(driver.tripsCompleted);
    setFormScore(driver.safetyScore);
    setFormStatus(driver.status);
    setFormVehicle(driver.currentVehicle || '');
    setFormError('');
    setIsEditOpen(true);
  };

  // Open Add driver
  const handleOpenAdd = () => {
    setFormName('');
    setFormLicense('');
    setFormCategory('A');
    setFormExpiry('');
    setFormPhone('');
    setFormTrips('');
    setFormScore('100');
    setFormStatus('Available');
    setFormVehicle('');
    setFormError('');
    setIsAddOpen(true);
  };

  // Submit Add Driver
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formLicense || !formName || !formExpiry || !formPhone || !formTrips || !formScore) {
      setFormError('All asterisk (*) fields are required.');
      return;
    }
    if (drivers.some(d => d.licenseNumber.toLowerCase() === formLicense.trim().toLowerCase())) {
      setFormError('A driver with this License Number already exists.');
      return;
    }

    const newDriver = {
      name: formName.trim(),
      licenseNumber: formLicense.trim().toUpperCase(),
      licenseCategory: formCategory,
      licenseExpiry: formExpiry.trim(),
      phone: formPhone.trim(),
      tripsCompleted: formTrips.trim(),
      safetyScore: parseInt(formScore, 10) || 100,
      status: formStatus,
      currentVehicle: formVehicle.trim(),
      violations: []
    };

    setDrivers([newDriver, ...drivers]);
    setIsAddOpen(false);
  };

  // Submit Edit Driver
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formExpiry || !formPhone || !formTrips || !formScore) {
      setFormError('All asterisk (*) fields are required.');
      return;
    }

    const updated = drivers.map(d => {
      if (d.licenseNumber === driverToEdit.licenseNumber) {
        return {
          ...d,
          name: formName.trim(),
          licenseCategory: formCategory,
          licenseExpiry: formExpiry.trim(),
          phone: formPhone.trim(),
          tripsCompleted: formTrips.trim(),
          safetyScore: parseInt(formScore, 10) || 100,
          status: formStatus,
          currentVehicle: formVehicle.trim()
        };
      }
      return d;
    });

    setDrivers(updated);
    setIsEditOpen(false);
  };

  // Suspend toggle action
  const handleSuspendToggle = (driver) => {
    const updated = drivers.map(d => {
      if (d.licenseNumber === driver.licenseNumber) {
        const nextStatus = d.status === 'Suspended' ? 'Available' : 'Suspended';
        return { ...d, status: nextStatus };
      }
      return d;
    });
    setDrivers(updated);
  };

  // Delete trigger
  const handleDeleteTrigger = (driver) => {
    setDriverToDelete(driver);
    setIsDeleteOpen(true);
  };

  // Confirm delete driver
  const handleDeleteConfirm = () => {
    setDrivers(drivers.filter(d => d.licenseNumber !== driverToDelete.licenseNumber));
    setIsDeleteOpen(false);
    setDriverToDelete(null);
    if (selectedDriver?.licenseNumber === driverToDelete.licenseNumber) {
      setSelectedDriver(null);
    }
  };

  const handleResetFilters = () => {
    setSearchName('');
    setFilterStatus('All');
    setFilterCategory('All');
    setFilterSafety('All');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Drivers & Safety Profiles</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage drivers, verify licenses, monitor safety scores, and track availability ({totalDrivers} total drivers).
          </p>
        </div>
        
        {/* ADD DRIVER ACTION */}
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition outline-none self-start"
        >
          <Plus size={15} />
          <span>Add Driver</span>
        </button>
      </div>

      {/* 2. SUMMARY KPI CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-6 gap-4">
        
        {/* KPI 1: Total */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Drivers</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={totalDrivers} />
          </h3>
          <span className="text-[9px] text-[#64748B] font-medium mt-1">Operational count</span>
        </div>

        {/* KPI 2: Available */}
        <div className="bg-white p-4 rounded-2xl border-l-4 border-[#22C55E] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Available</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={countAvailable} />
          </h3>
          <span className="text-[9px] text-emerald-600 font-semibold mt-1">Ready for dispatch</span>
        </div>

        {/* KPI 3: On Trip */}
        <div className="bg-white p-4 rounded-2xl border-l-4 border-[#2563EB] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">On Trip</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={countOnTrip} />
          </h3>
          <span className="text-[9px] text-[#64748B] font-medium mt-1">Active on active routes</span>
        </div>

        {/* KPI 4: Suspended */}
        <div className="bg-white p-4 rounded-2xl border-l-4 border-[#EF4444] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Suspended</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={countSuspended} />
          </h3>
          <span className="text-[9px] text-red-500 font-semibold mt-1">Blocked assignments</span>
        </div>

        {/* KPI 5: Expiring Licenses */}
        <div className="bg-white p-4 rounded-2xl border-l-4 border-[#F59E0B] border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">License Expiry</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={countExpiringSoon + countExpired} />
          </h3>
          <span className="text-[9px] text-[#F59E0B] font-semibold mt-1">{countExpired} expired units</span>
        </div>

        {/* KPI 6: Average Safety */}
        <div className="bg-white p-4 rounded-2xl border-l-4 border-indigo-500 border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Avg Safety</span>
          <h3 className="text-2xl font-bold font-space text-slate-800 mt-1.5">
            <AnimatedCounter value={avgSafetyScore} />
          </h3>
          <span className="text-[9px] text-emerald-600 font-semibold mt-1">Class-8 rating optimal</span>
        </div>

      </section>

      {/* 3. CHARTS & SIDE ALERT PANEL */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left column: 2 SVG Charts */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Availability */}
          <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <Users size={14} className="text-[#2563EB]" />
              Driver Availability Share
            </h3>
            <AvailabilityChart drivers={drivers} />
          </div>

          {/* Chart 2: Safety Distribution */}
          <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <TrendingUp size={14} className="text-[#2563EB]" />
              Safety Score Distribution
            </h3>
            <SafetyDistributionChart drivers={drivers} />
          </div>
        </div>

        {/* Right column: AI Recommendations & Renewal Alerts */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide border-b border-slate-100 pb-2">
            <Sparkles size={14} className="text-violet-600" />
            Safety Alerts & AI Insights
          </h3>
          
          <div className="space-y-3.5 max-h-[170px] overflow-y-auto pr-1">
            {/* Alert 1 */}
            {countExpired > 0 && (
              <div className="p-2.5 bg-red-50/50 border border-red-200 rounded-xl flex gap-2">
                <ShieldAlert size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-700 leading-normal">
                  <strong>License Expired:</strong> Elena Rostova has an expired license (2025-05-18). Dispatching is disabled.
                </p>
              </div>
            )}
            
            {/* Alert 2 */}
            <div className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl flex gap-2">
              <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 leading-normal">
                <strong>Renewal Alert:</strong> David Miller's license expires in 12 days. Standard renewals take 10 working days.
              </p>
            </div>

            {/* AI Recommendation */}
            <div className="p-2.5 bg-violet-50/40 border border-violet-200 rounded-xl flex gap-2">
              <Sparkles size={14} className="text-violet-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-violet-750 leading-normal">
                <strong>AI Recommend:</strong> Reassign Sarah Jenkins to the Tesla EV fleet due to top safety ratings (94) on regional lanes.
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
            <span>Search Drivers:</span>
          </div>

          {/* Search by Name/License */}
          <div className="relative max-w-xs flex-1 min-w-[160px]">
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Name or License Number..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
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
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* License Category */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Classes</option>
              <option value="A">Class A</option>
              <option value="B">Class B</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* Safety Threshold */}
          <div className="relative">
            <select
              value={filterSafety}
              onChange={(e) => setFilterSafety(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Safety Scores</option>
              <option value="Excellent">Excellent (90-100)</option>
              <option value="Good">Good (70-89)</option>
              <option value="Critical">Critical (&lt;70)</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* Clear Filters */}
        {(searchName || filterStatus !== 'All' || filterCategory !== 'All' || filterSafety !== 'All') && (
          <button 
            onClick={handleResetFilters}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            Clear Filters
          </button>
        )}
      </section>

      {/* 5. DRIVER TABLE */}
      <section className="flex-1">
        <DriverTable
          drivers={filteredDrivers}
          onSelectDriver={setSelectedDriver}
          onEditDriver={handleOpenEdit}
          onAssignTrip={(d) => console.log('Assign trip:', d)}
          onSuspendDriver={handleSuspendToggle}
          onDeleteDriver={handleDeleteTrigger}
        />
      </section>

      {/* 6. ADD DRIVER MODAL DIALOG */}
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
                <h3 className="font-bold text-slate-900 text-sm">Add Registered Driver</h3>
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
                  <label className="block text-slate-600 font-semibold mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">License Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DL-84092-TX"
                      value={formLicense}
                      onChange={(e) => setFormLicense(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Category Class *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="A">Class A (Heavy Commercial)</option>
                      <option value="B">Class B (Medium Cargo/Van)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">License Expiry *</label>
                    <input
                      type="date"
                      required
                      value={formExpiry}
                      onChange={(e) => setFormExpiry(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Trips Done *</label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={formTrips}
                      onChange={(e) => setFormTrips(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Safety Score *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      placeholder="100"
                      value={formScore}
                      onChange={(e) => setFormScore(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Vehicle Match</label>
                    <input
                      type="text"
                      placeholder="Cascadia #104"
                      value={formVehicle}
                      onChange={(e) => setFormVehicle(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Initial Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
                  </select>
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
                    Register Driver
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. EDIT DRIVER MODAL DIALOG */}
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
                <h3 className="font-bold text-slate-900 text-sm">Edit Driver Profile ({driverToEdit?.licenseNumber})</h3>
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
                  <label className="block text-slate-600 font-semibold mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category Class *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="A">Class A (Heavy Commercial)</option>
                    <option value="B">Class B (Medium Cargo/Van)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">License Expiry *</label>
                    <input
                      type="date"
                      required
                      value={formExpiry}
                      onChange={(e) => setFormExpiry(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (555) 234-5678"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Trips Done *</label>
                    <input
                      type="number"
                      required
                      placeholder="142"
                      value={formTrips}
                      onChange={(e) => setFormTrips(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Safety Score *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      placeholder="94"
                      value={formScore}
                      onChange={(e) => setFormScore(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Vehicle Match</label>
                    <input
                      type="text"
                      placeholder="Cascadia #104"
                      value={formVehicle}
                      onChange={(e) => setFormVehicle(e.target.value)}
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
                      <option value="Off Duty">Off Duty</option>
                      <option value="Suspended">Suspended</option>
                    </select>
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

      {/* 8. PROFILE DRAWER VIEW DETAILS */}
      <DriverDrawer
        driver={selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />

      {/* 9. DELETE CONFIRM DIALOG */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        vehicleName={driverToDelete?.name}
        regNumber={driverToDelete?.licenseNumber}
      />

    </div>
  );
}
