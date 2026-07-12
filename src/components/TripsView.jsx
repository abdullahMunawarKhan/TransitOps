import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, CheckCircle2, Navigation, AlertTriangle, ShieldCheck, 
  MapPin, Compass, Play, DollarSign, Fuel, Users, Activity, 
  Sparkles, ShieldAlert, ArrowUpRight, TrendingUp, HelpCircle, RotateCcw, ChevronDown
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

// Interactive Map component utilizing vector SVG paths
const RoutingMap = ({ origin, destination, progress = 0 }) => {
  // Mock coordinate calculations for path animation
  const originX = 40;
  const originY = 60;
  const destX = 260;
  const destY = 30;
  
  // Current vehicle location along the path
  const currentX = originX + (destX - originX) * (progress / 100);
  const currentY = originY + (destY - originY) * (progress / 100);

  return (
    <div className="bg-slate-900 rounded-xl relative p-4 border border-slate-950 shadow-inner h-[190px] overflow-hidden flex flex-col justify-between">
      <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1.5 z-10">
        <Activity size={10} className="text-emerald-500 animate-pulse" />
        <span>VECT-MAP Telemetry Sync</span>
      </div>

      {/* SVG Map Canvas */}
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 300 120">
        {/* Graticule / Grid */}
        <path d="M 0,30 L 300,30 M 0,60 L 300,60 M 0,90 L 300,90 M 50,0 L 50,120 M 100,0 L 100,120 M 150,0 L 150,120 M 200,0 L 200,120 M 250,0 L 250,120" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3"/>
        
        {/* Expected Route Line */}
        <line x1={originX} y1={originY} x2={destX} y2={destY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
        
        {/* Traveled Route Line */}
        {progress > 0 && (
          <motion.line 
            x1={originX} 
            y1={originY} 
            x2={currentX} 
            y2={currentY} 
            stroke="#2563EB" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        )}

        {/* Pickup Pin */}
        <circle cx={originX} cy={originY} r="4" fill="#22C55E" stroke="#ffffff" strokeWidth="1.5" />
        <text x={originX} y={originY + 14} fill="#94a3b8" fontSize="7" fontWeight="bold" textAnchor="middle">{origin || 'Origin'}</text>

        {/* Destination Pin */}
        <circle cx={destX} cy={destY} r="4" fill="#EF4444" stroke="#ffffff" strokeWidth="1.5" />
        <text x={destX} y={destY - 8} fill="#94a3b8" fontSize="7" fontWeight="bold" textAnchor="middle">{destination || 'Destination'}</text>

        {/* Vehicle Coordinates Tracker Marker */}
        {progress > 0 && progress < 100 && (
          <motion.g 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="cursor-pointer"
          >
            <circle cx={currentX} cy={currentY} r="7" fill="#2563EB" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
            <path d="M-3,-3 L3,3 M3,-3 L-3,3" stroke="#ffffff" strokeWidth="1" transform={`translate(${currentX}, ${currentY})`} />
          </motion.g>
        )}
      </svg>

      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 z-10 flex gap-3">
        <span>Lng: -96.7970</span>
        <span>Lat: 32.7767</span>
      </div>
    </div>
  );
};

export default function TripsView() {
  // 1. Initial operational resources
  const [vehicles, setVehicles] = useState(() => {
    const stored = localStorage.getItem('transitops.vehicles');
    return stored ? JSON.parse(stored) : [
      { regNumber: 'TX-1042-CS', name: 'Freightliner Cascadia #104', type: 'Semi-Truck', capacity: '45,000 lbs', odometer: '124,500 mi', cost: '$145,000', status: 'On Trip', driver: 'Sarah Jenkins', maintenanceLogs: [] },
      { regNumber: 'CA-2038-VN', name: 'Ford E-350 Cargo Van #203', type: 'Cargo Van', capacity: '9,500 lbs', odometer: '85,200 mi', cost: '$48,500', status: 'Available', driver: 'Michael Chang', maintenanceLogs: [] },
      { regNumber: 'CA-4010-EV', name: 'Tesla Semi #401', type: 'Electric Truck', capacity: '40,000 lbs', odometer: '12,400 mi', cost: '$180,000', status: 'Available', driver: 'David Miller', maintenanceLogs: [] },
      { regNumber: 'FL-1120-VV', name: 'Volvo VNL 860 #112', type: 'Semi-Truck', capacity: '45,000 lbs', odometer: '210,350 mi', cost: '$152,000', status: 'In Shop', driver: 'Elena Rostova', maintenanceLogs: [] },
      { regNumber: 'TX-1528-PB', name: 'Peterbilt 579 #152', type: 'Semi-Truck', capacity: '44,500 lbs', odometer: '198,400 mi', cost: '$138,000', status: 'Available', driver: 'Marcus Vance', maintenanceLogs: [] },
      { regNumber: 'MA-2059-VN', name: 'Ford E-350 Cargo Van #205', type: 'Cargo Van', capacity: '9,500 lbs', odometer: '94,150 mi', cost: '$49,000', status: 'On Trip', driver: 'James O\'Connor', maintenanceLogs: [] }
    ];
  });

  const [drivers, setDrivers] = useState(() => {
    const stored = localStorage.getItem('transitops.drivers');
    return stored ? JSON.parse(stored) : [
      { name: 'Sarah Jenkins', licenseCategory: 'A', licenseExpiry: '2027-08-12', safetyScore: 94, status: 'On Trip', licenseNumber: 'DL-84092-TX', phone: '+1 (555) 234-5678' },
      { name: 'Michael Chang', licenseCategory: 'B', licenseExpiry: '2028-01-20', safetyScore: 89, status: 'Available', licenseNumber: 'DL-20385-CA', phone: '+1 (555) 876-5432' },
      { name: 'David Miller', licenseCategory: 'A', licenseExpiry: '2026-07-24', safetyScore: 92, status: 'Available', licenseNumber: 'DL-40104-IL', phone: '+1 (555) 345-6789' },
      { name: 'Elena Rostova', licenseCategory: 'A', licenseExpiry: '2025-05-18', safetyScore: 68, status: 'Available', licenseNumber: 'DL-11204-FL', phone: '+1 (555) 456-7890' },
      { name: 'Marcus Vance', licenseCategory: 'A', licenseExpiry: '2026-10-15', safetyScore: 95, status: 'Suspended', licenseNumber: 'DL-15284-TX', phone: '+1 (555) 901-2345' },
      { name: 'James O\'Connor', licenseCategory: 'B', licenseExpiry: '2027-11-05', safetyScore: 84, status: 'On Trip', licenseNumber: 'DL-20594-NY', phone: '+1 (555) 789-0123' }
    ];
  });

  // 2. Mock Active Board Trips
  const [activeTrips, setActiveTrips] = useState(() => {
    const stored = localStorage.getItem('transitops.trips');
    if (stored) return JSON.parse(stored);
    const defaultTrips = [
      {
        id: 'TRIP-8402',
        cargo: 'Electronics (High Value)',
        origin: 'Atlanta, GA',
        destination: 'Charlotte, NC',
        vehicle: 'Freightliner Cascadia #104',
        driver: 'Sarah Jenkins',
        status: 'In Progress',
        priority: 'High',
        progress: 65,
        eta: 'Today, 4:30 PM',
        location: 'Route I-85 North (Mile 142)',
        distance: '245 mi'
      },
      {
        id: 'TRIP-8407',
        cargo: 'E-commerce Packages',
        origin: 'New York, NY',
        destination: 'Boston, MA',
        vehicle: 'Ford E-350 Cargo Van #205',
        driver: 'James O\'Connor',
        status: 'Dispatched',
        priority: 'Medium',
        progress: 25,
        eta: 'Today, 6:15 PM',
        location: 'Route I-95 North (Mile 45)',
        distance: '215 mi'
      }
    ];
    localStorage.setItem('transitops.trips', JSON.stringify(defaultTrips));
    return defaultTrips;
  });

  useEffect(() => {
    localStorage.setItem('transitops.trips', JSON.stringify(activeTrips));
  }, [activeTrips]);

  // 3. Form input states
  const [formSource, setFormSource] = useState('');
  const [formDest, setFormDest] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formRevenue, setFormRevenue] = useState('');
  const [formFuel, setFormFuel] = useState('');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formCargo, setFormCargo] = useState('');
  const [formDistance, setFormDistance] = useState('');

  // 4. Stepper control states (Draft, Dispatched, In Progress, Completed, Cancelled)
  const [stepperStage, setStepperStage] = useState('Draft');

  // Real-time compliance validations
  const [validations, setValidations] = useState({
    vehicleAvailable: false,
    driverAvailable: false,
    licenseValid: false,
    capacityOk: false
  });

  // AI recommendations box details
  const [aiRecs, setAiRecs] = useState({
    vehicle: 'Tesla Semi #401',
    driver: 'David Miller',
    fuelCost: '$180',
    profit: '$2,450',
    savings: '$120 (Smart Dispatch)',
    risk: 'Low (Safety Rating 92)'
  });

  // Calculate dynamic stats
  const kpis = {
    todayTrips: activeTrips.length + 4, // Including completed trips
    activeTrips: activeTrips.filter(t => t.status === 'In Progress' || t.status === 'Dispatched').length,
    completed: 3,
    cancelled: 1,
    pendingDispatch: stepperStage === 'Draft' && formSource && formDest ? 1 : 0,
    avgEta: '4.2h',
    revenueToday: '$14,850',
    fleetAvailability: '46%'
  };

  // Run dynamic validations whenever selectors change
  useEffect(() => {
    const vMatch = vehicles.find(v => v.name === selectedVehicle);
    const dMatch = drivers.find(d => d.name === selectedDriver);

    const vehicleOk = vMatch ? vMatch.status === 'Available' : false;
    const driverOk = dMatch ? dMatch.status === 'Available' : false;
    
    // License validity check
    const licenseOk = dMatch ? new Date(dMatch.licenseExpiry) > new Date() : false;
    
    // Weight limits check
    const weightVal = parseFloat(formWeight) || 0;
    const capacityOk = vMatch ? weightVal <= vMatch.capacity : false;

    setValidations({
      vehicleAvailable: vehicleOk,
      driverAvailable: driverOk,
      licenseValid: licenseOk,
      capacityOk: capacityOk
    });

    // Update AI recommendations pairing dynamically
    if (vMatch && dMatch) {
      const estimatedFuel = vMatch.type === 'Electric Truck' ? '$0 (EV)' : `$${Math.round(weightVal * 0.015 + 180)}`;
      const estimatedProfit = `$${Math.round((parseFloat(formRevenue) || 1200) - (vMatch.type === 'Electric Truck' ? 20 : 250))}`;
      const riskScore = dMatch.safetyScore >= 90 ? 'Low (Safety Rating ' + dMatch.safetyScore + ')' : 'Medium';
      
      setAiRecs({
        vehicle: vMatch.name,
        driver: dMatch.name,
        fuelCost: estimatedFuel,
        profit: estimatedProfit,
        savings: vMatch.type === 'Electric Truck' ? '$280 (Zero Emission Routing)' : '$95 (Eco Pathing)',
        risk: riskScore
      });
    }
  }, [selectedVehicle, selectedDriver, formWeight, formRevenue]);

  const canDispatch = validations.vehicleAvailable && validations.driverAvailable && validations.licenseValid && validations.capacityOk;

  // Handle Dispatch click
  const handleDispatch = (e) => {
    e.preventDefault();
    if (!canDispatch) return;

    const newTripId = `TRIP-${Math.floor(8400 + Math.random() * 200)}`;
    const newTrip = {
      id: newTripId,
      cargo: formCargo || 'General Freight',
      origin: formSource,
      destination: formDest,
      vehicle: selectedVehicle,
      driver: selectedDriver,
      status: 'Dispatched',
      priority: formPriority,
      progress: 0,
      eta: 'Today, 8:45 PM',
      location: `${formSource} Depot`
    };

    setActiveTrips([newTrip, ...activeTrips]);
    setStepperStage('Dispatched');

    // Reset inputs
    setFormSource('');
    setFormDest('');
    setSelectedVehicle('');
    setSelectedDriver('');
    setFormWeight('');
    setFormRevenue('');
    setFormFuel('');
    setFormCargo('');
  };

  const handleResetForm = () => {
    setFormSource('');
    setFormDest('');
    setSelectedVehicle('');
    setSelectedDriver('');
    setFormWeight('');
    setFormRevenue('');
    setFormFuel('');
    setFormCargo('');
    setStepperStage('Draft');
  };

  return (
    <div className="space-y-6">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Trip Dispatcher</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Create, validate, and dispatch transport trips under live compliance protocols (today: {kpis.todayTrips} dispatches).
        </p>
      </div>

      {/* TOP SUMMARY KPI CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-8 gap-4">
        
        {/* KPI 1: Today's Trips */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Today's Trips</span>
          <h3 className="text-xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={kpis.todayTrips} />
          </h3>
          <span className="text-[8px] text-emerald-600 font-semibold mt-1">Direct scheduling</span>
        </div>

        {/* KPI 2: Active */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Active Trips</span>
          <h3 className="text-xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={kpis.activeTrips} />
          </h3>
          <span className="text-[8px] text-blue-600 font-semibold mt-1">Live tracking</span>
        </div>

        {/* KPI 3: Completed */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Completed</span>
          <h3 className="text-xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={kpis.completed} />
          </h3>
          <span className="text-[8px] text-[#64748B] font-medium mt-1">Delivery records</span>
        </div>

        {/* KPI 4: Cancelled */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Cancelled</span>
          <h3 className="text-xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={kpis.cancelled} />
          </h3>
          <span className="text-[8px] text-red-500 font-semibold mt-1">Dispatcher override</span>
        </div>

        {/* KPI 5: Pending */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Pending Disp.</span>
          <h3 className="text-xl font-bold font-space text-slate-800 mt-2">
            <AnimatedCounter value={kpis.pendingDispatch} />
          </h3>
          <span className="text-[8px] text-[#64748B] font-medium mt-1">In staging queue</span>
        </div>

        {/* KPI 6: Average ETA */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Avg ETA</span>
          <h3 className="text-xl font-bold font-space text-slate-800 mt-2">{kpis.avgEta}</h3>
          <span className="text-[8px] text-emerald-600 font-semibold mt-1">Eco optimized</span>
        </div>

        {/* KPI 7: Revenue */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Revenue Today</span>
          <h3 className="text-xl font-bold font-space text-slate-800 mt-2">{kpis.revenueToday}</h3>
          <span className="text-[8px] text-emerald-600 font-semibold mt-1">+$2.8k vs target</span>
        </div>

        {/* KPI 8: Fleet Avail */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Fleet Avail.</span>
          <h3 className="text-xl font-bold font-space text-slate-800 mt-2">{kpis.fleetAvailability}</h3>
          <span className="text-[8px] text-[#64748B] font-medium mt-1">Deploy buffer optimal</span>
        </div>

      </section>

      {/* TRIP LIFECYCLE INTERACTIVE STEPPER */}
      <section className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 max-w-4xl mx-auto">
          {[
            { id: 'Draft', label: 'Draft Stage', desc: 'Planning cargo weight', color: 'border-slate-300 text-slate-500' },
            { id: 'Dispatched', label: 'Dispatched', desc: 'Validations cleared', color: 'border-blue-500 text-blue-600' },
            { id: 'In Progress', label: 'In Progress', desc: 'Live GPS coordinate sync', color: 'border-purple-500 text-purple-600' },
            { id: 'Completed', label: 'Completed', desc: 'Delivery signed off', color: 'border-emerald-500 text-emerald-600' },
            { id: 'Cancelled', label: 'Cancelled', desc: 'Archived / Terminated', color: 'border-red-500 text-red-600' }
          ].map((step, idx, arr) => {
            const isActive = stepperStage === step.id;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition duration-200 ${
                    isActive 
                      ? 'bg-blue-600 border-transparent text-white shadow-md shadow-blue-600/25 ring-4 ring-blue-50' 
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800 leading-none">{step.label}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">{step.desc}</span>
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden md:block flex-1 h-0.5 bg-slate-100" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* CORE WORKFLOW SPLIT PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Left Side: Create Trip Form + Real-time Validation (span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create Trip Form Card */}
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-[#111827] text-sm">Create Trip Dispatch</h3>
              <p className="text-[10px] text-[#64748B] mt-0.5">Input routing points and match compliance resources.</p>
            </div>

            <form onSubmit={handleDispatch} className="space-y-3.5 text-xs">
              
              {/* Pickup & Destination */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pickup (Source) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atlanta Depot, GA"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Charlotte Depot, NC"
                    value={formDest}
                    onChange={(e) => setFormDest(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cargo Name & Weight */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cargo Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High Value Electronics"
                    value={formCargo}
                    onChange={(e) => setFormCargo(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cargo Weight (lbs) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35000"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Vehicle Select */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assign Fleet Vehicle *</label>
                <div className="relative">
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Choose vehicle...</option>
                    {vehicles.map(v => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.type} | Max: {v.capacity.toLocaleString()} lbs | Status: {v.status})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 pointer-events-none text-slate-400" />
                </div>
              </div>

              {/* Driver Select */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assign Safety Driver *</label>
                <div className="relative">
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Choose driver...</option>
                    {drivers.map(d => (
                      <option key={d.name} value={d.name}>
                        {d.name} (Class {d.licenseCategory} | Score: {d.safetyScore} | Status: {d.status})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 pointer-events-none text-slate-400" />
                </div>
              </div>

              {/* Expected Revenue & Priority */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Expected Revenue *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2400"
                    value={formRevenue}
                    onChange={(e) => setFormRevenue(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Route Priority</label>
                  <div className="relative">
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value)}
                      className="w-full appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-2.5 pointer-events-none text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-center transition"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={!canDispatch}
                  className="flex-1 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition text-center"
                >
                  Dispatch Trip
                </button>
              </div>

            </form>
          </div>

          {/* Real-time Validation Card */}
          <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm space-y-3">
            <h4 className="font-bold text-[#111827] text-xs">Real-Time Compliance Dispatch Audit</h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              
              {/* Validation 1: Vehicle Status */}
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                validations.vehicleAvailable 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                  : 'bg-red-50 text-red-750 border-red-150'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  validations.vehicleAvailable ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {validations.vehicleAvailable ? '✓' : '✗'}
                </div>
                <div>
                  <span className="font-bold block leading-tight">Vehicle Availability</span>
                  <span className="text-[9px] font-medium opacity-85">
                    {validations.vehicleAvailable ? 'Unit Ready for dispatch' : 'Occupied / In Maintenance'}
                  </span>
                </div>
              </div>

              {/* Validation 2: Driver status */}
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                validations.driverAvailable 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                  : 'bg-red-50 text-red-750 border-red-150'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  validations.driverAvailable ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {validations.driverAvailable ? '✓' : '✗'}
                </div>
                <div>
                  <span className="font-bold block leading-tight">Driver Availability</span>
                  <span className="text-[9px] font-medium opacity-85">
                    {validations.driverAvailable ? 'Driver available' : 'Suspended / Rest active'}
                  </span>
                </div>
              </div>

              {/* Validation 3: License */}
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                validations.licenseValid 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                  : 'bg-red-50 text-red-750 border-red-150'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  validations.licenseValid ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {validations.licenseValid ? '✓' : '✗'}
                </div>
                <div>
                  <span className="font-bold block leading-tight">License Validity</span>
                  <span className="text-[9px] font-medium opacity-85">
                    {validations.licenseValid ? 'License Verified' : 'Expired / Class mismatch'}
                  </span>
                </div>
              </div>

              {/* Validation 4: Capacity */}
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                validations.capacityOk 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                  : 'bg-red-50 text-red-750 border-red-150'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  validations.capacityOk ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {validations.capacityOk ? '✓' : '✗'}
                </div>
                <div>
                  <span className="font-bold block leading-tight">Load Capacity</span>
                  <span className="text-[9px] font-medium opacity-85">
                    {validations.capacityOk ? 'Under maximum limit' : 'Cargo overweight alert'}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Map + AI recommendations + Live Board (span-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Map + AI recommendation section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Map Frame (col-span-3) */}
            <div className="md:col-span-3">
              <RoutingMap 
                origin={formSource} 
                destination={formDest} 
                progress={selectedVehicle && selectedDriver ? 35 : 0} 
              />
            </div>

            {/* AI Recommendation Panel (col-span-2) */}
            <div className="md:col-span-2 bg-[#F8FAFC] border border-[#E2E8F0] p-4.5 rounded-xl flex flex-col justify-between min-h-[190px]">
              <div>
                <h4 className="text-[10px] font-bold text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles size={13} className="text-violet-600" />
                  Smart-Dispatch Recommendation
                </h4>
                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Best Match Pairing:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[120px]">{aiRecs.driver.split(' ')[0]} + {aiRecs.vehicle.split('#')[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Est. Fuel Cost:</span>
                    <span className="font-bold font-mono text-slate-800">{aiRecs.fuelCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Expected Profit:</span>
                    <span className="font-bold font-mono text-emerald-600">{aiRecs.profit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Risk evaluation:</span>
                    <span className="font-bold text-emerald-600">{aiRecs.risk}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#E2E8F0] pt-2 mt-2 text-[9px] text-slate-500 font-semibold">
                Savings: {aiRecs.savings}
              </div>
            </div>

          </div>

          {/* Live Dispatch Board */}
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Live Dispatch Board</h3>
              <p className="text-[10px] text-[#64748B] mt-0.5">Real-time telematics of deployed routing units.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTrips.map(trip => (
                <div 
                  key={trip.id}
                  className="p-4 border border-[#E2E8F0] rounded-xl hover:shadow-md transition bg-slate-50/10 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-600 tracking-tight">{trip.id}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                      trip.status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      'bg-purple-50 text-purple-750 border border-purple-100'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{trip.cargo}</span>
                      <span className="text-[10px] font-medium text-slate-500">{trip.priority} Priority</span>
                    </div>
                    <div className="flex justify-between text-[#64748B]">
                      <span>Route: {trip.origin} → {trip.destination}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>Driver: {trip.driver}</span>
                      <span>Unit: {trip.vehicle.split(' ').pop()}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                      <span>Live Progress</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${trip.progress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-[#2563EB]"
                      />
                    </div>
                  </div>
                  
                  <div className="text-[9px] text-[#64748B] flex justify-between font-medium">
                    <span>Pos: {trip.location}</span>
                    <span>ETA: {trip.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: DISPATCH TIMELINE LOGS */}
      <section className="bg-white border border-[#E2E8F0] p-4.5 rounded-2xl shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Today's Dispatch Activity Log</h3>
          <p className="text-[10px] text-[#64748B] mt-0.5">Audit history of route dispatches and compliance overrides.</p>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <span className="font-bold text-slate-800">Route TRIP-8407 dispatched successfully</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Cargo: E-commerce Packages. Driver: James O'Connor</p>
              </div>
            </div>
            <span className="font-mono text-slate-400">1 hour ago</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <span className="font-bold text-slate-800">Route TRIP-8402 telematics synchronized</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Expected arrival at Charlotte Depot within 2 hours</p>
              </div>
            </div>
            <span className="font-mono text-slate-400">3 hours ago</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <div>
                <span className="font-bold text-red-650">Route TRIP-8405 cancelled by dispatcher</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Cargo load verification failed at Florida Depot</p>
              </div>
            </div>
            <span className="font-mono text-slate-400">4 hours ago</span>
          </div>
        </div>
      </section>

    </div>
  );
}
