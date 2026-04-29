import React from 'react';
import FadeIn from '../components/FadeIn';
import SectionTitle from '../components/ui/SectionTitle';
import Grid from '../components/ui/Grid';
import Card from '../components/ui/Card';
import './Achievements.css';

const Achievements = () => {
  return (
    <div className="page-container">
      <FadeIn>
        <SectionTitle>Our Achievements 🏆</SectionTitle>
      </FadeIn>
      <Grid>
        <FadeIn delay={0.1} style={{width: '100%'}}>
          <Card imageSrc="/assets/vajra-onstage.jpg" imageAlt="Technoxian 2025" className="achievement-card">
            <div className="ui-card-caption">Technoxian 2025 - World Rank 3 / All India Rank 2</div>
          </Card>
        </FadeIn>
        <FadeIn delay={0.2} style={{width: '100%'}}>
          <Card imageSrc="/assets/technoxian-24.jpg" imageAlt="Technoxian Championship 2024" className="achievement-card">
            <div className="ui-card-caption">Technoxian 2024 - World Rank 4 / All India Rank 3</div>
          </Card>
        </FadeIn>
      </Grid>

      <div className="section-divider"></div>

      <FadeIn delay={0.05}>
        <SectionTitle>Upcoming Events</SectionTitle>
      </FadeIn>
      <Grid>
        <FadeIn delay={0.1} style={{width: '100%'}}>
          <Card imageSrc="/assets/tech.png" imageAlt="Technoxian World Cup" className="achievement-card">
            <div className="ui-card-caption">Technoxian World Cup'26</div>
          </Card>
        </FadeIn>
        <FadeIn delay={0.2} style={{width: '100%'}}>
          <Card imageSrc="/assets/sae-international-logo.png" imageAlt="SAE Aerothon" className="achievement-card">
            <div className="ui-card-caption">SAE Aerothon 2026</div>
          </Card>
        </FadeIn>
      </Grid>
    </div>
  );
};

export default Achievements;
