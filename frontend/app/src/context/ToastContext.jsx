import React, { createContext, useContext, useCallback, useReducer } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

// Purpose: Global toast notification for background actions.
// Call useToast().push({message, type}) from any component.

const ToastContext = createContext(null);
const ICONS    = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };
const ICO_CLS  = { success: 'text-emerald-400', error: 'text-rose-400', warning: 'text-amber-400', info: 'text-blue-400' };
const BORDER   = { success: 'border-emerald-500/40', error: 'border-rose-500/40', warning: 'border-amber-500/40', info: 'border-blue-500/40' };

let _id = 0;

function reducer(state, action) {
  if (action.type === 'PUSH')   return [...state, action.toast];
  if (action.type === 'REMOVE') return state.filter((t) => t.id !== action.id);
  return state;
}

export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(reducer, []);
  const push = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = ++_id;
    dispatch({ type: 'PUSH', toast: { id, message, type } });
    if (duration > 0) setTimeout(() => dispatch({ type: 'REMOVE', id }), duration);
  }, []);
  const remove = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div aria-live='polite' className='fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none'>
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type];
            return (
              <motion.div
                key={toast.id} layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{    opacity: 0, y: 10,  scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border bg-[#0C1222]/95 backdrop-blur-md shadow-2xl text-sm text-slate-200 ${BORDER[toast.type]}`}
              >
                <Icon size={16} className={`${ICO_CLS[toast.type]} shrink-0 mt-0.5`} />
                <span className='flex-1 min-w-0 break-words leading-relaxed'>{toast.message}</span>
                <button type='button' onClick={() => remove(toast.id)} aria-label='Dismiss'
                  className='ml-auto shrink-0 text-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded cursor-pointer transition-colors'>
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

export default ToastProvider;
