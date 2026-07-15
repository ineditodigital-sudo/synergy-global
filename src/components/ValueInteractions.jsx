import React from 'react';

export default function ValueInteractions() {
  return (
    <section id="intelligence" className="py-24 md:py-48 px-4 md:px-16 bg-bone border-b border-sand/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="font-sans font-light tracking-[0.4em] text-xs uppercase text-sand mb-6">The Synergy Advantage</h2>
          <h3 className="font-heading text-4xl md:text-5xl text-sage max-w-2xl leading-tight">
            Institutional <span className="italic text-sand-dark">Precision</span>, Bespoke Execution.
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Pillar 1: Strategic Matchmaking */}
          <div className="flex flex-col space-y-8">
            <div className="aspect-[4/5] overflow-hidden border border-sand/20 bg-charcoal group">
              <img 
                src="/advantage/matchmaking.png" 
                alt="Luxury Estate" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 grayscale-[30%]"
              />
            </div>
            <div>
              <h4 className="font-sans font-light tracking-widest text-xs uppercase text-sand mb-4">Strategic Matchmaking</h4>
              <p className="font-body text-xl text-sage/80 leading-relaxed mb-6">
                Direct access to high-yield, off-market institutional assets and private placements that never reach the public eye.
              </p>
              <div className="w-10 h-px bg-sand/40"></div>
            </div>
          </div>

          {/* Pillar 2: Market Intelligence */}
          <div className="flex flex-col space-y-8 lg:mt-24">
            <div className="p-10 border border-sand/20 bg-white shadow-sm flex-1 flex flex-col justify-between min-h-[400px]">
              <div>
                <h4 className="font-sans font-light tracking-widest text-xs uppercase text-sand mb-8">Intelligence</h4>
                <p className="font-heading text-2xl text-sage mb-12">Precision-led global market insights.</p>
                
                <ul className="space-y-6">
                  <li className="flex justify-between items-end border-b border-sand/10 pb-2">
                    <span className="font-sans text-[10px] tracking-widest uppercase text-sage/50">Cross-Border Yield</span>
                    <span className="font-body text-lg text-sand-dark">12.4% Avg.</span>
                  </li>
                  <li className="flex justify-between items-end border-b border-sand/10 pb-2">
                    <span className="font-sans text-[10px] tracking-widest uppercase text-sage/50">Portfolio Resilience</span>
                    <span className="font-body text-lg text-sand-dark">Tier 1</span>
                  </li>
                  <li className="flex justify-between items-end border-b border-sand/10 pb-2">
                    <span className="font-sans text-[10px] tracking-widest uppercase text-sage/50">Asset Liquidity</span>
                    <span className="font-body text-lg text-sand-dark">Optimized</span>
                  </li>
                </ul>
              </div>
              <p className="font-sans font-light text-xs text-sage/40 italic">
                Data-driven counsel for transformative growth.
              </p>
            </div>
          </div>

          {/* Pillar 3: Bespoke Advisory */}
          <div className="flex flex-col space-y-8">
            <div className="aspect-[4/5] overflow-hidden border border-sand/20 bg-charcoal group">
              <img 
                src="/advantage/advisory.png" 
                alt="Architecture" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div>
              <h4 className="font-sans font-light tracking-widest text-xs uppercase text-sand mb-4">Confidential Advisory</h4>
              <p className="font-body text-xl text-sage/80 leading-relaxed mb-6">
                End-to-end execution with absolute discretion, navigating complex regulatory landscapes across North American borders.
              </p>
              <div className="w-10 h-px bg-sand/40"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

