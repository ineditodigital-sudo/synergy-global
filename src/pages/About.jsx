import React from 'react';
import SEO from '../components/SEO';
import TeamCarousel from '../components/TeamCarousel';
import ImageGalleryCarousel from '../components/ImageGalleryCarousel';
import { useContent } from '../context/ContentContext';

export default function About() {
  const { content } = useContent();
  const { about } = content;

  // Safety fallbacks
  const safeAbout = about || { 
    header: { badge: 'Leadership', title: 'Our Team' },
    narrative: { text1: '', text2: '' },
    team: [],
    valueStatement: { text: '' }
  };

  return (
    <div className="pt-40 bg-bone min-h-screen">
      <SEO title="Leadership" description="Meet the executive team behind Synergy Global's transformative investments." />
      
      {/* Narrative Section */}
      <section className="px-6 md:px-16 mb-32">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-sans font-light tracking-[0.4em] text-xs uppercase text-sand mb-8">{safeAbout.header?.badge}</h1>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-5xl text-sage mb-12 leading-tight max-w-4xl">
            {(safeAbout.header?.title || '').split(' ').map((word, i) => (
              <span key={i}>
                {word === 'experience' || word === 'perspective' ? <span className="italic text-sand-dark">{word} </span> : word + ' '}
              </span>
            ))}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <p className="font-sans font-light text-xl text-sage/80 leading-relaxed">
              {safeAbout.narrative?.text1}
            </p>
            <p className="font-sans font-light text-xl text-sage/80 leading-relaxed">
              {safeAbout.narrative?.text2}
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Grid */}
      <TeamCarousel />

      {/* Press & Media Gallery */}
      <ImageGalleryCarousel title="Press & Media" />
      
      {/* Value Statement */}
      <section className="py-32 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-body italic text-3xl md:text-4xl text-sage mb-8">{safeAbout.valueStatement?.text}</h3>
          <div className="w-12 h-px bg-sand mx-auto"></div>
        </div>
      </section>
    </div>
  );
}
