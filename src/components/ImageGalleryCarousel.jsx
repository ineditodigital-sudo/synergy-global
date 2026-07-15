import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const SPEED = 0.6; // px per frame — gentle auto-scroll drift

export default function ImageGalleryCarousel({ title }) {
  const { content } = useContent();
  const images = (content.gallery?.images || []).filter(img => img.visible !== false).map(img => img.src);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollRef = useRef(null);
  const posRef = useRef(0);        // float scroll position we drive
  const halfRef = useRef(0);       // width of one image set
  const pausedRef = useRef(false); // paused while the user interacts
  const resumeTimer = useRef(null);
  const draggedRef = useRef(false); // true if the last touch was a swipe (so we don't open the lightbox)

  const handleImageClick = (src, index) => {
    if (draggedRef.current) { draggedRef.current = false; return; }
    setSelectedImage(src);
    setSelectedIndex(index % images.length);
    setLightboxOpen(true);
  };

  const showNextImage = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  }, [selectedIndex, images]);

  const showPrevImage = useCallback(() => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  }, [selectedIndex, images]);

  const closeLightbox = () => { setLightboxOpen(false); setSelectedImage(''); };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' && lightboxOpen) showNextImage();
      if (e.key === 'ArrowLeft' && lightboxOpen) showPrevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, showNextImage, showPrevImage]);

  // Auto-scroll marquee on a NATIVE scroll container, so it is swipeable on touch.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || images.length === 0) return;

    const measure = () => { halfRef.current = el.scrollWidth / 2; };
    measure();

    let raf;
    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        const h = halfRef.current;
        if (h > 0 && posRef.current >= h) posRef.current -= h; // seamless loop (images are doubled)
        el.scrollLeft = posRef.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => { pausedRef.current = true; clearTimeout(resumeTimer.current); };
    const resumeSoon = () => {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        const h = halfRef.current;
        posRef.current = h > 0 ? el.scrollLeft % h : el.scrollLeft;
        pausedRef.current = false;
      }, 1500);
    };
    const onTouchStart = () => { pause(); draggedRef.current = false; };
    const onTouchMove = () => { draggedRef.current = true; };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resumeSoon);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', resumeSoon, { passive: true });
    el.addEventListener('wheel', () => { pause(); resumeSoon(); }, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer.current);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resumeSoon);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', resumeSoon);
      window.removeEventListener('resize', measure);
    };
  }, [images.length]);

  // Desktop arrows: smooth scroll by roughly one image, then resume drift.
  const navigate = (direction) => {
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

  const doubledImages = [...images, ...images];

  return (
    <section className="py-24 bg-bone overflow-hidden">
      {/* Header with title and nav arrows */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-heading italic text-4xl md:text-5xl text-sage mb-4">{title}</h2>
          <div className="w-12 h-px bg-sand"></div>
        </div>

        <div className="hidden md:flex gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Previous images"
            className="w-12 h-12 rounded-full border border-sand/40 flex items-center justify-center text-sage hover:bg-sage hover:text-bone transition-all duration-300"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => navigate(1)}
            aria-label="Next images"
            className="w-12 h-12 rounded-full border border-sand/40 flex items-center justify-center text-sage hover:bg-sage hover:text-bone transition-all duration-300"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Native, swipeable scroll track — no edge gradients */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max">
          {doubledImages.map((src, index) => (
            <div
              key={index}
              className="flex-none px-2 cursor-pointer"
              onClick={() => handleImageClick(src, index)}
            >
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] overflow-hidden rounded shadow-sm border border-sand/20 group">
                <img
                  src={src}
                  alt={`Gallery image ${(index % images.length) + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-sand transition-colors z-50"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>

          <button
            className="absolute left-4 md:left-12 text-white hover:text-sand transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>

          <img
            src={selectedImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl relative z-40"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 md:right-12 text-white hover:text-sand transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); showNextImage(); }}
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        </div>
      )}
    </section>
  );
}
