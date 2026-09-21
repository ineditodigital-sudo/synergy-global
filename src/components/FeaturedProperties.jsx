import { useEffect, useRef } from 'react';
import { useContent } from '../content/context.js';
import { propertyPath, propertyPlace } from '../content/site.js';
import { gsap, reducedMotion } from '../lib/gsap.js';
import SmartLink from './ui/SmartLink.jsx';
import SmartImage from './ui/SmartImage.jsx';

/** Full-screen stacked cards for the properties marked "Featured on home". */
export default function FeaturedProperties() {
  const { home, portfolio } = useContent();
  const visible = portfolio.items.filter((p) => p.visible);
  const featured = visible.filter((p) => p.featured);
  const items = (featured.length ? featured : visible).slice(0, 6);
  const container = useRef(null);
  const cards = useRef([]);
  const key = items.map((p) => p.id).join('|');

  useEffect(() => {
    if (reducedMotion() || items.length < 2) return undefined;
    const ctx = gsap.context(() => {
      cards.current.forEach((card, i) => {
        const prev = cards.current[i - 1];
        if (!card || !prev) return;
        gsap.to(prev, {
          scale: 0.98,
          opacity: 0.3,
          ease: 'power1.inOut',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'top top', scrub: true },
        });
      });
    }, container);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the list changes
  }, [key]);

  if (!home.featured.visible || !items.length) return null;

  return (
    <section ref={container} id="featured-properties" aria-label="Featured properties" className="relative w-full bg-charcoal border-b border-sand/30">
      {items.map((item, index) => {
        const details = [item.beds && `${item.beds} BD`, item.baths && `${item.baths} BA`, item.sqft && `${item.sqft} Sq. Ft.`].filter(Boolean);
        const line = details.length ? details : item.summary.split('·').map((s) => s.trim()).filter(Boolean);
        return (
          <article
            key={item.id}
            ref={(el) => {
              cards.current[index] = el;
            }}
            className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden"
            style={{ zIndex: index }}
          >
            <SmartImage
              src={item.images[0]?.src}
              alt={item.images[0]?.alt || item.title}
              sizes="100vw"
              preferred={1920}
              className="absolute inset-0 w-full h-full object-cover"
              placeholderClassName="bg-charcoal"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/90" />
            <div className="absolute inset-8 md:inset-16 border border-white/10 pointer-events-none" />

            {item.status && (
              <div className="absolute top-12 md:top-24 left-12 md:left-24 z-20">
                <span className="bg-sand text-sage text-[8px] md:text-[10px] font-sans tracking-[0.3em] uppercase px-4 py-2">{item.status}</span>
              </div>
            )}

            <div className="relative z-10 text-center text-bone px-4 md:px-6 max-w-4xl flex flex-col items-center">
              <SmartLink to={propertyPath(item)} className="group">
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4 tracking-wide leading-tight group-hover:text-sand transition-colors">
                  {item.title}
                </h2>
              </SmartLink>
              <p className="font-sans font-light tracking-[0.3em] text-[10px] md:text-sm uppercase text-sand mb-8">{propertyPlace(item)}</p>
              {line.length > 0 && (
                <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 gap-y-2 font-sans text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-bone/60 border-t border-b border-white/10 py-6">
                  {line.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              )}
              <SmartLink
                to={propertyPath(item)}
                className="mt-12 px-8 py-3 border border-sand/50 text-[9px] font-sans tracking-[0.3em] uppercase text-sand hover:bg-sand hover:text-charcoal transition-all duration-500"
              >
                {home.featured.buttonLabel || 'View Property'}
              </SmartLink>
            </div>
          </article>
        );
      })}
    </section>
  );
}
