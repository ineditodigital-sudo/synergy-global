import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../content/context.js';
import { reducedMotion } from '../lib/gsap.js';
import SmartImage from '../components/ui/SmartImage.jsx';
import Paragraphs from '../components/ui/Paragraphs.jsx';

const ITEM_WIDTH = 332; // 300px card + 32px gap
const SPEED = 0.6;

function PartnerCard({ partner, label }) {
  const body = partner.logo ? (
    <div className="w-[300px] h-[160px] flex items-center justify-center p-8 bg-white border border-sand/20 rounded shadow-sm hover:border-sand/50 transition-all duration-500">
      <SmartImage
        src={partner.logo}
        alt={partner.name}
        sizes="240px"
        preferred={600}
        className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
        placeholderClassName="bg-transparent"
      />
    </div>
  ) : (
    <div className="w-[300px] h-[160px] flex flex-col items-center justify-center p-6 bg-white border border-sand/20 rounded shadow-sm hover:border-sand/50 transition-all duration-500 text-center">
      <div className="w-8 h-px bg-sand/40 mb-4" />
      <h3 className="font-heading text-sm uppercase tracking-wider text-sage mb-2 leading-tight px-2">{partner.name}</h3>
      {label && <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-sand font-medium">{label}</p>}
    </div>
  );
  if (/^https?:\/\//i.test(partner.url)) {
    return (
      <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={partner.name}>
        {body}
      </a>
    );
  }
  return body;
}

export default function Partnerships() {
  const { partnerships: p } = useContent();
  const partners = p.items.filter((x) => x.visible && (x.name || x.logo));
  const count = partners.length;
  const track = useRef(null);
  const pos = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    if (!count || reducedMotion()) return undefined;
    const total = ITEM_WIDTH * count;
    let raf;
    const animate = () => {
      if (!paused.current && document.visibilityState === 'visible') {
        pos.current -= SPEED;
        if (Math.abs(pos.current) >= total) pos.current += total;
      }
      if (track.current) track.current.style.transform = `translateX(${pos.current}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  const nudge = (direction) => {
    const total = ITEM_WIDTH * count;
    const start = pos.current;
    const end = start + direction * ITEM_WIDTH;
    const t0 = performance.now();
    paused.current = true;
    const step = (now) => {
      const k = Math.min((now - t0) / 400, 1);
      const ease = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      pos.current = start + (end - start) * ease;
      if (Math.abs(pos.current) >= total) pos.current += total;
      if (pos.current > 0) pos.current -= total;
      if (track.current) track.current.style.transform = `translateX(${pos.current}px)`;
      if (k < 1) requestAnimationFrame(step);
      else paused.current = false;
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="pt-40 pb-32 bg-bone text-sage min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-4xl">
          <h1 className="font-heading italic text-5xl md:text-6xl mb-12">{p.header.title}</h1>
          <Paragraphs text={p.header.intro} className="font-sans font-light text-xl md:text-2xl leading-relaxed text-sage/80 mb-12" />
          {p.header.callout && (
            <div className="bg-sand/10 border-l-2 border-sand p-8">
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-sand font-medium">{p.header.callout}</p>
            </div>
          )}
          {p.header.listIntro && count > 0 && <p className="font-sans font-light text-xl mt-12 text-sage/80 italic">{p.header.listIntro}</p>}
        </div>
      </div>

      {count > 0 && (
        <div className="w-full relative py-8 border-y border-sand/20 bg-bone">
          <h2 className="sr-only">Strategic partners</h2>
          {count > 1 && (
            <div className="max-w-7xl mx-auto px-6 mb-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => nudge(1)}
                aria-label="Previous partners"
                className="w-10 h-10 rounded-full border border-sand/40 flex items-center justify-center text-sage hover:bg-sage hover:text-bone transition-all duration-300"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => nudge(-1)}
                aria-label="Next partners"
                className="w-10 h-10 rounded-full border border-sand/40 flex items-center justify-center text-sage hover:bg-sage hover:text-bone transition-all duration-300"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          )}
          <div
            className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]"
            onMouseEnter={() => {
              paused.current = true;
            }}
            onMouseLeave={() => {
              paused.current = false;
            }}
          >
            <ul ref={track} className="flex will-change-transform">
              {[...partners, ...partners].map((partner, i) => (
                <li key={`${partner.id}-${i}`} className="flex-none mx-4" aria-hidden={i >= count || undefined}>
                  <PartnerCard partner={partner} label={p.cardLabel} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
