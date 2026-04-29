import React from 'react';
import './Sponsors.css';

const sponsors = [
  { href: 'https://www.ansys.com/en-in',     src: '/assets/ansys-logo.jpg',        alt: 'Ansys'               },
  { href: 'https://www.altium.com/',          src: '/assets/alt.logo.png',          alt: 'Altium'              },
  { href: 'https://punecottoncompany.com/',   src: '/assets/pune cotton comp.jpeg', alt: 'Pune Cotton Company' },
  { href: 'http://www.phoenixsystems.co.in/', src: '/assets/phoenix systems.png',   alt: 'Phoenix Systems'     },
  { href: 'https://learnac.com/',             src: '/assets/ninad.png',             alt: 'Learn AC'            },
];

const Sponsors = () => {
  return (
    <section className="sponsor">
      <h2>Our Sponsors</h2>
      <marquee behavior="scroll" direction="left" scrollamount="6" onMouseOver={(e) => e.target.stop()} onMouseOut={(e) => e.target.start()}>
        {sponsors.map((s) => (
          <a
            key={s.alt}
            href={s.href}
            target={s.href !== '#' ? '_blank' : undefined}
            rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
            className="sponsor-logo-link"
            style={{ display: 'inline-block', margin: '0 40px' }}
          >
            <img src={s.src} alt={s.alt} style={{ height: '60px', verticalAlign: 'middle' }} />
          </a>
        ))}
      </marquee>
    </section>
  );
};

export default Sponsors;
