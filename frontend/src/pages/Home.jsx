import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../components/ui/Button';
import './Home.css';

// Staggered hero text animation variants
const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const Home = () => {
  const { scrollY } = useScroll();
  
  // Create dynamic scroll transforms for the zoom & fade out effect
  const scale = useTransform(scrollY, [0, 500], [1, 0.92]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <>
      {/* Hero Section with scroll-controlled zoom/fade */}
      <section className="hero" style={{ overflow: 'hidden' }}>
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          style={{
            scale,
            opacity,
            y,
            willChange: 'transform, opacity'
          }}
        >
          <motion.h1 variants={heroItem}>Throttling to Great Heights</motion.h1>
          <motion.h3 variants={heroItem}>About Us</motion.h3>
          <motion.p variants={heroItem}>
            <strong>Team Vajra</strong> is the official <strong>Drone and Robotics Club of MMCOE</strong>, dedicated to
            pioneering innovation in <strong>UAV design, development, and aerial technology</strong>. Our team focuses on
            building cutting-edge autonomous systems, high-speed racing drones, and practical aerial solutions that push the
            boundaries of modern engineering.
          </motion.p>
          <motion.p variants={heroItem}>
            <strong>Achievements:</strong> Proud winners of <strong>Technoxian 2025</strong> — securing <strong>World Rank
            3</strong> and <strong>All India Rank 2</strong> in Drone Racing, a testament to our technical mastery and
            collaborative spirit.
          </motion.p>
          <motion.p variants={heroItem}>
            Driven by innovation, precision, and passion, <strong>Team Vajra</strong> continues to redefine the skies — one
            flight at a time — through excellence in engineering, teamwork, and relentless pursuit of aerial perfection.
          </motion.p>
          <motion.div variants={heroItem}>
            <Button to="/drones">Explore Our Drones</Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
