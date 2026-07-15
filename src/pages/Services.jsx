import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUpRight, Globe, Shield, Zap, MoveRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext';

export default function Services() {
  const { content } = useContent();
  const { services } = content;
  const containerRef = useRef(null);

  const pillars = services.items;

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.service-card-modern', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }, containerRef);
    return () => ctx.revert();
  }, [services]);

  const getIcon = (title) => {
    if (title.toLowerCase().includes('real estate')) return <Zap size={20} />;
    if (title.toLowerCase().includes('supply chain')) return <Globe size={20} />;
    return <Shield size={20} />;
  };

  const getLink = (title) => {
    const t = title.toLowerCase();
    if (t.includes('supply chain')) return '/services/supply-chain';
    if (t.includes('trade')) return '/services/trade-investment';
    if (t.includes('investor')) return '/services/investor-representation';
    if (t.includes('corporate')) return '/services/corporate-formation';
    if (t.includes('advocacy')) return '/services/business-advocacy';
    return '/legal';
  };

  const getFallbackImage = (index) => {
    const fallbacks = [
      '/services/service1_new.png',
      '/services/service2_new.png',
      '/services/service3_new.png'
    ];
    return fallbacks[index % 3];
  };

  return (
    <div ref={containerRef} className="pt-48 pb-32 px-6 bg-bone min-h-screen text-sage overflow-hidden">
      <SEO 
        title={services.header.title} 
        description={services.header.subtitle} 
      />
      
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="mb-24 text-center max-w-2xl mx-auto">
          <h1 className="font-sans font-light tracking-[0.4em] text-[10px] uppercase text-sand mb-6">{services.header.badge}</h1>
          <h2 className="font-heading text-4xl md:text-5xl text-sage mb-6">
            {services.header.title}
          </h2>
          {services.header.subtitle && (
            <p className="font-sans text-xl text-sage/80 mb-8 font-light italic">
              {services.header.subtitle}
            </p>
          )}
          <div className="w-12 h-px bg-sand mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="service-card-modern group bg-white border border-sand/10 p-8 flex flex-col h-full hover:bg-charcoal transition-all duration-700 ease-in-out shadow-sm hover:shadow-2xl"
            >
              <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-sand/10 flex items-center justify-center text-sand border border-sand/20 group-hover:bg-sand group-hover:text-charcoal transition-all duration-500">
                    {getIcon(pillar.title)}
                  </div>
                </div>
                <h3 className="font-heading text-3xl text-sage group-hover:text-white transition-colors duration-500 mb-2">
                  {pillar.title}
                </h3>
                <p className="font-sans font-light text-sm text-sage/80 group-hover:text-bone/80 transition-colors duration-500 leading-relaxed mb-8">
                  {pillar.desc}
                </p>
                
                <Link 
                  to={getLink(pillar.title)} 
                  className="inline-flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-sand hover:text-white transition-colors group/btn"
                >
                  Explore Strategy <MoveRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>

              <div className="relative mt-auto aspect-[16/10] overflow-hidden rounded-sm bg-bone border border-sand/20">
                <img 
                  src={pillar.image || getFallbackImage(index)} 
                  alt={pillar.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out opacity-100"
                />
                <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-transparent transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-sand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
