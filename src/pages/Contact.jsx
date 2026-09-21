import { useState } from 'react';
import { MapPin, Phone, CheckCircle } from 'lucide-react';
import { useContent } from '../content/context.js';

export default function Contact() {
  const { contact: c } = useContent();
  const [submitted, setSubmitted] = useState(false);
  const emails = c.info.emails.filter(Boolean);
  const tel = c.info.phone.replace(/[^\d+]/g, '');
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(c.info.mapQuery || c.info.office || 'San Francisco, CA')}&z=12&output=embed`;

  return (
    <div className="pt-40 pb-32 px-6 bg-bone text-sage min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          {c.header.badge && <p className="font-sans tracking-[0.4em] text-[10px] uppercase text-sand mb-6">{c.header.badge}</p>}
          <h1 className="font-heading italic text-5xl md:text-6xl mb-12">{c.header.title}</h1>
          {c.header.subtitle && <p className="font-sans font-light text-xl text-sage/70 mb-16 leading-relaxed max-w-lg">{c.header.subtitle}</p>}

          <div className="space-y-12">
            {emails.length > 0 && (
              <div>
                <h2 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-4">{c.info.emailsTitle}</h2>
                <ul className="flex flex-col gap-3">
                  {emails.map((email) => (
                    <li key={email}>
                      <a href={`mailto:${email}`} className="font-body text-2xl hover:text-sand transition-colors break-all">
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.info.phone && (
              <div>
                <h2 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-4">Phone</h2>
                <a href={`tel:${tel}`} className="font-body text-2xl hover:text-sand transition-colors inline-flex items-center gap-3">
                  <Phone size={20} className="text-sand" aria-hidden="true" /> {c.info.phone}
                </a>
              </div>
            )}

            {(c.info.office || c.info.officeText) && (
              <div>
                {c.info.officeTitle && <h2 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-4">{c.info.officeTitle}</h2>}
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sand/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin size={18} className="text-sand" aria-hidden="true" />
                    </div>
                    <address className="not-italic">
                      {c.info.office && <p className="font-heading text-3xl text-sage leading-tight">{c.info.office}</p>}
                      {c.info.officeRegion && <p className="font-sans text-[11px] tracking-widest uppercase text-sand mt-1">{c.info.officeRegion}</p>}
                      {c.info.officeText && <p className="font-sans font-light text-sm text-sage/50 mt-3 leading-relaxed max-w-sm">{c.info.officeText}</p>}
                    </address>
                  </div>

                  {c.info.showMap && (
                    <div className="w-full h-52 overflow-hidden border border-sand/20 relative group">
                      <iframe
                        title={`Map – ${c.info.mapQuery || c.info.office}`}
                        src={mapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(80%) contrast(1.1)' }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(c.info.mapQuery || c.info.office)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                      >
                        <span className="bg-charcoal text-bone text-[9px] tracking-widest uppercase px-3 py-2">Open in Maps ↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-10 md:p-16 shadow-2xl relative overflow-hidden">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in" role="status">
              <CheckCircle size={80} className="text-sand mb-8" aria-hidden="true" />
              <h2 className="font-heading text-4xl text-sage mb-4 uppercase">{c.form.successTitle}</h2>
              <p className="font-sans font-light text-sage/60 max-w-xs leading-relaxed">{c.form.successText}</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-12 text-sand font-sans text-[10px] tracking-[0.3em] uppercase border-b border-sand pb-2 hover:text-sage hover:border-sage transition-all"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-heading text-4xl mb-8">{c.form.title}</h2>
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="space-y-2 block">
                    <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Full Name</span>
                    <input type="text" name="name" autoComplete="name" required className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors" />
                  </label>
                  <label className="space-y-2 block">
                    <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Email Address</span>
                    <input type="email" name="email" autoComplete="email" required className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors" />
                  </label>
                </div>
                <label className="space-y-2 block">
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Phone (optional)</span>
                  <input type="tel" name="phone" autoComplete="tel" className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors" />
                </label>
                {c.form.inquiryTypes.length > 0 && (
                  <label className="space-y-2 block">
                    <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Inquiry Type</span>
                    <select name="type" className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors cursor-pointer">
                      {c.form.inquiryTypes.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="space-y-2 block">
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Message</span>
                  <textarea name="message" rows="4" required className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors resize-none" />
                </label>
                <button type="submit" className="w-full bg-charcoal text-bone py-5 font-sans text-[10px] tracking-[0.4em] uppercase hover:bg-sand transition-all duration-500">
                  {c.form.submitLabel}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
