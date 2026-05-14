import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Search, User } from 'lucide-react';
import logoJade from '../assets/brand/logo-horizontal-jade.png';
import logoWhite from '../assets/brand/logo-horizontal-white.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const isSolid = !isHome || scrolled;

  return (
    <>
      {/* Secondary Bar (Top) */}
      <div className={`hidden lg:flex fixed top-0 left-0 w-full z-[60] bg-charcoal text-[9px] font-sans tracking-[0.3em] uppercase py-2 px-16 justify-between items-center transition-transform duration-500 ${scrolled ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="flex space-x-8 text-bone/60">
          <span className="flex items-center gap-2"><Globe size={10} /> Global Operations</span>
          <span className="flex items-center gap-2 border-l border-white/10 pl-8">USA | MEXICO | CANADA</span>
        </div>
        <div className="flex space-x-8 text-bone/60">
          <Link to="/contact" className="hover:text-sand">Contact Us</Link>
          <Link to="/" className="hover:text-sand flex items-center gap-2"><User size={10} /> My Portal</Link>
        </div>
      </div>

      {/* Primary Navbar */}
      <div className={`fixed ${scrolled ? 'top-0' : 'lg:top-8'} left-0 w-full z-50 transition-all duration-700 ${isSolid ? 'bg-bone border-b border-sand/40 py-3' : 'bg-transparent py-6'}`}>
        <nav className={`w-full max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between ${isSolid ? 'text-sage' : 'text-white'}`}>
          <div className="flex items-center">
            <Link to="/">
              <img src={isSolid ? logoJade : logoWhite} alt="Synergy Global" className="h-7 md:h-9 w-auto" />
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-10 text-[10px] font-sans tracking-widest uppercase font-medium">
            <Link to="/" className={`hover:text-sand transition-all relative group ${location.pathname === '/' ? 'text-sand' : ''}`}>
              Home
              <span className={`absolute -bottom-2 left-0 h-px bg-sand transition-all duration-500 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/mission" className={`hover:text-sand transition-all relative group ${location.pathname === '/mission' ? 'text-sand' : ''}`}>
              Mission & Vision
              <span className={`absolute -bottom-2 left-0 h-px bg-sand transition-all duration-500 ${location.pathname === '/mission' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/about" className={`hover:text-sand transition-all relative group ${location.pathname === '/about' ? 'text-sand' : ''}`}>
              Leadership
              <span className={`absolute -bottom-2 left-0 h-px bg-sand transition-all duration-500 ${location.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/portfolio" className={`hover:text-sand transition-all relative group ${location.pathname === '/portfolio' ? 'text-sand' : ''}`}>
              Portfolio
              <span className={`absolute -bottom-2 left-0 h-px bg-sand transition-all duration-500 ${location.pathname === '/portfolio' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/services" className={`hover:text-sand transition-all relative group ${location.pathname === '/services' ? 'text-sand' : ''}`}>
              Our Services
              <span className={`absolute -bottom-2 left-0 h-px bg-sand transition-all duration-500 ${location.pathname === '/services' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Search size={18} className="cursor-pointer hover:text-sand hidden lg:block" />
            <Link to="/contact" className={`hidden lg:block px-8 py-3 text-[10px] tracking-widest border transition-all duration-500 ${isSolid ? 'border-sage bg-sage text-bone hover:bg-charcoal' : 'border-white text-white hover:bg-white hover:text-sage'}`}>
              GET IN TOUCH
            </Link>
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-bone z-40 flex flex-col items-center justify-center transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col items-center space-y-6 text-base font-sans tracking-widest uppercase text-sage">
          <Link to="/">Home</Link>
          <Link to="/about">Leadership</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/services">Services</Link>
          <Link to="/mission">Mission & Vision</Link>
          <Link to="/contact" className="bg-sand px-10 py-3 mt-4 text-white">Contact</Link>
        </div>
      </div>
    </>
  );
}
