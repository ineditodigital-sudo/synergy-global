import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Search, User, MapPin } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import logoJade from '../assets/brand/logo-horizontal-jade.png';
import logoWhite from '../assets/brand/logo-horizontal-white.png';

export default function Navbar() {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = content.navigation?.mainMenu || [];

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
      <div className={`hidden lg:flex fixed top-0 left-0 w-full z-[60] bg-charcoal text-[8px] xl:text-[9px] font-sans tracking-[0.2em] xl:tracking-[0.3em] uppercase py-2 px-8 xl:px-16 justify-between items-center transition-transform duration-500 ${scrolled ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="flex space-x-6 xl:space-x-8 text-bone/60">
          <span className="flex items-center gap-2 text-sand font-medium">
            <MapPin size={10} className="text-sand" /> San Francisco, CA — Headquarters
          </span>
        </div>
        <div className="flex space-x-6 xl:space-x-8 text-bone/60">
          <Link to="/contact" className="hover:text-sand">Contact Us</Link>
          <Link to="/" className="hover:text-sand flex items-center gap-2"><User size={10} /> My Portal</Link>
        </div>
      </div>

      {/* Primary Navbar */}
      <div className={`fixed ${scrolled ? 'top-0' : 'lg:top-8'} left-0 w-full z-50 transition-all duration-700 ${isSolid ? 'bg-bone border-b border-sand/40 py-3' : 'bg-transparent py-6'}`}>
        <nav className={`w-full max-w-[1400px] mx-auto px-6 lg:px-4 xl:px-16 flex items-center justify-between ${isSolid ? 'text-sage' : 'text-white'}`}>
          <Link to="/" className="shrink-0">
            <img 
              src={isSolid ? (content.style?.logoUrl || '/brand/logo-condensed-jade.png') : '/brand/logo-condensed-white.png'} 
              alt="Synergy Global" 
              className="w-auto object-contain transition-all duration-300" 
              style={{ height: content.style?.logoSize ? `${content.style.logoSize}px` : '50px' }}
            />
          </Link>
          
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-5 font-sans tracking-[0.05em] xl:tracking-[0.15em] uppercase font-medium transition-all duration-300" style={{ fontSize: `${content.style?.typography?.navSize || 10}px` }}>
            {menuItems.map((item, idx) => (
              <Link 
                key={idx}
                to={item.path} 
                className={`hover:text-sand transition-all relative group whitespace-nowrap ${location.pathname === item.path ? 'text-sand' : ''}`}
              >
                {item.label}
                <span className={`absolute -bottom-2 left-0 h-px bg-sand transition-all duration-500 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3 xl:space-x-6">
            {/* Search removed */}
            <Link to="/contact" className={`hidden lg:block shrink-0 whitespace-nowrap px-4 xl:px-8 py-3 text-[9px] xl:text-[10px] tracking-widest border transition-all duration-500 ${isSolid ? 'border-sage bg-sage text-bone hover:bg-charcoal' : 'border-white text-white hover:bg-white hover:text-sage'}`}>
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
          {menuItems.map((item, idx) => (
            <Link key={idx} to={item.path}>{item.label}</Link>
          ))}
          <Link to="/contact" className="bg-sand px-10 py-3 mt-4 text-white">Contact</Link>
        </div>
      </div>
    </>
  );
}

