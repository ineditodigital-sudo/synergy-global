import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, CheckCircle, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../content/context.js';
import { isPreviewFrame } from '../lib/preview.js';
import { resolveRoute, propertyPath, propertyPlace } from '../content/site.js';
import Paragraphs from '../components/ui/Paragraphs.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import SmartLink from '../components/ui/SmartLink.jsx';
import NotFound from './NotFound.jsx';

const FACTS = [
  ['beds', 'Bedrooms'],
  ['baths', 'Bathrooms'],
  ['sqft', 'Interior Sq. Ft.'],
  ['lotSize', 'Lot Size'],
  ['yearBuilt', 'Year Built'],
  ['parking', 'Parking'],
  ['type', 'Property Type'],
  ['status', 'Status'],
];

export default function PropertyDetail() {
  const { slug } = useParams();
  const content = useContent();
  const route = resolveRoute(content, `/portfolio/${slug}`, { includeHidden: isPreviewFrame() });
  const [photoState, setPhotoState] = useState({ slug, index: 0 });

  if (route.type !== 'property') return <NotFound />;
  const p = route.item;
  const d = content.portfolio.detail;
  const photos = p.images.filter((i) => i.src);
  const photo = photoState.slug === slug ? Math.min(photoState.index, Math.max(photos.length - 1, 0)) : 0;
  const setPhoto = (index) => setPhotoState({ slug, index });
  const facts = FACTS.filter(([k]) => p[k]);
  const list = content.portfolio.items.filter((x) => x.visible);
  const idx = list.findIndex((x) => x.id === p.id);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const current = photos[photo];

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <nav className="mb-12 pt-8" aria-label="Breadcrumb">
          <Link to="/portfolio" className="inline-flex items-center gap-3 text-sand hover:text-sage transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase">Back to Properties</span>
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {p.status && <span className="px-4 py-1 bg-sand text-sage text-[9px] tracking-[0.2em] uppercase">{p.status}</span>}
              {p.type && <span className="px-4 py-1 border border-sand/30 text-sand text-[9px] tracking-[0.2em] uppercase">{p.type}</span>}
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sage mb-8 leading-tight">{p.title}</h1>
            <p className="flex items-center gap-3 text-sand mb-12">
              <MapPin size={18} aria-hidden="true" />
              <span className="font-sans text-lg tracking-widest uppercase">
                {propertyPlace(p)}
                {p.postalCode ? ` ${p.postalCode}` : ''}
              </span>
            </p>
            {p.summary && <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-sage/60 mb-8">{p.summary}</p>}
            {p.price && (
              <div className="mb-12">
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand block mb-2">Price</span>
                <span className="font-heading text-4xl text-sage">{p.price}</span>
              </div>
            )}
            {d.inquireLabel && (
              <SmartLink
                to={d.inquireLink || '/contact'}
                className="inline-block bg-charcoal text-bone px-12 py-5 font-sans text-[10px] tracking-[0.4em] uppercase hover:bg-sand transition-all duration-500"
              >
                {d.inquireLabel}
              </SmartLink>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden shadow-2xl bg-sand/10">
              <SmartImage
                src={current?.src}
                alt={current?.alt || p.title}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                preferred={1280}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-[24px] border-bone/10 pointer-events-none" />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setPhoto((photo - 1 + photos.length) % photos.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bone/80 text-sage flex items-center justify-center hover:bg-bone"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhoto((photo + 1) % photos.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bone/80 text-sage flex items-center justify-center hover:bg-bone"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <span className="absolute bottom-4 right-4 bg-charcoal/70 text-bone font-sans text-[10px] tracking-widest px-3 py-1">
                    {photo + 1} / {photos.length}
                  </span>
                </>
              )}
            </div>
            {photos.length > 1 && (
              <ul className="grid grid-cols-5 gap-3 mt-4">
                {photos.map((img, i) => (
                  <li key={img.id}>
                    <button
                      type="button"
                      onClick={() => setPhoto(i)}
                      aria-label={`Show photo ${i + 1}`}
                      aria-current={i === photo || undefined}
                      className={`block w-full aspect-square overflow-hidden border-2 transition-colors ${i === photo ? 'border-sand' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <SmartImage src={img.src} alt="" sizes="120px" preferred={640} className="w-full h-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {facts.length > 0 && (
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-24 border-y border-sand/20 py-16">
            {facts.map(([k, label]) => (
              <div key={k}>
                <dt className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand mb-3">{label}</dt>
                <dd className="font-heading text-xl text-sage">{p[k]}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
          <div>
            {p.description && (
              <>
                <h2 className="font-heading text-3xl md:text-4xl text-sage mb-8">About This Property</h2>
                <Paragraphs text={p.description} className="font-body text-xl text-sage/70 leading-relaxed mb-6" />
              </>
            )}
            {p.features.length > 0 && (
              <>
                <h2 className="font-heading text-3xl md:text-4xl text-sage mb-10 mt-12">
                  Features & <span className="italic">Amenities</span>
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-4">
                      <CheckCircle size={18} className="text-sand shrink-0" aria-hidden="true" />
                      <span className="font-sans text-sm text-sage/80 tracking-wide">{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {(d.boxTitle || d.boxText) && (
            <aside className="bg-sand/5 p-12 border border-sand/20 flex flex-col justify-center self-start">
              <Shield size={48} className="text-sand mb-8" aria-hidden="true" />
              {d.boxTitle && <h2 className="font-heading text-2xl text-sage mb-6 uppercase tracking-tight">{d.boxTitle}</h2>}
              {d.boxText && <p className="font-body text-sage/60 leading-relaxed mb-8">{d.boxText}</p>}
              {d.boxButtonLabel && (
                <SmartLink
                  to={d.boxButtonLink || '/contact'}
                  className="text-sand font-sans text-[10px] tracking-[0.3em] uppercase border-b border-sand pb-2 self-start hover:text-sage hover:border-sage transition-all"
                >
                  {d.boxButtonLabel}
                </SmartLink>
              )}
            </aside>
          )}
        </div>

        {(prev || next) && (
          <nav className="border-t border-sand/20 pt-16 flex justify-between items-center gap-6" aria-label="More properties">
            {prev ? (
              <Link to={propertyPath(prev)} className="group flex flex-col items-start">
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand mb-2">Previous Property</span>
                <span className="font-heading text-xl text-sage group-hover:text-sand transition-colors">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={propertyPath(next)} className="group flex flex-col items-end text-right">
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand mb-2">Next Property</span>
                <span className="font-heading text-xl text-sage group-hover:text-sand transition-colors">{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
