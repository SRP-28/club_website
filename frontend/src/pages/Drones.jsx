import React from 'react';
import FadeIn from '../components/FadeIn';
import SectionTitle from '../components/ui/SectionTitle';
import './Drones.css';

const drones = [
  {
    name: 'OUR FIRST DRONE',
    img: '/assets/First.jpg',
    alt: 'Our First Drone',
    desc: `Built on a durable F450 frame with 1000KV brushless DC motors for balanced thrust and stability. It is controlled using the KK 2.1.5 flight controller, ensuring smooth and responsive flight handling. It is equipped with Electronic Speed Controllers (ESCs) and a LiPo battery for efficient power management. Originally developed in the early days of Team Vajra as a foundation for UAV experimentation. It is designed for mapping and aerial survey applications, enabling precise and stable flight paths. Served as a training and research platform, paving the way for more advanced drone designs in our lineup.`,
  },
  {
    name: 'ABHIMANYU',
    img: '/assets/Abhimanyu.jpg',
    alt: 'Abhimanyu Drone',
    desc: `Abhimanyu FPV Drone (Racing Edition) A 5-inch FPV racing quad powered by T-Motor Velox 2207 (2050KV) motors for exceptional thrust and agility. It is built on a Speedy Bee flight controller with integrated ESC stack, ensuring rapid response and smooth power delivery. It features an FPV camera, VTX module, and 6-channel receiver for real-time video transmission and precise control. It has been paired with Eachine EV800 goggles, providing an immersive first-person flight experience. Designed for competitive FPV racing, Abhimanyu showcased outstanding performance and stability. This drone proudly represented Team Vajra at Technoxian 2024, securing an impressive World Rank 4 in the FPV Racing category.`,
  },
  {
    name: 'MARUT',
    img: '/assets/Hexa.jpg',
    alt: 'Marut Drone',
    desc: `Constructed with a high-thrust hexacopter frame powered by 850KV brushless DC motors for enhanced stability and payload capacity. It is operated through the APM flight controller, enabling precise manual and autonomous flight modes. It has integrated ESCs and a LiPo battery system for efficient power distribution and long-endurance flights. It is specially engineered to handle heavy-lift operations, making it ideal for delivery and transport applications. Designed for reliability and control, this drone demonstrates Team Vajra's advancement toward autonomous aerial logistics solutions. It's a key step in our evolution from experimental builds to mission-ready UAV systems.`,
  },
  {
    name: 'VASUKI',
    img: '/assets/Vasuki.jpg',
    alt: 'Vasuki Drone',
    desc: `Developed on a sturdy F450 frame and powered by 850KV brushless DC motors with 30A ESCs for stable and efficient flight. It is controlled by a Pixhawk flight controller, enabling fully autonomous navigation and mission planning. Equipped with a 10-channel receiver for enhanced control flexibility and reliable communication. It is powered by a LiPo battery system, ensuring extended flight endurance for field operations. Designed primarily for surveillance and mapping missions, delivering high accuracy and consistent performance. This Drone represents Team Vajra's leap into advanced autonomous UAV systems, blending innovation with real-world applicability.`,
  },
  {
    name: 'TECHNOXIAN HERO',
    img: '/assets/3inch.jpg',
    alt: 'Technoxian Hero Drone',
    desc: `Built on a 150mm Apex 3-inch carbon fiber frame, offering exceptional durability, light weight, and agility for precision racing. It is powered by EMAX ECO II 2004 2000KV brushless motors with Orange 3052 tri-blade propellers for powerful thrust and responsive control. Controlled by a SpeedyBee F405 Mini Stack (F405 FC + 35A ESC), allowing fine-tuned flight adjustments and easy Wi-Fi configuration. It is well equipped with a RunCam Robin 3 FPV camera and AKK Race Ranger 1.6W VTX, ensuring crystal-clear, long-range video transmission. Integrated ExpressLRS receiver paired with a Radiomaster Pocket RC transmitter for ultra-low latency and reliable control link. FPV feed viewed through iFlight DVR FPV goggles, offering immersive real-time visuals and recording capabilities. With this drone, Team Vajra proudly secured AIR 2 and World Rank 3 in the Technoxian Drone Circuit Racing 2025, showcasing its unmatched performance and precision.`,
  },
];

const Drones = () => {
  return (
    <section className="drones-section">
      <FadeIn>
        <SectionTitle>Our Drones</SectionTitle>
      </FadeIn>

      {drones.map((drone, i) => (
        <FadeIn key={drone.name} delay={0.05}>
          <div className={`drone ${i % 2 === 1 ? 'reverse' : ''}`}>
            <div className="drone-info">
              <h3>{drone.name}</h3>
              <p>{drone.desc}</p>
            </div>
            <div className="drone-image-container">
              <img src={drone.img} alt={drone.alt} />
            </div>
          </div>
        </FadeIn>
      ))}
    </section>
  );
};

export default Drones;

