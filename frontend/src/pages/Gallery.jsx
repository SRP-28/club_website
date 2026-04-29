import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import SectionTitle from '../components/ui/SectionTitle';
import Grid from '../components/ui/Grid';
import Card from '../components/ui/Card';
import './Gallery.css';

const images = [
  { src: '/assets/gall 1.JPG',  alt: 'Team Vajra Gallery 1'  },
  { src: '/assets/gall 2.JPG',  alt: 'Team Vajra Gallery 2'  },
  { src: '/assets/gall 3.JPG',  alt: 'Team Vajra Gallery 3'  },
  { src: '/assets/gall 4.jpg',  alt: 'Team Vajra Gallery 4'  },
  { src: '/assets/gall 5.JPG',  alt: 'Team Vajra Gallery 5'  },
  { src: '/assets/gall 6.jpg',  alt: 'Team Vajra Gallery 6'  },
  { src: '/assets/gall 7.jpg',  alt: 'Team Vajra Gallery 7'  },
  { src: '/assets/gall 8.jpg',  alt: 'Team Vajra Gallery 8'  },
  { src: '/assets/gall 9.jpg',  alt: 'Team Vajra Gallery 9'  },
  { src: '/assets/gall 10.jpg', alt: 'Team Vajra Gallery 10' },
  { src: '/assets/gall 11.jpg', alt: 'Team Vajra Gallery 11' },
  { src: '/assets/gall 12.jpg', alt: 'Team Vajra Gallery 12' },
  { src: '/assets/gall 13.jpg', alt: 'Team Vajra Gallery 13' },
  { src: '/assets/gall 16.jpg', alt: 'Team Vajra Gallery 16' },
  { src: '/assets/gall 18.jpg', alt: 'Team Vajra Gallery 18' },
];

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const isOpen = activeIndex !== null;

  const openLightbox = (i) => setActiveIndex(i);
  const closeLightbox = () => setActiveIndex(null);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape')    closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, goNext, goPrev]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <section className="gallery">
      <FadeIn>
        <SectionTitle>Our Gallery 📸</SectionTitle>
      </FadeIn>

      <Grid>
        {images.map((img, i) => (
          <FadeIn key={img.src} delay={(i % 5) * 0.06} style={{width: '100%'}}>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(i)}
              aria-label={`Open ${img.alt}`}
              style={{ display: 'block', width: '100%', outline: 'none' }}
            >
              <Card 
                imageSrc={img.src} 
                imageAlt={img.alt} 
                className="gallery-card" 
                onClick={() => openLightbox(i)}
              />
            </div>
          </FadeIn>
        ))}
      </Grid>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>

            {/* Prev button */}
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
            >
              ‹
            </button>

            {/* Image */}
            <motion.div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <img
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
              />
              <p className="lightbox-caption">
                {images[activeIndex].alt} &nbsp;·&nbsp; {activeIndex + 1} / {images.length}
              </p>
            </motion.div>

            {/* Next button */}
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
