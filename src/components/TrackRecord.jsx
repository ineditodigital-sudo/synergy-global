import { useEffect, useRef, useState } from 'react';
import { useContent } from '../content/context.js';
import { reducedMotion } from '../lib/gsap.js';

/** Counts up to the number once the section scrolls into view. */
function StatNumber({ stat, start }) {
  const raw = String(stat.value ?? '').trim();
  const numeric = /^[\d,.]+$/.test(raw);
  const target = numeric ? parseFloat(raw.replace(/,/g, '')) || 0 : 0;
  const decimals = numeric ? (raw.split('.')[1] || '').length : 0;
  const [n, setN] = useState(0);
  const animate = numeric && start && !reducedMotion();

  useEffect(() => {
    if (!animate) return undefined;
    let raf;
    let t0 = null;
    const step = (t) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / 1400, 1);
      setN(target * (1 - (1 - p) ** 2));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animate, target]);

  const shown = !numeric ? raw : animate ? n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : raw;
  return (
    <span className="font-display text-6xl text-sage mb-4 block tabular-nums">
      {stat.prefix}
      {shown}
      {stat.suffix}
    </span>
  );
}

export default function TrackRecord() {
  const { home } = useContent();
  const stats = home.metrics.items.filter((s) => s.value || s.label);
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stats.length]);

  if (!home.metrics.visible || !stats.length) return null;
  return (
    <section ref={ref} className="py-24 bg-bone border-y border-sand/20" aria-label="Key figures">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-14 md:gap-x-28">
          {stats.map((stat) => (
            <li key={stat.id} className="text-center flex flex-col items-center min-w-[130px]">
              <StatNumber stat={stat} start={inView} />
              <span className="font-sans font-light tracking-[0.2em] text-[10px] md:text-xs uppercase text-sand text-center max-w-[160px]">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
