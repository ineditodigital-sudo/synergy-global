import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const ITEM_WIDTH = 332; // 300px card + 32px gap (mx-4 = 16px each side)
const SPEED = 0.6; // px per frame

export default function Partnerships() {
  const partners = [
    { name: "Intelink Law Group, PC", image: "/partners/intelink.png" },
    { name: "DOOTS International", image: "/partners/DOOTERS-LOGO.png" },
    { name: "VEM2", image: null },
    { name: "California Hispanic Chambers of Commerce", image: "/partners/california-hispanic-chambers-of-commerce.png" },
    { name: "Canada U.S. Mexico Chamber of International Trade (“CUSMEX”)", image: "/partners/CUSMEX.png" },
    { name: "ABM Consulting", image: null },
    { name: "Javier Madera Consulting", image: null },
    { name: "Our Billion Ventures", image: "/partners/logo-obv.png" }
  ];

  const trackRef = useRef(null);
  const posRef = useRef(0);          // Current X position (negative = moved left)
  const isPausedRef = useRef(false); // Paused on hover
  const rafRef = useRef(null);

  // Main animation loop
  useEffect(() => {
    const totalWidth = ITEM_WIDTH * partners.length;

    const animate = () => {
      if (!isPausedRef.current) {
        posRef.current -= SPEED;
        // Seamless infinite loop: reset when we've scrolled one full set
        if (Math.abs(posRef.current) >= totalWidth) {
          posRef.current += totalWidth;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [partners.length]);

  // Arrow navigation: shift position smoothly
  const navigate = (direction) => {
    const shift = direction * ITEM_WIDTH;
    const totalWidth = ITEM_WIDTH * partners.length;
    const start = posRef.current;
    const end = start + shift;
    const duration = 400; // ms
    const startTime = performance.now();

    isPausedRef.current = true;

    const animateSlide = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease in-out
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      posRef.current = start + (end - start) * ease;

      // Keep within bounds for seamless loop
      if (Math.abs(posRef.current) >= totalWidth) posRef.current += totalWidth;
      if (posRef.current > 0) posRef.current -= totalWidth;

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateSlide);
      } else {
        isPausedRef.current = false;
      }
    };

    requestAnimationFrame(animateSlide);
  };

  // Double partners array for infinite ticker effect
  const doubledPartners = [...partners, ...partners];

  return (
    <div className="pt-40 pb-32 bg-bone text-sage min-h-screen overflow-hidden">
      <SEO 
        title="Key Partnerships and Collaboration" 
        description="Our strategic alliances are thoroughly vetted to ensure that our clients are served with the highest level of expertise, professionalism, and ethical standards." 
      />
      
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-4xl">
          <h1 className="font-heading italic text-5xl md:text-6xl mb-12">Key Partnerships & Collaboration</h1>
          <p className="font-sans font-light text-xl md:text-2xl leading-relaxed text-sage/80 mb-12 text-justify">
            Synergy Global proudly partners and collaborates with key companies and professional associations to enhance the menu of service options for our clients in a wholistic approach. If our team is not able to address and oversee your immediate or long-term business or personal needs, we will refer you to our extensive network of service providers at no cost to you.
          </p>
          <div className="bg-sand/10 border-l-2 border-sand p-8">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-sand font-medium">
              Our strategic alliances are thoroughly vetted to ensure that our clients are in a safe space and served with the highest level of expertise, professionalism, and ethical standards.
            </p>
          </div>
          <p className="font-sans font-light text-xl mt-12 text-sage/80 italic">
            The following are highlights of some of our strategic partners:
          </p>
        </div>
      </div>

      {/* Ticker Section */}
      <div className="w-full relative py-8 border-y border-sand/20 bg-bone">
        {/* Navigation Buttons */}
        <div className="max-w-7xl mx-auto px-6 mb-6 flex justify-end gap-3">
          <button
            onClick={() => navigate(1)}
            aria-label="Previous partners"
            className="w-10 h-10 rounded-full border border-sand/40 flex items-center justify-center text-sage hover:bg-sage hover:text-bone transition-all duration-300 z-10"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => navigate(-1)}
            aria-label="Next partners"
            className="w-10 h-10 rounded-full border border-sand/40 flex items-center justify-center text-sage hover:bg-sage hover:text-bone transition-all duration-300 z-10"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Carousel Track */}
        <div
          className="w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
        >
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ transform: 'translateX(0px)' }}
          >
            {doubledPartners.map((partner, index) => (
              <div
                key={index}
                className="flex-none mx-4"
              >
                {partner.image ? (
                  <div className="w-[300px] h-[160px] flex items-center justify-center p-8 bg-white border border-sand/20 rounded shadow-sm hover:border-sand/50 transition-all duration-500 group">
                    <img 
                      src={partner.image} 
                      alt={partner.name} 
                      className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 group-hover:scale-102 transition-all duration-500" 
                    />
                  </div>
                ) : (
                  <div className="w-[300px] h-[160px] flex flex-col items-center justify-center p-6 bg-white border border-sand/20 rounded shadow-sm hover:border-sand/50 transition-all duration-500 text-center">
                    <div className="w-8 h-px bg-sand/40 mb-4"></div>
                    <h3 className="font-heading text-sm uppercase tracking-wider text-sage mb-2 leading-tight px-2">
                      {partner.name}
                    </h3>
                    <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-sand font-medium">
                      Strategic Ally
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
