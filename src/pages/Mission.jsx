import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Target, Eye, Globe, Zap, ShieldCheck } from 'lucide-react';

import SEO from '../components/SEO';

import { useContent } from '../context/ContentContext';

export default function Mission() {
  const { content } = useContent();
  const { mission } = content;
  const containerRef = useRef(null);

  // Safety fallbacks
  const safeHeader = mission?.header || { badge: 'Mission', title: 'Building Legacies' };
  const safeMission = mission?.missionCard || { badge: 'Mission', text: '' };
  const safeVision = mission?.visionCard || { badge: 'Vision', text: '' };
  const safePillars = mission?.pillars || [];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.mission-card', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, [mission]);

  const getPillarIcon = (index) => {
    if (index === 0) return <Globe className="text-sand mb-6" size={32} strokeWidth={1} />;
    if (index === 1) return <Zap className="text-sand mb-6" size={32} strokeWidth={1} />;
    return <ShieldCheck className="text-sand mb-6" size={32} strokeWidth={1} />;
  };

  return (
    <div ref={containerRef} className="pt-40 pb-32 px-6 min-h-screen bg-bone text-sage overflow-hidden">
      <SEO 
        title={safeHeader.title} 
        description={safeMission.text} 
      />
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-20 text-center md:text-left">
          <h1 className="font-sans font-light tracking-[0.5em] text-[10px] uppercase text-sand mb-6">{safeHeader.badge}</h1>
          <h2 className="font-heading text-5xl md:text-6xl text-sage max-w-3xl leading-tight">
            {(safeHeader.title || '').split(' ').map((word, i) => (
              <span key={i}>
                {word === 'Legacies' ? <span className="italic text-sand-dark">Legacies </span> : word + ' '}
              </span>
            ))}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="mission-card bg-white p-12 border border-sand/10 shadow-sm relative group overflow-hidden min-h-[450px] flex flex-col justify-end">
            {safeMission.image && (
              <div className="absolute inset-0 z-0">
                <img src={safeMission.image} className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700 group-hover:scale-110 transition-transform duration-1000" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
              </div>
            )}
            <div className="absolute top-0 right-0 p-8 text-sand/10 group-hover:text-sand/20 transition-colors z-10">
              <Target size={120} strokeWidth={0.5} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-sand/10 flex items-center justify-center mb-8">
                <Target className="text-sand" size={24} />
              </div>
              <h3 className="font-sans font-light tracking-[0.3em] text-xs uppercase text-sand mb-6">{safeMission.badge}</h3>
              <p className="font-body text-2xl md:text-3xl text-sage leading-snug mb-6">
                {safeMission.text}
              </p>
              <div className="w-10 h-px bg-sand/30"></div>
            </div>
          </div>

          <div className="mission-card bg-charcoal text-bone p-12 border border-white/5 relative group overflow-hidden min-h-[450px] flex flex-col justify-end">
            {safeVision.image && (
              <div className="absolute inset-0 z-0">
                <img src={safeVision.image} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700 group-hover:scale-110 transition-transform duration-1000" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent"></div>
              </div>
            )}
            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors z-10">
              <Eye size={120} strokeWidth={0.5} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-8">
                <Eye className="text-sand" size={24} />
              </div>
              <h3 className="font-sans font-light tracking-[0.3em] text-xs uppercase text-sand mb-6">{safeVision.badge}</h3>
              <p className="font-body text-2xl md:text-3xl leading-snug mb-6">
                {safeVision.text}
              </p>
              <div className="w-10 h-px bg-sand/30"></div>
            </div>
          </div>
        </div>

        {safePillars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-sand/20 pt-16">
            {safePillars.map((pillar, index) => (
              <div key={index} className="mission-card flex flex-col items-center text-center">
                {getPillarIcon(index)}
                <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-4">{pillar.title}</h4>
                <p className="font-sans font-light text-sage/70 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
