import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, CheckCircle, Calendar, Shield, Maximize } from 'lucide-react';
import SEO from '../components/SEO';

import { useContent } from '../context/ContentContext';

export default function PropertyDetail() {
  const { id } = useParams();
  const { content } = useContent();
  const properties = content.portfolio?.items || [];
  
  // Find property by ID or slugified title
  const property = properties.find(p => 
    String(p.id) === id || 
    p.title.toLowerCase().replace(/\s+/g, '-') === id
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!property) {
    return (
      <div className="pt-40 pb-32 text-center">
        <h1 className="font-heading text-4xl text-sage mb-8">Asset not found</h1>
        <Link to="/portfolio" className="text-sand underline uppercase tracking-widest text-xs">Back to Portfolio</Link>
      </div>
    );
  }

  // Ensure default structures for safety
  const specs = property.specs || {};
  const features = property.features || [];
  const description = property.description || "No description available.";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!property) {
    return (
      <div className="pt-40 pb-32 text-center">
        <h1 className="font-heading text-4xl text-sage mb-8">Asset not found</h1>
        <Link to="/portfolio" className="text-sand underline uppercase tracking-widest text-xs">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <SEO title={property.title} description={`${property.type} in ${property.location}`} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Navigation */}
        <div className="mb-12">
          <Link to="/portfolio" className="flex items-center gap-3 text-sand hover:text-sage transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase">Return to Portfolio</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1 border border-sand/30 text-sand text-[9px] tracking-[0.2em] uppercase">{property.type}</span>
              <span className="text-sage/40 font-sans text-[9px] tracking-[0.2em] uppercase italic">Ref: SG-{String(property.id).substring(0, 4).toUpperCase()}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sage mb-8 leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-3 text-sand mb-12">
              <MapPin size={18} />
              <span className="font-sans text-lg tracking-widest uppercase">{property.location}</span>
            </div>
            <p className="font-body text-xl text-sage/70 leading-relaxed mb-12 max-w-xl">
              {description}
            </p>
            <div className="flex items-end gap-12 mb-12">
              <div>
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand block mb-2">Investment</span>
                <span className="font-heading text-4xl text-sage">{property.price}</span>
              </div>
            </div>
            <Link to="/contact" className="inline-block bg-charcoal text-bone px-12 py-5 font-sans text-[10px] tracking-[0.4em] uppercase hover:bg-sand transition-all duration-500">
              Inquire Privately
            </Link>
          </div>
          <div className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden shadow-2xl">
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[24px] border-bone/10 pointer-events-none"></div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-32 border-y border-sand/20 py-16">
          {typeof specs === 'string' ? (
            // Handle string format "6 Beds | 8 Baths"
            specs.split('|').map((spec, i) => (
              <div key={i}>
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand block mb-3">Feature</span>
                <span className="font-heading text-xl text-sage uppercase">{spec.trim()}</span>
              </div>
            ))
          ) : (
            // Handle object format { beds: 6, baths: 8 }
            Object.entries(specs).map(([key, value]) => (
              <div key={key}>
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand block mb-3">{key.replace('_', ' ')}</span>
                <span className="font-heading text-xl text-sage uppercase">{value}</span>
              </div>
            ))
          )}
        </div>

        {/* Features & Amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-sage mb-12">Features & <span className="italic">Amenities</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <CheckCircle size={18} className="text-sand group-hover:text-sage transition-colors" />
                  <span className="font-sans text-sm text-sage/80 tracking-wide">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-sand/5 p-12 border border-sand/20 flex flex-col justify-center">
            <Shield size={48} className="text-sand mb-8" />
            <h3 className="font-heading text-2xl text-sage mb-6 uppercase tracking-tight">Private Placement</h3>
            <p className="font-body text-sage/60 leading-relaxed mb-8">
              This asset is part of our private placement portfolio. Detailed financial reports, structural surveys, and site visit schedules are available upon signing a non-disclosure agreement.
            </p>
            <Link to="/contact" className="text-sand font-sans text-[10px] tracking-[0.3em] uppercase border-b border-sand pb-2 self-start hover:text-sage hover:border-sage transition-all">
              Request Full Dossier
            </Link>
          </div>
        </div>

        {/* Project Navigation */}
        <div className="border-t border-sand/20 pt-16 flex justify-between items-center">
          {properties.indexOf(property) > 0 ? (
            <Link 
              to={`/portfolio/${properties[properties.indexOf(property) - 1].title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group flex flex-col items-start"
            >
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand mb-2">Previous Asset</span>
              <span className="font-heading text-xl text-sage group-hover:text-sand transition-colors">
                {properties[properties.indexOf(property) - 1].title}
              </span>
            </Link>
          ) : <div />}

          {properties.indexOf(property) < properties.length - 1 ? (
            <Link 
              to={`/portfolio/${properties[properties.indexOf(property) + 1].title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group flex flex-col items-end text-right"
            >
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand mb-2">Next Asset</span>
              <span className="font-heading text-xl text-sage group-hover:text-sand transition-colors">
                {properties[properties.indexOf(property) + 1].title}
              </span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
