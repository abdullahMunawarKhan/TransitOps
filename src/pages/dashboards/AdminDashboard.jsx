import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, Wrench, Fuel, BarChart3, Settings, 
  Clock, CheckCircle2, Activity, Navigation, ArrowUpRight 
} from 'lucide-react';

// Import modular components
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import FilterBar from '../../components/FilterBar';
import StatCard from '../../components/StatCard';
import TripsTable from '../../components/TripsTable';
import VehicleStatusCard from '../../components/VehicleStatusCard';
import TripDetailDrawer from '../../components/TripDetailDrawer';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState('Dashboard');

  // Sync state tab from route transitions
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveMenuTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleMenuTabChange = (tabName) => {
    if (tabName === 'Fleet') {
      navigate('/fleet');
    } else if (tabName === 'Drivers') {
      navigate('/drivers');
    } else if (tabName === 'Trips') {
      navigate('/trips');
    } else if (tabName === 'Maintenance') {
      navigate('/maintenance');
    } else if (tabName === 'Fuel & Expenses') {
      navigate('/fuel');
    } else {
      setActiveMenuTab(tabName);
    }
  };
  
  // Interactive UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRegion, setFilterRegion] = useState('All');
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  
  // Notification states
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', text: 'Vehicle Cascadia #104 fuel level below 15%', time: '10m ago', unread: true },
    { id: 2, type: 'danger', text: 'Trip TRIP-8405 cancelled by Dispatcher', time: '1h ago', unread: true },
    { id: 3, type: 'info', text: 'New route optimized for Trip TRIP-8402', time: '3h ago', unread: false }
  ]);
  
  // Mock Recent Trips Data
  const [trips, setTrips] = useState([
    { 
      id: 'TRIP-8402', 
      vehicle: 'Freightliner Cascadia #104', 
      type: 'Semi-Truck', 
      driver: 'Sarah Jenkins', 
      status: 'On Trip', 
      eta: 'Today, 4:30 PM',
      region: 'East Coast',
      origin: 'Atlanta, GA',
      destination: 'Charlotte, NC',
      cargo: 'Electronics (High Value)',
      temperature: '68°F (Ambient)',
      fuelStatus: '85%',
      speed: '68 mph',
      driverPhone: '+1 (555) 234-5678',
      driverRating: '4.9 ⭐',
      routeProgress: 65
    },
    { 
      id: 'TRIP-8403', 
      vehicle: 'Ford E-350 Cargo Van #203', 
      type: 'Cargo Van', 
      driver: 'Michael Chang', 
      status: 'Completed', 
      eta: 'Yesterday, 3:15 PM',
      region: 'West Coast',
      origin: 'Los Angeles, CA',
      destination: 'San Francisco, CA',
      cargo: 'Pharmaceuticals',
      temperature: '39°F (Refrigerated)',
      fuelStatus: '92%',
      speed: '0 mph',
      driverPhone: '+1 (555) 876-5432',
      driverRating: '4.8 ⭐',
      routeProgress: 100
    },
    { 
      id: 'TRIP-8404', 
      vehicle: 'Tesla Semi #401', 
      type: 'Electric Truck', 
      driver: 'David Miller', 
      status: 'Pending', 
      eta: 'Tomorrow, 9:00 AM',
      region: 'Mid-West',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      cargo: 'Auto Parts',
      temperature: 'N/A',
      fuelStatus: '100% (Charged)',
      speed: '0 mph',
      driverPhone: '+1 (555) 345-6789',
      driverRating: '4.95 ⭐',
      routeProgress: 0
    },
    { 
      id: 'TRIP-8405', 
      vehicle: 'Volvo VNL 860 #112', 
      type: 'Semi-Truck', 
      driver: 'Elena Rostova', 
      status: 'Cancelled', 
      eta: 'Cancelled',
      region: 'East Coast',
      origin: 'Miami, FL',
      destination: 'Atlanta, GA',
      cargo: 'Fresh Produce',
      temperature: '34°F (Frozen)',
      fuelStatus: '40%',
      speed: '0 mph',
      driverPhone: '+1 (555) 456-7890',
      driverRating: '4.7 ⭐',
      routeProgress: 20
    },
    { 
      id: 'TRIP-8406', 
      vehicle: 'Peterbilt 579 #152', 
      type: 'Semi-Truck', 
      driver: 'Marcus Vance', 
      status: 'Draft', 
      eta: 'Planning Stage',
      region: 'South-West',
      origin: 'Dallas, TX',
      destination: 'Houston, TX',
      cargo: 'Building Materials',
      temperature: 'N/A',
      fuelStatus: '100%',
      speed: '0 mph',
      driverPhone: '+1 (555) 901-2345',
      driverRating: '4.6 ⭐',
      routeProgress: 0
    },
    { 
      id: 'TRIP-8407', 
      vehicle: 'Ford E-350 Cargo Van #205', 
      type: 'Cargo Van', 
      driver: 'James O\'Connor', 
      status: 'On Trip', 
      eta: 'Today, 6:15 PM',
      region: 'East Coast',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      cargo: 'E-commerce Packages',
      temperature: 'N/A',
      fuelStatus: '62%',
      speed: '55 mph',
      driverPhone: '+1 (555) 789-0123',
      driverRating: '4.85 ⭐',
      routeProgress: 45
    }
  ]);
  
  // Stat values that adjust when filtering
  const [kpis, setKpis] = useState({
    activeVehicles: '42',
    availableVehicles: '18',
    maintenanceVehicles: '5',
    activeTrips: '28',
    pendingTrips: '12',
    driversOnDuty: '36',
    utilization: '94.2%'
  });

  // Recalculate KPIs based on status filters for extra premium fidelity
  useEffect(() => {
    let activeV = 42;
    let availV = 18;
    let maintV = 5;
    let activeT = 28;
    let pendT = 12;
    let drivers = 36;
    let util = 94.2;

    if (filterType !== 'All') {
      activeV = filterType === 'Semi-Truck' ? 24 : filterType === 'Cargo Van' ? 12 : 6;
      availV = filterType === 'Semi-Truck' ? 10 : filterType === 'Cargo Van' ? 6 : 2;
      maintV = filterType === 'Semi-Truck' ? 3 : filterType === 'Cargo Van' ? 1 : 1;
      activeT = filterType === 'Semi-Truck' ? 16 : filterType === 'Cargo Van' ? 8 : 4;
      util = filterType === 'Electric Truck' ? 96.5 : 93.8;
    }

    if (filterRegion !== 'All') {
      const regionFactor = filterRegion === 'East Coast' ? 0.4 : filterRegion === 'West Coast' ? 0.3 : 0.15;
      activeV = Math.round(activeV * regionFactor * 2.5);
      availV = Math.round(availV * regionFactor * 2.5);
      maintV = Math.round(maintV * regionFactor * 2.5) || 1;
      activeT = Math.round(activeT * regionFactor * 2.5);
      pendT = Math.round(pendT * regionFactor * 2.5) || 2;
      drivers = Math.round(drivers * regionFactor * 2.5);
    }

    setKpis({
      activeVehicles: String(activeV),
      availableVehicles: String(availV),
      maintenanceVehicles: String(maintV),
      activeTrips: String(activeT),
      pendingTrips: String(pendT),
      driversOnDuty: String(drivers),
      utilization: util.toFixed(1) + '%'
    });
  }, [filterType, filterRegion]);

  // Sidebar Menu Items definition
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Fleet', icon: Truck, badge: '65' },
    { name: 'Drivers', icon: Users, badge: '40' },
    { name: 'Trips', icon: Navigation, badge: '12' },
    { name: 'Maintenance', icon: Wrench, alert: true },
    { name: 'Fuel & Expenses', icon: Fuel },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  // Filtering Recent Trips list
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All' || trip.type === filterType;
    const matchesStatus = filterStatus === 'All' || trip.status === filterStatus;
    const matchesRegion = filterRegion === 'All' || trip.region === filterRegion;

    return matchesSearch && matchesType && matchesStatus && matchesRegion;
  });

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('supabase.auth.token');
    navigate('/login');
  };

  const handleAddTrip = () => {
    const newTripId = `TRIP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTrip = {
      id: newTripId,
      vehicle: 'Tesla Semi #402',
      type: 'Electric Truck',
      driver: 'Aria Brooks',
      status: 'Pending',
      eta: 'Tomorrow, 2:00 PM',
      region: 'West Coast',
      origin: 'Seattle, WA',
      destination: 'Portland, OR',
      cargo: 'Medical Supplies',
      temperature: '38°F (Refrigerated)',
      fuelStatus: '100% (Charged)',
      speed: '0 mph',
      driverPhone: '+1 (555) 654-3210',
      driverRating: '4.9 ⭐',
      routeProgress: 0
    };
    setTrips([newTrip, ...trips]);
    setNotifications([{
      id: Date.now(),
      type: 'info',
      text: `Created new scheduled Trip: ${newTripId}`,
      time: 'Just now',
      unread: true
    }, ...notifications]);
  };

  // Sparkline data
  const statCharts = {
    activeVehicles: [38, 39, 41, 40, 43, 42, 42],
    availableVehicles: [22, 20, 19, 21, 17, 19, 18],
    maintenance: [7, 6, 8, 5, 4, 6, 5],
    activeTrips: [22, 25, 27, 26, 29, 28, 28],
    pending: [15, 14, 11, 13, 10, 12, 12],
    drivers: [32, 34, 35, 33, 37, 36, 36],
    utilization: [92.1, 93.4, 93.9, 94.0, 94.5, 94.1, 94.2]
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#111827] font-sans antialiased overflow-x-hidden">
      
      {/* 1. SIDEBAR */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={handleMenuTabChange}
        handleLogout={handleLogout}
        menuItems={menuItems}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* 2. TOP NAVIGATION */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          notifications={notifications}
          markAllNotificationsRead={markAllNotificationsRead}
          deleteNotification={deleteNotification}
          handleLogout={handleLogout}
          onAddTrip={handleAddTrip}
          setActiveMenuTab={handleMenuTabChange}
        />

        {/* ACTIVE MAIN ROUTE CONTAINER */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          
          {activeMenuTab !== 'Dashboard' ? (
            /* Page constructors fallbacks */
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Truck size={30} />
              </div>
              <h2 className="text-xl font-bold mb-2">{activeMenuTab} Management Console</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                You are currently viewing the {activeMenuTab} segment of the operations platform. Fleet metrics and synchronization are fully live.
              </p>
              <button 
                onClick={() => setActiveMenuTab('Dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
              >
                Back to Dashboard Overview
              </button>
            </div>
          ) : (
            /* MAIN DASHBOARD OVERVIEW */
            <>
              {/* 3. FILTER SECTION */}
              <FilterBar
                filterType={filterType}
                setFilterType={setFilterType}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterRegion={filterRegion}
                setFilterRegion={setFilterRegion}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              {/* 4. KPI CARDS */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                <StatCard
                  title="Active Vehicles"
                  value={kpis.activeVehicles}
                  icon={Truck}
                  trend="+8.4%"
                  trendText="vs last month"
                  points={statCharts.activeVehicles}
                  color="#2563EB"
                  borderColorClass="border-l-4 border-[#2563EB]"
                  delay={0.01}
                />
                <StatCard
                  title="Available Vehicles"
                  value={kpis.availableVehicles}
                  icon={CheckCircle2}
                  trend="+2.1%"
                  trendText="vs yesterday"
                  points={statCharts.availableVehicles}
                  color="#22C55E"
                  borderColorClass="border-l-4 border-[#22C55E]"
                  delay={0.02}
                />
                <StatCard
                  title="In Maintenance"
                  value={kpis.maintenanceVehicles}
                  icon={Wrench}
                  trend="-12.5%"
                  trendText="vs last week"
                  isTrendingDown={true}
                  points={statCharts.maintenance}
                  color="#F59E0B"
                  borderColorClass="border-l-4 border-[#F59E0B]"
                  delay={0.03}
                />
                <StatCard
                  title="Active Trips"
                  value={kpis.activeTrips}
                  icon={Activity}
                  trend="+14.2%"
                  trendText="vs last week"
                  points={statCharts.activeTrips}
                  color="#2563EB"
                  borderColorClass="border-l-4 border-[#2563EB]"
                  delay={0.04}
                />
                <StatCard
                  title="Pending Trips"
                  value={kpis.pendingTrips}
                  icon={Clock}
                  trend="+5.0%"
                  trendText="vs yesterday"
                  points={statCharts.pending}
                  color="#7C3AED"
                  borderColorClass="border-l-4 border-[#7C3AED]"
                  delay={0.05}
                />
                <StatCard
                  title="Drivers On Duty"
                  value={kpis.driversOnDuty}
                  icon={Users}
                  trend="+4.8%"
                  trendText="vs last shift"
                  points={statCharts.drivers}
                  color="#22C55E"
                  borderColorClass="border-l-4 border-[#22C55E]"
                  delay={0.06}
                />
                <StatCard
                  title="Fleet Util."
                  value={kpis.utilization}
                  icon={ArrowUpRight}
                  trend="+1.5%"
                  trendText="vs last week"
                  points={statCharts.utilization}
                  color="#22C55E"
                  borderColorClass="border-l-4 border-[#22C55E]"
                  delay={0.07}
                />
              </section>

              {/* 5. TABLE & STATUS GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Recent Trips Table */}
                <div className="xl:col-span-2">
                  <TripsTable
                    filteredTrips={filteredTrips}
                    onSelectTrip={setSelectedTrip}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>

                {/* Vehicle Allocation Status progress bars */}
                <div>
                  <VehicleStatusCard
                    availableCount={18}
                    availablePercent="30%"
                    onTripCount={42}
                    onTripPercent="60%"
                    inShopCount={5}
                    inShopPercent="8%"
                    retiredCount={2}
                    retiredPercent="2%"
                    totalCapacity={65}
                  />
                </div>

              </div>
            </>
          )}

        </main>
      </div>

      {/* 6. STRIPE-GRADE DETAILS OVERLAY DRAWER */}
      <TripDetailDrawer
        selectedTrip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
        onMarkCompleted={(tripId, data) => {
          const updatedTrips = trips.map(t => {
            if (t.id === tripId) {
              return { ...t, status: 'Completed', routeProgress: 100, speed: '0 mph' };
            }
            return t;
          });
          setTrips(updatedTrips);
          setSelectedTrip(null);
          setNotifications([{
            id: Date.now(),
            type: 'info',
            text: `Trip ${tripId} marked as Completed`,
            time: 'Just now',
            unread: true
          }, ...notifications]);

          // Sync trips
          const storedTrips = JSON.parse(localStorage.getItem('transitops.trips') || '[]');
          const newStoredTrips = storedTrips.map(t => t.id === tripId ? { ...t, status: 'Completed' } : t);
          localStorage.setItem('transitops.trips', JSON.stringify(newStoredTrips));

          // Sync vehicle
          const storedVehicles = JSON.parse(localStorage.getItem('transitops.vehicles') || '[]');
          const tripDetails = trips.find(t => t.id === tripId);
          if (tripDetails) {
            const newVehicles = storedVehicles.map(v => {
              if (v.name === tripDetails.vehicle) {
                const updatedLogs = [...(v.fuelLogs || []), {
                  date: new Date().toISOString().split('T')[0],
                  cost: `$${data.fuelCost}`,
                  [v.type === 'Electric Truck' ? 'kWh' : 'liters']: data.fuel
                }];
                return { ...v, status: 'In Shop', odometer: data.odometer, driver: '', fuelLogs: updatedLogs };
              }
              return v;
            });
            localStorage.setItem('transitops.vehicles', JSON.stringify(newVehicles));

            // Sync driver
            const storedDrivers = JSON.parse(localStorage.getItem('transitops.drivers') || '[]');
            const newDrivers = storedDrivers.map(d => {
              if (d.name === tripDetails.driver) {
                return { ...d, status: 'Available', currentVehicle: '' };
              }
              return d;
            });
            localStorage.setItem('transitops.drivers', JSON.stringify(newDrivers));
          }
        }}
        onCancelTrip={() => {
          const updatedTrips = trips.map(t => {
            if (t.id === selectedTrip.id) {
              return { ...t, status: 'Cancelled', routeProgress: 0, speed: '0 mph' };
            }
            return t;
          });
          setTrips(updatedTrips);
          setSelectedTrip({ ...selectedTrip, status: 'Cancelled', routeProgress: 0, speed: '0 mph' });
          setNotifications([{
            id: Date.now(),
            type: 'danger',
            text: `Trip ${selectedTrip.id} cancelled manually`,
            time: 'Just now',
            unread: true
          }, ...notifications]);
        }}
      />

    </div>
  );
}
