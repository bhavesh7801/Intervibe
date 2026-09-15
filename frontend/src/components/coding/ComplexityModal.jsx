import React from 'react';
import { X, Zap, Clock, Database, CheckCircle2 } from 'lucide-react';

export const ComplexityModal = ({ isOpen, onClose, timeComp = 'O(N)', spaceComp = 'O(N)', explanation }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Big-O Complexity Audit
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
              <Clock size={13} className="text-rose-600" />
              <span>Time</span>
            </div>
            <span className="text-xl font-black font-mono text-slate-900">{timeComp}</span>
            <span className="text-[10px] text-emerald-600 font-bold block">Optimal Linear</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
              <Database size={13} className="text-purple-600" />
              <span>Aux Space</span>
            </div>
            <span className="text-xl font-black font-mono text-slate-900">{spaceComp}</span>
            <span className="text-[10px] text-sky-600 font-bold block">HashMap Overhead</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
          {explanation ||
            'The single-pass hash map algorithm scans the array in linear O(N) operations, guaranteeing instantaneous O(1) complement lookups.'}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ComplexityModal;
