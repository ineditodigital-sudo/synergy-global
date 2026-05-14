import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, CheckCircle, Calendar, Shield, Maximize } from 'lucide-react';
import SEO from '../components/SEO';

const propertiesData = {
  'the-glass-house': {
    title: "The Glass House",
    location: "Paradise Valley, AZ",
    price: "$12,500,000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80",
    type: "Residential",
    specs: {
      beds: "6",
      baths: "8",
      sqft: "8,500",
      lot: "1.2 Acres",
      year: "2023"
    },
    description: "An architectural masterpiece perched on the edge of Camelback Mountain. The Glass House features floor-to-ceiling retractable walls that blur the line between indoor and outdoor living. Designed for the ultimate collector of experiences, this residence offers panoramic views of the entire valley.",
    features: ["Infinity Edge Pool", "1,500 Bottle Wine Cellar", "Gourmet Chef's Kitchen", "Smart Home Automation", "Private Guest Wing", "Wellness Center & Spa"]
  },
  'san-miguel-estate': {
    title: "San Miguel Estate",
    location: "Paradise Valley, AZ",
    price: "$8,900,000",
    image: "https://images.unsplash.com/photo-1613490908578-f1489e8020b7?auto=format&fit=crop&w=2000&q=80",
    type: "Residential",
    specs: {
      beds: "5",
      baths: "6",
      sqft: "7,200",
      lot: "0.8 Acres",
      year: "2021"
    },
    description: "A modern interpretation of Mediterranean luxury. San Miguel Estate combines timeless materials with avant-garde design. The sprawling grounds feature curated desert landscaping and multiple water features that create a private oasis in the heart of Arizona.",
    features: ["Courtyard Entrance", "Home Theater", "Outdoor Kitchen", "Guest Casita", "Four-Car Garage", "Solar Integrated"]
  },
  'global-logistics-hub': {
    title: "Global Logistics Hub",
    location: "Mexico City, MX",
    price: "Inquiry Only",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80",
    type: "Commercial",
    specs: {
      type: "Industrial",
      sqft: "150,000",
      dock_doors: "42",
      clear_height: "36'",
      parking: "200+ Spaces"
    },
    description: "Strategically located to serve the growing North American supply chain. This state-of-the-art logistics facility features high-efficiency cooling systems, reinforced flooring, and advanced security infrastructure. A cornerstone asset for international distribution.",
    features: ["24/7 Security", "Cross-Dock Configuration", "LED Lighting", "Office Suite", "Fiber Optic Ready", "Direct Highway Access"]
  },
  'desert-modernist': {
    title: "Desert Modernist",
    location: "Scottsdale, AZ",
    price: "$6,400,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
    type: "Residential",
    specs: {
      beds: "4",
      baths: "5",
      sqft: "5,800",
      lot: "0.6 Acres",
      year: "2020"
    },
    description: "A tribute to mid-century design with contemporary sophistication. The Desert Modernist features clean lines, natural stone accents, and a fluid layout that prioritizes privacy and natural light.",
    features: ["Floor-to-ceiling Glass", "Custom Millwork", "Private Courtyard", "Home Office", "Outdoor Firepit", "Art Gallery Lighting"]
  },
  'urban-development-site': {
    title: "Urban Development Site",
    location: "Phoenix, AZ",
    price: "$15,000,000",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
    type: "Development",
    specs: {
      type: "Mixed-Use",
      acres: "2.5",
      zoning: "High-Density",
      potential_units: "240",
      frontage: "450'"
    },
    description: "A prime opportunity in the heart of the urban core. This 2.5-acre site is shovel-ready for a high-density mixed-use development, offering unparalleled visibility and accessibility.",
    features: ["Utility Infrastructure in Place", "Zoning Approval", "Phase 1 Environmental Done", "Transit-Oriented Location", "High Walk Score", "Corner Lot"]
  },
  'boutique-winery-estate': {
    title: "Boutique Winery Estate",
    location: "Napa Valley, CA",
    price: "Price Upon Request",
    image: "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=2000&q=80",
    type: "Residential",
    specs: {
      beds: "4",
      baths: "4",
      acres: "10",
      vineyard: "6 Acres",
      production: "1,500 Cases"
    },
    description: "An extraordinary blend of luxury living and agricultural heritage. This 10-acre estate features a meticulously designed residence overlooking 6 acres of premium Cabernet Sauvignon vines.",
    features: ["Private Tasting Room", "Temperature Controlled Storage", "Pool Pavilion", "Olive Grove", "Chef's Garden", "Guest Studio"]
  }
};

export default function PropertyDetail() {
  const { id } = useParams();
  const property = propertiesData[id];

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
              <span className="text-sage/40 font-sans text-[9px] tracking-[0.2em] uppercase italic">Ref: SG-{id.substring(0, 4).toUpperCase()}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-sage mb-8 leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-3 text-sand mb-12">
              <MapPin size={18} />
              <span className="font-sans text-lg tracking-widest uppercase">{property.location}</span>
            </div>
            <p className="font-body text-xl text-sage/70 leading-relaxed mb-12 max-w-xl">
              {property.description}
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
          {Object.entries(property.specs).map(([key, value]) => (
            <div key={key}>
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand block mb-3">{key.replace('_', ' ')}</span>
              <span className="font-heading text-xl text-sage uppercase">{value}</span>
            </div>
          ))}
        </div>

        {/* Features & Amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-sage mb-12">Features & <span className="italic">Amenities</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {property.features.map((feature, i) => (
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
          {Object.keys(propertiesData).indexOf(id) > 0 ? (
            <Link 
              to={`/portfolio/${Object.keys(propertiesData)[Object.keys(propertiesData).indexOf(id) - 1]}`}
              className="group flex flex-col items-start"
            >
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand mb-2">Previous Asset</span>
              <span className="font-heading text-xl text-sage group-hover:text-sand transition-colors">
                {propertiesData[Object.keys(propertiesData)[Object.keys(propertiesData).indexOf(id) - 1]].title}
              </span>
            </Link>
          ) : <div />}

          {Object.keys(propertiesData).indexOf(id) < Object.keys(propertiesData).length - 1 ? (
            <Link 
              to={`/portfolio/${Object.keys(propertiesData)[Object.keys(propertiesData).indexOf(id) + 1]}`}
              className="group flex flex-col items-end text-right"
            >
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-sand mb-2">Next Asset</span>
              <span className="font-heading text-xl text-sage group-hover:text-sand transition-colors">
                {propertiesData[Object.keys(propertiesData)[Object.keys(propertiesData).indexOf(id) + 1]].title}
              </span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
