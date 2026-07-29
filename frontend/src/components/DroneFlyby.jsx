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
            {/* High-detail X-frame quadcopter */}
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  {/* Propeller blur gradient */}
                  <radialGradient id="prop-grad-a" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(200,210,255,0.05)" />
                    <stop offset="55%" stopColor="rgba(200,210,255,0.35)" />
                    <stop offset="85%" stopColor="rgba(180,195,255,0.15)" />
                    <stop offset="100%" stopColor="rgba(180,195,255,0)" />
                  </radialGradient>
                  {/* Body gradient */}
                  <linearGradient id="body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4a4a5a" />
                    <stop offset="40%" stopColor="#2a2a38" />
                    <stop offset="100%" stopColor="#1a1a24" />
                  </linearGradient>
                  {/* Top shell gradient */}
                  <linearGradient id="shell-grad" x1="0%" y1="0%" x2="30%" y2="100%">
                    <stop offset="0%" stopColor="#5a5a70" />
                    <stop offset="100%" stopColor="#222230" />
                  </linearGradient>
                  {/* Motor gradient */}
                  <linearGradient id="motor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#606070" />
                    <stop offset="100%" stopColor="#222228" />
                  </linearGradient>
                  {/* Arm gradient */}
                  <linearGradient id="arm-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3a3a48" />
                    <stop offset="50%" stopColor="#252530" />
                    <stop offset="100%" stopColor="#3a3a48" />
                  </linearGradient>
                  {/* Camera lens gradient */}
                  <radialGradient id="lens-grad" cx="35%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#5566cc" />
                    <stop offset="40%" stopColor="#223388" />
                    <stop offset="100%" stopColor="#000010" />
                  </radialGradient>
                  {/* LED glow filter */}
                  <filter id="led-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  {/* Shadow filter */}
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* ── X-FRAME ARMS (tapered, 3D-looking) ── */}
                {/* Arm: center → top-left motor */}
                <polygon points="76,76 84,84 34,34 26,26" fill="url(#arm-grad-1)" />
                <line x1="80" y1="80" x2="30" y2="30" stroke="#555565" strokeWidth="0.5" />
                {/* Arm: center → top-right motor */}
                <polygon points="84,76 76,84 126,34 134,26" fill="url(#arm-grad-1)" />
                <line x1="80" y1="80" x2="130" y2="30" stroke="#555565" strokeWidth="0.5" />
                {/* Arm: center → bottom-left motor */}
                <polygon points="76,84 84,76 34,126 26,134" fill="url(#arm-grad-1)" />
                <line x1="80" y1="80" x2="30" y2="130" stroke="#555565" strokeWidth="0.5" />
                {/* Arm: center → bottom-right motor */}
                <polygon points="84,84 76,76 126,126 134,134" fill="url(#arm-grad-1)" />
                <line x1="80" y1="80" x2="130" y2="130" stroke="#555565" strokeWidth="0.5" />

                {/* ── PROPELLER DISKS (spinning blur) ── */}
                {/* Top-left */}
                <motion.g animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 0.08, repeat: Infinity }}>
                  <circle cx="30" cy="30" r="24" fill="url(#prop-grad-a)" />
                  {/* Blade shimmer lines */}
                  <line x1="30" y1="9" x2="30" y2="51" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <line x1="9" y1="30" x2="51" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <line x1="13" y1="13" x2="47" y2="47" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <line x1="47" y1="13" x2="13" y2="47" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                </motion.g>
                {/* Top-right */}
                <motion.g animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 0.08, repeat: Infinity, delay: 0.04 }}>
                  <circle cx="130" cy="30" r="24" fill="url(#prop-grad-a)" />
                  <line x1="130" y1="9" x2="130" y2="51" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <line x1="109" y1="30" x2="151" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <line x1="113" y1="13" x2="147" y2="47" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <line x1="147" y1="13" x2="113" y2="47" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                </motion.g>
                {/* Bottom-left */}
                <motion.g animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 0.08, repeat: Infinity, delay: 0.02 }}>
                  <circle cx="30" cy="130" r="24" fill="url(#prop-grad-a)" />
                  <line x1="30" y1="109" x2="30" y2="151" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <line x1="9" y1="130" x2="51" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <line x1="13" y1="113" x2="47" y2="147" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <line x1="47" y1="113" x2="13" y2="147" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                </motion.g>
                {/* Bottom-right */}
                <motion.g animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 0.08, repeat: Infinity, delay: 0.06 }}>
                  <circle cx="130" cy="130" r="24" fill="url(#prop-grad-a)" />
                  <line x1="130" y1="109" x2="130" y2="151" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <line x1="109" y1="130" x2="151" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <line x1="113" y1="113" x2="147" y2="147" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <line x1="147" y1="113" x2="113" y2="147" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                </motion.g>

                {/* ── MOTOR CANS ── */}
                {/* Top-left motor */}
                <ellipse cx="30" cy="28" rx="7" ry="3" fill="#555565" />
                <rect x="23" y="28" width="14" height="10" rx="2" fill="url(#motor-grad)" />
                <ellipse cx="30" cy="38" rx="7" ry="3" fill="#333340" />
                <ellipse cx="30" cy="28" rx="5" ry="2" fill="#6a6a80" opacity="0.6" />

                {/* Top-right motor */}
                <ellipse cx="130" cy="28" rx="7" ry="3" fill="#555565" />
                <rect x="123" y="28" width="14" height="10" rx="2" fill="url(#motor-grad)" />
                <ellipse cx="130" cy="38" rx="7" ry="3" fill="#333340" />
                <ellipse cx="130" cy="28" rx="5" ry="2" fill="#6a6a80" opacity="0.6" />

                {/* Bottom-left motor */}
                <ellipse cx="30" cy="128" rx="7" ry="3" fill="#555565" />
                <rect x="23" y="128" width="14" height="10" rx="2" fill="url(#motor-grad)" />
                <ellipse cx="30" cy="138" rx="7" ry="3" fill="#333340" />
                <ellipse cx="30" cy="128" rx="5" ry="2" fill="#6a6a80" opacity="0.6" />

                {/* Bottom-right motor */}
                <ellipse cx="130" cy="128" rx="7" ry="3" fill="#555565" />
                <rect x="123" y="128" width="14" height="10" rx="2" fill="url(#motor-grad)" />
                <ellipse cx="130" cy="138" rx="7" ry="3" fill="#333340" />
                <ellipse cx="130" cy="128" rx="5" ry="2" fill="#6a6a80" opacity="0.6" />

                {/* ── MAIN BODY ── */}
                {/* Bottom plate */}
                <ellipse cx="80" cy="86" rx="26" ry="10" fill="#1a1a22" filter="url(#shadow)" />
                {/* Body shell */}
                <rect x="56" y="62" width="48" height="28" rx="14" fill="url(#body-grad)" stroke="#3a3a50" strokeWidth="0.8" />
                {/* Panel line detail */}
                <line x1="56" y1="76" x2="104" y2="76" stroke="#3a3a50" strokeWidth="0.5" opacity="0.6" />
                <line x1="68" y1="62" x2="68" y2="90" stroke="#3a3a50" strokeWidth="0.5" opacity="0.5" />
                <line x1="92" y1="62" x2="92" y2="90" stroke="#3a3a50" strokeWidth="0.5" opacity="0.5" />
                {/* Top shell / canopy */}
                <ellipse cx="80" cy="66" rx="20" ry="9" fill="url(#shell-grad)" stroke="#4a4a60" strokeWidth="0.6" />
                <ellipse cx="80" cy="65" rx="14" ry="5" fill="#3a3a50" opacity="0.5" />
                {/* Ventilation slots */}
                <rect x="72" y="71" width="3" height="8" rx="1.5" fill="#111118" opacity="0.7" />
                <rect x="77" y="71" width="3" height="8" rx="1.5" fill="#111118" opacity="0.7" />
                <rect x="82" y="71" width="3" height="8" rx="1.5" fill="#111118" opacity="0.7" />
                {/* Battery bay indicator */}
                <rect x="62" y="79" width="36" height="8" rx="3" fill="#111118" stroke="#333345" strokeWidth="0.5" />
                <rect x="64" y="81" width="12" height="4" rx="1.5" fill="#2a5a2a" />

                {/* ── CAMERA GIMBAL ── */}
                {/* Gimbal arm */}
                <rect x="76" y="88" width="8" height="7" rx="2" fill="#222230" stroke="#333345" strokeWidth="0.5" />
                {/* Camera housing */}
                <ellipse cx="80" cy="97" rx="7" ry="5" fill="#1e1e2a" stroke="#333345" strokeWidth="0.6" />
                {/* Lens */}
                <circle cx="80" cy="97" r="4" fill="url(#lens-grad)" stroke="#2a2a40" strokeWidth="0.5" />
                <circle cx="80" cy="97" r="2.2" fill="#001" opacity="0.9" />
                {/* Lens reflection */}
                <circle cx="78.5" cy="95.5" r="0.8" fill="rgba(255,255,255,0.4)" />

                {/* ── ANTENNA ── */}
                <line x1="80" y1="62" x2="80" y2="52" stroke="#555566" strokeWidth="1.2" />
                <circle cx="80" cy="52" r="1.5" fill="#888899" />

                {/* ── LANDING LEGS ── */}
                {/* Front-left */}
                <line x1="65" y1="89" x2="58" y2="100" stroke="#333345" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="54" y1="100" x2="62" y2="100" stroke="#333345" strokeWidth="1.5" strokeLinecap="round" />
                {/* Front-right */}
                <line x1="95" y1="89" x2="102" y2="100" stroke="#333345" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="98" y1="100" x2="106" y2="100" stroke="#333345" strokeWidth="1.5" strokeLinecap="round" />

                {/* ── STATUS LEDs ── */}
                {/* Front green LED (nose) */}
                <motion.circle
                  cx="80" cy="63" r="1.8"
                  filter="url(#led-glow)"
                  animate={{ fill: ['#00ff88', '#005530', '#00ff88'], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                {/* Left red LED */}
                <motion.circle
                  cx="56" cy="76" r="1.8"
                  filter="url(#led-glow)"
                  animate={{ fill: ['#ff2244', '#440010', '#ff2244'], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: 0.45 }}
                />
                {/* Right white LED */}
                <motion.circle
                  cx="104" cy="76" r="1.8"
                  filter="url(#led-glow)"
                  animate={{ fill: ['#ffffff', '#444455', '#ffffff'], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.0, repeat: Infinity, delay: 0.2 }}
                />
                {/* Rear blue LED */}
                <motion.circle
                  cx="80" cy="89" r="1.5"
                  filter="url(#led-glow)"
                  animate={{ fill: ['#4488ff', '#001044', '#4488ff'], opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: 0.6 }}
                />
              </svg>
            </div>
            {/* Ground shadow */}
            <div style={{ 
              width: '80px', 
              height: '4px', 
              background: 'rgba(0, 0, 0, 0.35)', 
              filter: 'blur(6px)',
              margin: '0 auto',
              marginTop: '-8px',
              borderRadius: '50%'
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DroneFlyby;
