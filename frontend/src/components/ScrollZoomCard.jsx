import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollZoomCard - An element that subtly scales up as it reaches
 * the center of the viewport and scales back down as it scrolls away.
 * 100% GPU-composited — uses only transform.
 */
const ScrollZoomCard = ({ children, className = '', style }) => {
  const ref = useRef(null);

  // Track this element's progress through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // track from entering bottom to leaving top
  });

  // Map scroll progress: small at entry (0), peak at center (0.5), small at exit (1)
  // The parabola: scale is highest at 0.5, lower at 0 and 1
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0.95, 1.02, 1.04, 1.02, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.6, 1, 1, 0.6]
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        scale,
        opacity,
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollZoomCard;
