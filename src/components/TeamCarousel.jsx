import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../content/context.js';
import { memberPath } from '../content/site.js';
import SmartLink from './ui/SmartLink.jsx';
import SmartImage from './ui/SmartImage.jsx';

export default function TeamCarousel({ showLink = false }) {
  const { about, home } = useContent();
  const team = about.team.filter((m) => m.visible && m.name);
  const ref = useRef(null);

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollLeft + (dir * el.clientWidth) / 2, behavior: 'smooth' });
  };

  if (!team.length) return null;
  return (
    <section className="py-32 bg-charcoal overflow-hidden" aria-labelledby="team-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-16 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            {about.teamSection.badge && (
              <p className="font-sans font-light tracking-[0.4em] text-[10px] uppercase text-sand mb-6">{about.teamSection.badge}</p>
            )}
            <h2 id="team-heading" className="font-heading text-4xl md:text-5xl text-white">
              {about.teamSection.title}
            </h2>
          </div>
          <div className="flex items-center gap-12">
            {showLink && home.team.linkLabel && (
              <SmartLink to={home.team.linkPath} className="group flex items-center gap-4 text-sand hover:text-white transition-colors duration-500">
                <span className="font-sans text-xs tracking-widest uppercase">{home.team.linkLabel}</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
              </SmartLink>
            )}
            {team.length > 1 && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => scroll(-1)}
                  className="p-4 border border-white/10 text-white hover:bg-white hover:text-charcoal transition-all duration-500 rounded-full"
                  aria-label="Previous team members"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll(1)}
                  className="p-4 border border-white/10 text-white hover:bg-white hover:text-charcoal transition-all duration-500 rounded-full"
                  aria-label="Next team members"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ul
        ref={ref}
        className="flex [justify-content:safe_center] gap-6 md:gap-8 px-6 md:px-16 overflow-x-auto pb-12 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {team.map((member) => (
          <li key={member.id} className="flex-shrink-0 w-[300px] md:w-[380px] lg:w-[400px] snap-start py-8">
            <SmartLink to={memberPath(member)} className="group block relative aspect-[3/4] w-full">
              <div className="absolute inset-0 border border-transparent group-hover:border-sand/60 group-hover:-inset-4 transition-all duration-500 ease-out pointer-events-none z-20" />
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-transparent group-hover:border-sand group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-500 ease-out z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-transparent group-hover:border-sand group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-500 ease-out z-20 pointer-events-none" />
              <div className="absolute inset-0 overflow-hidden bg-sage/20 border border-white/5">
                <SmartImage
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 380px, 300px"
                  preferred={480}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 ease-out opacity-60 group-hover:opacity-100"
                  placeholderClassName="bg-sage/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-10 transform group-hover:-translate-y-2.5 transition-transform duration-700">
                  <div className="overflow-hidden mb-3 h-0 group-hover:h-6 transition-all duration-700">
                    <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      {member.role}
                    </p>
                  </div>
                  <h3 className="font-heading text-3xl text-white">{member.name}</h3>
                  <div className="mt-8 w-12 h-px bg-sand opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </div>
            </SmartLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
