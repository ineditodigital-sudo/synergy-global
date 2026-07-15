import React, { useState } from 'react';
import { ArrowRight, MapPin, User, Mail, Calendar, Check } from 'lucide-react';

import { useContent } from '../context/ContentContext';

export default function PropertyValuation() {
  const { content } = useContent();
  const valuationData = content.home?.valuation || {
    title: 'What is your property worth?',
    description: 'Our proprietary algorithm, combined with deep market intelligence, provides an accurate valuation of your global real estate assets in minutes.',
    features: ['Comprehensive Market Analysis', 'Privacy-First Data Handling']
  };
  
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    timeframe: "curious",
    consent: true
  });

  const nextStep = () => setStep(step + 1);

  return (
    <section className="py-24 md:py-48 bg-bone border-b border-sand/30">
      <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        
        <div>
          <h2 className="font-heading italic text-5xl md:text-5xl lg:text-6xl text-sage mb-8 leading-tight">
            {valuationData.title}
          </h2>
          <p className="font-sans font-light text-lg text-sage/70 max-w-lg mb-12 leading-relaxed">
            {valuationData.description}
          </p>
          
          <div className="flex flex-col space-y-6">
            {(valuationData.features || []).map((feature, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full border border-sand/30 flex items-center justify-center text-sand">
                  <Check size={16} />
                </div>
                <p className="font-sans text-[10px] tracking-widest uppercase text-sage">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Decorative frame */}
          <div className="absolute -inset-4 border border-sand/10 pointer-events-none"></div>
          
          <div className="bg-white p-8 md:p-12 shadow-2xl relative z-10 border border-sand/20">
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Step 01 / 02</span>
                  <div className="h-px w-12 bg-sand/30"></div>
                </div>
                <h3 className="font-body text-3xl text-sage mb-8">Enter your property address</h3>
                <div className="relative mb-8">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sand" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. 6601 E San Miguel Ave, Paradise Valley"
                    className="w-full bg-bone border border-sand/20 py-5 pl-12 pr-6 font-sans text-sm focus:outline-none focus:border-sage transition-colors"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <button 
                  onClick={nextStep}
                  disabled={!address}
                  className="w-full bg-sage text-bone py-5 font-sans text-[10px] tracking-[0.3em] uppercase hover:bg-charcoal transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand">Step 02 / 02</span>
                  <div className="h-px w-12 bg-sand/30"></div>
                </div>
                <h3 className="font-body text-3xl text-sage mb-8">Your Contact Details</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-sand" size={18} />
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      className="w-full bg-bone border border-sand/20 py-4 pl-12 pr-6 font-sans text-sm focus:outline-none focus:border-sage"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-sand" size={18} />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      className="w-full bg-bone border border-sand/20 py-4 pl-12 pr-6 font-sans text-sm focus:outline-none focus:border-sage"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sand" size={18} />
                    <select className="w-full bg-bone border border-sand/20 py-4 pl-12 pr-6 font-sans text-sm focus:outline-none focus:border-sage appearance-none">
                      <option value="curious">Just Curious</option>
                      <option value="3months">Selling in 3 Months</option>
                      <option value="now">Selling Now</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-8">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    className="mt-1 accent-sage"
                  />
                  <label htmlFor="consent" className="font-sans text-[9px] text-sage/60 leading-relaxed uppercase tracking-widest">
                    I consent to receive market updates and valuation reports.
                  </label>
                </div>

                <button 
                  onClick={() => setStep(3)}
                  className="w-full bg-sage text-bone py-5 font-sans text-[10px] tracking-[0.3em] uppercase hover:bg-charcoal transition-all flex items-center justify-center gap-4"
                >
                  Get Valuation <ArrowRight size={14} />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 bg-sand/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check className="text-sage" size={32} />
                </div>
                <h3 className="font-body text-4xl text-sage mb-4">Request Received</h3>
                <p className="font-sans font-light text-sage/60 mb-8 leading-relaxed">
                  Our advisors are analyzing the market data for {address}. A comprehensive report will be sent to your email shortly.
                </p>
                <button 
                  onClick={() => setStep(1)}
                  className="text-[9px] font-sans tracking-[0.3em] uppercase border-b border-sand pb-1 text-sand"
                >
                  Valuate Another Property
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
