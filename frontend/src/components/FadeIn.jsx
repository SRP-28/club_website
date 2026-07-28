import { motion } from 'framer-motion';

/**
 * FadeIn - A reusable scroll-triggered fade-up animation wrapper.
 * Wraps any children with a smooth fade-in + slide-up on viewport entry.
 */
const FadeIn = ({ children, delay = 0, className = '', once = false, style }) => {
  return (
    <motion.div
      className={className}
      style={{
        willChange: "transform, opacity, filter",
        ...style
      }}
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Ultra-smooth Apple-style curve
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
