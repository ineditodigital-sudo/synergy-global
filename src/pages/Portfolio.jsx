import { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useContent } from '../content/context.js';
import { propertyPath, propertyPlace } from '../content/site.js';
import Highlight from '../components/ui/Highlight.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import SmartLink from '../components/ui/SmartLink.jsx';

export default function Portfolio() {
  const { portfolio } = useContent();
  const properties = portfolio.items.filter((p) => p.visible && p.title);
  const types = [...new Set(properties.map((p) => p.type).filter(Boolean))];
  const [filter, setFilter] = useState('All');
  const active = filter === 'All' || types.includes(filter) ? filter : 'All';
  const shown = active === 'All' ? properties : properties.filter((p) => p.type === active);

  return (
    <div className="pt-32 pb-24">
      <section className="px-6 md:px-16 mb-20 pt-8">
        <div className="max-w-7xl mx-auto">
          {portfolio.header.badge && <p className="font-sans font-light tracking-[0.4em] text-xs uppercase text-sand mb-8">{portfolio.header.badge}</p>}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="max-w-4xl">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sage leading-tight">{portfolio.header.title}</h1>
              {portfolio.header.subtitle && <p className="font-sans font-light text-lg text-sage/70 mt-6">{portfolio.header.subtitle}</p>}
            </div>
            {types.length > 1 && (
              <div className="flex flex-wrap gap-4" role="group" aria-label="Filter by property type">
                {['All', ...types].map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFilter(f)}
                    aria-pressed={active === f}
                    className={`px-8 py-3 font-sans text-[10px] tracking-[0.3em] uppercase border transition-all duration-500 ${active === f ? 'bg-sage text-bone border-sage shadow-lg' : 'bg-transparent text-sand border-sand/30 hover:border-sage hover:text-sage'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 mb-32" aria-label="Properties">
        <ul className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {shown.map((prop) => (
            <li key={prop.id} className="group">
              <SmartLink to={propertyPath(prop)} className="block" aria-label={`${prop.title} – view details`}>
                <div className="relative aspect-[4/5] overflow-hidden mb-8 shadow-sm">
                  <SmartImage
                    src={prop.images[0]?.src}
                    alt={prop.images[0]?.alt || prop.title}
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 45vw, 90vw"
                    preferred={640}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    {prop.status && (
                      <span className="bg-sand text-sage px-4 py-2 font-sans text-[9px] tracking-[0.2em] uppercase font-medium">{prop.status}</span>
                    )}
                    {prop.type && (
                      <span className="bg-bone/90 backdrop-blur-sm px-4 py-2 border border-sand/20 font-sans text-[9px] tracking-[0.2em] uppercase text-sage font-medium">
                        {prop.type}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8">
                    <div className="bg-bone text-sage w-full py-4 font-sans text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </SmartLink>

              <div className="flex justify-between items-start gap-4 mb-4">
                <SmartLink to={propertyPath(prop)} className="block">
                  <h2 className="font-body text-3xl text-sage mb-2 group-hover:text-sand transition-colors">{prop.title}</h2>
                  <p className="flex items-center gap-2 text-sand">
                    <MapPin size={14} aria-hidden="true" />
                    <span className="font-sans text-[10px] tracking-widest uppercase">{propertyPlace(prop)}</span>
                  </p>
                </SmartLink>
                {prop.price && <p className="font-body text-xl text-sage italic text-right shrink-0 max-w-[45%]">{prop.price}</p>}
              </div>
              <div className="h-px w-full bg-sand/10 mb-4" />
              {prop.summary && <p className="font-sans text-[10px] tracking-[0.15em] text-sage/50 uppercase">{prop.summary}</p>}
            </li>
          ))}
        </ul>
        {!shown.length && (
          <p className="max-w-7xl mx-auto font-sans font-light text-lg text-sage/60">New listings are coming soon. Contact our team for off-market opportunities.</p>
        )}
      </section>

      {(portfolio.cta.title || portfolio.cta.buttonLabel) && (
        <section className="px-6 md:px-16 py-32 bg-charcoal text-bone text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
          <div className="max-w-3xl mx-auto relative z-10">
            {portfolio.cta.title && (
              <h2 className="font-heading text-4xl md:text-6xl mb-8 leading-tight">
                <Highlight text={portfolio.cta.title} highlight={portfolio.cta.highlight} className="italic text-sand" />
              </h2>
            )}
            {portfolio.cta.text && <p className="font-sans font-light text-xl text-bone/60 mb-12 leading-relaxed">{portfolio.cta.text}</p>}
            {portfolio.cta.buttonLabel && (
              <SmartLink
                to={portfolio.cta.buttonLink}
                className="inline-block bg-sand text-sage px-12 py-5 font-sans text-xs tracking-[0.4em] uppercase hover:bg-bone transition-all duration-500 shadow-xl"
              >
                {portfolio.cta.buttonLabel}
              </SmartLink>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
