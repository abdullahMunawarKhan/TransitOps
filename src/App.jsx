import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import FleetDashboard from './pages/dashboards/FleetDashboard';
import DispatcherDashboard from './pages/dashboards/Dispatcher';
import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';
import SftyOfcrDashboard from './pages/dashboards/SftyOfcrDashboard';
import FinclAnystDashboard from './pages/dashboards/FinclAnystDashboard';



// Helper to get user from localStorage
const getCurrentUser = () => {
  try {
    const authToken = localStorage.getItem('supabase.auth.token');
    if (!authToken) return null;
    const parsed = JSON.parse(authToken);
    return parsed?.currentSession?.user || null;
  } catch (e) {
    return null;
  }
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const isWelcomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/update-password';
  const isDashboardPage = 
    location.pathname === '/dashboard' || 
    location.pathname === '/admin-dashboard' || 
    location.pathname === '/fleet-dashboard' || 
    location.pathname === '/dispatcher-dashboard' || 
    location.pathname === '/safety-dashboard' || 
    location.pathname === '/finance-dashboard' || 
    location.pathname === '/fleet' || 
    location.pathname === '/drivers' || 
    location.pathname === '/trips' || 
    location.pathname === '/maintenance' ||
    location.pathname === '/fuel';

  // Redirect logic
  useEffect(() => {
    if (currentUser) {
      // If user is logged in and on welcome/login/signup page, redirect to their dashboard
      if (isWelcomePage || isAuthPage) {
        if (currentUser.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (currentUser.role === 'fleet') {
          navigate('/fleet-dashboard', { replace: true });
        } else if (currentUser.role === 'dispatcher') {
          navigate('/dispatcher-dashboard', { replace: true });
        } else if (currentUser.role === 'safety_officer') {
          navigate('/safety-dashboard', { replace: true });
        } else if (currentUser.role === 'financial_analyst') {
          navigate('/finance-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } else {
      // If user is not logged in and on a protected page, redirect to login
      if (isDashboardPage) {
        navigate('/login', { replace: true });
      }
    }
  }, [currentUser, location.pathname, navigate, isWelcomePage, isAuthPage, isDashboardPage]);

  return (
    <div className="relative min-h-screen bg-slate-50 text-gray-900 font-sans">
      <main className="p-0 min-h-screen">
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/fleet-dashboard" element={<FleetDashboard />} />
            <Route path="/dispatcher-dashboard" element={<DispatcherDashboard />} />
            <Route path="/safety-dashboard" element={<SftyOfcrDashboard />} />
            <Route path="/finance-dashboard" element={<FinclAnystDashboard />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </div>
      </main>

    </div>
  );
}

export default App;


