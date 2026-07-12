import React, { useState } from 'react';
import { 
  ArrowUpDown, ChevronLeft, ChevronRight, MoreVertical, 
  CheckCircle2, Navigation, AlertTriangle, Play, RefreshCw,
  Eye, Edit, Ban, Trash2, ShieldAlert, Phone, ChevronUp, ChevronDown as ChevronDownIcon
} from 'lucide-react';

export default function DriverTable({
  drivers,
  onSelectDriver,
  onEditDriver,
  onAssignTrip,
  onSuspendDriver,
  onDeleteDriver,
  // Optional Safety Officer extensions — default to false/null so existing
  // Dispatcher and Admin usage is completely unaffected.
  allowScoreEdit = false,
  onUpdateScore = null,
  hideActions = false,
}) {
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuRow, setActiveMenuRow] = useState(null);
  
  const itemsPerPage = 6;

  // Status Badge styles
  const getStatusBadge = (status, isExpired) => {
    if (status === 'Suspended') {
      return {
        bg: 'bg-red-50 text-red-700 border-red-100',
        dot: 'bg-red-500',
        icon: Ban
      };
    }
    if (isExpired) {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-100',
        dot: 'bg-amber-500',
        icon: ShieldAlert
      };
    }

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
      case 'Off Duty':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: Play
        };
    }
  };

  // Safety Score status colors
  const getSafetyScoreColor = (score) => {
    if (score >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-500', stroke: '#10b981' };
    if (score >= 70) return { text: 'text-amber-600', bg: 'bg-amber-500', stroke: '#f59e0b' };
    return { text: 'text-red-600', bg: 'bg-red-500', stroke: '#ef4444' };
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

  // Sorting
  const sortedDrivers = [...drivers].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'trips') {
      valA = parseInt(a.tripsCompleted, 10) || 0;
      valB = parseInt(b.tripsCompleted, 10) || 0;
    } else if (sortField === 'score') {
      valA = parseFloat(a.safetyScore) || 0;
      valB = parseFloat(b.safetyScore) || 0;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedDrivers.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedDrivers = sortedDrivers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5 sticky top-0 bg-white">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1.5 hover:text-slate-800 outline-none">
                  Driver Name <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">License Number</th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">Category</th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">
                <button onClick={() => handleSort('licenseExpiry')} className="flex items-center gap-1.5 hover:text-slate-800 outline-none">
                  License Expiry <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">Phone Number</th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">
                <button onClick={() => handleSort('trips')} className="flex items-center gap-1.5 hover:text-slate-800 outline-none">
                  Trips <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">
                <button onClick={() => handleSort('score')} className="flex items-center gap-1.5 hover:text-slate-800 outline-none">
                  Safety Score <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3.5 px-5 sticky top-0 bg-white">Status</th>
              {!hideActions && <th className="py-3.5 px-5 sticky top-0 bg-white text-right">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {paginatedDrivers.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-500 font-medium">
                  No drivers found matching search or filter selections.
                </td>
              </tr>
            ) : (
              paginatedDrivers.map((driver, idx) => {
                const today = new Date();
                const expiryDate = new Date(driver.licenseExpiry);
                const isExpired = expiryDate < today;
                
                const badge = getStatusBadge(driver.status, isExpired);
                const IconComponent = badge.icon;
                const scoreColors = getSafetyScoreColor(driver.safetyScore);

                // Short avatar text
                const avatarText = driver.name.split(' ').map(n => n[0]).join('');

                return (
                  <tr
                    key={driver.licenseNumber}
                    onClick={() => onSelectDriver(driver)}
                    className={`group hover:bg-[#F8FAFC]/60 transition duration-150 cursor-pointer ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'
                    }`}
                  >
                    {/* Name & Photo */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 text-[10px] flex-shrink-0">
                          {avatarText}
                        </div>
                        <span className="font-bold text-[#111827]">{driver.name}</span>
                      </div>
                    </td>

                    {/* License Number */}
                    <td className="py-3.5 px-5 font-mono text-slate-700 font-medium">
                      {driver.licenseNumber}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-5 text-[#64748B] font-semibold">
                      Class {driver.licenseCategory}
                    </td>

                    {/* Expiry with warning */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className={isExpired ? 'text-red-650 font-bold' : 'text-slate-755'}>
                          {driver.licenseExpiry}
                        </span>
                        {isExpired && (
                          <AlertTriangle size={13} className="text-red-500 flex-shrink-0" title="License Expired" />
                        )}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-5 text-slate-500 font-mono font-medium">
                      {driver.phone}
                    </td>

                    {/* Trips Completed */}
                    <td className="py-3.5 px-5 font-bold font-space text-[#111827]">
                      {driver.tripsCompleted}
                    </td>

                    {/* Circular Safety Score Ring + optional +/- edit */}
                    <td className="py-3.5 px-5" onClick={(e) => allowScoreEdit && e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {/* SVG Mini Ring */}
                        <svg className="w-5 h-5" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                          <circle 
                            cx="18" 
                            cy="18" 
                            r="15.915" 
                            fill="none" 
                            stroke={scoreColors.stroke} 
                            strokeWidth="3.2"
                            strokeDasharray={`${driver.safetyScore} ${100 - driver.safetyScore}`}
                            strokeDashoffset="25"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className={`font-bold font-space ${scoreColors.text}`}>
                          {driver.safetyScore}
                        </span>
                        {allowScoreEdit && onUpdateScore && (
                          <div className="flex flex-col gap-0.5 ml-1">
                            <button
                              onClick={() => onUpdateScore(driver, Math.max(0, Math.min(100, driver.safetyScore + 1)))}
                              className="w-4 h-4 flex items-center justify-center rounded hover:bg-emerald-100 text-emerald-600 transition outline-none"
                              title="Increase score by 1"
                            >
                              <ChevronUp size={10} />
                            </button>
                            <button
                              onClick={() => onUpdateScore(driver, Math.max(0, Math.min(100, driver.safetyScore - 1)))}
                              className="w-4 h-4 flex items-center justify-center rounded hover:bg-red-100 text-red-500 transition outline-none"
                              title="Decrease score by 1"
                            >
                              <ChevronDownIcon size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Availability / Status badge */}
                    <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                        <IconComponent size={11} className="flex-shrink-0" />
                        {isExpired ? 'Expired License' : driver.status}
                      </span>
                    </td>

                    {/* Row Menu Actions — hidden when hideActions=true */}
                    {!hideActions && (
                      <td className="py-3.5 px-5 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenuRow(activeMenuRow === driver.licenseNumber ? null : driver.licenseNumber)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition inline-flex outline-none"
                          aria-label="View actions"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {activeMenuRow === driver.licenseNumber && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setActiveMenuRow(null)} />
                            <div className="absolute right-5 mt-1 w-40 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-40 py-1 text-left overflow-hidden">
                              <button
                                onClick={() => {
                                  onSelectDriver(driver);
                                  setActiveMenuRow(null);
                                }}
                                className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2"
                              >
                                <Eye size={13} className="text-slate-400" />
                                View Profile
                              </button>
                              <button
                                onClick={() => {
                                  onEditDriver(driver);
                                  setActiveMenuRow(null);
                                }}
                                className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2"
                              >
                                <Edit size={13} className="text-slate-400" />
                                Edit Profile
                              </button>
                              <button
                                onClick={() => {
                                  onAssignTrip && onAssignTrip(driver);
                                  setActiveMenuRow(null);
                                }}
                                disabled={isExpired || driver.status === 'Suspended' || driver.status === 'On Trip'}
                                className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2 disabled:opacity-40 disabled:hover:bg-transparent"
                              >
                                <Play size={13} className="text-slate-400" />
                                Assign Trip
                              </button>
                              <button
                                onClick={() => {
                                  onSuspendDriver(driver);
                                  setActiveMenuRow(null);
                                }}
                                className="w-full flex items-center px-3.5 py-2 hover:bg-slate-50 text-[#111827] font-medium text-xs transition gap-2"
                              >
                                <Ban size={13} className="text-slate-400" />
                                {driver.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                              </button>
                              <button
                                onClick={() => {
                                  onDeleteDriver(driver);
                                  setActiveMenuRow(null);
                                }}
                                className="w-full flex items-center px-3.5 py-2 hover:bg-red-50 text-red-600 font-semibold text-xs transition border-t border-slate-100 gap-2"
                              >
                                <Trash2 size={13} />
                                Delete Profile
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    )}
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, drivers.length)} of {drivers.length} entries
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
