import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Globe, TrendingUp, Target, Briefcase, MoveRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

export default function TradeInvestment() {
  const containerRef = useRef(null);

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

      gsap.from('.animate-up', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.animate-up',
          start: 'top 85%'
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const capabilities = [
    {
      title: "Global Market Entry",
      desc: "Comprehensive strategies for expanding your operations into emerging and established international markets.",
      icon: <Globe size={24} />
    },
    {
      title: "Capital Strategy",
      desc: "Connecting vetted capital with high-impact ventures to ensure sustainable business growth.",
      icon: <TrendingUp size={24} />
    },
    {
      title: "Targeted Sourcing",
      desc: "Identifying and securing lucrative trade opportunities across the Americas.",
      icon: <Target size={24} />
    },
    {
      title: "Investment Structuring",
      desc: "Engineering secure and compliant investment vehicles for cross-border capital flow.",
      icon: <Briefcase size={24} />
    }
  ];

  return (
    <div ref={containerRef} className="bg-bone min-h-screen text-sage">
      <SEO 
        title="Trade & Investment Promotion" 
        description="Strategic promotion and capital structuring for international trade." 
      />

      {/* Hero Section */}
      <section className="hero-container relative h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden bg-charcoal">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000" 
            alt="Trade and Investment" 
            className="hero-image absolute inset-0 w-full h-[120%] object-cover opacity-60 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal"></div>
          <div className="absolute inset-0 bg-[#0a0a0a]/20 mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 w-full text-center md:text-left pt-20 md:pt-32">
          <div className="max-w-4xl">
            <span className="hero-tag inline-block font-sans font-light tracking-[0.6em] text-[9px] uppercase text-sand mb-6">
              Strategic Expansion
            </span>
            <h1 className="hero-title font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8">
              Trade & <br />
              <span className="italic text-sand ml-0 md:ml-16">Investment.</span>
            </h1>
            <div className="hero-line w-24 h-px bg-sand/40 mb-8 origin-left"></div>
            <p className="hero-desc font-sans font-light text-lg md:text-xl text-bone/60 max-w-xl leading-relaxed italic">
              "Fostering robust economic ties and facilitating seamless capital deployment across borders."
            </p>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
          <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-sand">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-sand to-transparent"></div>
        </div>
      </section>

      {/* Core Strategy */}
      <section className="py-32 px-6 md:px-16 border-b border-sand/10">
        <div className="max-w-7xl mx-auto mb-20 animate-up">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-6 block">Capabilities</span>
          <h3 className="font-heading text-4xl md:text-5xl text-sage">Growth <span className="italic">Catalyst.</span></h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="animate-up">
            <h3 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-8">The Strategy</h3>
            <p className="font-heading text-4xl text-sage leading-tight mb-8">
              Navigating global <br />
              <span className="italic">markets</span> with precision.
            </p>
            <p className="font-sans font-light text-lg text-sage/70 leading-relaxed mb-8">
              We empower our clients to break into new markets by providing actionable intelligence, reliable partnerships, and robust investment frameworks that minimize risk and maximize returns.
            </p>
            <ul className="space-y-4">
              {["Cross-Border M&A", "FDI Facilitation", "Joint Venture Structuring"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-sans text-sm tracking-widest uppercase text-sage/60">
                  <CheckCircle2 size={16} className="text-sand" /> {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-up">
            {capabilities.map((cap, index) => (
              <div key={index} className="p-10 bg-white border border-sand/10 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="text-sand mb-6">{cap.icon}</div>
                <h4 className="font-heading text-xl text-sage mb-4">{cap.title}</h4>
                <p className="font-sans font-light text-sm text-sage/60 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-32 bg-charcoal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sand/5 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 text-center animate-up relative z-10">
          <h3 className="font-heading text-4xl md:text-5xl mb-8">Ready to expand your global footprint?</h3>
          <Link to="/contact" className="inline-flex items-center gap-4 bg-sand text-sage px-12 py-5 font-sans text-xs tracking-[0.4em] uppercase hover:bg-white transition-all">
            Inquire for Consultation <MoveRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
