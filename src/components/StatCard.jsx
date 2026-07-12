import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import Sparkline from './Sparkline';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendText,
  isTrendingDown = false,
  points,
  color,
  borderColorClass,
  delay = 0
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)" }}
      className={`bg-white p-4.5 rounded-2xl border border-[#E5E7EB] flex flex-col justify-between transition-shadow shadow-sm min-h-[128px] ${borderColorClass}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">{title}</span>
        {Icon && <Icon size={16} style={{ color }} />}
      </div>
      
      <div className="my-2.5">
        <h3 className="text-2xl font-bold font-space text-[#111827]">
          <AnimatedCounter value={value} />
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-[10px] font-semibold inline-flex items-center ${isTrendingDown ? 'text-red-500' : 'text-emerald-600'}`}>
            {isTrendingDown ? <TrendingDown size={10} className="mr-0.5" /> : <TrendingUp size={10} className="mr-0.5" />}
            {trend}
          </span>
          <span className="text-[9px] text-[#6B7280]">{trendText}</span>
        </div>
      </div>
      
      <div className="mt-1">
        <Sparkline points={points} color={color} />
      </div>
    </motion.div>
  );
}
