import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, Wrench, Fuel, BarChart3, Settings, Navigation
} from 'lucide-react';
import { supabase } from '../utils/supabase';

// Import modular components
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DriversView from '../components/DriversView';

export default function Drivers() {
  const navigate = useNavigate();

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Interactive UI states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', text: 'Vehicle Cascadia #104 fuel level below 15%', time: '10m ago', unread: true },
    { id: 2, type: 'danger', text: 'Trip TRIP-8405 cancelled by Dispatcher', time: '1h ago', unread: true },
    { id: 3, type: 'info', text: 'New route optimized for Trip TRIP-8402', time: '3h ago', unread: false }
  ]);

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

  const handleMenuClick = (tabName) => {
    if (tabName === 'Dashboard') {
      navigate('/dashboard');
    } else if (tabName === 'Fleet') {
      navigate('/fleet');
    } else if (tabName !== 'Drivers') {
      // Navigate to dashboard and trigger that tab view
      navigate('/dashboard', { state: { activeTab: tabName } });
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#111827] font-sans antialiased overflow-x-hidden">
      
      {/* 1. SIDEBAR */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        activeMenuTab="Drivers"
        setActiveMenuTab={handleMenuClick}
        handleLogout={handleLogout}
        menuItems={menuItems}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* 2. TOP NAVIGATION */}
        <Navbar
          searchQuery=""
          setSearchQuery={() => {}}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          notifications={notifications}
          markAllNotificationsRead={markAllNotificationsRead}
          deleteNotification={deleteNotification}
          handleLogout={handleLogout}
          onAddTrip={() => navigate('/dashboard')} // quick action bypass
          setActiveMenuTab={handleMenuClick}
        />

        {/* ACTIVE MAIN ROUTE CONTAINER */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          
          {/* DRIVERS & SAFETY PANEL */}
          <DriversView />

        </main>
      </div>

    </div>
  );
}
