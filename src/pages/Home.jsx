import React from 'react';
import Hero from '../components/Hero';
import TrackRecord from '../components/TrackRecord';
import PortfolioShowcase from '../components/PortfolioShowcase';
import Manifesto from '../components/Manifesto';
import ValueInteractions from '../components/ValueInteractions';
import PropertyValuation from '../components/PropertyValuation';
import TeamCarousel from '../components/TeamCarousel';

import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="Home" 
        description="Premier advisory and development firm specializing in luxury real estate and strategic global investment." 
        />
      <Hero />
      <TrackRecord />
      <PortfolioShowcase />
      <Manifesto />
      <PropertyValuation />
      <ValueInteractions />
      <TeamCarousel />
    </>
  );
}
