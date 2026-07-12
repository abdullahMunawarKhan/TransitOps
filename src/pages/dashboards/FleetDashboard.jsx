import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, Wrench, Fuel, Settings, 
  CheckCircle2, ArrowUpRight 
} from 'lucide-react';

// Import modular components
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import FilterBar from '../../components/FilterBar';
import StatCard from '../../components/StatCard';
import VehicleStatusCard from '../../components/VehicleStatusCard';

export default function FleetDashboard() {
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
  
  // Notification states
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', text: 'Vehicle Cascadia #104 fuel level below 15%', time: '10m ago', unread: true },
    { id: 3, type: 'info', text: 'New route optimized for Trip TRIP-8402', time: '3h ago', unread: false }
  ]);
  
  // Stat values that adjust when filtering
  const [kpis, setKpis] = useState({
    activeVehicles: '42',
    availableVehicles: '18',
    maintenanceVehicles: '5',
    utilization: '94.2%'
  });

  // Recalculate KPIs based on status filters for extra premium fidelity
  useEffect(() => {
    let activeV = 42;
    let availV = 18;
    let maintV = 5;
    let util = 94.2;

    if (filterType !== 'All') {
      activeV = filterType === 'Semi-Truck' ? 24 : filterType === 'Cargo Van' ? 12 : 6;
      availV = filterType === 'Semi-Truck' ? 10 : filterType === 'Cargo Van' ? 6 : 2;
      maintV = filterType === 'Semi-Truck' ? 3 : filterType === 'Cargo Van' ? 1 : 1;
      util = filterType === 'Electric Truck' ? 96.5 : 93.8;
    }

    if (filterRegion !== 'All') {
      const regionFactor = filterRegion === 'East Coast' ? 0.4 : filterRegion === 'West Coast' ? 0.3 : 0.15;
      activeV = Math.round(activeV * regionFactor * 2.5);
      availV = Math.round(availV * regionFactor * 2.5);
      maintV = Math.round(maintV * regionFactor * 2.5) || 1;
    }

    setKpis({
      activeVehicles: String(activeV),
      availableVehicles: String(availV),
      maintenanceVehicles: String(maintV),
      utilization: util.toFixed(1) + '%'
    });
  }, [filterType, filterRegion]);

  // Sidebar Menu Items definition
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Fleet', icon: Truck, badge: '65' },
    { name: 'Drivers', icon: Users, badge: '40' },
    { name: 'Maintenance', icon: Wrench, alert: true },
    { name: 'Fuel & Expenses', icon: Fuel },
    { name: 'Settings', icon: Settings },
  ];

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

  // Sparkline data
  const statCharts = {
    activeVehicles: [38, 39, 41, 40, 43, 42, 42],
    availableVehicles: [22, 20, 19, 21, 17, 19, 18],
    maintenance: [7, 6, 8, 5, 4, 6, 5],
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
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  title="Fleet Util."
                  value={kpis.utilization}
                  icon={ArrowUpRight}
                  trend="+1.5%"
                  trendText="vs last week"
                  points={statCharts.utilization}
                  color="#22C55E"
                  borderColorClass="border-l-4 border-[#22C55E]"
                  delay={0.04}
                />
              </section>

              {/* 5. VEHICLE STATUS GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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

    </div>
  );
}
