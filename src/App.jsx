import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Mission from './pages/Mission';
import About from './pages/About';
import Services from './pages/Services';
import Partnerships from './pages/Partnerships';
import Legal from './pages/Legal';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import MemberProfile from './pages/MemberProfile';
import PropertyDetail from './pages/PropertyDetail';

// Service Detail Pages
import SupplyChain from './pages/services/SupplyChain';
import RealEstate from './pages/services/RealEstate';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function CustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (!cursor || !follower) return;

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        overwrite: true
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        overwrite: true
      });
    };

    window.addEventListener('mousemove', moveCursor);
    
    const handleLinkHover = () => {
      gsap.to(follower, { scale: 1.5, backgroundColor: 'rgba(198, 183, 160, 0.1)', duration: 0.3 });
    };
    const handleLinkLeave = () => {
      gsap.to(follower, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
    };

    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleLinkLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover);
        link.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="custom-cursor hidden md:block"></div>
      <div className="custom-cursor-follower hidden md:block"></div>
    </>
  );
}

import AdminDashboard from './pages/admin/AdminDashboard';
import './admin.css';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';
  const hideGlobalUI = isAdmin || isPreview;

  return (
    <div className={`relative w-full min-h-screen ${isAdmin ? 'bg-white' : 'bg-bone'} flex flex-col`}>
      {!hideGlobalUI && <div className="noise-overlay"></div>}
      {!hideGlobalUI && <CustomCursor />}
      <ScrollToTop />
      
      {!hideGlobalUI && <Navbar />}
      
      <main className={`flex-grow ${isPreview ? 'pt-0' : ''}`}>
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          <Route path="/" element={<Home />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/supply-chain" element={<SupplyChain />} />
          <Route path="/services/real-estate" element={<RealEstate />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<PropertyDetail />} />
          <Route path="/team/:id" element={<MemberProfile />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      
      {!hideGlobalUI && <Footer />}
    </div>
  );
}

import { ContentProvider } from './context/ContentContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', color: 'red', background: 'white', minHeight: '100vh' }}>
          <h1>Algo salió mal al cargar la web:</h1>
          <pre>{this.state.error?.toString()}</pre>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}>Limpiar Datos y Reintentar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ContentProvider>
        <Router>
          <AppContent />
        </Router>
      </ContentProvider>
    </ErrorBoundary>
  );
}

export default App;

