import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const team = [
  {
    id: 'victor-marquez',
    name: "Victor M. Marquez",
    role: "CEO & Founder",
    image: "/team/victor.png"
  },
  {
    id: 'marisol-jimenez',
    name: "Marisol Jimenez",
    role: "Managing Director",
    image: "/team/marisol.png"
  },
  {
    id: 'roberto-castillo',
    name: "Roberto Castillo",
    role: "Strategic Advisor",
    image: "/team/roberto.png"
  },
  {
    id: 'elena-vargas',
    name: "Elena Vargas",
    role: "Global Logistics",
    image: "/team/elena.png"
  },
  {
    id: 'marcus-thorne',
    name: "Marcus Thorne",
    role: "Investment Analyst",
    image: "/team/marcus.png"
  }
];

export default function TeamCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-32 bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="font-sans font-light tracking-[0.4em] text-[10px] uppercase text-sand mb-6">Our Leadership</h2>
            <h3 className="font-heading text-4xl md:text-5xl text-white">The Minds Behind the Vision.</h3>
          </div>
          <div className="flex items-center space-x-12">
            <Link to="/about" className="group flex items-center space-x-4 text-sand hover:text-white transition-colors duration-500">
              <span className="font-sans text-xs tracking-widest uppercase">Full Leadership</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => scroll('left')}
                className="p-4 border border-white/10 text-white hover:bg-white hover:text-charcoal transition-all duration-500 rounded-full"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-4 border border-white/10 text-white hover:bg-white hover:text-charcoal transition-all duration-500 rounded-full"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex space-x-8 px-6 md:px-16 overflow-x-auto no-scrollbar pb-12 snap-x snap-mandatory"
      >
        {team.map((member) => (
          <Link 
            to={`/team/${member.id}`} 
            key={member.id}
            className="team-card-premium flex-shrink-0 w-[300px] md:w-[450px] group relative aspect-[3/4] overflow-hidden bg-sage/20 border border-white/5 snap-start"
          >
            {/* Background Image */}
            <img 
              src={member.image} 
              alt={member.name} 
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out opacity-60 group-hover:opacity-100"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-10 transform group-hover:translate-y-[-10px] transition-transform duration-700">
              <div className="overflow-hidden mb-3 h-0 group-hover:h-6 transition-all duration-700">
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {member.role}
                </p>
              </div>
              <div className="overflow-hidden">
                <h4 className="font-heading text-3xl text-white">
                  {member.name}
                </h4>
              </div>
              
              <div className="mt-8 w-12 h-px bg-sand opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </Link>
        ))}
        
        <div className="flex-shrink-0 w-16"></div>
      </div>


      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

