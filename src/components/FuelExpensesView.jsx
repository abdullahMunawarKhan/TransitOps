import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Fuel, Wrench, DollarSign, Plus, Filter, Navigation, FileText } from 'lucide-react';
import StatCard from './StatCard';

const parseAmt = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  return parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;
};

export default function FuelExpensesView() {
  const [vehicles, setVehicles] = useState([]);
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState('Fuel'); // 'Fuel' or 'Expense'

  // Form State
  const [formVehicle, setFormVehicle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState('Toll');
  const [formDescription, setFormDescription] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('transitops.vehicles');
    if (stored) {
      setVehicles(JSON.parse(stored));
    }
  }, []);

  const saveVehicles = (updated) => {
    setVehicles(updated);
    localStorage.setItem('transitops.vehicles', JSON.stringify(updated));
  };

  const kpis = useMemo(() => {
    let totalFuelCost = 0;
    let totalFuelAmount = 0;
    let totalMaintenance = 0;
    let totalTolls = 0;

    vehicles.forEach(v => {
      if (v.fuelLogs) {
        v.fuelLogs.forEach(log => {
          totalFuelCost += parseAmt(log.cost);
          totalFuelAmount += parseAmt(log.liters || log.kWh);
        });
      }
      if (v.otherExpenses) {
        v.otherExpenses.forEach(exp => {
          const cost = parseAmt(exp.amount);
          if (exp.type === 'Maintenance') totalMaintenance += cost;
          else if (exp.type === 'Toll') totalTolls += cost;
          else totalMaintenance += cost; // Misc to maintenance for simplicity
        });
      }
    });

    return {
      totalFuel: `$${totalFuelCost.toLocaleString()}`,
      avgFuelCost: totalFuelAmount ? `$${(totalFuelCost / totalFuelAmount).toFixed(2)}/unit` : '$0',
      totalMaint: `$${totalMaintenance.toLocaleString()}`,
      totalTolls: `$${totalTolls.toLocaleString()}`
    };
  }, [vehicles]);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!formVehicle) return;

    const updated = vehicles.map(v => {
      if (v.name === formVehicle) {
        if (logType === 'Fuel') {
          const newLog = {
            date: formDate,
            cost: `$${parseFloat(formCost).toFixed(2)}`
          };
          if (v.type === 'Electric Truck') {
            newLog.kWh = `${formAmount} kWh`;
          } else {
            newLog.liters = `${formAmount} L`;
          }
          return { ...v, fuelLogs: [newLog, ...(v.fuelLogs || [])] };
        } else {
          const newExp = {
            date: formDate,
            type: formType,
            amount: `$${parseFloat(formCost).toFixed(2)}`,
            description: formDescription || formType
          };
          return { ...v, otherExpenses: [newExp, ...(v.otherExpenses || [])] };
        }
      }
      return v;
    });

    saveVehicles(updated);
    setShowLogModal(false);
    
    // Reset
    setFormAmount('');
    setFormCost('');
    setFormDescription('');
  };

  // Compile all logs for recent list
  const allLogs = useMemo(() => {
    const logs = [];
    vehicles.forEach(v => {
      if (v.fuelLogs) {
        v.fuelLogs.forEach(log => {
          logs.push({
            id: Math.random().toString(),
            vehicle: v.name,
            date: log.date,
            type: 'Fuel',
            amount: log.cost,
            details: log.liters || log.kWh
          });
        });
      }
      if (v.otherExpenses) {
        v.otherExpenses.forEach(exp => {
          logs.push({
            id: Math.random().toString(),
            vehicle: v.name,
            date: exp.date,
            type: exp.type,
            amount: exp.amount,
            details: exp.description
          });
        });
      }
    });
    return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [vehicles]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fuel & Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">Track operational costs and log receipts across the fleet.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setLogType('Expense'); setShowLogModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
          >
            <Plus size={16} /> Log Expense
          </button>
          <button 
            onClick={() => { setLogType('Fuel'); setShowLogModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm shadow-blue-600/20 transition"
          >
            <Fuel size={16} /> Log Fuel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Fuel Spent" value={kpis.totalFuel} icon={Fuel} trend="+2.4%" trendText="vs last month" color="#3B82F6" borderColorClass="border-blue-100" delay={0.1} points={[40, 45, 42, 50, 48, 55, 60]} />
        <StatCard title="Avg Fuel Cost" value={kpis.avgFuelCost} icon={DollarSign} trend="-0.5%" trendText="vs last month" isTrendingDown color="#10B981" borderColorClass="border-emerald-100" delay={0.2} points={[30, 28, 29, 27, 26, 25, 24]} />
        <StatCard title="Total Maintenance" value={kpis.totalMaint} icon={Wrench} trend="+5.2%" trendText="vs last month" color="#F59E0B" borderColorClass="border-amber-100" delay={0.3} points={[20, 22, 25, 24, 28, 30, 32]} />
        <StatCard title="Total Tolls" value={kpis.totalTolls} icon={Navigation} trend="+1.1%" trendText="vs last month" color="#8B5CF6" borderColorClass="border-purple-100" delay={0.4} points={[10, 12, 11, 15, 14, 16, 18]} />
      </div>

      {/* Recent Logs Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Recent Transactions</h2>
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition">
            <Filter size={16} /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Vehicle</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Details</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allLogs.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No logs found.</td></tr>
              ) : allLogs.slice(0, 15).map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-slate-600">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{log.vehicle}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      log.type === 'Fuel' ? 'bg-blue-50 text-blue-600' :
                      log.type === 'Maintenance' ? 'bg-amber-50 text-amber-600' :
                      log.type === 'Toll' ? 'bg-purple-50 text-purple-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{log.details}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-right">{log.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold">Log {logType}</h2>
              <p className="text-sm text-slate-500 mt-1">Record a new {logType.toLowerCase()} transaction.</p>
            </div>
            <form onSubmit={handleAddLog} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Vehicle</label>
                <select 
                  required 
                  value={formVehicle} 
                  onChange={e => setFormVehicle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Select Vehicle...</option>
                  {vehicles.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Date</label>
                <input 
                  type="date" 
                  required 
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {logType === 'Fuel' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Amount (Liters / kWh)</label>
                    <input 
                      type="number" 
                      required 
                      step="0.01"
                      value={formAmount}
                      onChange={e => setFormAmount(e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Expense Category</label>
                    <select 
                      required 
                      value={formType} 
                      onChange={e => setFormType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="Toll">Toll</option>
                      <option value="Maintenance">Maintenance / Repair</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Inspection">Inspection</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Description</label>
                    <input 
                      type="text" 
                      required 
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      placeholder="e.g. Route 95 Toll"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Total Cost ($)</label>
                <input 
                  type="number" 
                  required 
                  step="0.01"
                  value={formCost}
                  onChange={e => setFormCost(e.target.value)}
                  placeholder="e.g. 120.50"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition"
                >
                  Save Log
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
