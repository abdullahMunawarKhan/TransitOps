import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (user.role === 'fleet') {
        navigate('/fleet-dashboard', { replace: true });
      } else if (user.role === 'dispatcher') {
        navigate('/dispatcher-dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 font-semibold animate-pulse">Loading dashboard...</div>
    </div>
  );
}
