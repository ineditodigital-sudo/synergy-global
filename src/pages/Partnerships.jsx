import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Partnerships() {
  const containerRef = useRef(null);

  const partners = [
    "Intelink Law Group, PC",
    "DOOTS International",
    "VEM2",
    "California Hispanic Chambers of Commerce",
    "Canada U.S. Mexico Chamber o International Trade (“CUSMEX”)",
    "ABM Consulting",
    "Javier Madera Consulting",
    "Our Billion Ventures"
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.partner-item', {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power1.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-40 pb-32 px-6 min-h-screen bg-bone text-sage">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 max-w-4xl">
          <h1 className="font-heading italic text-5xl md:text-6xl mb-12">Key Partnerships & Collaboration</h1>
          <p className="font-sans font-light text-xl md:text-2xl leading-relaxed text-sage/80 mb-12 text-justify">
            Synergy Global proudly partners and collaborates with key companies and professional associations to enhance the menu of service options for our clients in a wholistic approach. If our team is not able to address and oversee your immediate or long-term business or personal needs, we will refer you to our extensive network of service providers at no cost to you.
          </p>
          <div className="bg-sand/10 border-l-2 border-sand p-8">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-sand font-medium">
              Our strategic alliances are thoroughly vetted to ensure that our clients are in a safe space and served with the highest level of expertise, professionalism, and ethical standards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="partner-item elegant-panel p-10 flex flex-col items-center justify-center text-center group hover:bg-sage hover:text-bone transition-all duration-700"
            >
              <div className="w-12 h-px bg-sand group-hover:bg-sand/30 mb-8 transition-colors"></div>
              <h3 className="font-body text-2xl md:text-3xl mb-4 leading-tight">{partner}</h3>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase opacity-40 group-hover:opacity-60 transition-opacity">Strategic Ally</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
