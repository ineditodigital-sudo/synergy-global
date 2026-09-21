import { useEffect, useMemo, useRef, useState } from 'react';
import { useContent } from '../content/context.js';
import { gsap, reducedMotion } from '../lib/gsap.js';
import { videoForScreen, isVideo } from '../lib/media.js';
import SmartLink from './ui/SmartLink.jsx';
import SmartImage from './ui/SmartImage.jsx';

const ALIGN = {
  text: { left: 'text-left', center: 'text-center', right: 'text-right' },
  mdText: { left: 'md:text-left', center: 'md:text-center md:mx-auto', right: 'md:text-right md:ml-auto' },
  items: { left: 'items-start', center: 'items-center', right: 'items-end' },
  mdItems: { left: 'md:items-start', center: 'md:items-center', right: 'md:items-end' },
  justify: { left: 'justify-start', center: 'justify-center', right: 'justify-end' },
  mdJustify: { left: 'md:justify-start', center: 'md:justify-center', right: 'md:justify-end' },
};

export default function Hero() {
  const { home } = useContent();
  const hero = home.hero;
  const ref = useRef(null);
  const [videoFailed, setVideoFailed] = useState('');
  const m = ALIGN.text[hero.mobileAlign] ? hero.mobileAlign : 'center';
  const d = ALIGN.text[hero.desktopAlign] ? hero.desktopAlign : 'left';
  const src = useMemo(() => (isVideo(hero.backgroundVideo) ? videoForScreen(hero.backgroundVideo) : ''), [hero.backgroundVideo]);
  const showVideo = Boolean(src) && videoFailed !== src && !reducedMotion();

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.hero-line', { y: 60, opacity: 0, duration: 1.4, stagger: 0.18, ease: 'power4.out' });
      gsap.from('.hero-bg', { scale: 1.08, duration: 3, ease: 'power2.out' });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] w-full flex items-center overflow-hidden bg-charcoal">
      <div className="hero-bg absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80 z-10" />
        <SmartImage
          src={hero.backgroundImage}
          alt=""
          priority
          sizes="100vw"
          preferred={1920}
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
          placeholderClassName="bg-charcoal"
        />
        {showVideo && (
          <video
            key={src}
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setVideoFailed(src)}
          >
            <source src={src} type="video/mp4" onError={() => setVideoFailed(src)} />
          </video>
        )}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-20">
        <div className={`${ALIGN.text[m]} ${ALIGN.mdText[d]} max-w-3xl`}>
          <h1 className={`flex flex-col mb-8 md:mb-12 ${ALIGN.items[m]} ${ALIGN.mdItems[d]}`}>
            {hero.badge && (
              <span className="hero-line font-sans font-light tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-sm uppercase mb-4 md:mb-6 text-sand">
                {hero.badge}
              </span>
            )}
            {hero.title && <span className="hero-line font-heading text-4xl md:text-5xl leading-tight md:leading-none text-bone">{hero.title}</span>}
            {hero.subtitle && (
              <span className="hero-line font-body italic text-2xl md:text-4xl lg:text-6xl text-bone/90 mt-2">{hero.subtitle}</span>
            )}
          </h1>

          {(hero.primaryCta || hero.secondaryCta) && (
            <div className={`hero-line flex flex-col md:flex-row items-center gap-6 md:gap-10 mt-12 ${ALIGN.justify[m]} ${ALIGN.mdJustify[d]}`}>
              {hero.primaryCta && (
                <SmartLink
                  to={hero.primaryLink}
                  className="w-full md:w-auto bg-sand text-sage px-10 py-4 text-[10px] font-sans tracking-[0.3em] uppercase hover:bg-bone transition-all duration-500 shadow-xl text-center"
                >
                  {hero.primaryCta}
                </SmartLink>
              )}
              {hero.secondaryCta && (
                <SmartLink
                  to={hero.secondaryLink}
                  className="w-full md:w-auto border border-white/30 text-bone px-10 py-4 text-[10px] font-sans tracking-[0.3em] uppercase hover:bg-white hover:text-sage transition-all duration-500 text-center"
                >
                  {hero.secondaryCta}
                </SmartLink>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
