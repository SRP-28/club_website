import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal - Premium scroll animation using only GPU-composited
 * transform + opacity properties. No blur, no repaints.
 * Gives a satisfying scale-up + slide-up reveal on viewport entry.
 */
const ScrollReveal = ({ children, delay = 0, className = '', once = false, style }) => {
  return (
    <motion.div
      className={className}
      style={{
        willChange: "transform, opacity",
        ...style
      }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Expo ease-out — fast start, smooth landing
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
