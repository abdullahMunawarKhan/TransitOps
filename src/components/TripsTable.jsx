import React from 'react';
import { Search, ArrowUpRight } from 'lucide-react';

export default function TripsTable({
  filteredTrips,
  onSelectTrip,
  searchQuery,
  setSearchQuery
}) {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'On Trip':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'Completed': return '#22C55E';
      case 'On Trip': return '#2563EB';
      case 'Pending': return '#F59E0B';
      case 'Cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden h-full">
      <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
        <div>
          <h2 className="font-bold text-base text-slate-900">Recent Trips</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking of all active, pending, and scheduled routes.</p>
        </div>
        {/* Mobile inline search */}
        <div className="relative sm:hidden w-full">
          <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto overflow-y-hidden flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-slate-50/30 text-xs font-semibold text-slate-500 uppercase">
              <th className="py-3 px-5 sticky top-0 bg-white">Trip ID</th>
              <th className="py-3 px-5 sticky top-0 bg-white">Vehicle</th>
              <th className="py-3 px-5 sticky top-0 bg-white">Driver</th>
              <th className="py-3 px-5 sticky top-0 bg-white">Status</th>
              <th className="py-3 px-5 sticky top-0 bg-white">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-sm">
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-500 text-xs">
                  No trips matched the selected filters.
                </td>
              </tr>
            ) : (
              filteredTrips.map((trip) => (
                <tr
                  key={trip.id}
                  onClick={() => onSelectTrip(trip)}
                  className="group hover:bg-[#F8FAFC] transition duration-150 cursor-pointer"
                >
                  <td className="py-3.5 px-5 font-semibold text-blue-600 text-xs tracking-tight">
                    <span className="flex items-center gap-1.5">
                      {trip.id}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-900 text-xs">
                    {trip.vehicle}
                  </td>
                  <td className="py-3.5 px-5 text-slate-700 text-xs">
                    {trip.driver}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(trip.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusDotColor(trip.status) }} />
                      {trip.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 text-xs font-medium">
                    {trip.eta}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
