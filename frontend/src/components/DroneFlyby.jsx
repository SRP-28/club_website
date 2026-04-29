import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DroneFlyby = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState('left-to-right');
  const [yPos, setYPos] = useState(20); // Percentage from top

  useEffect(() => {
    const triggerAnimation = () => {
      setDirection(Math.random() > 0.5 ? 'left-to-right' : 'right-to-left');
      setYPos(Math.floor(Math.random() * 60) + 20); // Between 20% and 80%
      setIsVisible(true);

      // Hide after animation duration (match with 15s duration)
      setTimeout(() => {
        setIsVisible(false);
      }, 15000);
    };

    // Initial delay
    const initialTimeout = setTimeout(triggerAnimation, 3000);
    
    // Interval for subsequent flybys
    const interval = setInterval(triggerAnimation, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const variants = {
    'left-to-right': {
      initial: { x: '-200px', y: `${yPos}vh`, rotate: 5, opacity: 0 },
      animate: { 
        x: '110vw', 
        y: [`${yPos}vh`, `${yPos-5}vh`, `${yPos}vh`],
        opacity: [0, 1, 1, 0],
        rotate: [5, 8, 5],
        transition: {
          x: { duration: 15, ease: "linear" }, // Slower speed
          y: { duration: 3, repeat: 5, ease: "easeInOut" },
          opacity: { times: [0, 0.1, 0.9, 1], duration: 15 },
          rotate: { duration: 3, repeat: 5, ease: "easeInOut" }
        }
      }
    },
    'right-to-left': {
      initial: { x: '110vw', y: `${yPos}vh`, rotate: -5, opacity: 0 },
      animate: { 
        x: '-200px', 
        y: [`${yPos}vh`, `${yPos+5}vh`, `${yPos}vh`],
        opacity: [0, 1, 1, 0],
        rotate: [-5, -8, -5],
        transition: {
          x: { duration: 15, ease: "linear" }, // Slower speed
          y: { duration: 3, repeat: 5, ease: "easeInOut" },
          opacity: { times: [0, 0.1, 0.9, 1], duration: 15 },
          rotate: { duration: 3, repeat: 5, ease: "easeInOut" }
        }
      }
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="drone-flyby"
            initial={variants[direction].initial}
            animate={variants[direction].animate}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute' }}
          >
            {/* Detailed quadcopter design */}
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg width="120" height="120" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Arms - slightly shorter to keep everything compact */}
                <path d="M25 25 L75 75 M75 25 L25 75" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                <path d="M25 25 L75 75 M75 25 L25 75" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                
                {/* Motors */}
                <circle cx="25" cy="25" r="5" fill="#222" stroke="#444" />
                <circle cx="75" cy="25" r="5" fill="#222" stroke="#444" />
                <circle cx="25" cy="75" r="5" fill="#222" stroke="#444" />
                <circle cx="75" cy="75" r="5" fill="#222" stroke="#444" />
                
                {/* Propeller Blur Disks (much more realistic for a fast-spinning drone) */}
                <motion.circle 
                  cx="25" cy="25" r="18" 
                  fill="url(#prop-grad)" 
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />
                <motion.circle 
                  cx="75" cy="25" r="18" 
                  fill="url(#prop-grad)" 
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />
                <motion.circle 
                  cx="25" cy="75" r="18" 
                  fill="url(#prop-grad)" 
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />
                <motion.circle 
                  cx="75" cy="75" r="18" 
                  fill="url(#prop-grad)" 
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />

                <defs>
                  <radialGradient id="prop-grad">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="70%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Main Body - More sleek and modern */}
                <rect x="35" y="38" width="30" height="24" rx="10" fill="#222" stroke="#444" strokeWidth="1" />
                <rect x="40" y="42" width="20" height="16" rx="6" fill="#111" />
                
                {/* Camera/Lens at the front */}
                <circle cx="50" cy="38" r="3" fill="#000" stroke="#333" />
                <circle cx="50" cy="38" r="1" fill="#44f" opacity="0.6" />
                
                {/* Status LEDs */}
                <motion.circle 
                  cx="42" cy="45" r="1" 
                  animate={{ fill: ['#0f0', '#030', '#0f0'] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.circle 
                  cx="58" cy="45" r="1" 
                  animate={{ fill: ['#f00', '#300', '#f00'] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </svg>
            </div>
            <div style={{ 
              width: '60px', 
              height: '3px', 
              background: 'rgba(0, 0, 0, 0.4)', 
              filter: 'blur(8px)',
              margin: '0 auto',
              marginTop: '-15px',
              borderRadius: '50%'
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DroneFlyby;
