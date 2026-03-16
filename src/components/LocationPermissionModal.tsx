import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ShieldCheck, ChevronRight, X, AlertCircle } from 'lucide-react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LocationPermissionModal({ isOpen, onClose, onConfirm }: LocationPermissionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl pointer-events-auto"
            >
              <div className="relative p-8 text-center space-y-6">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full bg-black/5 text-black/40 hover:text-black hover:bg-black/10 transition-all"
                >
                  <X size={20} />
                </button>

                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center border border-emerald-100/50">
                    <MapPin className="text-emerald-600" size={32} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-display font-black tracking-tight text-stone-900 leading-tight">
                    Location Required
                  </h2>
                  <p className="text-stone-500 text-sm font-medium leading-relaxed">
                    To submit evidence, we need to verify your physical location at the site.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-emerald-100 rounded-full p-1">
                      <ShieldCheck className="text-emerald-600" size={12} />
                    </div>
                    <p className="text-xs font-semibold text-stone-700">Ward Mapping: <span className="font-medium text-stone-500">Automatically syncs your report with regional administrative boundaries.</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-emerald-100 rounded-full p-1">
                      <ShieldCheck className="text-emerald-600" size={12} />
                    </div>
                    <p className="text-xs font-semibold text-stone-700">Local Verification: <span className="font-medium text-stone-500">Ensures you are physically present at the site to prevent fake reports.</span></p>
                  </div>
                </div>

                <button
                  onClick={onConfirm}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-stone-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Allow location & continue
                  <ChevronRight size={18} />
                </button>
                
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                  CivicLens requires on-site presence
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
