import { motion } from 'motion/react';
import { Check } from 'lucide-react';

// Purpose: Makes the next step obvious — users in multi-step flows need
// to know where they are and how many steps remain.

const StepProgress = ({ total, current, labels = [] }) => {
  const pct = (current / Math.max(total - 1, 1)) * 100;
  return (
    <div className='w-full' role='progressbar' aria-valuenow={current + 1} aria-valuemax={total}>
      <div className='relative flex items-center justify-between'>
        <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 rounded-full' />
        <motion.div
          className='absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full origin-left'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct / 100 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%' }}
        />
        {Array.from({ length: total }).map((_, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} className='relative z-10 flex flex-col items-center'>
              <motion.div
                initial={false}
                animate={{ backgroundColor: done || active ? '#2563EB' : '#1E293B', borderColor: done || active ? '#3B82F6' : '#334155', scale: active ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
                className='w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold'
              >
                {done ? <Check size={12} className='text-white' /> : <span className={active ? 'text-white' : 'text-slate-500'}>{i + 1}</span>}
              </motion.div>
              {labels[i] && (
                <span className={`mt-1.5 text-[10px] font-semibold whitespace-nowrap ${active ? 'text-blue-400' : done ? 'text-slate-400' : 'text-slate-600'}`}>{labels[i]}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
