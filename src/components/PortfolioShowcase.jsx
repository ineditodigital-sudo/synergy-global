import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioShowcase() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const portfolioItems = [
    {
      title: "176 Randall Street",
      location: "San Francisco, CA",
      details: "2 Townhomes | Private Elevator | 4,600 Sq. Ft.",
      status: "Active Listing",
      image: "/portfolio/prop1.jpg"
    },
    {
      title: "The Pacific Heights Residence",
      location: "Pacific Heights, San Francisco, CA",
      details: "5 BD | 6 BA | 6,800 Sq. Ft.",
      status: "Sold",
      image: "/portfolio/prop2.jpg"
    },
    {
      title: "Twin Peaks Penthouse",
      location: "Twin Peaks, San Francisco, CA",
      details: "3 BD | 4 BA | 3,200 Sq. Ft.",
      status: "Active Under Contract",
      image: "/portfolio/prop3.jpg"
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card || i === 0) return;

        const prevCard = cardsRef.current[i - 1];
        if (!prevCard) return;

        gsap.to(prevCard, {
          scale: 0.98,
          opacity: 0.3,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top top",
            scrub: true,
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="portfolio" className="relative w-full bg-charcoal border-b border-sand/30">
      {portfolioItems.map((item, index) => (
        <div 
          key={index} 
          ref={el => cardsRef.current[index] = el}
          className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden"
          style={{ zIndex: index }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${item.image}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/90"></div>

          {/* Symmetrical border frame */}
          <div className="absolute inset-8 md:inset-16 border border-white/10 pointer-events-none"></div>

          {/* Indicators */}
          <div className="absolute top-12 md:top-24 left-12 md:left-24 z-20">
            <span className="bg-sand text-sage text-[8px] md:text-[10px] font-sans tracking-[0.3em] uppercase px-4 py-2">
              {item.status}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-bone px-4 md:px-6 max-w-4xl flex flex-col items-center">
            <Link to="/portfolio" className="group">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4 tracking-wide leading-tight group-hover:text-sand transition-colors">
                {item.title}
              </h2>
            </Link>
            <p className="font-sans font-light tracking-[0.3em] text-[10px] md:text-sm uppercase text-sand mb-8">
              {item.location}
            </p>
            
            <div className="flex items-center space-x-6 md:space-x-12 font-sans text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-bone/60 border-t border-b border-white/10 py-6">
              {item.details.split('|').map((detail, dIdx) => (
                <span key={dIdx}>{detail.trim()}</span>
              ))}
            </div>

            <Link to="/portfolio" className="mt-12 px-8 py-3 border border-sand/50 text-[9px] font-sans tracking-[0.3em] uppercase text-sand hover:bg-sand hover:text-charcoal transition-all duration-500">
              View Private Listing
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
