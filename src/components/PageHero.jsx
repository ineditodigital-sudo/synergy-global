import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/gsap.js';
import SmartImage from './ui/SmartImage.jsx';

/** Dark parallax hero shared by the service pages and the legal page. */
export default function PageHero({ tag, title, accent, quote, image }) {
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('.page-hero-image', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap
        .timeline()
        .from('.page-hero-tag', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' })
        .from('.page-hero-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, '-=0.4')
        .from('.page-hero-line', { scaleX: 0, duration: 1, ease: 'power3.inOut' }, '-=0.6')
        .from('.page-hero-desc', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.4');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative h-[65vh] md:h-[75vh] min-h-[480px] flex items-center justify-center overflow-hidden bg-charcoal">
      <div className="absolute inset-0 w-full h-full">
        <SmartImage
          src={image}
          alt=""
          priority
          sizes="100vw"
          preferred={1920}
          className="page-hero-image absolute inset-0 w-full h-[120%] object-cover opacity-60 scale-110"
          placeholderClassName="bg-charcoal"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 w-full text-center md:text-left pt-20 md:pt-32">
        <div className="max-w-4xl">
          {tag && <p className="page-hero-tag inline-block font-sans font-light tracking-[0.6em] text-[9px] uppercase text-sand mb-6">{tag}</p>}
          <h1 className="page-hero-title font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8">
            {title}
            {title && accent && <br />}
            {accent && <span className="italic text-sand ml-0 md:ml-16">{accent}</span>}
          </h1>
          <div className="page-hero-line w-24 h-px bg-sand/40 mb-8 origin-left mx-auto md:mx-0" />
          {quote && <p className="page-hero-desc font-sans font-light text-lg md:text-xl text-bone/60 max-w-xl leading-relaxed italic">“{quote}”</p>}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40" aria-hidden="true">
        <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-sand">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-sand to-transparent" />
      </div>
    </section>
  );
}
