import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext';

export default function Contact() {
  const { content } = useContent();
  const { contact } = content;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-40 pb-32 px-6 bg-bone text-sage min-h-screen">
      <SEO title={contact.header.title} description={contact.header.subtitle} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        
        <div>
          <h1 className="font-heading italic text-6xl md:text-6xl mb-12">{contact.header.title}</h1>
          <p className="font-sans font-light text-xl text-sage/70 mb-16 leading-relaxed max-w-lg">
            {contact.header.subtitle}
          </p>

          <div className="space-y-12">
            <div className="group">
              <h3 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-4">Direct Email</h3>
              <div className="flex flex-col gap-3">
                {(contact.info?.email || '').split(',').map((email, idx) => {
                  const cleanEmail = email.trim();
                  if (!cleanEmail) return null;
                  return (
                    <div key={idx}>
                      <a href={`mailto:${cleanEmail}`} className="font-body text-2xl hover:text-sand transition-colors break-all">
                        {cleanEmail}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-4">Global Headquarters</h3>
              <div className="space-y-8">
                {/* SF Location Card */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sand/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin size={18} className="text-sand" />
                  </div>
                  <div>
                    <p className="font-heading text-3xl text-sage leading-tight">San Francisco</p>
                    <p className="font-sans text-[11px] tracking-widest uppercase text-sand mt-1">California, United States</p>
                    <p className="font-sans font-light text-sm text-sage/50 mt-3 leading-relaxed">
                      Our principal office and global operations hub,<br />
                      serving international clients and partners.
                    </p>
                  </div>
                </div>

                {/* Embedded Map */}
                <div className="w-full h-52 overflow-hidden border border-sand/20 relative group">
                  <iframe
                    title="Synergy Global — San Francisco HQ"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98443948298!2d-122.50764017948198!3d37.75781499772775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1748217600000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(80%) contrast(1.1)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href="https://maps.google.com/?q=San+Francisco,+CA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="bg-charcoal text-bone text-[9px] tracking-widest uppercase px-3 py-2">
                      Open in Maps ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 md:p-16 shadow-2xl relative overflow-hidden">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
              <CheckCircle size={80} className="text-sand mb-8" />
              <h2 className="font-heading text-4xl text-sage mb-4 uppercase">Message Sent</h2>
              <p className="font-sans font-light text-sage/60 max-w-xs leading-relaxed">
                Thank you for reaching out. An executive advisor will review your inquiry and respond within 24 hours.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-12 text-sand font-sans text-[10px] tracking-[0.3em] uppercase border-b border-sand pb-2 hover:text-sage hover:border-sage transition-all"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-heading text-4xl mb-8">Send a Message</h2>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Full Name</label>
                    <input type="text" required className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Email Address</label>
                    <input type="email" required className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Inquiry Type</label>
                  <select className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors appearance-none cursor-pointer">
                    <option>Real Estate Development</option>
                    <option>Supply Chain Investment</option>
                    <option>International Trade</option>
                    <option>Global Distribution</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Message</label>
                  <textarea rows="4" required className="w-full bg-transparent border-b border-sand/30 py-3 font-sans text-sage focus:border-sand outline-none transition-colors resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-charcoal text-bone py-5 font-sans text-[10px] tracking-[0.4em] uppercase hover:bg-sand transition-all duration-500">
                  Submit Inquiry
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
