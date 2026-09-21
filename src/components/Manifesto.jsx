import { useEffect, useRef } from 'react';
import { useContent } from '../content/context.js';
import { gsap, reducedMotion } from '../lib/gsap.js';

const Words = ({ text }) =>
  String(text || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => (
      <span key={i} className="manifesto-word inline-block">
        {w}&nbsp;
      </span>
    ));

export default function Manifesto() {
  const { home, style } = useContent();
  const m = home.manifesto;
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.manifesto-word', {
        opacity: 0,
        y: 15,
        duration: 1.2,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });
    }, ref);
    return () => ctx.revert();
  }, [m.title, m.subtitle]);

  if (!m.visible || (!m.title && !m.subtitle)) return null;
  return (
    <section ref={ref} className="relative w-full py-24 md:py-48 px-4 md:px-16 bg-bone text-sage overflow-hidden border-y border-sand/20">
      <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left flex flex-col items-center md:items-start">
        <div className="w-12 h-px bg-sand mb-8 md:mb-12" />
        {m.title && (
          <h2 className="font-sans font-light text-xl md:text-4xl lg:text-5xl mb-8 md:mb-12 leading-relaxed text-sand">
            <Words text={m.title} />
          </h2>
        )}
        {m.subtitle && (
          <p className="font-heading italic leading-tight text-sage" style={{ fontSize: `${style.manifestoTextSize}px` }}>
            <Words text={m.subtitle} />
          </p>
        )}
      </div>
    </section>
  );
}
