import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { useContent } from '../context/ContentContext';

const DEFAULT_METRICS = [
  { label: 'Total AUM', value: '$2.4B' },
  { label: 'Track Record', value: '15+' },
  { label: 'Projects', value: '450+' },
  { label: 'Markets', value: '12' }
];

// Self-contained count-up: pure React + requestAnimationFrame.
// Re-counts whenever the target changes and ALWAYS ends exactly on target.
function StatNumber({ stat }) {
  const raw = String(stat.value ?? '');
  const prefix = raw.startsWith('$') ? '$' : '';
  const suffix = raw.endsWith('B') ? 'B' : (stat.suffix || '');
  const num = raw.replace(/[^0-9.]/g, '');
  const target = parseFloat(num) || 0;
  const decimals = (num.split('.')[1] || '').length;
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf;
    let startT = null;
    const duration = 1400;
    const step = (t) => {
      if (startT === null) startT = t;
      const p = Math.min((t - startT) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 2);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else setN(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <span className="font-display text-6xl md:text-6xl text-sage mb-4 block">
      {prefix + n.toFixed(decimals) + suffix}
    </span>
  );
}

export default function TrackRecord() {
  const { content } = useContent();
  const metrics = content.home?.metrics || { items: DEFAULT_METRICS };
  const stats = metrics.items || [];
  const sectionRef = useRef(null);
  const statsKey = JSON.stringify(stats);

  // Entrance fade only (opacity/position). clearProps hands control back to React.
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.selector(sectionRef.current)('.stat-item'), {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [statsKey]);

  return (
    <section ref={sectionRef} className="py-24 bg-bone border-y border-sand/20">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-14 md:gap-x-28">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item text-center flex flex-col items-center min-w-[130px]">
              <StatNumber stat={stat} />
              <span className="font-sans font-light tracking-[0.2em] text-[10px] md:text-xs uppercase text-sand text-center max-w-[150px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
