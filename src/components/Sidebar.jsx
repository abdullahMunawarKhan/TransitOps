import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, LogOut, X } from 'lucide-react';

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  activeMenuTab,
  setActiveMenuTab,
  handleLogout,
  menuItems
}) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-[#E5E7EB] h-screen sticky top-0 transition-all duration-300 ease-in-out z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-[280px]'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB] justify-between overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/10">
              <Truck size={18} className="text-white" />
            </div>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                TransitOps
              </motion.span>
            )}
          </div>
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-md border border-[#E5E7EB] hover:bg-slate-50 items-center justify-center text-[#6B7280] transition"
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeMenuTab === item.name;
            const Icon = item.icon;
            
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenuTab(item.name)}
                className={`w-full relative flex items-center group rounded-xl p-3 text-sm font-medium transition-all duration-200 outline-none ${
                  isActive 
                    ? 'text-white bg-[#2563EB] shadow-md shadow-blue-600/10' 
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC]'
                }`}
              >
                {/* Left active line indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon size={18} className={`flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#111827]'}`} />
                
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-3 truncate"
                  >
                    {item.name}
                  </motion.span>
                )}

                {/* Badges / Alert dots */}
                {!isSidebarCollapsed && item.badge && (
                  <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {!isSidebarCollapsed && item.alert && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}

                {/* Collapsed Sidebar Tooltip */}
                {isSidebarCollapsed && (
                  <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-[#111827] text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none z-50">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center group p-3 text-sm font-medium text-[#6B7280] hover:text-red-600 rounded-xl hover:bg-red-50 transition duration-200 outline-none"
          >
            <LogOut size={18} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            {!isSidebarCollapsed && <span className="ml-3">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-[#E5E7EB] z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB] justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-bold">
                    <Truck size={18} className="text-white" />
                  </div>
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TransitOps</span>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-[#6B7280]"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = activeMenuTab === item.name;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveMenuTab(item.name);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center rounded-xl p-3 text-sm font-medium transition duration-150 ${
                        isActive 
                          ? 'text-white bg-[#2563EB] shadow-md shadow-blue-600/10' 
                          : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <Icon size={18} className="mr-3" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.alert && <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#E5E7EB]">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 text-sm font-medium text-[#6B7280] hover:text-red-600 rounded-xl hover:bg-red-50 transition duration-150"
                >
                  <LogOut size={18} className="mr-3" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
