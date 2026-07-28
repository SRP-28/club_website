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
        willChange: "transform, opacity",
        ...style
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
