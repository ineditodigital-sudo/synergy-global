import React from 'react';
import { Link } from 'react-router-dom';

export default function TeamMemberCard({ member }) {
  return (
    <Link to={`/team/${member.id}`} className="group block text-center">
      <div className="relative aspect-[4/5] overflow-hidden mb-6 team-card">
        {/* Main Image */}
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Hover Overlay (Glassmorphism Effect) */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
          {/* Animated Border */}
          <div className="absolute inset-4 border border-charcoal/40 opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-100 transition-all duration-700"></div>
          
          {/* Learn More Button */}
          <div className="relative z-10 bg-bone/90 border border-charcoal py-3 px-8 text-[10px] tracking-[0.3em] uppercase text-charcoal opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
            Learn More
          </div>
        </div>
      </div>

      <h3 className="font-body text-2xl text-sage mb-2 transition-colors group-hover:text-sand">
        {member.name}
      </h3>
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-sand font-medium">
        {member.role}
      </p>
    </Link>
  );
}
