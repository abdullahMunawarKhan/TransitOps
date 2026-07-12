import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  vehicleName,
  regNumber
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15 }}
            className="relative bg-white rounded-2xl max-w-md w-full border border-[#E2E8F0] shadow-2xl p-6 overflow-hidden z-10"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm leading-6">Delete Registered Vehicle?</h3>
                <p className="text-xs text-slate-500 mt-2">
                  Are you sure you want to delete **{vehicleName}** ({regNumber}) from the TransitOps registry? This action is permanent and cannot be undone. Active trips and logs linking to this vehicle will be archived.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs transition outline-none"
              >
                No, Keep Unit
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs shadow-sm transition outline-none"
              >
                Yes, Delete Unit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
