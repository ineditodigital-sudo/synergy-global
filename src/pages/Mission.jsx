import { useEffect, useRef } from 'react';
import { Target, Eye } from 'lucide-react';
import { useContent } from '../content/context.js';
import { gsap, reducedMotion } from '../lib/gsap.js';
import Highlight from '../components/ui/Highlight.jsx';
import Icon from '../components/ui/Icon.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';

function Card({ card, dark, icon: CardIcon, textSize }) {
  return (
    <div
      className={`mission-card p-10 md:p-12 relative group overflow-hidden min-h-[450px] flex flex-col justify-between ${dark ? 'bg-charcoal text-bone border border-white/5' : 'bg-white border border-sand/10 shadow-sm'}`}
    >
      {card.image && (
        <div className="absolute inset-0 z-0">
          <SmartImage
            src={card.image}
            alt=""
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${dark ? 'opacity-20 group-hover:opacity-30' : 'opacity-10 group-hover:opacity-20'}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${dark ? 'from-charcoal via-charcoal/60' : 'from-white via-white/80'} to-transparent`} />
        </div>
      )}
      <div className={`absolute top-0 right-0 p-8 z-0 transition-colors ${dark ? 'text-white/5 group-hover:text-white/10' : 'text-sand/10 group-hover:text-sand/20'}`}>
        <CardIcon size={120} strokeWidth={0.5} aria-hidden="true" />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 flex items-center justify-center ${dark ? 'bg-white/5' : 'bg-sand/10'}`}>
          <CardIcon className="text-sand" size={24} aria-hidden="true" />
        </div>
      </div>
      <div className="relative z-10 mt-8">
        {card.badge && <h2 className="font-sans font-light tracking-[0.3em] text-xs uppercase text-sand mb-4">{card.badge}</h2>}
        <p className={`font-body leading-snug mb-6 ${dark ? 'text-bone' : 'text-sage'}`} style={{ fontSize: `${textSize}px` }}>
          {card.text}
        </p>
        <div className="w-10 h-px bg-sand/30" />
      </div>
    </div>
  );
}

export default function Mission() {
  const { mission, style } = useContent();
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.mission-card', { y: 40, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', clearProps: 'all' });
    }, ref);
    return () => ctx.revert();
  }, []);

  const pillars = mission.pillars.filter((p) => p.title || p.desc);
  return (
    <div ref={ref} className="pt-40 pb-32 px-6 min-h-screen bg-bone text-sage overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-20 text-center md:text-left">
          {mission.header.badge && <p className="font-sans font-light tracking-[0.5em] text-[10px] uppercase text-sand mb-6">{mission.header.badge}</p>}
          <h1 className="font-heading text-5xl md:text-6xl text-sage max-w-3xl leading-tight">
            <Highlight text={mission.header.title} highlight={mission.header.highlight} />
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {(mission.missionCard.text || mission.missionCard.badge) && <Card card={mission.missionCard} icon={Target} textSize={style.missionTextSize} />}
          {(mission.visionCard.text || mission.visionCard.badge) && <Card card={mission.visionCard} icon={Eye} dark textSize={style.missionTextSize} />}
        </div>

        {pillars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-sand/20 pt-16">
            {pillars.map((p) => (
              <div key={p.id} className="mission-card flex flex-col items-center text-center">
                <Icon name={p.icon} size={32} strokeWidth={1} className="text-sand mb-6" />
                <h3 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-4">{p.title}</h3>
                <p className="font-sans font-light text-sage/70 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
