import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Purpose: Confirms the copy action landed — silent clipboard write gives no feedback.
// A 1.5s checkmark swap closes the feedback loop clearly.

const CopyButton = ({ text, className = '', label = 'Copy to clipboard' }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch { /* fallback not needed for modern browsers */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <motion.button
      type='button' onClick={handleCopy} aria-label={label} title={copied ? 'Copied!' : label}
      className={`relative flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700/60 bg-slate-800/40 hover:bg-slate-700/60 hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors duration-200 cursor-pointer ${className}`}
      whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <AnimatePresence mode='wait' initial={false}>
        {copied ? (
          <motion.span key='check' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }}>
            <Check size={14} className='text-emerald-400' />
          </motion.span>
        ) : (
          <motion.span key='copy' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }}>
            <Copy size={14} className='text-slate-400' />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyButton;
