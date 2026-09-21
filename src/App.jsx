import { Component, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ContentProvider from './content/ContentProvider.jsx';
import { useContent } from './content/context.js';
import { useSeoSync } from './lib/seo.js';
import { isPreviewFrame } from './lib/preview.js';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Home from './pages/Home.jsx';
import Mission from './pages/Mission.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Partnerships from './pages/Partnerships.jsx';
import Legal from './pages/Legal.jsx';
import Contact from './pages/Contact.jsx';
import Portfolio from './pages/Portfolio.jsx';
import PropertyDetail from './pages/PropertyDetail.jsx';
import MemberProfile from './pages/MemberProfile.jsx';
import NotFound from './pages/NotFound.jsx';

// The CMS is only downloaded by people who open /admin.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('[app]', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bone text-sage px-6 text-center">
        <p className="font-sans tracking-[0.4em] text-[10px] uppercase text-sand mb-6">Synergy Global</p>
        <h1 className="font-heading text-4xl mb-6">Something went wrong.</h1>
        <p className="font-sans font-light text-sage/70 mb-10 max-w-md">Please reload the page. If the problem continues, contact us at info@SynergyGlobalDevelopment.com.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-sage text-bone px-8 py-4 font-sans text-[10px] tracking-[0.3em] uppercase"
        >
          Reload
        </button>
      </div>
    );
  }
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** Google Analytics 4, only when an ID is set in the CMS (never in the preview). */
function Analytics() {
  const { settings } = useContent();
  const { pathname } = useLocation();
  const id = /^G-[A-Z0-9]{4,}$/i.test(settings.analyticsId) ? settings.analyticsId.toUpperCase() : '';

  useEffect(() => {
    if (!id || isPreviewFrame() || window.gtag) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });
  }, [id]);

  useEffect(() => {
    if (id && window.gtag && !isPreviewFrame()) window.gtag('event', 'page_view', { page_path: pathname, page_location: window.location.href });
  }, [id, pathname]);
  return null;
}

function PublicSite() {
  useSeoSync();
  const preview = isPreviewFrame();
  return (
    <div className="relative w-full min-h-screen bg-bone flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-sage focus:text-bone focus:px-4 focus:py-2">
        Skip to content
      </a>
      {!preview && <CustomCursor />}
      <ScrollManager />
      <Analytics />
      <Navbar />
      <main id="main" className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<PropertyDetail />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<About />} />
          <Route path="/team/:slug" element={<MemberProfile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function AdminLoading() {
  return <div className="min-h-screen flex items-center justify-center bg-[#f6f4ef] text-[#2C3E35] font-sans text-sm">Loading…</div>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <ContentProvider>
                <PublicSite />
              </ContentProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
