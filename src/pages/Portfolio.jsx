import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext';

export default function Portfolio() {
  const { content } = useContent();
  const { portfolio } = content;
  const [filter, setFilter] = useState('All');

  const properties = portfolio.items;

  const filteredProperties = filter === 'All' 
    ? properties 
    : properties.filter(p => p.type === filter);

  return (
    <div className="pt-32 pb-24">
      <SEO title={portfolio.header.title} description={portfolio.header.subtitle} />
      {/* Header Section */}
      <section className="px-6 md:px-16 mb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-sans font-light tracking-[0.4em] text-xs uppercase text-sand mb-8">{portfolio.header.badge}</h1>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sage leading-tight max-w-4xl">
              {portfolio.header.title}
            </h2>
            
            <div className="flex flex-wrap gap-4">
              {['All', 'Residential', 'Commercial', 'Development'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-8 py-3 font-sans text-[10px] tracking-[0.3em] uppercase border transition-all duration-500 ${filter === f ? 'bg-sage text-bone border-sage shadow-lg' : 'bg-transparent text-sand border-sand/30 hover:border-sage hover:text-sage'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-6 md:px-16 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {filteredProperties.map((prop) => (
              <div key={prop.id} className="group cursor-pointer">
                <Link to={`/portfolio/${prop.title.toLowerCase().replace(/ /g, '-')}`}>
                  <div className="relative aspect-[4/5] overflow-hidden mb-8 shadow-sm">
                    {/* Image */}
                    <img 
                      src={prop.image} 
                      alt={prop.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-6 left-6 bg-bone/90 backdrop-blur-sm px-4 py-2 border border-sand/20">
                      <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-sage font-medium">{prop.type}</span>
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8">
                      <div className="bg-bone text-sage w-full py-4 font-sans text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                        View Details <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex justify-between items-start mb-4">
                  <Link to={`/portfolio/${prop.title.toLowerCase().replace(/ /g, '-')}`} className="block group">
                    <div>
                      <h3 className="font-body text-3xl text-sage mb-2 group-hover:text-sand transition-colors">{prop.title}</h3>
                      <div className="flex items-center space-x-2 text-sand">
                        <MapPin size={14} />
                        <span className="font-sans text-[10px] tracking-widest uppercase">{prop.location}</span>
                      </div>
                    </div>
                  </Link>
                  <p className="font-body text-xl text-sage italic">{prop.price}</p>
                </div>
                
                <div className="h-px w-full bg-sand/10 mb-4"></div>
                <p className="font-sans text-[10px] tracking-[0.15em] text-sage/50 uppercase">{prop.specs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Section */}
      <section className="px-6 md:px-16 py-32 bg-charcoal text-bone text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h3 className="font-heading text-4xl md:text-6xl mb-8 leading-tight">Can't find what you are <span className="italic text-sand">seeking?</span></h3>
          <p className="font-sans font-light text-xl text-bone/60 mb-12 leading-relaxed">
            Many of our most exclusive assets are held in private placement and are not listed publicly. Contact our advisory team for a confidential consultation.
          </p>
          <Link to="/contact" className="inline-block bg-sand text-sage px-12 py-5 font-sans text-xs tracking-[0.4em] uppercase hover:bg-bone transition-all duration-500 shadow-xl">
            Inquire Privately
          </Link>
        </div>
      </section>
    </div>
  );
}
