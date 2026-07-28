import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal - A premium animation wrapper that performs a smooth clip-path
 * reveal (mask wipe) combined with a scale-down effect for images and cards.
 */
const ScrollReveal = ({ children, delay = 0, className = '', once = false, style }) => {
  return (
    <div 
      className={className} 
      style={{ 
        overflow: 'hidden', 
        position: 'relative', 
        borderRadius: 'inherit',
        ...style 
      }}
    >
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
        viewport={{ once, margin: '-50px' }}
        transition={{
          clipPath: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay },
          scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }
        }}
        style={{ 
          width: '100%', 
          height: '100%', 
          willChange: 'clip-path, transform' 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollReveal;
