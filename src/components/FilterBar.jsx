import React from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';

export default function FilterBar({
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterRegion,
  setFilterRegion,
  searchQuery,
  setSearchQuery
}) {
  const isCustomized = filterType !== 'All' || filterStatus !== 'All' || filterRegion !== 'All' || searchQuery !== '';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E5E7EB] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280]">
          <Filter size={14} />
          <span>Filter Ops:</span>
        </div>

        {/* Filter 1: Vehicle Type */}
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="appearance-none bg-white border border-[#E5E7EB] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Vehicle Types</option>
            <option value="Semi-Truck">Semi-Trucks</option>
            <option value="Cargo Van">Cargo Vans</option>
            <option value="Electric Truck">Electric Trucks (Tesla)</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
        </div>

        {/* Filter 2: Status */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-[#E5E7EB] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Trip Statuses</option>
            <option value="On Trip">On Trip</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Draft">Draft</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
        </div>

        {/* Filter 3: Region */}
        <div className="relative">
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="appearance-none bg-white border border-[#E5E7EB] rounded-xl py-1.5 pl-3.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Regions</option>
            <option value="East Coast">East Coast</option>
            <option value="West Coast">West Coast</option>
            <option value="Mid-West">Mid-West</option>
            <option value="South-West">South-West</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
        </div>
      </div>

      {isCustomized && (
        <button 
          onClick={() => {
            setFilterType('All');
            setFilterStatus('All');
            setFilterRegion('All');
            setSearchQuery('');
          }}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
        >
          Clear all filters
        </button>
      )}
    </motion.section>
  );
}
