import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Shield, Gavel, Scale, FileText } from 'lucide-react';
import SEO from '../components/SEO';

export default function Legal() {
  const containerRef = useRef(null);
  const legalAreas = [
    {
      title: "Cross-Border Transactions",
      desc: "Specialized legal oversight for real estate and industrial acquisitions between the U.S., Canada, and Mexico.",
      icon: <Scale size={24} />
    },
    {
      title: "Corporate Formation",
      desc: "Comprehensive entity structuring and registration across North American jurisdictions.",
      icon: <Shield size={24} />
    },
    {
      title: "Commercial Litigation",
      desc: "Robust advocacy and dispute resolution for real estate and business-related companies.",
      icon: <Gavel size={24} />
    },
    {
      title: "Regulatory Strategy",
      desc: "Navigating the complexities of international trade law and economic development policy.",
      icon: <FileText size={24} />
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero image parallax
      gsap.to('.hero-image', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-container',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Text reveal
      const tl = gsap.timeline();
      tl.from('.hero-tag', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' })
        .from('.hero-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, '-=0.4')
        .from('.hero-line', { scaleX: 0, duration: 1, ease: 'power3.inOut' }, '-=0.6')
        .from('.hero-desc', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.4');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-bone min-h-screen text-sage">
      <SEO 
        title="Legal Framework & Advocacy" 
        description="Institutional integrity through specialized cross-border legal counsel." 
      />

      {/* Hero Section */}
      <section className="hero-container relative h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden bg-charcoal">
        {/* Parallax Background */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/services/legal.png" 
            alt="Legal Strategy" 
            className="hero-image absolute inset-0 w-full h-[120%] object-cover opacity-60 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal"></div>
          <div className="absolute inset-0 bg-[#0a0a0a]/20 mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 w-full text-center md:text-left pt-20 md:pt-32">
          <div className="max-w-4xl">
            <span className="hero-tag inline-block font-sans font-light tracking-[0.6em] text-[9px] uppercase text-sand mb-6">
              Institutional Strategy
            </span>
            <h1 className="hero-title font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8">
              Legal <br />
              <span className="italic text-sand ml-0 md:ml-16">Integrity.</span>
            </h1>
            <div className="hero-line w-24 h-px bg-sand/40 mb-8 origin-left"></div>
            <p className="hero-desc font-sans font-light text-lg md:text-xl text-bone/60 max-w-xl leading-relaxed italic">
              "Upholding excellence through specialized cross-border counsel and unwavering ethical governance."
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
          <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-sand">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-sand to-transparent"></div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 md:px-16 bg-bone py-32 border-y border-sand/20">
        <div className="max-w-7xl mx-auto mb-20">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-6 block text-center md:text-left">Legal Expertise</span>
          <h3 className="font-heading text-4xl md:text-5xl text-sage text-center md:text-left">Strategic <span className="italic">Counsel.</span></h3>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {legalAreas.map((area, index) => (
              <div key={index} className="flex gap-8 group">
                <div className="w-16 h-16 shrink-0 bg-white border border-sand/30 flex items-center justify-center text-sand group-hover:bg-sage group-hover:text-bone transition-all duration-500">
                  {area.icon}
                </div>
                <div>
                  <h3 className="font-body text-2xl text-sage mb-4">{area.title}</h3>
                  <p className="font-sans font-light text-sage/60 leading-relaxed">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="px-6 md:px-16 py-32">
        <div className="max-w-3xl mx-auto">
          <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-8 text-center font-bold">Terms & Privacy</h4>
          <div className="space-y-12">
            <div className="border-t border-sand/20 pt-8">
              <h5 className="font-body text-xl text-sage mb-4">Privacy Policy</h5>
              <p className="font-sans font-light text-sm text-sage/50 leading-loose">
                Synergy Global Development & Investments, Inc. is committed to protecting your privacy. We collect and process personal data only for the purposes of providing our advisory services and maintaining our client relationships. All information provided through our property valuation tools is handled with strict confidentiality.
              </p>
            </div>
            <div className="border-t border-sand/20 pt-8">
              <h5 className="font-body text-xl text-sage mb-4">Terms of Service</h5>
              <p className="font-sans font-light text-sm text-sage/50 leading-loose">
                The information provided on this website is for informational purposes only and does not constitute professional legal or financial advice. Access to private listings and certain advisory services may require further qualification and verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
