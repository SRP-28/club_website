import React from 'react';
import './Sponsors.css';

// blend  → white background logo: mix-blend-mode lighten removes white on dark UI
// invert → dark/black background logo: invert to show cleanly
// (no class) → logo with its own coloured background, shown as-is
const sponsors = [
  { href: 'https://www.ansys.com/en-in',  src: '/assets/ansys-logo.jpg',        alt: 'Ansys',              className: 'blend'  },
  { href: 'https://www.altium.com/',       src: '/assets/alt.logo.png',          alt: 'Altium',             className: 'blend'  },
  { href: 'https://www.solidworks.com/',   src: '/assets/SolidWorks_Logo.jpg',   alt: 'SolidWorks',         className: 'blend'  },
  { href: '#',                             src: '/assets/Sukhi Panda.jpg',        alt: 'Sukhi Panda',        className: ''       },
  { href: '#',                             src: '/assets/Phoenix Systems.jpg',    alt: 'Phoenix Systems',    className: 'blend'  },
  { href: '#',                             src: '/assets/MJ Woods.jpg',           alt: 'MJ Woods',           className: 'blend'  },
  { href: '#',                             src: '/assets/Sarthak Industries.jpg', alt: 'Sarthak Properties', className: ''       },
  { href: 'https://www.urvirl.in/',        src: '/assets/Urvi Labs.jpg',          alt: 'Urvi Labs',          className: 'blend'  },
];

const Sponsors = () => {
  return (
    <section className="sponsor">
      <h2>Our Sponsors</h2>
      <marquee behavior="scroll" direction="left" scrollamount="6" onMouseOver={(e) => e.currentTarget.stop()} onMouseOut={(e) => e.currentTarget.start()}>
        {sponsors.map((s) => (
          <a
            key={s.alt}
            href={s.href}
            target={s.href !== '#' ? '_blank' : undefined}
            rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
            className={`sponsor-logo-link ${s.className}`}
          >
            <img src={s.src} alt={s.alt} />
          </a>
        ))}
      </marquee>
    </section>
  );
};

export default Sponsors;
