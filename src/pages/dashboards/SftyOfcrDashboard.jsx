import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShieldCheck, IdCard, FileText, Settings,
  AlertTriangle, ShieldAlert, Ban, Users, TrendingUp, CheckCircle2,
  Navigation, ChevronDown, Search, X, Download, Plus, Edit2
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import DriverTable from '../../components/DriverTable';
import DriverDrawer from '../../components/DriverDrawer';
import AnimatedCounter from '../../components/AnimatedCounter';

import { getDrivers, saveDrivers, updateDriver } from '../../utils/storage';
import { exportToCSV } from '../../utils/export';

// ── Safety Alert Feed ──────────────────────────────────────────────────────────
const AlertFeed = ({ alerts }) => {
  if (alerts.length === 0)
    return (
      <div className="flex flex-col items-center py-10 text-slate-400 text-xs font-medium gap-2">
        <ShieldCheck size={32} className="text-emerald-400" />
        No active safety alerts — fleet compliance is healthy.
      </div>
    );

  return (
    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`flex gap-3 p-3 rounded-xl border text-xs ${
            a.severity === 'critical'
              ? 'bg-red-50/60 border-red-200'
              : a.severity === 'warning'
              ? 'bg-amber-50/60 border-amber-200'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <a.Icon
            size={14}
            className={`flex-shrink-0 mt-0.5 ${
              a.severity === 'critical'
                ? 'text-red-500'
                : a.severity === 'warning'
                ? 'text-amber-500'
                : 'text-slate-400'
            }`}
          />
          <div>
            <p className="font-semibold text-slate-800">{a.title}</p>
            <p className="text-slate-500 mt-0.5">{a.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── License Bucket View ────────────────────────────────────────────────────────
const LicenseMonitorView = ({ drivers }) => {
  const today = new Date();
  const bucket = (d) => {
    const diff = Math.ceil((new Date(d.licenseExpiry) - today) / 86400000);
    if (diff < 0) return 'Expired';
    if (diff <= 7) return '7 days';
    if (diff <= 15) return '15 days';
    if (diff <= 30) return '30 days';
    return 'Valid';
  };

  const tabs = ['Expired', '7 days', '15 days', '30 days', 'Valid'];
  const [active, setActive] = useState('Expired');

  const colored = {
    Expired: 'bg-red-100 text-red-700 border-red-300',
    '7 days': 'bg-orange-100 text-orange-700 border-orange-300',
    '15 days': 'bg-amber-100 text-amber-700 border-amber-300',
    '30 days': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Valid: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  };

  const activeTabColor = {
    Expired: 'bg-red-600 text-white shadow-red-500/20',
    '7 days': 'bg-orange-500 text-white shadow-orange-400/20',
    '15 days': 'bg-amber-500 text-white shadow-amber-400/20',
    '30 days': 'bg-yellow-500 text-white shadow-yellow-400/20',
    Valid: 'bg-emerald-600 text-white shadow-emerald-500/20',
  };

  const filtered = drivers.filter((d) => bucket(d) === active);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count = drivers.filter((d) => bucket(d) === t).length;
          const isActive = active === t;
          return (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm ${
                isActive ? `${activeTabColor[t]} shadow-md` : `bg-white ${colored[t]}`
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-xs font-medium">
          <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-400" />
          No drivers in this category.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">License #</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Days Remaining</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => {
                const diff = Math.ceil((new Date(d.licenseExpiry) - today) / 86400000);
                return (
                  <tr key={d.licenseNumber} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{d.licenseNumber}</td>
                    <td className="py-3 px-4">Class {d.licenseCategory}</td>
                    <td className="py-3 px-4 font-medium">{d.licenseExpiry}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          diff < 0 ? 'text-red-600' : diff <= 7 ? 'text-orange-600' : 'text-amber-600'
                        }`}
                      >
                        {diff < 0 ? `${Math.abs(diff)} days ago` : `${diff} days`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${colored[active]}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Safety Reports View ───────────────────────────────────────────────────────
const REPORT_COLS = {
  'License Expiry Report': [
    { label: 'Driver Name', key: 'name' },
    { label: 'License Number', key: 'licenseNumber' },
    { label: 'Category', key: (r) => `Class ${r.licenseCategory}` },
    { label: 'Expiry Date', key: 'licenseExpiry' },
    { label: 'Status', key: 'status' },
    { label: 'Safety Score', key: 'safetyScore' },
  ],
  'Driver Compliance Report': [
    { label: 'Driver Name', key: 'name' },
    { label: 'License Number', key: 'licenseNumber' },
    { label: 'Category', key: (r) => `Class ${r.licenseCategory}` },
    { label: 'Expiry Date', key: 'licenseExpiry' },
    { label: 'Status', key: 'status' },
    { label: 'Safety Score', key: 'safetyScore' },
    { label: 'Trips Completed', key: 'tripsCompleted' },
    { label: 'Phone', key: 'phone' },
  ],
  'Safety Score Ranking': [
    { label: 'Rank', key: (_, i) => i + 1 },
    { label: 'Driver Name', key: 'name' },
    { label: 'Safety Score', key: 'safetyScore' },
    { label: 'Status', key: 'status' },
    { label: 'License Expiry', key: 'licenseExpiry' },
    { label: 'Violations', key: (r) => (r.violations || []).length },
  ],
};

const SafetyReportsView = ({ drivers }) => {
  const today = new Date();

  const handleExport = (reportName) => {
    let data = [...drivers];
    const cols = REPORT_COLS[reportName];

    if (reportName === 'License Expiry Report') {
      data = data.sort((a, b) => new Date(a.licenseExpiry) - new Date(b.licenseExpiry));
    } else if (reportName === 'Safety Score Ranking') {
      data = data.sort((a, b) => b.safetyScore - a.safetyScore);
    }

    // For 'Rank' column that needs index, wrap exportToCSV inline
    if (reportName === 'Safety Score Ranking') {
      const header = cols.map((c) => c.label).join(',');
      const rows = data.map((row, i) =>
        cols.map((c) => (typeof c.key === 'function' ? c.key(row, i) : row[c.key])).join(',')
      );
      const csv = [header, ...rows].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportName.toLowerCase().replace(/\s+/g, '-')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    exportToCSV(data, cols, reportName.toLowerCase().replace(/\s+/g, '-'));
  };

  const reports = [
    {
      name: 'License Expiry Report',
      desc: 'All drivers sorted by license expiry date, soonest first.',
      count: `${drivers.length} drivers`,
      color: 'bg-amber-50 border-amber-200',
      icon: IdCard,
      iconColor: 'text-amber-600',
    },
    {
      name: 'Driver Compliance Report',
      desc: 'Full compliance snapshot per driver: status, license validity, safety score.',
      count: `${drivers.length} drivers`,
      color: 'bg-blue-50 border-blue-200',
      icon: ShieldCheck,
      iconColor: 'text-blue-600',
    },
    {
      name: 'Safety Score Ranking',
      desc: 'All drivers ranked by safety score, descending.',
      count: `${drivers.length} drivers`,
      color: 'bg-violet-50 border-violet-200',
      icon: TrendingUp,
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.name}
              className={`border rounded-2xl p-5 flex flex-col gap-3 ${r.color} hover:shadow-md transition`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${r.iconColor}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {r.count}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{r.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
              </div>
              <button
                onClick={() => handleExport(r.name)}
                className="mt-auto flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition self-start shadow-sm"
              >
                <Download size={12} />
                Export CSV
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Driver Compliance View ────────────────────────────────────────────────────
const DriverComplianceView = ({ drivers, onDriversChange }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const handleSuspendToggle = (driver) => {
    const nextStatus = driver.status === 'Suspended' ? 'Available' : 'Suspended';
    const updated = updateDriver(driver.licenseNumber, { status: nextStatus });
    onDriversChange(updated);
  };

  const handleScoreUpdate = (driver, nextScore) => {
    const updated = updateDriver(driver.licenseNumber, { safetyScore: nextScore });
    onDriversChange(updated);
  };

  const filtered = drivers.filter((d) => {
    const matchesName =
      d.name.toLowerCase().includes(searchName.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchName.toLowerCase());
    const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || d.licenseCategory === filterCategory;
    return matchesName && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Name or license number..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-1.5 pl-7 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
          <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
        </div>
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Classes</option>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
          </select>
          <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
        </div>
        {(searchName || filterStatus !== 'All' || filterCategory !== 'All') && (
          <button
            onClick={() => { setSearchName(''); setFilterStatus('All'); setFilterCategory('All'); }}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      <DriverTable
        drivers={filtered}
        onSelectDriver={setSelectedDriver}
        onEditDriver={() => {}}
        onSuspendDriver={handleSuspendToggle}
        onDeleteDriver={() => {}}
        allowScoreEdit={true}
        onUpdateScore={handleScoreUpdate}
        hideActions={false}
      />

      <AnimatePresence>
        {selectedDriver && (
          <DriverDrawer driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function SftyOfcrDashboard() {
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState('Dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    setDrivers(getDrivers());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('supabase.auth.token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Driver Compliance', icon: ShieldCheck },
    { name: 'License Monitor', icon: IdCard },
    { name: 'Safety Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'danger', text: 'Elena Rostova has an expired license', time: '1h ago', unread: true },
    { id: 2, type: 'warning', text: 'David Miller license expires in 12 days', time: '3h ago', unread: true },
  ]);

  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ── KPI Derivations ──────────────────────────────────────────────────────────
  const today = new Date();
  const activeDrvrs = drivers; // All drivers (safety view includes all)
  const total = activeDrvrs.length;
  const suspended = activeDrvrs.filter((d) => d.status === 'Suspended').length;
  const onDuty = activeDrvrs.filter((d) => d.status === 'On Trip').length;
  const avgScore =
    total > 0
      ? Math.round(activeDrvrs.reduce((s, d) => s + (d.safetyScore || 0), 0) / total)
      : 0;

  const expiringSoon = activeDrvrs.filter((d) => {
    const diff = Math.ceil((new Date(d.licenseExpiry) - today) / 86400000);
    return diff >= 0 && diff <= 30;
  }).length;
  const expired = activeDrvrs.filter((d) => new Date(d.licenseExpiry) < today).length;

  // Safety alert feed
  const alerts = [
    ...activeDrvrs
      .filter((d) => new Date(d.licenseExpiry) < today)
      .map((d) => ({
        severity: 'critical',
        Icon: ShieldAlert,
        title: `Expired License — ${d.name}`,
        detail: `License ${d.licenseNumber} expired on ${d.licenseExpiry}.`,
      })),
    ...activeDrvrs
      .filter((d) => {
        const diff = Math.ceil((new Date(d.licenseExpiry) - today) / 86400000);
        return diff >= 0 && diff <= 30;
      })
      .map((d) => {
        const diff = Math.ceil((new Date(d.licenseExpiry) - today) / 86400000);
        return {
          severity: 'warning',
          Icon: AlertTriangle,
          title: `License Expiring Soon — ${d.name}`,
          detail: `Expires in ${diff} day${diff !== 1 ? 's' : ''} (${d.licenseExpiry}).`,
        };
      }),
    ...activeDrvrs
      .filter((d) => d.safetyScore < 70)
      .map((d) => ({
        severity: 'warning',
        Icon: TrendingUp,
        title: `Low Safety Score — ${d.name}`,
        detail: `Score: ${d.safetyScore}/100. Requires immediate review.`,
      })),
    ...activeDrvrs
      .filter((d) => d.status === 'Suspended')
      .map((d) => ({
        severity: 'info',
        Icon: Ban,
        title: `Driver Suspended — ${d.name}`,
        detail: `${d.name} is currently suspended and excluded from dispatch pool.`,
      })),
  ];

  // Sparkline mock points
  const safetySparkline = [82, 84, 83, 85, 86, 87, avgScore];
  const suspendedSparkline = [1, 2, 1, 1, 2, 2, suspended];
  const expirySparkline = [1, 2, 2, 3, expired + expiringSoon - 1, expired + expiringSoon, expired + expiringSoon];
  const dutySparkline = [3, 2, 4, 3, 3, 4, onDuty];
  const expiredSparkline = [0, 0, 1, 1, 1, 1, expired];

  const renderContent = () => {
    switch (activeMenuTab) {
      case 'Driver Compliance':
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Driver Compliance</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Manage driver licensing, safety scores and suspension status.</p>
            </div>
            <DriverComplianceView drivers={drivers} onDriversChange={setDrivers} />
          </div>
        );
      case 'License Monitor':
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">License Monitor</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Drivers grouped by commercial license expiry windows.</p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
              <LicenseMonitorView drivers={drivers} />
            </div>
          </div>
        );
      case 'Safety Reports':
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Safety Reports</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Download CSV compliance and ranking reports.</p>
            </div>
            <SafetyReportsView drivers={drivers} />
          </div>
        );
      case 'Settings':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Settings size={28} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Settings</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Safety Officer configuration options will appear here.</p>
          </div>
        );
      default:
        return (
          <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Safety Dashboard</h1>
                <p className="text-xs text-[#64748B] mt-0.5">Fleet compliance and driver safety overview — {total} total drivers.</p>
              </div>
            </div>

            {/* KPI Cards */}
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                title="Licenses Expiring (30d)"
                value={expiringSoon}
                icon={IdCard}
                trend={`${expired} expired`}
                trendText="action required"
                isTrendingDown={true}
                points={expirySparkline}
                color="#F59E0B"
                borderColorClass="border-l-4 border-[#F59E0B]"
                delay={0.01}
              />
              <StatCard
                title="Expired Licenses"
                value={expired}
                icon={AlertTriangle}
                trend={expired > 0 ? 'Critical' : 'Clear'}
                trendText="immediate review"
                isTrendingDown={expired > 0}
                points={expiredSparkline}
                color="#EF4444"
                borderColorClass="border-l-4 border-[#EF4444]"
                delay={0.02}
              />
              <StatCard
                title="Suspended Drivers"
                value={suspended}
                icon={Ban}
                trend="Blocked from dispatch"
                trendText="pool exclusion active"
                isTrendingDown={suspended > 0}
                points={suspendedSparkline}
                color="#7C3AED"
                borderColorClass="border-l-4 border-[#7C3AED]"
                delay={0.03}
              />
              <StatCard
                title="Avg Safety Score"
                value={avgScore}
                icon={ShieldCheck}
                trend={avgScore >= 85 ? '+Optimal' : 'Below target'}
                trendText="fleet average"
                points={safetySparkline}
                color="#2563EB"
                borderColorClass="border-l-4 border-[#2563EB]"
                delay={0.04}
              />
              <StatCard
                title="Drivers On Duty"
                value={onDuty}
                icon={Navigation}
                trend="Active routes"
                trendText="currently on trip"
                points={dutySparkline}
                color="#22C55E"
                borderColorClass="border-l-4 border-[#22C55E]"
                delay={0.05}
              />
            </section>

            {/* Alert Feed + Safety Distribution */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-red-500" />
                  Safety Alert Feed
                </h3>
                <AlertFeed alerts={alerts} />
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-blue-500" />
                  Score Distribution
                </h3>
                {total === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">No driver data available.</p>
                ) : (
                  <div className="space-y-3">
                    {[
                      { label: 'Excellent (90–100)', count: drivers.filter((d) => d.safetyScore >= 90).length, color: 'bg-emerald-500' },
                      { label: 'Good (70–89)', count: drivers.filter((d) => d.safetyScore >= 70 && d.safetyScore < 90).length, color: 'bg-amber-500' },
                      { label: 'Critical (<70)', count: drivers.filter((d) => d.safetyScore < 70).length, color: 'bg-red-500' },
                    ].map((seg) => (
                      <div key={seg.label}>
                        <div className="flex justify-between text-[11px] font-semibold mb-1 text-slate-600">
                          <span>{seg.label}</span>
                          <span>{seg.count} drivers</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${total > 0 ? (seg.count / total) * 100 : 0}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${seg.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#111827] font-sans antialiased overflow-x-hidden">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        handleLogout={handleLogout}
        menuItems={menuItems}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
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
          setActiveMenuTab={setActiveMenuTab}
        />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
