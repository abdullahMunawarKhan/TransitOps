
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, Wrench, Fuel, BarChart3, 
  ShieldCheck, TrendingUp, Zap, ArrowRight 
} from 'lucide-react';

function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Truck,
      title: 'Vehicle Registry',
      description: 'Centralized master list for vehicle tracking with automated status syncing between Available, On Trip, In Shop, and Retired.'
    },
    {
      icon: Users,
      title: 'Driver Management',
      description: 'Complete driver profiles including license details, contact info, safety scores, and real-time status updates.'
    },
    {
      icon: LayoutDashboard,
      title: 'Smart Trip Management',
      description: 'Create and manage trips with mandatory business rules enforcement and automated lifecycle tracking (Draft → Dispatched → Completed → Cancelled).'
    },
    {
      icon: Wrench,
      title: 'Maintenance Workflow',
      description: 'Comprehensive maintenance log generation with automatic vehicle status switching and service scheduling.'
    },
    {
      icon: Fuel,
      title: 'Fuel & Expense Management',
      description: 'Record fuel logs and operational expenses, auto-calculate total operational cost per vehicle and fleet-wide.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Data-driven insights for fuel efficiency, fleet utilization, and vehicle ROI with CSV/PDF export capabilities.'
    }
  ];

  const roles = [
    {
      title: 'Fleet Manager',
      description: 'Oversee fleet assets, maintenance, vehicle lifecycle, and efficiency.'
    },
    {
      title: 'Dispatcher',
      description: 'Manage and optimize daily trip assignments and driver allocations.'
    },
    {
      title: 'Safety Officer',
      description: 'Track driver compliance, license validity, and safety scores across the fleet.'
    },
    {
      title: 'Financial Analyst',
      description: 'Review operational expenses, fuel consumption, maintenance costs, and profitability.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Truck size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#2563EB] to-indigo-600 bg-clip-text text-transparent">
                TransitOps
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 rounded-xl transition"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-[#F8FAFC]" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <Zap size={16} className="text-[#2563EB]" />
                <span className="text-xs font-semibold text-[#2563EB]">
                  Smart Transport Operations Platform
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Digitize Your Fleet Operations with
                <span className="block bg-gradient-to-r from-[#2563EB] to-indigo-600 bg-clip-text text-transparent">
                  TransitOps
                </span>
              </h1>
              
              <p className="text-lg text-[#6B7280] max-w-xl">
                An end-to-end transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management while enforcing strict business rules and providing real-time operational insights.
              </p>
              
              <p className="text-sm text-[#6B7280]">
                Replace spreadsheets and manual logbooks with a centralized system to manage the complete lifecycle of logistics and transport operations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02]"
                >
                  Start Free Trial
                  <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-[#111827] rounded-xl font-semibold border border-[#E5E7EB] transition"
                >
                  Sign In to Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-6">
                <div>
                  <div className="text-2xl font-bold text-[#111827]">65+</div>
                  <div className="text-xs text-[#6B7280]">Vehicles Managed</div>
                </div>
                <div className="h-10 w-px bg-[#E5E7EB]" />
                <div>
                  <div className="text-2xl font-bold text-[#111827]">40+</div>
                  <div className="text-xs text-[#6B7280]">Active Drivers</div>
                </div>
                <div className="h-10 w-px bg-[#E5E7EB]" />
                <div>
                  <div className="text-2xl font-bold text-[#111827]">94.2%</div>
                  <div className="text-xs text-[#6B7280]">Fleet Utilization</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden relative z-10">
                <div className="p-4 bg-gradient-to-r from-[#2563EB] to-indigo-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-[#111827]">Fleet Overview</div>
                    <div className="text-xs text-[#22C55E] bg-green-50 px-2 py-1 rounded-full font-medium">
                      Live
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                      <div className="text-xs text-[#6B7280] mb-1">Active Vehicles</div>
                      <div className="text-2xl font-bold text-[#2563EB]">42</div>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                      <div className="text-xs text-[#6B7280] mb-1">Active Trips</div>
                      <div className="text-2xl font-bold text-[#2563EB]">28</div>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                      <div className="text-xs text-[#6B7280] mb-1">Available</div>
                      <div className="text-2xl font-bold text-[#22C55E]">18</div>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
                      <div className="text-xs text-[#6B7280] mb-1">Drivers On Duty</div>
                      <div className="text-2xl font-bold text-[#22C55E]">36</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-4">
            <TrendingUp size={16} className="text-[#2563EB]" />
            <span className="text-xs font-semibold text-[#2563EB]">
              Powerful Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Manage Your Fleet
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Comprehensive tools designed to streamline your transport operations and improve efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#111827]">
                {feature.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-4">
              <ShieldCheck size={16} className="text-[#2563EB]" />
              <span className="text-xs font-semibold text-[#2563EB]">
                Role-Based Access
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Custom Interfaces for Every Team Member
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Each role gets a tailored experience with the tools and permissions they need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <div 
                key={index} 
                className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] text-center"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2563EB] to-indigo-600 text-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-bold">{role.title.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#111827]">
                  {role.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="bg-gradient-to-r from-[#2563EB] to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Fleet Operations?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of logistics teams already using TransitOps to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/signup')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2563EB] rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-[1.02]"
            >
              Get Started for Free
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-indigo-600 flex items-center justify-center text-white">
                <Truck size={16} />
              </div>
              <span className="font-semibold text-[#111827]">TransitOps</span>
            </div>
            <div className="text-xs text-[#6B7280]">
              © 2026 TransitOps. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;

