import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal - A premium animation wrapper that performs a smooth 
 * blur-to-focus reveal, gentle scale-up, and translation with hardware acceleration.
 */
const ScrollReveal = ({ children, delay = 0, className = '', once = false, style }) => {
  return (
    <motion.div
      className={className}
      style={{
        willChange: "transform, opacity, filter",
        ...style
      }}
      initial={{ opacity: 0, y: 35, scale: 0.97, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Premium Apple-style ease-out
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
