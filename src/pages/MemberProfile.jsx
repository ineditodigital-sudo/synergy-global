import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Globe, ArrowLeft, Users } from 'lucide-react';
import SEO from '../components/SEO';

const teamData = {
  'victor-marquez': {
    name: "Victor M. Marquez",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200",
    email: "victor@SynergyGlobalDevelopment.com",
    bio: "Victor M. Marquez is a highly skilled business and real estate attorney with over 30 years of experience across the U.S., Mexico, and Europe. As a partner at Intelink Law Group, he specializes in real estate transactions, land use, commercial litigation, and cross-border trade. His practice bridges the gap between North American markets, providing institutional-grade counsel to global investors.",
    specialties: ["Cross-Border Law", "Institutional Real Estate", "Global Trade Policy", "Commercial Litigation"],
    locations: ["California", "Mexico City", "Madrid"]
  },
  'marisol-jimenez': {
    name: "Marisol Jimenez",
    role: "Managing Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    email: "marisol@SynergyGlobalDevelopment.com",
    bio: "Specializing in international logistics and supply chain optimization, Marisol leads our global distribution strategies. With a background in cross-border trade, she ensures operational excellence across all manufacturing industries.",
    specialties: ["Supply Chain Logistics", "Global Distribution", "Trade Optimization", "Operational Excellence"],
    locations: ["Pan-American Markets", "San Francisco", "Mexico City"]
  },
  'roberto-castillo': {
    name: "Roberto Castillo",
    role: "Strategic Advisor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
    email: "roberto@SynergyGlobalDevelopment.com",
    bio: "Roberto brings extensive experience in Mexico's real estate development sector. His expertise in land use and commercial litigation provides our clients with a secure foundation for transformative investments.",
    specialties: ["Real Estate Development", "Land Use Policy", "Strategic Advisory", "Market Intelligence"],
    locations: ["Mexico", "Phoenix", "Southwest USA"]
  }
};

export default function MemberProfile() {
  const { id } = useParams();
  const member = teamData[id];

  if (!member) {
    return (
      <div className="pt-48 pb-24 text-center">
        <h1 className="font-body text-4xl text-sage mb-8">Member not found</h1>
        <Link to="/about" className="text-sand uppercase tracking-widest text-xs">Back to Leadership</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <SEO title={member.name} description={member.role} />
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        
        {/* Back Button */}
        <Link to="/about" className="flex items-center space-x-2 text-sand hover:text-sage transition-colors mb-16 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase">Leadership</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          
          {/* Image Column */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] bg-charcoal overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 border-[20px] border-bone/5 pointer-events-none"></div>
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="mt-12 space-y-8">
              <div>
                <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-4">Contact</h4>
                <a href={`mailto:${member.email}`} className="flex items-center space-x-3 text-sage hover:text-sand transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                  <span className="font-sans text-sm">{member.email}</span>
                </a>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="w-12 h-12 rounded-full border border-sand/20 flex items-center justify-center text-sage hover:bg-sand hover:text-bone transition-all">
                  <Users size={20} strokeWidth={1.5} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-sand/20 flex items-center justify-center text-sage hover:bg-sand hover:text-bone transition-all">
                  <Globe size={20} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          {/* Bio Column */}
          <div className="lg:col-span-7">
            <div className="mb-12">
              <h1 className="font-body text-5xl md:text-5xl text-sage mb-4 leading-tight">{member.name}</h1>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-sand font-medium">{member.role}</p>
            </div>

            <div className="h-px w-full bg-sand/20 mb-12"></div>

            <div className="prose prose-sage max-w-none">
              <p className="font-sans font-light text-xl text-sage/80 leading-relaxed mb-12 text-justify">
                {member.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 pt-16 border-t border-sand/20">
              <div>
                <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-6">Specialties</h4>
                <ul className="space-y-4">
                  {member.specialties.map((spec, i) => (
                    <li key={i} className="flex items-center space-x-3 font-sans text-sm text-sage/70">
                      <div className="w-1.5 h-1.5 bg-sand rounded-full"></div>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-6">Key Markets</h4>
                <div className="flex flex-wrap gap-3">
                  {member.locations.map((loc, i) => (
                    <span key={i} className="px-4 py-2 bg-bone border border-sand/20 font-sans text-[10px] tracking-widest uppercase text-sage">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
