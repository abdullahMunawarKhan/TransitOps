import React, { useState } from 'react';
import { 
  ArrowUpDown, ChevronLeft, ChevronRight, MoreVertical, 
  CheckCircle2, Navigation, Wrench, AlertTriangle, 
  Trash2, Edit, Calendar, History, Eye
} from 'lucide-react';
import { formatCurrency, parseCurrency } from '../utils/parsers';

export const getOperationalCost = (vehicle) => {
  const parseAmt = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = val.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const maintTotal = (vehicle.maintenanceLogs || []).reduce((acc, log) => acc + parseAmt(log.cost), 0);
  const fuelTotal = (vehicle.fuelLogs || []).reduce((acc, log) => acc + parseAmt(log.cost), 0);
  const otherTotal = (vehicle.otherExpenses || []).reduce((acc, log) => acc + parseAmt(log.cost), 0);

  return maintTotal + fuelTotal + otherTotal;
};

export default function VehicleTable({
  vehicles,
  onSelectVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onLogMaintenance,
  onViewHistory
}) {
  // Sort states
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Action menu active row
  const [activeMenuRow, setActiveMenuRow] = useState(null);

  // Status Badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot: 'bg-emerald-500',
          icon: CheckCircle2
        };
      case 'On Trip':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-100',
          dot: 'bg-blue-600',
          icon: Navigation
        };
      case 'In Shop':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-100',
          dot: 'bg-amber-500',
          icon: Wrench
        };
      case 'Retired':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-gray-50 text-gray-700 border-gray-100',
          dot: 'bg-gray-400',
          icon: CheckCircle2
        };
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // Sort vehicles
  const sortedVehicles = [...vehicles].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // Clean numerical values for proper comparison if sorting by odometer or cost
    if (sortField === 'odometer') {
      valA = parseInt(String(a[sortField]).replace(/[^0-9]/g, ''), 10) || 0;
      valB = parseInt(String(b[sortField]).replace(/[^0-9]/g, ''), 10) || 0;
    } else if (sortField === 'cost') {
      valA = parseInt(String(a[sortField]).replace(/[^0-9]/g, ''), 10) || 0;
      valB = parseInt(String(b[sortField]).replace(/[^0-9]/g, ''), 10) || 0;
    } else if (sortField === 'capacity') {
      valA = parseInt(String(a[sortField]).replace(/[^0-9]/g, ''), 10) || 0;
      valB = parseInt(String(b[sortField]).replace(/[^0-9]/g, ''), 10) || 0;
    } else if (sortField === 'opsCost') {
      valA = getOperationalCost(a);
      valB = getOperationalCost(b);
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Paginated vehicles
  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedVehicles = sortedVehicles.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5 sticky top-0 bg-white">
                <button 
                  onClick={() => handleSort('regNumber')}
                  className="flex items-center gap-1.5 hover:text-slate-800 outline-none"
                >
                  Reg. Number <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-5 sticky top-0 bg-white">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1.5 hover:text-slate-800 outline-none"
                >
                  Vehicle Name <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-5 sticky top-0 bg-white">
                <button 
                  onClick={() => handleSort('type')}
                  className="flex items-center gap-1.5 hover:text-slate-800 outline-none"
                >
                  Type <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-5 sticky top-0 bg-white">
                <button 
                  onClick={() => handleSort('capacity')}
                  className="flex items-center gap-1.5 hover:text-slate-800 outline-none"
                >
                  Max Capacity <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-5 sticky top-0 bg-white">
                <button 
                  onClick={() => handleSort('odometer')}
                  className="flex items-center gap-1.5 hover:text-slate-800 outline-none"
                >
                  Odometer <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-5 sticky top-0 bg-white">
                <button 
                  onClick={() => handleSort('cost')}
                  className="flex items-center gap-1.5 hover:text-slate-800 outline-none"
                >
                  Acq. Cost <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-5 sticky top-0 bg-white">
                <button 
                  onClick={() => handleSort('opsCost')}
                  className="flex items-center gap-1.5 hover:text-slate-800 outline-none"
                >
                  Ops Cost <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-5 sticky top-0 bg-white">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1.5 hover:text-slate-800 outline-none"
                >
                  Status <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-5 sticky top-0 bg-white text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {paginatedVehicles.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-500 font-medium">
                  No vehicles found matching the filter criteria.
                </td>
              </tr>
            ) : (
              paginatedVehicles.map((vehicle, idx) => {
                const badge = getStatusBadge(vehicle.status);
                const IconComponent = badge.icon;
                const opsCost = getOperationalCost(vehicle);
                
                return (
                  <tr
                    key={vehicle.regNumber}
                    onClick={() => onSelectVehicle(vehicle)}
                    className={`group hover:bg-[#F8FAFC]/60 transition duration-150 cursor-pointer ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'
                    }`}
                  >
                    {/* Reg. Number */}
                    <td className="py-3.5 px-5 font-semibold text-blue-600 tracking-tight">
                      {vehicle.regNumber}
                    </td>
                    
                    {/* Name */}
                    <td className="py-3.5 px-5 font-bold text-[#111827]">
                      {vehicle.name}
                    </td>
                    
                    {/* Type */}
                    <td className="py-3.5 px-5 text-[#64748B] font-medium">
                      {vehicle.type}
                    </td>
                    
                    {/* Max Capacity */}
                    <td className="py-3.5 px-5 text-[#111827] font-medium">
                      {vehicle.capacity}
                    </td>
                    
                    {/* Odometer */}
                    <td className="py-3.5 px-5 text-[#64748B] font-mono font-medium">
                      {vehicle.odometer}
                    </td>
                    
                    {/* Cost */}
                    <td className="py-3.5 px-5 text-[#111827] font-medium font-mono">
                      {formatCurrency(parseCurrency(vehicle.cost))}
                    </td>

                    {/* Operational Cost */}
                    <td className="py-3.5 px-5 text-emerald-600 font-bold font-mono">
                      {formatCurrency(opsCost)}
                    </td>
                    
                    {/* Status badge pill */}
                    <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                        <IconComponent size={11} className="flex-shrink-0" />
                        {vehicle.status}
                      </span>
                    </td>
                    
                    {/* Action dropdown menu */}
                    <td className="py-3.5 px-5 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenuRow(activeMenuRow === vehicle.regNumber ? null : vehicle.regNumber)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition inline-flex outline-none"
                        aria-label="View actions"
                      >
                        <MoreVertical size={14} />
                      </button>
                      
                      {activeMenuRow === vehicle.regNumber && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setActiveMenuRow(null)} />
                          <div className="absolute right-5 mt-1 w-40 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-40 py-1 text-left overflow-hidden">
                            <button
                              onClick={() => {
                                onSelectVehicle(vehicle);
                                setActiveMenuRow(null);
                              }}
                              className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2"
                            >
                              <Eye size={13} className="text-slate-400" />
                              View Detail
                            </button>
                            <button
                              onClick={() => {
                                onEditVehicle(vehicle);
                                setActiveMenuRow(null);
                              }}
                              className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2"
                            >
                              <Edit size={13} className="text-slate-400" />
                              Edit Specs
                            </button>
                            <button
                              onClick={() => {
                                onLogMaintenance(vehicle);
                                setActiveMenuRow(null);
                              }}
                              className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2"
                            >
                              <Wrench size={13} className="text-slate-400" />
                              Maintenance
                            </button>
                            <button
                              onClick={() => {
                                onViewHistory(vehicle);
                                setActiveMenuRow(null);
                              }}
                              className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2"
                            >
                              <History size={13} className="text-slate-400" />
                              Trip History
                            </button>
                            <button
                              onClick={() => {
                                onDeleteVehicle(vehicle);
                                setActiveMenuRow(null);
                              }}
                              className="w-full flex items-center px-3.5 py-2 hover:bg-red-50 text-red-600 font-semibold text-xs transition border-t border-slate-100 gap-2"
                            >
                              <Trash2 size={13} />
                              Delete Unit
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/30 flex items-center justify-between">
          <span className="text-[10px] font-medium text-[#64748B]">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, vehicles.length)} of {vehicles.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-white text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition outline-none"
            >
              <ChevronLeft size={14} />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition border ${
                  currentPage === idx + 1
                    ? 'bg-[#2563EB] text-white border-transparent shadow-sm'
                    : 'bg-white border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-white text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition outline-none"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
