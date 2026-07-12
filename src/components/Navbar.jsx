import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, ChevronDown, Settings, LogOut, X, AlertTriangle, XCircle, Activity, Menu } from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  setIsMobileSidebarOpen,
  showNotifications,
  setShowNotifications,
  showProfileMenu,
  setShowProfileMenu,
  notifications,
  markAllNotificationsRead,
  deleteNotification,
  handleLogout,
  onAddTrip,
  setActiveMenuTab
}) {
  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] sticky top-0 flex items-center px-4 md:px-8 justify-between z-20">
      
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-slate-50 transition"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        
        {/* Large Rounded Search Bar */}
        <div className="relative w-full hidden sm:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search trips, vehicles, cargo, drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-full py-2 pl-10 pr-12 text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <kbd className="hidden lg:inline-flex items-center h-5 px-1.5 font-mono text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3 md:gap-4 ml-4">
        
        {/* Quick Actions Button */}
        <div className="relative">
          <button 
            onClick={onAddTrip}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-sm transition outline-none"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Trip</span>
          </button>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`p-2 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 text-[#6B7280] transition relative outline-none ${
              showNotifications ? 'bg-slate-50 text-[#111827] border-blue-500' : ''
            }`}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-40 overflow-hidden"
                >
                  <div className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/50">
                    <span className="font-semibold text-sm">Notifications</span>
                    <button 
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="divide-y divide-[#E5E7EB] max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications to display
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer relative group ${
                            n.unread ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.type === 'warning' && <AlertTriangle size={15} className="text-amber-500" />}
                            {n.type === 'danger' && <XCircle size={15} className="text-red-500" />}
                            {n.type === 'info' && <Activity size={15} className="text-blue-500" />}
                          </div>
                          <div className="flex-1 pr-4">
                            <p className={`text-xs text-slate-700 leading-snug ${n.unread ? 'font-medium text-slate-900' : ''}`}>{n.text}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                          </div>
                          <button 
                            onClick={(e) => deleteNotification(n.id, e)}
                            className="absolute right-2.5 top-3.5 text-slate-300 hover:text-slate-500 transition opacity-0 group-hover:opacity-100"
                            aria-label="Delete notification"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Card & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-2 py-1 select-none text-left rounded-lg hover:bg-slate-50 transition border border-transparent outline-none"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-blue-500 border border-slate-200">
              <svg viewBox="0 0 32 32" className="w-full h-full text-white">
                <circle cx="16" cy="11" r="5" fill="currentColor" opacity="0.95" />
                <path d="M16 18c-6.1 0-11 4.9-11 11h22c0-6.1-4.9-11-11-11z" fill="currentColor" opacity="0.85" />
              </svg>
            </div>
            
            <div className="hidden lg:block">
              <div className="text-xs font-semibold text-slate-900 leading-none mb-0.5">Alex Mercer</div>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                Fleet Manager
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-40 py-1.5 overflow-hidden"
                >
                  <div className="px-3.5 py-2.5 border-b border-[#E5E7EB]">
                    <span className="block text-xs text-slate-400 font-medium">Logged in as</span>
                    <span className="block text-xs font-semibold text-slate-800">alex.mercer@transitops.com</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveMenuTab('Settings');
                    }}
                    className="w-full flex items-center px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Settings size={14} className="mr-2 text-slate-400" />
                    Account Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition font-medium border-t border-[#E5E7EB]"
                  >
                    <LogOut size={14} className="mr-2" />
                    Log Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
