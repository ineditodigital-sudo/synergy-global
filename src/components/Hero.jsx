import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

import { useContent } from '../context/ContentContext';

export default function Hero() {
  const { content } = useContent();
  const heroRef = useRef(null);
  const hero = content.home?.hero || {
    badge: 'Synergy Global | Luxury Advisory',
    title: 'Transforming Real Estate with',
    subtitle: 'Strategic Global Insight.',
    backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
    primaryCta: 'View Assets',
    secondaryCta: 'Our Strategy',
    locations: 'US • MEXICO • EUROPE'
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out"
      });
      
      gsap.from(".hero-bg", {
        scale: 1.1,
        duration: 3,
        ease: "power2.out"
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Cinematic Background */}
      <div className="hero-bg absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80 z-10"></div>
        <img 
          src={hero.backgroundImage} 
          alt="Luxury Architecture" 
          className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
        />
      </div>

      <div className="relative z-20 text-center px-6 max-w-5xl">
        <h1 className="flex flex-col mb-8 md:mb-12">
          <span className="hero-line font-sans font-light tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-sm uppercase mb-4 md:mb-6 text-sand">
            {hero.badge}
          </span>
          <span className="hero-line font-heading text-4xl md:text-5xl lg:text-5xl leading-tight md:leading-none text-bone">
            {hero.title}
          </span>
          <span className="hero-line font-body italic text-2xl md:text-4xl lg:text-6xl text-bone/90 mt-2">
            {hero.subtitle}
          </span>
        </h1>
        
        {/* Dual CTA Section based on Research */}
        <div className="hero-line flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-12">
          <Link to="/portfolio" className="w-full md:w-auto bg-sand text-sage px-10 py-4 text-[10px] font-sans tracking-[0.3em] uppercase hover:bg-bone transition-all duration-500 shadow-xl text-center">
            {hero.primaryCta}
          </Link>
          <Link to="/about" className="w-full md:w-auto border border-white/30 text-bone px-10 py-4 text-[10px] font-sans tracking-[0.3em] uppercase hover:bg-white hover:text-sage transition-all duration-500 text-center">
            {hero.secondaryCta}
          </Link>
        </div>

        {/* Geographic Qualification */}
        <div className="hero-line absolute bottom-12 left-0 w-full hidden md:flex justify-center">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-bone/40">
            {hero.locations}
          </p>
        </div>
      </div>
    </section>
  );
}

