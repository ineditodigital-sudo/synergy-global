import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';
import { useContent } from '../content/context.js';
import SmartLink from './ui/SmartLink.jsx';
import SmartImage from './ui/SmartImage.jsx';

const isActive = (pathname, path) => {
  const clean = String(path || '').split('#')[0];
  if (!clean.startsWith('/')) return false;
  if (clean === '/') return pathname === '/';
  return pathname === clean || pathname.startsWith(`${clean}/`);
};

export default function Navbar() {
  const { navigation: nav, style } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const items = nav.mainMenu.filter((i) => i.visible && i.label.trim());
  const topBar = nav.topBar.visible && (nav.topBar.text || nav.topBar.linkLabel);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = pathname !== '/' || scrolled || open;
  const logo = solid ? style.logo : style.logoOnDark || style.logo;
  const close = () => setOpen(false);

  return (
    <>
      {topBar && (
        <div
          className={`hidden lg:flex fixed top-0 left-0 w-full z-[60] bg-charcoal text-[9px] font-sans tracking-[0.3em] uppercase py-2 px-8 xl:px-16 justify-between items-center transition-transform duration-500 ${scrolled ? '-translate-y-full' : 'translate-y-0'}`}
        >
          <span className="flex items-center gap-2 text-sand font-medium">
            {nav.topBar.text && (
              <>
                <MapPin size={10} aria-hidden="true" /> {nav.topBar.text}
              </>
            )}
          </span>
          {nav.topBar.linkLabel && (
            <SmartLink to={nav.topBar.linkPath} className="text-bone/60 hover:text-sand transition-colors">
              {nav.topBar.linkLabel}
            </SmartLink>
          )}
        </div>
      )}

      <header
        className={`fixed left-0 w-full z-50 transition-all duration-700 ${scrolled || !topBar ? 'top-0' : 'top-0 lg:top-8'} ${solid ? 'bg-bone border-b border-sand/40 py-3' : 'bg-transparent py-6'}`}
      >
        <nav
          aria-label="Main"
          className={`w-full max-w-[1400px] mx-auto px-6 lg:px-4 xl:px-16 flex items-center justify-between gap-4 ${solid ? 'text-sage' : 'text-white'}`}
        >
          <SmartLink to="/" className="shrink-0" onClick={close} aria-label="Synergy Global – Home">
            <SmartImage
              src={logo}
              alt="Synergy Global Development & Investments"
              priority
              preferred={400}
              sizes="200px"
              className="w-auto object-contain transition-all duration-300"
              placeholderClassName="bg-transparent w-32"
              style={{ height: `${style.logoHeight}px` }}
            />
          </SmartLink>

          <ul
            className="hidden lg:flex flex-wrap justify-end min-w-0 items-center gap-x-3 gap-y-2 xl:gap-x-5 font-sans tracking-[0.08em] xl:tracking-[0.15em] uppercase font-medium"
            style={{ fontSize: `${style.navTextSize}px` }}
          >
            {items.map((item) => {
              const active = isActive(pathname, item.path);
              return (
                <li key={item.id}>
                  <SmartLink
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`hover:text-sand transition-colors relative group whitespace-nowrap ${active ? 'text-sand' : ''}`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-sand transition-all duration-500 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </SmartLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            {nav.showCta && nav.ctaLabel && (
              <SmartLink
                to={nav.ctaPath}
                className={`hidden xl:block shrink-0 whitespace-nowrap px-6 2xl:px-8 py-3 text-[10px] tracking-widest uppercase border transition-all duration-500 ${solid ? 'border-sage bg-sage text-bone hover:bg-charcoal' : 'border-white text-white hover:bg-white hover:text-sage'}`}
              >
                {nav.ctaLabel}
              </SmartLink>
            )}
            <button
              type="button"
              className="lg:hidden p-2 -mr-2"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={`lg:hidden fixed inset-0 bg-bone z-40 flex flex-col items-center justify-center overflow-y-auto py-24 transition-all duration-500 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <ul className="flex flex-col items-center gap-6 text-base font-sans tracking-widest uppercase text-sage text-center px-6">
          {items.map((item) => (
            <li key={item.id}>
              <SmartLink to={item.path} onClick={close} className={isActive(pathname, item.path) ? 'text-sand' : ''}>
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
        {nav.showCta && nav.ctaLabel && (
          <SmartLink to={nav.ctaPath} onClick={close} className="bg-sand px-10 py-3 mt-8 text-white font-sans tracking-widest uppercase">
            {nav.ctaLabel}
          </SmartLink>
        )}
      </div>
    </>
  );
}
