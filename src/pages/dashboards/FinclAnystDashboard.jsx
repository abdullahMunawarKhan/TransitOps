import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Fuel, Receipt, TrendingUp, FileText, Settings,
  DollarSign, Wrench, Zap, BarChart2, PieChart, Plus, X, ChevronDown,
  Search, Download, Edit, Trash2, CheckCircle2
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import AnimatedCounter from '../../components/AnimatedCounter';

import { getVehicles, getRevenueEntries, addRevenueEntry, deleteRevenueEntry, saveRevenueEntries } from '../../utils/storage';
import { parseCurrency, parseNumeric, formatCurrency } from '../../utils/parsers';
import { exportToCSV } from '../../utils/export';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Sum all fuel costs for a vehicle (handles number and string formats) */
const vehicleFuelTotal = (v) =>
  (v.fuelLogs || []).reduce((s, f) => s + parseCurrency(f.cost), 0);

/** Sum all maintenance costs for a vehicle */
const vehicleMaintenanceTotal = (v) =>
  (v.maintenanceLogs || []).reduce((s, m) => s + parseCurrency(m.cost), 0);

/** Sum all other expenses for a vehicle (handles .cost and .amount keys) */
const vehicleOtherTotal = (v) =>
  (v.otherExpenses || []).reduce(
    (s, e) => s + parseCurrency(e.amount !== undefined ? e.amount : e.cost),
    0
  );

const isCurrentMonth = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

// Exclude Draft vehicles from all financial calculations
const activeVehicles = (vehicles) => vehicles.filter((v) => v.status !== 'Draft');

