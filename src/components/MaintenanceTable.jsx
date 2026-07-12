import React, { useState } from 'react';
import { 
  ArrowUpDown, ChevronLeft, ChevronRight, MoreVertical, 
  Wrench, Play, CheckCircle2, XCircle, Eye, Calendar, DollarSign, Trash2, ArrowUpRight
} from 'lucide-react';
import { formatCurrency, parseCurrency } from '../utils/parsers';

export default function MaintenanceTable({
  records,
  onSelectRecord,
  onStatusChange,
  onDeleteRecord
}) {
  const [sortField, setSortField] = useState('startDate');
  const [sortAsc, setSortAsc] = useState(false); // Default newest first
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuRow, setActiveMenuRow] = useState(null);

  const itemsPerPage = 6;

  // Status Badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot: 'bg-emerald-500',
          icon: CheckCircle2
        };
      case 'In Progress':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-100',
          dot: 'bg-amber-500',
          icon: Wrench
        };
      case 'Cancelled':
        return {
          bg: 'bg-red-50 text-red-700 border-red-100',
          dot: 'bg-red-500',
          icon: XCircle
        };
      case 'Scheduled':
      default:
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-100',
          dot: 'bg-blue-600',
          icon: Calendar
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

  // Sorting logic
  const sortedRecords = [...records].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'cost') {
      valA = parseFloat(a.actualCost || a.estimatedCost) || 0;
      valB = parseFloat(b.actualCost || b.estimatedCost) || 0;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedRecords = sortedRecords.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5 sticky top-0 bg-white">
                <button onClick={() => handleSort('vehicle')} className="flex items-center gap-1.5 hover:text-slate-800 outline-none">
                  Vehicle <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">Service Type</th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">Mechanic</th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">Workshop</th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">
                <button onClick={() => handleSort('startDate')} className="flex items-center gap-1.5 hover:text-slate-800 outline-none">
                  Start Date <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">Expected Completion</th>
              <th className="py-3.5 px-5 sticky top-0 bg-white text-right">
                <button onClick={() => handleSort('cost')} className="flex items-center gap-1.5 hover:text-slate-800 outline-none ml-auto">
                  Cost <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">Status</th>
              <th className="py-3.5 px-5 sticky top-0 bg-white text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-500 font-medium">
                  No maintenance records matched current filters.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, idx) => {
                const badge = getStatusBadge(record.status);
                const IconComponent = badge.icon;
                const cost = record.actualCost || record.estimatedCost;

                return (
                  <tr
                    key={record.id}
                    onClick={() => onSelectRecord(record)}
                    className={`group hover:bg-[#F8FAFC]/60 transition duration-150 cursor-pointer ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'
                    }`}
                  >
                    {/* Vehicle */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#111827]">{record.vehicle}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5 font-mono">{record.id}</span>
                      </div>
                    </td>

                    {/* Service Type */}
                    <td className="py-3.5 px-5 font-semibold text-slate-700">
                      {record.serviceType}
                    </td>

                    {/* Mechanic */}
                    <td className="py-3.5 px-5 text-slate-500 font-medium">
                      {record.mechanic}
                    </td>

                    {/* Workshop */}
                    <td className="py-3.5 px-5 text-slate-550 font-medium">
                      {record.workshop}
                    </td>

                    {/* Start Date */}
                    <td className="py-3.5 px-5 text-slate-500 font-mono font-medium">
                      {record.startDate}
                    </td>

                    {/* Expected Completion */}
                    <td className="py-3.5 px-5 text-slate-500 font-mono font-medium">
                      {record.expectedCompletion}
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 px-5 text-right font-bold text-slate-900 font-mono">
                      {formatCurrency(parseCurrency(cost))}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                        <IconComponent size={11} className="flex-shrink-0" />
                        {record.status}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-5 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenuRow(activeMenuRow === record.id ? null : record.id)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition inline-flex outline-none"
                        aria-label="View actions"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {activeMenuRow === record.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setActiveMenuRow(null)} />
                          <div className="absolute right-5 mt-1 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-40 py-1 text-left overflow-hidden">
                            <button
                              onClick={() => {
                                onSelectRecord(record);
                                setActiveMenuRow(null);
                              }}
                              className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2"
                            >
                              <Eye size={13} className="text-slate-400" />
                              View Detailed Profile
                            </button>
                            
                            {record.status === 'Scheduled' && (
                              <button
                                onClick={() => {
                                  onStatusChange(record, 'In Progress');
                                  setActiveMenuRow(null);
                                }}
                                className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-blue-600 font-semibold text-xs transition gap-2"
                              >
                                <Play size={13} className="text-blue-500" />
                                Start Maintenance
                              </button>
                            )}

                            {record.status === 'In Progress' && (
                              <button
                                onClick={() => {
                                  onStatusChange(record, 'Completed');
                                  setActiveMenuRow(null);
                                }}
                                className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-emerald-600 font-semibold text-xs transition gap-2"
                              >
                                <CheckCircle2 size={13} className="text-emerald-500" />
                                Complete & Release
                              </button>
                            )}

                            {record.status !== 'Completed' && record.status !== 'Cancelled' && (
                              <button
                                onClick={() => {
                                  onStatusChange(record, 'Cancelled');
                                  setActiveMenuRow(null);
                                }}
                                className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-red-650 font-semibold text-xs transition gap-2"
                              >
                                <XCircle size={13} className="text-red-500" />
                                Cancel Repair
                              </button>
                            )}

                            <button
                              onClick={() => {
                                onDeleteRecord(record);
                                setActiveMenuRow(null);
                              }}
                              className="w-full flex items-center px-3.5 py-2 hover:bg-red-50 text-red-600 font-semibold text-xs transition border-t border-slate-100 gap-2"
                            >
                              <Trash2 size={13} />
                              Delete Log Entry
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, records.length)} of {records.length} entries
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
