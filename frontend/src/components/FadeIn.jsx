import { motion } from 'framer-motion';

/**
 * FadeIn - A reusable scroll-triggered fade-up animation wrapper.
 * Wraps any children with a smooth fade-in + slide-up on viewport entry.
 */
const FadeIn = ({ children, delay = 0, className = '', once = false, style }) => {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration: 0.55,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
