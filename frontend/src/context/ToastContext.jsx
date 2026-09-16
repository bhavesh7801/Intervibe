import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const warning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);
  const showToast = useCallback((msg, type = 'info', duration) => {
    if (type === 'success') success(msg, duration);
    else if (type === 'error') error(msg, duration);
    else if (type === 'warning') warning(msg, duration);
    else info(msg, duration);
  }, [success, error, warning, info]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info, showToast }}>
      {children}
      {/* Toast Render Portal Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => {
          let bg = 'bg-slate-900 text-white border-slate-700';
          let Icon = Info;
          let iconColor = 'text-sky-400';

          if (toast.type === 'success') {
            bg = 'bg-white text-slate-900 border-emerald-200 shadow-lg shadow-emerald-500/10';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            bg = 'bg-white text-slate-900 border-rose-200 shadow-lg shadow-rose-500/10';
            Icon = AlertCircle;
            iconColor = 'text-rose-500';
          } else if (toast.type === 'warning') {
            bg = 'bg-white text-slate-900 border-amber-200 shadow-lg shadow-amber-500/10';
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border text-xs font-semibold backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${bg}`}
            >
              <Icon size={16} className={`shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 break-words">{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (m) => console.log('Toast:', m),
      success: (m) => console.log('Toast [success]:', m),
      error: (m) => console.error('Toast [error]:', m),
      warning: (m) => console.warn('Toast [warning]:', m),
      info: (m) => console.info('Toast [info]:', m)
    };
  }
  return ctx;
};
