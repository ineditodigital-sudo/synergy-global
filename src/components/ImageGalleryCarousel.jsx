import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../content/context.js';
import { reducedMotion } from '../lib/gsap.js';
import SmartImage from './ui/SmartImage.jsx';

const SPEED = 0.6; // px per frame: gentle auto-scroll drift

export default function ImageGalleryCarousel({ title }) {
  const { gallery } = useContent();
  const images = gallery.images.filter((img) => img.visible !== false && img.src);
  const count = images.length;

  const [openIndex, setOpenIndex] = useState(-1);
  const scrollRef = useRef(null);
  const posRef = useRef(0);
  const halfRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimer = useRef(null);
  const draggedRef = useRef(false);

  const close = () => setOpenIndex(-1);
  const next = () => setOpenIndex((i) => (i + 1) % count);
  const prev = () => setOpenIndex((i) => (i - 1 + count) % count);
  const isOpen = openIndex >= 0;

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenIndex(-1);
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i + 1) % count);
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, count]);

  // Auto-scroll on a native scroll container, so it stays swipeable on touch.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || count === 0 || reducedMotion()) return undefined;
    const measure = () => {
      halfRef.current = el.scrollWidth / 2;
    };
    measure();
    let raf;
    const tick = () => {
      if (!pausedRef.current && document.visibilityState === 'visible') {
        posRef.current += SPEED;
        const h = halfRef.current;
        if (h > 0 && posRef.current >= h) posRef.current -= h;
        el.scrollLeft = posRef.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => {
      pausedRef.current = true;
      clearTimeout(resumeTimer.current);
    };
    const resumeSoon = () => {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        const h = halfRef.current;
        posRef.current = h > 0 ? el.scrollLeft % h : el.scrollLeft;
        pausedRef.current = false;
      }, 1500);
    };
    const onTouchStart = () => {
      pause();
      draggedRef.current = false;
    };
    const onTouchMove = () => {
      draggedRef.current = true;
    };
    const onWheel = () => {
      pause();
      resumeSoon();
    };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resumeSoon);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resumeSoon);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', resumeSoon, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('resize', measure);
    const imgs = el.querySelectorAll('img');
    imgs.forEach((img) => img.addEventListener('load', measure));
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer.current);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resumeSoon);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resumeSoon);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', resumeSoon);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', measure);
      imgs.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [count]);

  const nudge = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    pausedRef.current = true;
    clearTimeout(resumeTimer.current);
    el.scrollBy({ left: direction * 416, behavior: 'smooth' });
    resumeTimer.current = setTimeout(() => {
      const h = halfRef.current;
      posRef.current = h > 0 ? el.scrollLeft % h : el.scrollLeft;
      pausedRef.current = false;
    }, 1500);
  };

  if (!count) return null;
  const doubled = [...images, ...images];
  const current = images[openIndex];

  return (
    <section className="py-24 bg-bone overflow-hidden" aria-label={title || 'Gallery'}>
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          {title && <h2 className="font-heading italic text-4xl md:text-5xl text-sage mb-4">{title}</h2>}
          <div className="w-12 h-px bg-sand" />
        </div>
        <div className="hidden md:flex gap-3">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Previous images"
            className="w-12 h-12 rounded-full border border-sand/40 flex items-center justify-center text-sage hover:bg-sage hover:text-bone transition-all duration-300"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Next images"
            className="w-12 h-12 rounded-full border border-sand/40 flex items-center justify-center text-sage hover:bg-sage hover:text-bone transition-all duration-300"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="w-full overflow-x-auto touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max">
          {doubled.map((img, index) => {
            const real = index % count;
            const duplicate = index >= count;
            return (
              <li key={`${img.id}-${index}`} className="flex-none px-2" aria-hidden={duplicate || undefined}>
                <button
                  type="button"
                  tabIndex={duplicate ? -1 : 0}
                  onClick={() => {
                    if (draggedRef.current) {
                      draggedRef.current = false;
                      return;
                    }
                    setOpenIndex(real);
                  }}
                  className="block w-[300px] h-[300px] md:w-[400px] md:h-[400px] overflow-hidden rounded shadow-sm border border-sand/20 group cursor-pointer"
                  aria-label={`Open photo ${real + 1}${img.caption ? `: ${img.caption}` : ''}`}
                >
                  <SmartImage
                    src={img.src}
                    alt={img.caption || `${title || 'Gallery'} photo ${real + 1}`}
                    sizes="(min-width: 768px) 400px, 300px"
                    preferred={640}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable="false"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/95 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || `Photo ${openIndex + 1} of ${count}`}
          onClick={close}
        >
          <button type="button" className="absolute top-6 right-6 text-white hover:text-sand transition-colors z-50" onClick={close} aria-label="Close">
            <X size={32} />
          </button>
          {count > 1 && (
            <button
              type="button"
              className="absolute left-2 md:left-12 text-white hover:text-sand transition-colors z-50 p-2"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>
          )}
          <figure className="relative z-40 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <SmartImage
              src={current.src}
              alt={current.caption || `Photo ${openIndex + 1}`}
              sizes="90vw"
              preferred={1920}
              priority
              className="max-w-[90vw] max-h-[85vh] object-contain rounded shadow-2xl"
            />
            {current.caption && <figcaption className="mt-4 text-bone/80 font-sans text-sm text-center max-w-2xl">{current.caption}</figcaption>}
          </figure>
          {count > 1 && (
            <button
              type="button"
              className="absolute right-2 md:right-12 text-white hover:text-sand transition-colors z-50 p-2"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
