import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';

interface LeavePlanModalProps {
  isOpen: boolean;
  onContinueEditing: () => void;
  onConfirmLeave: () => void;
  language?: Language;
}

export const LeavePlanModal: React.FC<LeavePlanModalProps> = ({
  isOpen,
  onContinueEditing,
  onConfirmLeave,
  language = 'en',
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={onContinueEditing}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 z-10 space-y-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-modal-title"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 id="leave-modal-title" className="text-lg font-bold text-slate-900 leading-snug">
                  {t.leavePlanTitle || 'Leave this plan?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.leavePlanDesc || 'Your current progress may not be saved. You can continue editing your plan or return to the home screen.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onContinueEditing}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                {t.continueEditing || 'Continue Editing'}
              </button>
              <button
                type="button"
                onClick={onConfirmLeave}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>{t.goHome || 'Go Home'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
