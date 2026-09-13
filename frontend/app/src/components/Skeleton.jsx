import { motion } from 'motion/react';

// Purpose: Reduces perceived wait time — content-shaped placeholders
// make the page feel populated while data loads.

const Skeleton = ({ className = 'h-4 w-full rounded', count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className={`bg-slate-800/60 rounded ${className}`}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
      />
    ))}
  </>
);

export const SkeletonCard = ({ lines = 3 }) => (
  <div className='card-3d rounded-2xl p-5 space-y-3'>
    <Skeleton className='h-5 w-2/5 rounded-lg' />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-3.5 rounded ${i === lines - 1 ? 'w-3/5' : 'w-full'}`} />
    ))}
  </div>
);

export default Skeleton;
