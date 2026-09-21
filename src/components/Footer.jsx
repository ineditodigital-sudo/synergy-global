import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { useContent } from '../content/context.js';
import SmartLink from './ui/SmartLink.jsx';
import SmartImage from './ui/SmartImage.jsx';
import { SocialIcon, EqualHousingIcon } from './ui/SocialIcons.jsx';
import { SOCIAL_NETWORKS } from '../lib/icons.js';

export default function Footer() {
  const { footer, settings: s, style } = useContent();
  const year = new Date().getFullYear();
  const socials = SOCIAL_NETWORKS.filter(([key]) => /^https?:\/\//i.test(s.social[key] || ''));
  const columns = footer.columns.filter((c) => c.title || c.links.length);
  const tel = s.phone.replace(/[^\d+]/g, '');

  return (
    <footer className="bg-charcoal text-bone pt-24 pb-12 px-6 md:px-16 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sand/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-20">
          <div>
            <SmartLink to="/" aria-label="Synergy Global – Home">
              <SmartImage
                src={style.footerLogo}
                alt="Synergy Global Development & Investments"
                sizes="240px"
                preferred={480}
                className="h-10 w-auto mb-8 opacity-90"
                placeholderClassName="bg-transparent"
              />
            </SmartLink>
            {footer.tagline && <p className="font-sans font-light text-sm text-bone/60 leading-relaxed mb-8 max-w-xs">{footer.tagline}</p>}
            <div className="flex flex-wrap gap-5 text-sand">
              {s.email && (
                <a href={`mailto:${s.email}`} className="hover:text-white transition-colors" aria-label={`Email ${s.email}`}>
                  <Mail size={20} />
                </a>
              )}
              {socials.map(([key, label]) => (
                <a key={key} href={s.social[key]} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label={label}>
                  <SocialIcon name={key} size={19} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.id} aria-label={col.title || undefined}>
              {col.title && <h2 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-8">{col.title}</h2>}
              <ul className="space-y-4 font-sans text-[11px] tracking-widest uppercase">
                {col.links
                  .filter((l) => l.label)
                  .map((l) => (
                    <li key={l.id}>
                      <SmartLink to={l.path} className="hover:text-sand transition-colors">
                        {l.label}
                      </SmartLink>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}

          <div>
            {footer.officeTitle && <h2 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-8">{footer.officeTitle}</h2>}
            <div className="space-y-6">
              {(footer.officeLine1 || footer.officeLine2) && (
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-sand mt-1 flex-shrink-0" aria-hidden="true" />
                  <address className="not-italic">
                    {footer.officeLine1 && <p className="font-sans font-semibold text-sm text-bone leading-tight">{footer.officeLine1}</p>}
                    {footer.officeLine2 && <p className="font-sans font-light text-xs text-bone/50 mt-1">{footer.officeLine2}</p>}
                  </address>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {s.email && (
                  <a href={`mailto:${s.email}`} className="text-sand hover:text-white transition-colors text-[10px] tracking-widest uppercase break-all">
                    {s.email}
                  </a>
                )}
                {s.phone && (
                  <a href={`tel:${tel}`} className="flex items-center gap-2 text-sand hover:text-white transition-colors text-[10px] tracking-widest uppercase">
                    <Phone size={10} aria-hidden="true" /> {s.phone}
                  </a>
                )}
                {footer.presenceText && (
                  <span className="flex items-center gap-2 text-[9px] tracking-widest uppercase text-bone/40">
                    <Globe size={10} aria-hidden="true" /> {footer.presenceText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 font-sans text-[10px] tracking-[0.3em] uppercase text-bone/40 text-center md:text-left">
            <p>
              &copy; {year} {footer.copyright}
            </p>
            {s.licenseNumber && <p>{s.licenseNumber}</p>}
            {s.showEqualHousing && (
              <p className="flex items-center gap-2" title="Equal Housing Opportunity">
                <EqualHousingIcon size={18} /> Equal Housing Opportunity
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 font-sans text-[10px] tracking-[0.3em] uppercase text-bone/40">
            {footer.bottomLinks
              .filter((l) => l.label)
              .map((l) => (
                <SmartLink key={l.id} to={l.path} className="hover:text-white transition-colors">
                  {l.label}
                </SmartLink>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
