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
        perspective: 1000,
        ...style
      }}
      initial={{ opacity: 0, y: 45, scale: 0.92, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        type: "spring",
        stiffness: 65,
        damping: 13,
        mass: 0.8,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
