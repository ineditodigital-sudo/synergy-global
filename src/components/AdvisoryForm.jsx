import React from 'react';

export default function AdvisoryForm() {
  return (
    <section className="py-24 md:py-32 bg-bone px-6 md:px-16 border-b border-sand/20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        <div className="lg:w-1/2">
          <h2 className="font-sans font-light tracking-[0.3em] text-xs uppercase text-sand mb-6">Valuation & Strategy</h2>
          <h3 className="font-body text-4xl md:text-5xl lg:text-6xl text-sage mb-8 leading-tight">
            What's Your Property <span className="italic">Truly</span> Worth?
          </h3>
          <p className="font-sans font-light text-lg text-sage/70 leading-loose max-w-xl">
            Get a comprehensive market analysis and strategic advisory report tailored for high-net-worth portfolios. Data-driven, human-refined.
          </p>
        </div>

        <div className="lg:w-1/2 w-full bg-white p-8 md:p-12 shadow-sm border border-sand/30">
          <form className="space-y-6">
            <div>
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-sand mb-2 font-medium">Property Address</label>
              <input 
                type="text" 
                placeholder="Ex: 6601 E San Miguel Ave, Paradise Valley" 
                className="w-full bg-bone border border-sand/20 p-4 font-sans text-sm outline-none focus:border-sage transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-sand mb-2 font-medium">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-bone border border-sand/20 p-4 font-sans text-sm outline-none focus:border-sage transition-colors"
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-sand mb-2 font-medium">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full bg-bone border border-sand/20 p-4 font-sans text-sm outline-none focus:border-sage transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-sand mb-2 font-medium">Desired Timeline</label>
              <select className="w-full bg-bone border border-sand/20 p-4 font-sans text-sm outline-none focus:border-sage transition-colors appearance-none">
                <option>Interested in selling now</option>
                <option>Planning for next 6-12 months</option>
                <option>General market inquiry</option>
              </select>
            </div>

            <button className="w-full bg-sage text-bone py-5 font-sans text-[10px] tracking-[0.3em] uppercase hover:bg-sand hover:text-sage transition-all duration-500 font-medium">
              Request Strategic Evaluation
            </button>
            
            <p className="text-[9px] font-sans text-sand text-center tracking-widest leading-relaxed">
              BY SUBMITTING, YOU AGREE TO OUR PRIVACY POLICY AND TERMS OF SERVICE.
            </p>
          </form>
        </div>

      </div>
    </section>
  );
}
