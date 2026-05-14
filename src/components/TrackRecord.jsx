import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { useContent } from '../context/ContentContext';

export default function TrackRecord() {
  const { content } = useContent();
  const metrics = content.home?.metrics || {
    items: [
      { label: 'Total AUM', value: '$2.4B' },
      { label: 'Track Record', value: '15+' },
      { label: 'Projects', value: '450+' },
      { label: 'Markets', value: '12' }
    ]
  };
  const stats = metrics.items || [];
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef.current);
      
      gsap.from(q(".stat-item"), {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      const statNumbers = q(".stat-number");
      stats.forEach((stat, i) => {
        const el = statNumbers[i];
        if (!el) return;
        
        const val = parseFloat(stat.value.replace(/[^0-9.]/g, '')) || 0;
        const obj = { n: 0 };
        
        gsap.to(obj, {
          n: val,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          onUpdate: () => {
            if (!el) return;
            const prefix = stat.value.startsWith('$') ? '$' : '';
            const suffix = stat.value.endsWith('B') ? 'B' : (stat.suffix || '');
            el.innerHTML = prefix + obj.n.toFixed(i === 3 ? 1 : 0) + suffix;
          }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-bone border-y border-sand/20">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item text-center flex flex-col items-center">
              <span className="stat-number font-display text-4xl md:text-6xl text-sage mb-4 block">
                0
              </span>
              <span className="font-sans font-light tracking-[0.2em] text-[10px] md:text-xs uppercase text-sand">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
