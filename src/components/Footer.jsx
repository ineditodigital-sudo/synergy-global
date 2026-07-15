import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin } from 'lucide-react';
import logoWhite from '../assets/brand/logo-horizontal-white.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-bone pt-24 pb-12 px-6 md:px-16 overflow-hidden relative">
      {/* Subtle background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sand/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/">
              <img src={logoWhite} alt="Synergy Global" className="h-10 w-auto mb-8 opacity-90" />
            </Link>
            <p className="font-sans font-light text-sm text-bone/60 leading-relaxed mb-8 max-w-xs">
              Shaping the future through transformative real estate development and strategic global investment.
            </p>
            <div className="flex space-x-6 text-sand">
              <a href="#" className="hover:text-white transition-colors"><Globe size={20} /></a>
              <a href="mailto:info@SynergyGlobalDevelopment.com" className="hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          {/* Site Map Column */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-8">Navigation</h4>
            <ul className="space-y-4 font-sans text-[11px] tracking-widest uppercase">
              <li><Link to="/about" className="hover:text-sand transition-colors">Our Leadership</Link></li>
              <li><Link to="/portfolio" className="hover:text-sand transition-colors">Private Portfolio</Link></li>
              <li><Link to="/services" className="hover:text-sand transition-colors">Expertise & Services</Link></li>
              <li><Link to="/mission" className="hover:text-sand transition-colors">Mission & Vision</Link></li>
            </ul>
          </div>

          {/* Alliance Column */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-8">Strategic</h4>
            <ul className="space-y-4 font-sans text-[11px] tracking-widest uppercase">
              <li><Link to="/partnerships" className="hover:text-sand transition-colors">Global Alliances</Link></li>
              <li><Link to="/contact" className="hover:text-sand transition-colors">Advisory Request</Link></li>
              <li><Link to="/legal" className="hover:text-sand transition-colors">Investor Portal</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-8">Headquarters</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-sand mt-1 flex-shrink-0" />
                <div>
                  <p className="font-sans font-semibold text-sm text-bone leading-tight">San Francisco, CA</p>
                  <p className="font-sans font-light text-xs text-bone/50 mt-1">United States</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <a href="mailto:info@SynergyGlobalDevelopment.com" className="text-sand hover:text-white transition-colors text-[10px] tracking-widest uppercase">info@SynergyGlobalDevelopment.com</a>
                <span className="flex items-center gap-2 text-[9px] tracking-widest uppercase text-bone/40"><Globe size={10} /> Worldwide Presence</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-bone/30">
            &copy; {currentYear} Synergy Global Development & Investments, Inc. All rights reserved.
          </p>
          <div className="flex space-x-10 font-sans text-[10px] tracking-[0.3em] uppercase text-bone/30">
            <Link to="/legal" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/legal" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
