import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Home, Building2, Map, Layout, MoveRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

export default function InvestorRepresentation() {
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

  const features = [
    {
      title: "Industrial Development",
      desc: "Creating high-efficiency manufacturing and warehousing spaces for global industry leaders.",
      icon: <Building2 size={24} />
    },
    {
      title: "Strategic Matchmaking",
      desc: "Connecting institutional capital with high-yield off-market development opportunities.",
      icon: <TrendingUp size={24} />
    },
    {
      title: "Asset Management",
      desc: "Optimizing property performance and long-term value through specialized strategic oversight.",
      icon: <Map size={24} />
    },
    {
      title: "Transformative Design",
      desc: "Architecture and planning that redefines landscape and sets new institutional standards.",
      icon: <Layout size={24} />
    }
  ];

  return (
    <div ref={containerRef} className="bg-bone min-h-screen text-sage">
      <SEO 
        title="Investor Representation" 
        description="High-end real estate development and institutional investment representation." 
      />

      {/* Hero Section */}
      <section className="hero-container relative h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden bg-charcoal">
        {/* Parallax Background */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1575454645229-7685ce04e6c3?auto=format&fit=crop&q=80&w=2000" 
            alt="Real Estate" 
            className="hero-image absolute inset-0 w-full h-[120%] object-cover opacity-60 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal"></div>
          <div className="absolute inset-0 bg-[#0a0a0a]/20 mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 w-full text-center md:text-left pt-20 md:pt-32">
          <div className="max-w-4xl">
            <span className="hero-tag inline-block font-sans font-light tracking-[0.6em] text-[9px] uppercase text-sand mb-6">
              Institutional Asset Management
            </span>
            <h1 className="hero-title font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8">
              Investor <br />
              <span className="italic text-sand ml-0 md:ml-16">Representation.</span>
            </h1>
            <div className="hero-line w-24 h-px bg-sand/40 mb-8 origin-left"></div>
            <p className="hero-desc font-sans font-light text-lg md:text-xl text-bone/60 max-w-xl leading-relaxed italic">
              "Transforming global terrain into institutional excellence through precision architecture and strategic development."
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
          <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-sand">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-sand to-transparent"></div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="animate-up">
            <h3 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-8">The Philosophy</h3>
            <p className="font-heading text-4xl text-sage leading-tight mb-8">
              Transforming terrain into <br />
              <span className="italic text-sand-dark">institutional excellence.</span>
            </p>
            <p className="font-sans font-light text-lg text-sage/70 leading-relaxed mb-8">
              Our approach to real estate is rooted in precision. We represent the interests of institutional investors, ensuring that every project—from industrial parks to luxury commercial spaces—is executed with a focus on durability, performance, and cross-border synergy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["Industrial Parks", "Commercial Hubs", "Private Estates", "Strategic Land"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 font-sans text-[10px] tracking-widest uppercase text-sage/80 border-b border-sand/10 pb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-sand"></div> {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative aspect-[4/5] overflow-hidden border border-sand/20 animate-up shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" 
              alt="Luxury Project" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-32 px-6 md:px-16 bg-bone border-t border-sand/10">
        <div className="max-w-7xl mx-auto mb-20 animate-up">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-6 block">Strategic Pillars</span>
          <h3 className="font-heading text-4xl md:text-5xl text-sage">Institutional <span className="italic">Development.</span></h3>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-up">
            {features.map((feature, index) => (
              <div key={index} className="p-10 border border-sand/20 hover:bg-charcoal hover:text-white transition-all duration-700 group h-full">
                <div className="text-sand mb-8 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
                <h4 className="font-heading text-xl mb-4">{feature.title}</h4>
                <p className="font-sans font-light text-sm opacity-70 leading-relaxed italic">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio CTA */}
      <section className="py-32 bg-charcoal text-white text-center">
        <div className="max-w-3xl mx-auto px-6 animate-up">
          <h3 className="font-heading text-4xl mb-8">View our active developments.</h3>
          <Link to="/portfolio" className="inline-flex items-center gap-4 bg-sand text-sage px-12 py-5 font-sans text-xs tracking-[0.4em] uppercase hover:bg-bone transition-all">
            Browse Portfolio <MoveRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
