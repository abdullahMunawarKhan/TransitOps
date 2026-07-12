import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';

import TopPanel from './components/TopPanel';

function App() {
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';
  const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/fleet' || location.pathname === '/drivers' || location.pathname === '/trips' || location.pathname === '/maintenance';

  return (
    <div className="relative min-h-screen bg-slate-50 text-gray-900 font-sans">
      {!isWelcomePage && !isDashboardPage && <TopPanel />}
      <main className={isWelcomePage || isDashboardPage ? "p-0" : "p-4 min-h-[calc(100vh-64px)]"}>
        <div className={isWelcomePage || isDashboardPage ? "w-full" : "w-full max-w-7xl mx-auto"}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/maintenance" element={<Maintenance />} />
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


