import React from 'react';
import FadeIn from '../components/FadeIn';
import SectionTitle from '../components/ui/SectionTitle';
import Grid from '../components/ui/Grid';
import Card from '../components/ui/Card';
import './Team.css';

const members = [
  { href: "https://www.linkedin.com/in/prathmesh-patil-7a093a2a1", src: "/assets/IMG-20251008-WA0010.jpg", alt: "Prathamesh" },
  { href: "https://www.linkedin.com/in/adityashinde9", src: "/assets/IMG-20251008-WA0013.jpg", alt: "Aditya" },
  { href: "https://www.linkedin.com/in/atharvakanawade", src: "/assets/IMG-20251008-WA0012.jpg", alt: "Atharva" },
  { href: "https://www.linkedin.com/in/aarav-thigale-a64b63266", src: "/assets/IMG-20251008-WA0011.jpg", alt: "Aarav" },
  { href: "https://www.linkedin.com/in/omkar-bedekar-0021922ba/", src: "/assets/IMG-20251008-WA0015.jpg", alt: "Omkar" },
  { href: "https://www.linkedin.com/in/tanisha-kasliwal-853851298", src: "/assets/IMG-20251008-WA0014.jpg", alt: "Tanisha" },
  { href: "https://www.linkedin.com/in/vishwajit", src: "/assets/IMG-20251008-WA0016.jpg", alt: "Vishwajit" },
  { href: "https://www.linkedin.com/in/anushk-nanaware-60915a334", src: "/assets/IMG-20251008-WA0017.jpg", alt: "Anushk" },
  { href: "https://www.linkedin.com/in/soham-bhoir-488152334", src: "/assets/IMG-20251008-WA0019.jpg", alt: "Soham" },
  { href: "https://www.linkedin.com/in/avani-soman-1aa913316", src: "/assets/IMG-20251008-WA0018.jpg", alt: "Avani" },
  { href: "https://www.linkedin.com/in/ameya-walvekar-b52aa8233", src: "/assets/IMG-20251008-WA0025.jpg", alt: "Ameya" },
  { href: "https://www.linkedin.com/in/sammrudhikulkarni", src: "/assets/IMG-20251008-WA0020.jpg", alt: "Sammrudhi" },
  { href: "https://www.linkedin.com/in/rajat-mamluskar", src: "/assets/IMG-20251008-WA0024.jpg", alt: "Rajat" },
  { href: "https://www.linkedin.com/in/pranav-motale-7a922b2a5", src: "/assets/IMG-20251008-WA0026.jpg", alt: "Pranav" },
  { href: "https://www.linkedin.com/in/mohit-umardand-324608339", src: "/assets/IMG-20251008-WA0023.jpg", alt: "Mohit" },
  { href: "https://www.linkedin.com/in/siddhant-bachal-01318b336", src: "/assets/IMG-20251008-WA0021.jpg", alt: "Siddhant" },
];

const Team = () => {
  return (
    <>
      <section className="founders-section">
        <FadeIn>
          <SectionTitle>Meet Our Founders</SectionTitle>
        </FadeIn>
        <Grid variant="founders">
          {[
            { src: "/assets/manas.jpeg", alt: "Manas", name: "MANAS" },
            { src: "/assets/aatish.jpeg", alt: "Aatish", name: "AATISH" },
            { src: "/assets/omkar.jpeg", alt: "Omkar", name: "OMKAR" },
          ].map((founder, i) => (
            <FadeIn key={founder.name} delay={i * 0.12}>
              <Card imageSrc={founder.src} imageAlt={founder.alt} className="founders-card">
                <span className="founder-name">{founder.name}</span>
              </Card>
            </FadeIn>
          ))}
        </Grid>
      </section>

      <section className="team-section">
        <FadeIn>
          <SectionTitle>Meet Our Team</SectionTitle>
          <p className="team-subtitle">
            <strong>🔸 Click on the photos to know more about our members 🔸</strong>
          </p>
        </FadeIn>

        <Grid variant="team">
          {members.map((member, i) => (
            <FadeIn key={member.alt} delay={(i % 4) * 0.08} className="team-member-link">
              <a href={member.href} target="_blank" rel="noopener noreferrer" className="team-member-link">
                <Card imageSrc={member.src} imageAlt={member.alt} className="team-member-card" />
              </a>
            </FadeIn>
          ))}
        </Grid>
      </section>
    </>
  );
};

export default Team;
