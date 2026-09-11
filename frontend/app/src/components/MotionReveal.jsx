import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Purpose: Unified reveal-on-mount / reveal-on-scroll wrapper using Framer Motion.
// Replaces hand-rolled CSS Reveal so the codebase uses one animation vocabulary.
// Respects prefers-reduced-motion.

const MotionReveal = ({ children, delay = 0, y = 24, className = '', inView = false, once = true }) => {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={className}>{children}</div>;
  const initial = { opacity: 0, y };
  const animate = { opacity: 1, y: 0 };
  const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 };
  if (inView) {
    return (
      <motion.div className={className} initial={initial} whileInView={animate} viewport={{ once }} transition={transition}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div className={className} initial={initial} animate={animate} transition={transition}>
      {children}
    </motion.div>
  );
};

export default MotionReveal;
