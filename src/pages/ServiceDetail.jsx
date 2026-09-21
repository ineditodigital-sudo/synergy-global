import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, MoveRight } from 'lucide-react';
import { useContent } from '../content/context.js';
import { isPreviewFrame } from '../lib/preview.js';
import { resolveRoute } from '../content/site.js';
import { gsap, reducedMotion } from '../lib/gsap.js';
import PageHero from '../components/PageHero.jsx';
import Highlight from '../components/ui/Highlight.jsx';
import Icon from '../components/ui/Icon.jsx';
import Paragraphs from '../components/ui/Paragraphs.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import SmartLink from '../components/ui/SmartLink.jsx';
import NotFound from './NotFound.jsx';

export default function ServiceDetail() {
  const { slug } = useParams();
  const content = useContent();
  const route = resolveRoute(content, `/services/${slug}`, { includeHidden: isPreviewFrame() });
  const service = route.type === 'service' ? route.item : null;
  const ref = useRef(null);

  useEffect(() => {
    if (!service || reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.animate-up').forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
      });
    }, ref);
    return () => ctx.revert();
  }, [service]);

  if (!service) return <NotFound />;
  const d = service.detail;
  const caps = d.capabilities.filter((c) => c.title || c.desc);
  const highlights = d.highlights.filter(Boolean);
  const withSideImage = Boolean(d.sideImage);

  const intro = (d.introTitle || d.introText || highlights.length > 0) && (
    <div className="animate-up">
      {d.introBadge && <h2 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-8">{d.introBadge}</h2>}
      {d.introTitle && (
        <p className="font-heading text-4xl text-sage leading-tight mb-8">
          <Highlight text={d.introTitle} highlight={d.introHighlight} />
        </p>
      )}
      <Paragraphs text={d.introText} className="font-sans font-light text-lg text-sage/70 leading-relaxed mb-8" />
      {highlights.length > 0 && (
        <ul className={withSideImage ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-4'}>
          {highlights.map((h) => (
            <li
              key={h}
              className={`flex items-center gap-3 font-sans tracking-widest uppercase ${withSideImage ? 'text-[10px] text-sage/80 border-b border-sand/10 pb-4' : 'text-sm text-sage/60'}`}
            >
              <CheckCircle2 size={16} className="text-sand shrink-0" aria-hidden="true" /> {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const capabilityGrid = caps.length > 0 && (
    <ul className={`grid grid-cols-1 md:grid-cols-2 gap-8 animate-up ${withSideImage ? 'lg:grid-cols-4' : ''}`}>
      {caps.map((c) => (
        <li
          key={c.id}
          className={
            withSideImage
              ? 'p-10 border border-sand/20 hover:bg-charcoal hover:text-white transition-all duration-700 group h-full'
              : 'p-10 bg-white border border-sand/10 shadow-sm hover:shadow-xl transition-all duration-500'
          }
        >
          <div className="text-sand mb-6">
            <Icon name={c.icon} size={24} />
          </div>
          <h3 className="font-heading text-xl mb-4">{c.title}</h3>
          <p className="font-sans font-light text-sm opacity-70 leading-relaxed">{c.desc}</p>
        </li>
      ))}
    </ul>
  );

  const sectionHeading = d.sectionTitle && (
    <div className="max-w-7xl mx-auto mb-20 animate-up">
      {d.sectionBadge && <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-6">{d.sectionBadge}</p>}
      <h2 className="font-heading text-4xl md:text-5xl text-sage">
        <Highlight text={d.sectionTitle} highlight={d.sectionHighlight} />
      </h2>
    </div>
  );

  return (
    <div ref={ref} className="bg-bone min-h-screen text-sage">
      <PageHero tag={d.heroTag} title={d.heroTitle || service.title} accent={d.heroTitleAccent} quote={d.heroQuote} image={d.heroImage || service.image} />

      {withSideImage ? (
        <>
          {intro && (
            <section className="py-32 px-6 md:px-16 bg-white">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                {intro}
                <div className="relative aspect-[4/5] overflow-hidden border border-sand/20 animate-up shadow-2xl">
                  <SmartImage src={d.sideImage} alt={service.title} sizes="(min-width: 1024px) 45vw, 90vw" className="w-full h-full object-cover" />
                </div>
              </div>
            </section>
          )}
          {capabilityGrid && (
            <section className="py-32 px-6 md:px-16 bg-bone border-t border-sand/10">
              {sectionHeading}
              <div className="max-w-7xl mx-auto">{capabilityGrid}</div>
            </section>
          )}
        </>
      ) : (
        (intro || capabilityGrid) && (
          <section className="py-32 px-6 md:px-16 border-b border-sand/10">
            {sectionHeading}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
              {intro || <div />}
              {capabilityGrid}
            </div>
          </section>
        )
      )}

      {(d.ctaTitle || d.ctaLabel) && (
        <section className="py-32 bg-charcoal text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-sand/5 -skew-x-12 translate-x-1/2" />
          <div className="max-w-4xl mx-auto px-6 text-center animate-up relative z-10">
            {d.ctaTitle && <h2 className="font-heading text-4xl md:text-5xl mb-8">{d.ctaTitle}</h2>}
            {d.ctaLabel && (
              <SmartLink
                to={d.ctaLink || '/contact'}
                className="inline-flex items-center gap-4 bg-sand text-sage px-12 py-5 font-sans text-xs tracking-[0.4em] uppercase hover:bg-white transition-all"
              >
                {d.ctaLabel} <MoveRight size={18} />
              </SmartLink>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
