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
    <section ref={heroRef} className="relative h-screen w-full flex items-center overflow-hidden bg-charcoal">
      {/* Cinematic Background */}
      <div className="hero-bg absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80 z-10"></div>
        {hero.backgroundVideo ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
            poster={hero.backgroundImage}
          >
            <source src={hero.backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <img 
            src={hero.backgroundImage} 
            alt="Luxury Architecture" 
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
          />
        )}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-20">
        <div className={`${hero.mobileAlign === 'left' ? 'text-left' : hero.mobileAlign === 'right' ? 'text-right' : 'text-center'} ${hero.desktopAlign === 'center' ? 'md:text-center md:mx-auto' : hero.desktopAlign === 'right' ? 'md:text-right md:ml-auto' : 'md:text-left'} max-w-3xl`}>
          <h1 className={`flex flex-col mb-8 md:mb-12 ${hero.mobileAlign === 'left' ? 'items-start' : hero.mobileAlign === 'right' ? 'items-end' : 'items-center'} ${hero.desktopAlign === 'center' ? 'md:items-center' : hero.desktopAlign === 'right' ? 'md:items-end' : 'md:items-start'}`}>
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
          <div className={`hero-line flex flex-col md:flex-row items-center gap-6 md:gap-10 mt-12 ${hero.mobileAlign === 'left' ? 'justify-start' : hero.mobileAlign === 'right' ? 'justify-end' : 'justify-center'} ${hero.desktopAlign === 'center' ? 'md:justify-center' : hero.desktopAlign === 'right' ? 'md:justify-end' : 'md:justify-start'}`}>
            <Link to="/portfolio" className="w-full md:w-auto bg-sand text-sage px-10 py-4 text-[10px] font-sans tracking-[0.3em] uppercase hover:bg-bone transition-all duration-500 shadow-xl text-center">
              {hero.primaryCta}
            </Link>
            <Link to="/about" className="w-full md:w-auto border border-white/30 text-bone px-10 py-4 text-[10px] font-sans tracking-[0.3em] uppercase hover:bg-white hover:text-sage transition-all duration-500 text-center">
              {hero.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

