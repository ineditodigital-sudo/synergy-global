import { useParams, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Phone } from 'lucide-react';
import { useContent } from '../content/context.js';
import { isPreviewFrame } from '../lib/preview.js';
import { resolveRoute } from '../content/site.js';
import Paragraphs from '../components/ui/Paragraphs.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import { SocialIcon } from '../components/ui/SocialIcons.jsx';
import NotFound from './NotFound.jsx';

export default function MemberProfile() {
  const { slug } = useParams();
  const content = useContent();
  const route = resolveRoute(content, `/team/${slug}`, { includeHidden: isPreviewFrame() });
  if (route.type !== 'member') return <NotFound />;
  const m = route.item;
  const tel = m.phone.replace(/[^\d+]/g, '');

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <Link to="/about" className="inline-flex items-center gap-2 text-sand hover:text-sage transition-colors mb-16 pt-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase">Leadership</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] bg-charcoal overflow-hidden shadow-2xl relative">
              <SmartImage
                src={m.image}
                alt={`${m.name}, ${m.role}`}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                preferred={960}
                className="w-full h-full object-cover"
                placeholderClassName="bg-sage/30"
              />
              <div className="absolute inset-0 border-[20px] border-bone/5 pointer-events-none" />
            </div>

            {(m.email || (m.showPhone && m.phone) || m.linkedin) && (
              <div className="mt-12">
                <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-4">Contact</h2>
                <ul className="space-y-4">
                  {m.email && (
                    <li>
                      <a href={`mailto:${m.email}`} className="flex items-center gap-3 text-sage hover:text-sand transition-colors break-all">
                        <Mail size={18} strokeWidth={1.5} aria-hidden="true" />
                        <span className="font-sans text-sm">{m.email}</span>
                      </a>
                    </li>
                  )}
                  {m.showPhone && m.phone && (
                    <li>
                      <a href={`tel:${tel}`} className="flex items-center gap-3 text-sage hover:text-sand transition-colors">
                        <Phone size={18} strokeWidth={1.5} aria-hidden="true" />
                        <span className="font-sans text-sm">{m.phone}</span>
                      </a>
                    </li>
                  )}
                  {/^https?:\/\//i.test(m.linkedin) && (
                    <li>
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sage hover:text-sand transition-colors">
                        <SocialIcon name="linkedin" size={18} />
                        <span className="font-sans text-sm">LinkedIn</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <header className="mb-12">
              <h1 className="font-body text-5xl text-sage mb-4 leading-tight">{m.name}</h1>
              {m.role && <p className="font-sans text-xs tracking-[0.4em] uppercase text-sand font-medium">{m.role}</p>}
            </header>
            <div className="h-px w-full bg-sand/20 mb-12" />
            <Paragraphs text={m.bio} className="font-sans font-light text-xl text-sage/80 leading-relaxed mb-8" />

            {(m.specialties.length > 0 || m.locations.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 pt-16 border-t border-sand/20">
                {m.specialties.length > 0 && (
                  <div>
                    <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-6">Specialties</h2>
                    <ul className="space-y-4">
                      {m.specialties.map((s) => (
                        <li key={s} className="flex items-center gap-3 font-sans text-sm text-sage/70">
                          <span className="w-1.5 h-1.5 bg-sand rounded-full" aria-hidden="true" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.locations.length > 0 && (
                  <div>
                    <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-6">Key Markets</h2>
                    <ul className="flex flex-wrap gap-3">
                      {m.locations.map((l) => (
                        <li key={l} className="px-4 py-2 bg-bone border border-sand/20 font-sans text-[10px] tracking-widest uppercase text-sage">
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
