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
              <div className="mb-4">
                <a href={`mailto:${contact.info.email}`} className="font-body text-2xl hover:text-sand transition-colors break-all">
                  {contact.info.email}
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-4">Global Offices</h3>
              <div className="space-y-8">
                <div>
                  <h4 className="font-sans text-[11px] tracking-widest uppercase mb-2">{contact.info.country}</h4>
                  <p className="font-body text-2xl leading-relaxed">
                    {contact.info.office}<br />
                    {contact.info.country}
                  </p>
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