// ── Fuel Analytics View ───────────────────────────────────────────────────────
const FuelAnalyticsView = ({ vehicles }) => {
  const [filterVehicle, setFilterVehicle] = useState('All');
  const [search, setSearch] = useState('');

  const active = activeVehicles(vehicles);

  const rows = active.flatMap((v) =>
    (v.fuelLogs || []).map((f) => ({
      vehicle: v.name,
      regNumber: v.regNumber,
      type: v.type,
      liters: parseNumeric(f.liters || f.kWh || 0),
      unit: v.type === 'Electric Truck' ? 'kWh' : 'L',
      cost: parseCurrency(f.cost),
      date: f.date,
      odometer: parseNumeric(v.odometer),
    }))
  );

  const filteredRows = rows.filter((r) => {
    const matchVehicle = filterVehicle === 'All' || r.regNumber === filterVehicle;
    const matchSearch = r.vehicle.toLowerCase().includes(search.toLowerCase());
    return matchVehicle && matchSearch;
  });

  const totalFuel = filteredRows.reduce((s, r) => s + r.liters, 0);
  const totalCost = filteredRows.reduce((s, r) => s + r.cost, 0);
  const avgEfficiency = filteredRows.length > 0
    ? (filteredRows.reduce((s, r) => s + (r.odometer / (r.liters || 1)), 0) / filteredRows.length).toFixed(2)
    : 'N/A';

  const handleExport = () => {
    exportToCSV(
      filteredRows,
      [
        { label: 'Vehicle', key: 'vehicle' },
        { label: 'Reg Number', key: 'regNumber' },
        { label: 'Type', key: 'type' },
        { label: 'Fuel Used', key: (r) => `${r.liters} ${r.unit}` },
        { label: 'Cost (₹)', key: (r) => formatCurrency(r.cost) },
        { label: 'Date', key: 'date' },
        { label: 'Efficiency (mi/unit)', key: (r) => (r.odometer / (r.liters || 1)).toFixed(2) },
      ],
      'fuel-analytics-report'
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Fuel Used', value: `${totalFuel.toLocaleString()} units`, color: 'border-blue-400' },
          { label: 'Total Fuel Cost', value: formatCurrency(totalCost), color: 'border-amber-400' },
          { label: 'Avg Efficiency', value: avgEfficiency === 'N/A' ? 'N/A' : `${avgEfficiency} mi/unit`, color: 'border-emerald-400' },
        ].map((s) => (
          <div key={s.label} className={`bg-white border ${s.color} border-l-4 rounded-2xl p-4 shadow-sm`}>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold font-space text-slate-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-1.5 pl-7 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
              />
            </div>
            <div className="relative">
              <select
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
                className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Vehicles</option>
                {active.map((v) => (
                  <option key={v.regNumber} value={v.regNumber}>{v.name}</option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Download size={12} />
            Export CSV
          </button>
        </div>

        {filteredRows.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            <Fuel size={28} className="mx-auto mb-2 text-slate-300" />
            No fuel log entries match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Fuel Used</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4">Efficiency</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.vehicle}</td>
                    <td className="py-3 px-4 text-slate-500">{r.type}</td>
                    <td className="py-3 px-4 font-mono">{r.liters} {r.unit}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">{formatCurrency(r.cost)}</td>
                    <td className="py-3 px-4 font-mono">{(r.odometer / (r.liters || 1)).toFixed(2)} mi/{r.unit}</td>
                    <td className="py-3 px-4 text-slate-500">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Expense Management View ───────────────────────────────────────────────────
const ExpenseManagementView = ({ vehicles, revenueEntries, onRevenueChange }) => {
  const [tab, setTab] = useState('Expenses');
  const [showAddRevenue, setShowAddRevenue] = useState(false);
  const [filterVehicle, setFilterVehicle] = useState('All');

  const active = activeVehicles(vehicles);

  // Revenue form state
  const [revForm, setRevForm] = useState({ vehicleId: '', vehicleName: '', amount: '', date: '', note: '' });
  const [revError, setRevError] = useState('');

  const allExpenses = active.flatMap((v) => [
    ...(v.maintenanceLogs || []).map((m) => ({
      vehicle: v.name, regNumber: v.regNumber, category: 'Maintenance',
      amount: parseCurrency(m.cost), description: m.description || m.type, date: m.date,
    })),
    ...(v.fuelLogs || []).map((f) => ({
      vehicle: v.name, regNumber: v.regNumber, category: 'Fuel',
      amount: parseCurrency(f.cost), description: `${parseNumeric(f.liters || f.kWh || 0)} ${v.type === 'Electric Truck' ? 'kWh' : 'L'}`, date: f.date,
    })),
    ...(v.otherExpenses || []).map((e) => ({
      vehicle: v.name, regNumber: v.regNumber, category: e.type || 'Other',
      amount: parseCurrency(e.amount !== undefined ? e.amount : e.cost), description: e.description || '', date: e.date,
    })),
  ]).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredExpenses = allExpenses.filter(
    (e) => filterVehicle === 'All' || e.regNumber === filterVehicle
  );

  const handleAddRevenue = (ev) => {
    ev.preventDefault();
    if (!revForm.vehicleId || !revForm.amount || !revForm.date) {
      setRevError('Vehicle, amount and date are required.');
      return;
    }
    const entry = {
      id: `REV-${Date.now()}`,
      vehicleId: revForm.vehicleId,
      vehicleName: revForm.vehicleName,
      amount: parseCurrency(revForm.amount),
      date: revForm.date,
      note: revForm.note,
    };
    const updated = addRevenueEntry(entry);
    onRevenueChange(updated);
    setRevForm({ vehicleId: '', vehicleName: '', amount: '', date: '', note: '' });
    setRevError('');
    setShowAddRevenue(false);
  };

  const handleDeleteRevenue = (id) => {
    const updated = deleteRevenueEntry(id);
    onRevenueChange(updated);
  };

  const exportExpenses = () =>
    exportToCSV(
      filteredExpenses,
      [
        { label: 'Vehicle', key: 'vehicle' },
        { label: 'Category', key: 'category' },
        { label: 'Amount (₹)', key: (r) => formatCurrency(r.amount) },
        { label: 'Description', key: 'description' },
        { label: 'Date', key: 'date' },
      ],
      'expense-report'
    );

  const exportRevenue = () =>
    exportToCSV(
      revenueEntries,
      [
        { label: 'Entry ID', key: 'id' },
        { label: 'Vehicle', key: 'vehicleName' },
        { label: 'Reg Number', key: 'vehicleId' },
        { label: 'Amount (₹)', key: (r) => formatCurrency(r.amount) },
        { label: 'Date', key: 'date' },
        { label: 'Note', key: 'note' },
      ],
      'revenue-log'
    );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['Expenses', 'Revenue Log'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition ${
              tab === t
                ? 'bg-[#2563EB] text-white border-transparent shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Expenses' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={filterVehicle}
                  onChange={(e) => setFilterVehicle(e.target.value)}
                  className="appearance-none bg-white border border-[#E2E8F0] rounded-xl py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">All Vehicles</option>
                  {active.map((v) => (
                    <option key={v.regNumber} value={v.regNumber}>{v.name}</option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>
            <button onClick={exportExpenses} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm">
              <Download size={12} />Export CSV
            </button>
          </div>
          {filteredExpenses.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">
              <Receipt size={28} className="mx-auto mb-2 text-slate-300" />
              No expense records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map((e, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-semibold text-slate-800">{e.vehicle}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-red-600 font-semibold">{formatCurrency(e.amount)}</td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{e.description}</td>
                      <td className="py-3 px-4 text-slate-500">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'Revenue Log' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Revenue Entries ({revenueEntries.length})</span>
            <div className="flex gap-2">
              <button onClick={exportRevenue} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm">
                <Download size={12} />Export CSV
              </button>
              <button
                onClick={() => setShowAddRevenue(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                <Plus size={12} />Log Revenue
              </button>
            </div>
          </div>

          {revenueEntries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">
              <DollarSign size={28} className="mx-auto mb-2 text-slate-300" />
              No revenue entries yet. Click "Log Revenue" to add one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Note</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {revenueEntries.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-mono text-slate-500 text-[10px]">{e.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{e.vehicleName}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{formatCurrency(e.amount)}</td>
                      <td className="py-3 px-4 text-slate-500">{e.date}</td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{e.note || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleDeleteRevenue(e.id)} className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition" title="Delete">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Revenue Drawer */}
      <AnimatePresence>
        {showAddRevenue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddRevenue(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative bg-white rounded-2xl max-w-md w-full border border-[#E2E8F0] shadow-2xl p-6 z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Log Revenue Entry</h3>
                <button onClick={() => setShowAddRevenue(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>
              {revError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">{revError}</div>}
              <form onSubmit={handleAddRevenue} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Vehicle *</label>
                  <select
                    value={revForm.vehicleId}
                    onChange={(e) => {
                      const v = activeVehicles(vehicles).find((v) => v.regNumber === e.target.value);
                      setRevForm({ ...revForm, vehicleId: e.target.value, vehicleName: v ? v.name : '' });
                    }}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">— Select Vehicle —</option>
                    {activeVehicles(vehicles).map((v) => (
                      <option key={v.regNumber} value={v.regNumber}>{v.name} ({v.regNumber})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={revForm.amount}
                      onChange={(e) => setRevForm({ ...revForm, amount: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Date *</label>
                    <input
                      type="date"
                      value={revForm.date}
                      onChange={(e) => setRevForm({ ...revForm, date: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Note</label>
                  <input
                    type="text"
                    placeholder="Optional note..."
                    value={revForm.note}
                    onChange={(e) => setRevForm({ ...revForm, note: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAddRevenue(false)} className="px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10 text-xs">Save Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Profitability View ────────────────────────────────────────────────────────
const ProfitabilityView = ({ vehicles, revenueEntries }) => {
  const active = activeVehicles(vehicles);

  const rows = active.map((v) => {
    const revenue = revenueEntries
      .filter((e) => e.vehicleId === v.regNumber)
      .reduce((s, e) => s + parseCurrency(e.amount), 0);
    const fuel = vehicleFuelTotal(v);
    const maintenance = vehicleMaintenanceTotal(v);
    const other = vehicleOtherTotal(v);
    const totalExpenses = fuel + maintenance + other;
    const netProfit = revenue - totalExpenses;
    const acquisitionCost = parseCurrency(v.cost);
    const roi = acquisitionCost > 0
      ? (((revenue - (maintenance + fuel)) / acquisitionCost) * 100).toFixed(1)
      : '—';

    return { v, revenue, fuel, maintenance, other, totalExpenses, netProfit, acquisitionCost, roi };
  }).sort((a, b) => b.netProfit - a.netProfit);

  const handleExport = () =>
    exportToCSV(
      rows,
      [
        { label: 'Vehicle', key: (r) => r.v.name },
        { label: 'Reg Number', key: (r) => r.v.regNumber },
        { label: 'Acquisition Cost (₹)', key: (r) => formatCurrency(r.acquisitionCost) },
        { label: 'Revenue (₹)', key: (r) => formatCurrency(r.revenue) },
        { label: 'Fuel Cost (₹)', key: (r) => formatCurrency(r.fuel) },
        { label: 'Maintenance Cost (₹)', key: (r) => formatCurrency(r.maintenance) },
        { label: 'Other Expenses (₹)', key: (r) => formatCurrency(r.other) },
        { label: 'Total Expenses (₹)', key: (r) => formatCurrency(r.totalExpenses) },
        { label: 'Net Profit (₹)', key: (r) => formatCurrency(r.netProfit) },
        { label: 'ROI (%)', key: (r) => r.roi },
      ],
      'vehicle-roi-report'
    );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Vehicle Profitability (Revenue join key: regNumber)</h3>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm">
            <Download size={12} />Export CSV
          </button>
        </div>
        {rows.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No active vehicles to report.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Revenue</th>
                  <th className="py-3 px-4">Fuel</th>
                  <th className="py-3 px-4">Maintenance</th>
                  <th className="py-3 px-4">Other</th>
                  <th className="py-3 px-4">Net Profit</th>
                  <th className="py-3 px-4">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(({ v, revenue, fuel, maintenance, other, netProfit, roi }) => (
                  <tr key={v.regNumber} className={`hover:bg-slate-50/50 transition ${netProfit < 0 ? 'bg-red-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{v.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.regNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{formatCurrency(revenue)}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{formatCurrency(fuel)}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{formatCurrency(maintenance)}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{formatCurrency(other)}</td>
                    <td className={`py-3 px-4 font-mono font-bold ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {formatCurrency(netProfit)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        roi === '—' ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : parseFloat(roi) >= 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {roi}{roi !== '—' ? '%' : ''}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Financial Reports View ────────────────────────────────────────────────────
const FinancialReportsView = ({ vehicles, revenueEntries }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const active = activeVehicles(vehicles);

  const handleFuelReport = () =>
    exportToCSV(
      active.flatMap((v) =>
        (v.fuelLogs || []).map((f) => ({
          vehicle: v.name,
          regNumber: v.regNumber,
          liters: parseNumeric(f.liters || f.kWh || 0),
          unit: v.type === 'Electric Truck' ? 'kWh' : 'L',
          cost: parseCurrency(f.cost),
          efficiency: (parseNumeric(v.odometer) / (parseNumeric(f.liters || f.kWh || 1))).toFixed(2),
          date: f.date,
        }))
      ),
      [
        { label: 'Vehicle', key: 'vehicle' },
        { label: 'Reg Number', key: 'regNumber' },
        { label: 'Fuel Used', key: (r) => `${r.liters} ${r.unit}` },
        { label: 'Cost (₹)', key: (r) => formatCurrency(r.cost) },
        { label: 'Efficiency (mi/unit)', key: 'efficiency' },
        { label: 'Date', key: 'date' },
      ],
      'fuel-report'
    );

  const handleExpenseReport = () => {
    const rows = active.flatMap((v) => [
      ...(v.maintenanceLogs || []).map((m) => ({ vehicle: v.name, regNumber: v.regNumber, category: 'Maintenance', amount: parseCurrency(m.cost), description: m.type, date: m.date })),
      ...(v.fuelLogs || []).map((f) => ({ vehicle: v.name, regNumber: v.regNumber, category: 'Fuel', amount: parseCurrency(f.cost), description: `${parseNumeric(f.liters || f.kWh || 0)} units`, date: f.date })),
      ...(v.otherExpenses || []).map((e) => ({ vehicle: v.name, regNumber: v.regNumber, category: e.type || 'Other', amount: parseCurrency(e.amount !== undefined ? e.amount : e.cost), description: e.description || '', date: e.date })),
    ]);
    exportToCSV(rows, [
      { label: 'Vehicle', key: 'vehicle' }, { label: 'Category', key: 'category' },
      { label: 'Amount (₹)', key: (r) => formatCurrency(r.amount) }, { label: 'Description', key: 'description' }, { label: 'Date', key: 'date' },
    ], 'expense-report');
  };

  const handleROIReport = () => {
    const rows = active.map((v) => {
      const revenue = revenueEntries.filter((e) => e.vehicleId === v.regNumber).reduce((s, e) => s + parseCurrency(e.amount), 0);
      const fuel = vehicleFuelTotal(v);
      const maint = vehicleMaintenanceTotal(v);
      const acq = parseCurrency(v.cost);
      const roi = acq > 0 ? (((revenue - (maint + fuel)) / acq) * 100).toFixed(1) : '—';
      return { vehicle: v.name, regNumber: v.regNumber, acquisitionCost: acq, revenue, fuel, maint, netProfit: revenue - (fuel + maint + vehicleOtherTotal(v)), roi };
    }).sort((a, b) => parseFloat(b.roi || 0) - parseFloat(a.roi || 0));
    exportToCSV(rows, [
      { label: 'Vehicle', key: 'vehicle' }, { label: 'Reg Number', key: 'regNumber' },
      { label: 'Acquisition (₹)', key: (r) => formatCurrency(r.acquisitionCost) },
      { label: 'Revenue (₹)', key: (r) => formatCurrency(r.revenue) },
      { label: 'Fuel (₹)', key: (r) => formatCurrency(r.fuel) },
      { label: 'Maintenance (₹)', key: (r) => formatCurrency(r.maint) },
      { label: 'Net Profit (₹)', key: (r) => formatCurrency(r.netProfit) },
      { label: 'ROI (%)', key: 'roi' },
    ], 'vehicle-roi-report');
  };

  const handleMonthlyReport = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const inMonth = (dateStr) => {
      const d = new Date(dateStr);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    };
    const revenue = revenueEntries.filter((e) => inMonth(e.date)).reduce((s, e) => s + parseCurrency(e.amount), 0);
    const expenses = active.flatMap((v) => [
      ...(v.maintenanceLogs || []).filter((m) => inMonth(m.date)).map((m) => ({ category: 'Maintenance', amount: parseCurrency(m.cost) })),
      ...(v.fuelLogs || []).filter((f) => inMonth(f.date)).map((f) => ({ category: 'Fuel', amount: parseCurrency(f.cost) })),
      ...(v.otherExpenses || []).filter((e) => inMonth(e.date)).map((e) => ({ category: 'Other', amount: parseCurrency(e.amount !== undefined ? e.amount : e.cost) })),
    ]);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    exportToCSV(
      [{ month: selectedMonth, revenue: revenue.toFixed(2), expenses: totalExpenses.toFixed(2), profit: (revenue - totalExpenses).toFixed(2) }],
      [
        { label: 'Month', key: 'month' }, { label: 'Revenue (₹)', key: (r) => formatCurrency(r.revenue) },
        { label: 'Expenses (₹)', key: (r) => formatCurrency(r.expenses) }, { label: 'Net Profit (₹)', key: (r) => formatCurrency(r.profit) },
      ],
      `monthly-report-${selectedMonth}`
    );
  };

  const reportDefs = [
    { name: 'Fuel Report', desc: 'Fleet fuel logs with efficiency computed per entry.', icon: Fuel, color: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600', fn: handleFuelReport },
    { name: 'Expense Report', desc: 'All expense categories (Fuel, Maintenance, Tolls, Other).', icon: Receipt, color: 'bg-amber-50 border-amber-200', iconColor: 'text-amber-600', fn: handleExpenseReport },
    { name: 'Vehicle ROI Report', desc: 'Per-vehicle ROI ranking, descending.', icon: TrendingUp, color: 'bg-violet-50 border-violet-200', iconColor: 'text-violet-600', fn: handleROIReport },
    { name: 'Monthly Report', desc: 'Revenue, expenses and profit rollup for a selected month.', icon: BarChart2, color: 'bg-emerald-50 border-emerald-200', iconColor: 'text-emerald-600', fn: handleMonthlyReport, hasMonthPicker: true },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {reportDefs.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.name} className={`border rounded-2xl p-5 flex flex-col gap-3 ${r.color} hover:shadow-md transition`}>
              <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${r.iconColor}`}>
                <Icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{r.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
              </div>
              {r.hasMonthPicker && (
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              )}
              <button
                onClick={r.fn}
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

// ── Main Financial Dashboard ───────────────────────────────────────────────────
export default function FinclAnystDashboard() {
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState('Dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [revenueEntries, setRevenueEntries] = useState([]);

  useEffect(() => {
    setVehicles(getVehicles());
    setRevenueEntries(getRevenueEntries());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('supabase.auth.token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Fuel Analytics', icon: Fuel },
    { name: 'Expenses', icon: Receipt },
    { name: 'Profitability', icon: TrendingUp },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', text: 'Monthly financial report ready for export', time: '2h ago', unread: true },
  ]);
  const markAllNotificationsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ── KPI Derivations ──────────────────────────────────────────────────────────
  const active = activeVehicles(vehicles);
  const today = new Date();

  const totalRevenue = revenueEntries.reduce((s, e) => s + parseCurrency(e.amount), 0);
  const totalFuelCost = active.reduce((s, v) => s + vehicleFuelTotal(v), 0);
  const totalMaintenance = active.reduce((s, v) => s + vehicleMaintenanceTotal(v), 0);
  const totalOther = active.reduce((s, v) => s + vehicleOtherTotal(v), 0);
  const operationalCost = totalFuelCost + totalMaintenance + totalOther;
  const netProfit = totalRevenue - operationalCost;
  const margin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  const todayStr = today.toISOString().split('T')[0];
  const todayFuel = active.reduce(
    (s, v) => s + (v.fuelLogs || []).filter((f) => f.date === todayStr).reduce((ss, f) => ss + parseCurrency(f.cost), 0),
    0
  );

  const monthlyExpenses = active.reduce((s, v) => {
    const fuel = (v.fuelLogs || []).filter((f) => isCurrentMonth(f.date)).reduce((ss, f) => ss + parseCurrency(f.cost), 0);
    const maint = (v.maintenanceLogs || []).filter((m) => isCurrentMonth(m.date)).reduce((ss, m) => ss + parseCurrency(m.cost), 0);
    const other = (v.otherExpenses || []).filter((e) => isCurrentMonth(e.date)).reduce((ss, e) => ss + parseCurrency(e.amount !== undefined ? e.amount : e.cost), 0);
    return s + fuel + maint + other;
  }, 0);

  // Fleet ROI (aggregate)
  const totalAcquisition = active.reduce((s, v) => s + parseCurrency(v.cost), 0);
  const fleetROI = totalAcquisition > 0
    ? (((totalRevenue - (totalMaintenance + totalFuelCost)) / totalAcquisition) * 100).toFixed(1)
    : '0.0';

  const revenueSparkline = [4000, 5200, 4800, 6100, 5900, 6400, totalRevenue];
  const fuelSparkline = [600, 650, 700, 680, 720, 710, totalFuelCost];
  const maintSparkline = [200, 180, 350, 120, 280, 310, totalMaintenance];
  const profitSparkline = [500, 900, 600, 1200, 1000, 1100, netProfit > 0 ? netProfit : 0];

  const renderContent = () => {
    switch (activeMenuTab) {
      case 'Fuel Analytics':
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Fuel Analytics</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Fleet-wide fuel consumption, costs and efficiency metrics.</p>
            </div>
            <FuelAnalyticsView vehicles={vehicles} />
          </div>
        );
      case 'Expenses':
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Expense & Revenue Management</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Track all operational expenses and log revenue entries per vehicle.</p>
            </div>
            <ExpenseManagementView vehicles={vehicles} revenueEntries={revenueEntries} onRevenueChange={setRevenueEntries} />
          </div>
        );
      case 'Profitability':
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Profitability Analysis</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Per-vehicle revenue, expenses, net profit and ROI. Revenue joined via vehicle registration number.</p>
            </div>
            <ProfitabilityView vehicles={vehicles} revenueEntries={revenueEntries} />
          </div>
        );
      case 'Reports':
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Financial Reports</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Download CSV ledger reports for fuel, expenses, ROI and monthly summaries.</p>
            </div>
            <FinancialReportsView vehicles={vehicles} revenueEntries={revenueEntries} />
          </div>
        );
      case 'Settings':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Settings size={28} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Settings</h2>
            <p className="text-slate-500 text-sm">Financial Analyst configuration options will appear here.</p>
          </div>
        );
      default:
        return (
          <>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Financial Dashboard</h1>
                <p className="text-xs text-[#64748B] mt-0.5">Fleet financial performance — {active.length} active vehicles tracked.</p>
              </div>
            </div>

            {/* KPI Cards */}
            <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard title="Today's Fuel" value={formatCurrency(todayFuel)} icon={Fuel} trend="Today only" trendText="fuel logs" points={[0, 0, 0, 0, 0, 0, todayFuel]} color="#3B82F6" borderColorClass="border-l-4 border-[#3B82F6]" delay={0.01} />
              <StatCard title="Monthly Expenses" value={formatCurrency(monthlyExpenses)} icon={Receipt} trend="Current month" trendText="all categories" isTrendingDown={true} points={[800, 900, 1100, 950, 1050, 1000, monthlyExpenses]} color="#F59E0B" borderColorClass="border-l-4 border-[#F59E0B]" delay={0.02} />
              <StatCard title="Maintenance Cost" value={formatCurrency(totalMaintenance)} icon={Wrench} trend="All time" trendText="fleet total" isTrendingDown={true} points={maintSparkline} color="#7C3AED" borderColorClass="border-l-4 border-[#7C3AED]" delay={0.03} />
              <StatCard title="Operational Cost" value={formatCurrency(operationalCost)} icon={BarChart2} trend="Fuel + Maint." trendText="combined" isTrendingDown={true} points={[800, 900, 1200, 1000, 1100, 1050, operationalCost]} color="#EF4444" borderColorClass="border-l-4 border-[#EF4444]" delay={0.04} />
              <StatCard title="Fleet ROI" value={`${fleetROI}%`} icon={TrendingUp} trend="Acquisition based" trendText="aggregate" points={[1.2, 2.1, 1.8, 2.5, 2.3, 2.8, parseFloat(fleetROI)]} color="#22C55E" borderColorClass="border-l-4 border-[#22C55E]" delay={0.05} />
              <StatCard title="Net Profit" value={formatCurrency(netProfit)} icon={DollarSign} trend={`${margin}% margin`} trendText="revenue − costs" isTrendingDown={netProfit < 0} points={profitSparkline} color={netProfit >= 0 ? '#22C55E' : '#EF4444'} borderColorClass={`border-l-4 ${netProfit >= 0 ? 'border-[#22C55E]' : 'border-[#EF4444]'}`} delay={0.06} />
            </section>

            {/* Summary Breakdown */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                  <PieChart size={14} className="text-blue-500" />
                  Cost Breakdown
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Fuel', value: totalFuelCost, total: operationalCost, color: 'bg-blue-500' },
                    { label: 'Maintenance', value: totalMaintenance, total: operationalCost, color: 'bg-violet-500' },
                    { label: 'Other Expenses', value: totalOther, total: operationalCost, color: 'bg-amber-500' },
                  ].map((seg) => (
                    <div key={seg.label}>
                      <div className="flex justify-between text-[11px] font-semibold mb-1 text-slate-600">
                        <span>{seg.label}</span>
                        <span>{formatCurrency(seg.value)} ({seg.total > 0 ? ((seg.value / seg.total) * 100).toFixed(1) : 0}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${seg.total > 0 ? (seg.value / seg.total) * 100 : 0}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${seg.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-500" />
                  Revenue vs Costs Summary
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Revenue', value: totalRevenue, colorText: 'text-emerald-700', colorBg: 'bg-emerald-500' },
                    { label: 'Operational Cost', value: operationalCost, colorText: 'text-red-600', colorBg: 'bg-red-500' },
                    { label: 'Net Profit', value: netProfit, colorText: netProfit >= 0 ? 'text-emerald-700' : 'text-red-600', colorBg: netProfit >= 0 ? 'bg-emerald-500' : 'bg-red-500' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-semibold text-slate-600">{row.label}</span>
                      <span className={`text-sm font-bold font-space ${row.colorText}`}>{formatCurrency(row.value)}</span>
                    </div>
                  ))}
                </div>
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
