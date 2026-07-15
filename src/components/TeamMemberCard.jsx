import React from 'react';
import { Link } from 'react-router-dom';

export default function TeamMemberCard({ member }) {
  return (
    <div className="team-card-premium w-full">
      <Link 
        to={`/team/${member.id}`} 
        className="group block relative aspect-[3/4] w-full h-full"
      >
        {/* Exterior Frame */}
        <div className="absolute -inset-0 border border-transparent group-hover:border-sand/60 group-hover:-inset-4 transition-all duration-500 ease-out pointer-events-none z-20" />
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-transparent group-hover:border-sand group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-500 ease-out z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-transparent group-hover:border-sand group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-500 ease-out z-20 pointer-events-none" />

        {/* Inner Image Container */}
        <div className="absolute inset-0 overflow-hidden bg-sage/20 border border-white/5">
          <img 
            src={member.image} 
            alt={member.name} 
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 ease-out opacity-60 group-hover:opacity-100"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700"></div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 transform group-hover:translate-y-[-10px] transition-transform duration-700">
            <div className="overflow-hidden mb-3 h-0 group-hover:h-6 transition-all duration-700">
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                {member.role}
              </p>
            </div>
            <div className="overflow-hidden">
              <h4 className="font-heading text-2xl md:text-3xl text-white">
                {member.name}
              </h4>
            </div>
            
            <div className="mt-6 md:mt-8 w-12 h-px bg-sand opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </div>
      </Link>
    </div>
  );
}
