import { useEffect, useRef } from 'react';
import { MoveRight } from 'lucide-react';
import { useContent } from '../content/context.js';
import { servicePath } from '../content/site.js';
import { gsap, reducedMotion } from '../lib/gsap.js';
import Icon from '../components/ui/Icon.jsx';
import SmartLink from '../components/ui/SmartLink.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';

export default function Services() {
  const { services } = useContent();
  const items = services.items.filter((s) => s.visible && s.title);
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.service-card', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', clearProps: 'all' });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="pt-48 pb-32 px-6 bg-bone min-h-screen text-sage overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <header className="mb-24 text-center max-w-2xl mx-auto">
          {services.header.badge && <p className="font-sans font-light tracking-[0.4em] text-[10px] uppercase text-sand mb-6">{services.header.badge}</p>}
          <h1 className="font-heading text-4xl md:text-5xl text-sage mb-6">{services.header.title}</h1>
          {services.header.subtitle && <p className="font-sans text-xl text-sage/80 mb-8 font-light italic">{services.header.subtitle}</p>}
          <div className="w-12 h-px bg-sand mx-auto" />
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((s) => (
            <li
              key={s.id}
              className="service-card group bg-white border border-sand/10 p-8 flex flex-col h-full hover:bg-charcoal transition-all duration-700 ease-in-out shadow-sm hover:shadow-2xl"
            >
              <div className="mb-8">
                <div className="w-10 h-10 mb-6 bg-sand/10 flex items-center justify-center text-sand border border-sand/20 group-hover:bg-sand group-hover:text-charcoal transition-all duration-500">
                  <Icon name={s.icon} size={20} />
                </div>
                <h2 className="font-heading text-3xl text-sage group-hover:text-white transition-colors duration-500 mb-2">{s.title}</h2>
                {s.summary && (
                  <p className="font-sans font-light text-sm text-sage/80 group-hover:text-bone/80 transition-colors duration-500 leading-relaxed mb-8">{s.summary}</p>
                )}
                <SmartLink
                  to={servicePath(s)}
                  className="inline-flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-sand hover:text-white transition-colors group/btn"
                  aria-label={`${services.cardButtonLabel || 'Learn More'}: ${s.title}`}
                >
                  {services.cardButtonLabel || 'Learn More'} <MoveRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                </SmartLink>
              </div>
              <div className="relative mt-auto aspect-[16/10] overflow-hidden rounded-sm bg-bone border border-sand/20">
                <SmartImage
                  src={s.image}
                  alt={s.title}
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw"
                  preferred={640}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-sand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
