import React from 'react';
import { motion } from 'framer-motion';

const DroneLoader = ({ fullScreen = true, message = "Loading..." }) => {
  return (
    <div 
      className={`drone-loader-container ${fullScreen ? 'full-screen' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        width: '100%',
        minHeight: fullScreen ? '100vh' : '200px',
        background: fullScreen ? 'rgba(5, 6, 8, 0.9)' : 'transparent',
        position: fullScreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        zIndex: 2000,
        backdropFilter: fullScreen ? 'blur(10px)' : 'none',
      }}
    >
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {/* Detailed quadcopter design */}
          <svg width="120" height="120" viewBox="0 0 100 100">
            {/* Arms */}
            <path d="M25 25 L75 75 M75 25 L25 75" stroke="#333" strokeWidth="8" strokeLinecap="round" />
            <path d="M25 25 L75 75 M75 25 L25 75" stroke="#111" strokeWidth="3" strokeLinecap="round" />
            
            {/* Motors */}
            <circle cx="25" cy="25" r="5" fill="#222" stroke="#444" />
            <circle cx="75" cy="25" r="5" fill="#222" stroke="#444" />
            <circle cx="25" cy="75" r="5" fill="#222" stroke="#444" />
            <circle cx="75" cy="75" r="5" fill="#222" stroke="#444" />
            
            {/* Propeller Blur Disks */}
            <motion.circle 
              cx="25" cy="25" r="18" 
              fill="url(#loader-prop-grad)" 
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 0.08, repeat: Infinity }}
            />
            <motion.circle 
              cx="75" cy="25" r="18" 
              fill="url(#loader-prop-grad)" 
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 0.08, repeat: Infinity }}
            />
            <motion.circle 
              cx="25" cy="75" r="18" 
              fill="url(#loader-prop-grad)" 
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 0.08, repeat: Infinity }}
            />
            <motion.circle 
              cx="75" cy="75" r="18" 
              fill="url(#loader-prop-grad)" 
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 0.08, repeat: Infinity }}
            />

            <defs>
              <radialGradient id="loader-prop-grad">
                <stop offset="0%" stopColor="rgba(247, 194, 117, 0.15)" />
                <stop offset="70%" stopColor="rgba(247, 194, 117, 0.4)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Main Body */}
            <rect x="35" y="38" width="30" height="24" rx="10" fill="#222" stroke="#444" strokeWidth="1" />
            <rect x="40" y="42" width="20" height="16" rx="6" fill="#111" />
            
            {/* Camera */}
            <circle cx="50" cy="38" r="3" fill="#000" stroke="#333" />
            
            {/* LEDs */}
            <motion.circle 
              cx="42" cy="45" r="1" 
              animate={{ fill: ['#0f0', '#030', '#0f0'] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.circle 
              cx="58" cy="45" r="1" 
              animate={{ fill: ['#f00', '#300', '#f00'] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </svg>
        </motion.div>
        
        {/* Shadow */}
        <motion.div 
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ 
            width: '60px', 
            height: '4px', 
            background: 'rgba(0, 0, 0, 0.6)', 
            filter: 'blur(8px)',
            margin: '0 auto',
            marginTop: '-10px',
            borderRadius: '50%'
          }} 
        />
      </div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ 
            marginTop: '20px', 
            color: 'var(--brand-yellow)', 
            fontSize: '1rem', 
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(247, 194, 117, 0.3)'
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default DroneLoader;
