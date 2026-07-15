import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

const DEFAULT_CONTENT = {
  home: {
    hero: {
      badge: 'Luxury Real Estate & Investments',
      title: 'Global Legacy',
      subtitle: 'Engineered.',
      backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
      backgroundVideo: '/hero/video-v2.mp4',
      primaryCta: 'Search Properties',
      secondaryCta: 'Meet the Team',
      locations: 'San Francisco • Global Markets',
      mobileAlign: 'center'
    },
    manifesto: {
      title: 'Mission and Vision',
      subtitle: 'Synergy Global Development’s mission is to create enduring value through strategic development, disciplined investment, and collaborative partnerships. We are committed to delivering transformative projects that strengthen communities, generate long-term returns, and reflect the highest standards of integrity, innovation, and execution.\n\nOur goal is to empower business ventures to reach their full potential by providing specialized knowledge, innovative solutions, and partnerships.'
    },
    metrics: {
      items: [
        { label: "Continents", value: "3", suffix: "" },
        { label: "Active Projects", value: "3", suffix: "" },
        { label: "Years of Combined Experience", value: "20", suffix: "+" }
      ]
    },
    valuation: {
      title: 'What is your property worth?',
      description: 'Our proprietary algorithm, combined with deep market intelligence, provides an accurate valuation of your global real estate assets in minutes.',
      features: [
        'Comprehensive Market Analysis',
        'Privacy-First Data Handling'
      ]
    }
  },
  mission: {
    header: {
      badge: 'Our Ethos',
      title: 'Building Legacies Across Borders.'
    },
    missionCard: {
      badge: 'Our Mission',
      text: 'Synergy Global Development’s mission is to create enduring value through strategic development, disciplined investment, and collaborative partnerships. We are committed to delivering transformative projects that strengthen communities, generate long-term returns, and reflect the highest standards of integrity, innovation, and execution.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    visionCard: {
      badge: 'Our Vision',
      text: 'Our goal is to empower business ventures to reach their full potential by providing specialized knowledge, innovative solutions, and partnerships.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    },
    pillars: [
      { title: 'Cross-Border Reach', desc: 'Navigating complex regulatory and economic landscapes in the US and Mexico with absolute precision.' },
      { title: 'Institutional Impact', desc: 'Targeting supply chain optimization and manufacturing industries for high-yield, long-term growth.' },
      { title: 'Unwavering Integrity', desc: 'Discretion and ethical excellence are the bedrock of our advisory and development processes.' }
    ]
  },
  about: {
    header: {
      badge: 'Leadership',
      title: 'Decades of experience in cross-border real estate and institutional investments.',
      subtitle: 'Our principals bring a unique dual-market perspective to every partnership.'
    },
    narrative: {
      title: 'Our Story',
      text1: 'Founded on the principles of discretion and institutional excellence, Synergy Global has evolved into a multi-national powerhouse.',
      text2: 'We specialize in identifying undervalued assets and engineering them into world-class developments.'
    },
    team: [
      { 
        id: 1, 
        name: 'Victor M. Marquez', 
        role: 'CEO', 
        image: '/members/victor.jpg', 
        email: 'vmarquez@synergyglobaldevelopment.com',
        phone: '+1-415-314-7831',
        bio: 'Victor M. Marquez is a highly skilled business and real estate attorney with over 30 years of experience across the U.S., Mexico, and Europe. As a partner at Intelink Law Group, he specializes in real estate transactions, land use, commercial litigation, and cross-border trade. His practice bridges public and private sectors, with deep ties to the California Hispanic Chamber of Commerce and a focus on regulatory strategy, economic development, and international business.',
        specialties: ['Real Estate Law', 'Land Use', 'Commercial Litigation', 'Cross-Border Trade'],
        locations: ['San Francisco, CA']
      },
      { 
        id: 2, 
        name: 'Keith Ismael', 
        role: 'President', 
        image: '/members/keith.jpg', 
        email: 'kismael@synergyglobaldevelopment.com',
        phone: '+1-510-283-3211',
        bio: 'Keith Ismael is a former NFL athlete, entrepreneur, and investor with a disciplined approach to leadership, strategic growth, and value creation. His experience competing at the highest level of professional sports shaped the principles that guide his work today: resilience, accountability, adaptability, and a commitment to excellence.\n\nFollowing his NFL career, Keith transitioned into entrepreneurship and private investment, focusing on opportunities across real estate development, hospitality, wellness, technology, and emerging markets. As a founder and operator, he is passionate about identifying high-potential opportunities, building strategic partnerships, and developing businesses that create long-term economic value while delivering exceptional customer experiences.\n\nAt Synergy Global Development, Keith brings a forward-thinking perspective centered on innovation, execution, and sustainable growth. His work is driven by a commitment to developing transformative projects, fostering meaningful relationships, and creating lasting impact for investors, partners, and the communities the company serves.',
        specialties: ['Strategic Development', 'Real Estate Innovation', 'Business Leadership'],
        locations: ['San Francisco, CA']
      },
      { 
        id: 3, 
        name: 'Ron Torres', 
        role: 'COO', 
        image: '/members/ron.jpg', 
        email: 'rtorres@synergyglobaldevelopment.com',
        phone: '+1-650-296-3013',
        bio: 'Ron Torres is a dynamic, cross-disciplinary leader with 20+ years of experience driving innovation across technology, fitness & wellness, and business sectors. From enterprise IT rollouts to award-winning wellness programs at Electronic Arts and Stanford, Ron blends operational strategy with human-centered leadership. Now expanding into real estate development and wealth-building, he brings a rare ability to bridge systems, scale ideas, and create lasting impact.',
        specialties: ['Operational Strategy', 'Innovation', 'Cross-disciplinary Leadership'],
        locations: ['San Francisco, CA']
      }
    ],
    valueStatement: {
      text: '"Excellence is not an act, but a habit of transformative growth."'
    }
  },
  portfolio: {
    header: {
      badge: 'Track Record',
      title: 'Strategic assets across key industrial corridors.'
    },
    items: [
      { 
        id: 1, 
        title: "176 Randall Street", 
        location: "San Francisco, CA", 
        price: "Inquiry Only", 
        type: "Residential", 
        specs: "2 Luxury Townhome Condominiums | 4,600 Sq. Ft.", 
        description: "Private garden access, private elevator, and panoramic views to the bay and downtown.",
        image: '/portfolio/prop1.jpg' 
      },
      { id: 2, title: "The Glass House", location: "Paradise Valley, AZ", price: "$12,500,000", type: "Residential", specs: "6 Beds | 8 Baths", image: '/portfolio/prop2.jpg' },
      { id: 3, title: "Global Logistics Hub", location: "Mexico City, MX", price: "Inquiry Only", type: "Commercial", specs: "Industrial | 150k Sq Ft", image: '/portfolio/prop3.jpg' }
    ]
  },
  services: {
    header: {
      badge: 'Expertise',
      title: 'Our Services',
      subtitle: 'The services, advice, and counsel we provide to our clients include:'
    },
    items: [
      { id: 1, title: 'Supply Chain & Distribution', desc: 'Sourcing, production, and distribution of goods throughout the Americas’ supply chain.', image: '/services/service1.png' },
      { id: 2, title: 'Trade & Investment Promotion', desc: 'Trade and investment promotion.', image: '/services/service2.png' },
      { id: 3, title: 'Investor Representation', desc: 'Representation of real estate and industrial investors.', image: '/services/service3.png' },
      { id: 4, title: 'Corporate Formation', desc: 'Formation of corporate entities in the United States, Canada, and Mexico.', image: '/services/service1.png' },
      { id: 5, title: 'Business Advocacy', desc: 'Advocacy for all businesses and real estate related companies in the U.S. and Mexico.', image: '/services/service2.png' },
      { id: 6, title: 'Legal Services', desc: 'Legal services in Mexico and abroad.', image: '/services/service3.png' }
    ]
  },
  contact: {
    header: {
      badge: 'Get in Touch',
      title: 'Begin your transformation.',
      subtitle: 'Connect with our global advisors today.'
    },
    info: {
      email: 'Victor@SynergyGlobalDevelopment.com, VMarquez@Intelinklaw.com, info@SynergyGlobalDevelopment.com',
      office: 'San Francisco, CA',
      country: 'USA'
    }
  },
  navigation: {
    mainMenu: [
      { id: 1, label: 'Home', path: '/' },
      { id: 2, label: 'Mission and Vision', path: '/mission' },
      { id: 3, label: 'About Us', path: '/about' },
      { id: 4, label: 'Our Services', path: '/services' },
      { id: 5, label: 'Leadership', path: '/team' },
      { id: 6, label: 'Key Partnerships and Collaboration', path: '/partnerships' },
      { id: 7, label: 'Legal Services', path: '/legal' },
      { id: 8, label: 'Contact Us', path: '/contact' }
    ]
  },
  style: {
    colors: { primary: '#C6B7A0', secondary: '#2C3E35', accent: '#E5DED4' },
    typography: { heading: 'Alata', body: 'Montserrat', headingSize: 48, bodySize: 16, navSize: 10, missionBodySize: 18, manifestoBodySize: 24 },
    logoUrl: '/brand/logo-condensed-jade.png',
    logoSize: 50,
    adminLogoUrl: '',
    adminLogoSize: 100
  },
  gallery: {
    images: [
      { id: 1, src: '/gallery/WhatsApp Image 2026-05-27 at 9.57.01 AM.webp', caption: '', visible: true },
      { id: 2, src: '/gallery/0b14c02e-31f0-453f-9c81-c686663e9a5a.webp', caption: '', visible: true },
      { id: 3, src: '/gallery/1a38ee58-baeb-42e3-b348-294b1a2af7b6.webp', caption: '', visible: true },
      { id: 4, src: '/gallery/2d8df6c9-f93d-4b12-b88c-140f08fa5361.webp', caption: '', visible: true },
      { id: 5, src: '/gallery/3b92ff1e-9812-415c-8510-59ab5c187dc2.webp', caption: '', visible: true },
      { id: 6, src: '/gallery/5c1ad6e4-1d12-401b-8396-d1945c048a74.webp', caption: '', visible: true },
      { id: 7, src: '/gallery/5d1da102-8202-49df-8133-0845a5d12cad.webp', caption: '', visible: true },
      { id: 8, src: '/gallery/8f5a6ac5-4a47-4ef5-976d-98403200f411.webp', caption: '', visible: true },
      { id: 9, src: '/gallery/09f3554f-f15d-4d0f-9979-3d5dbd8c81de.webp', caption: '', visible: true },
      { id: 10, src: '/gallery/22a4219e-9ac1-46b9-b5a6-aa6f7692e02b.webp', caption: '', visible: true },
      { id: 11, src: '/gallery/42d3345b-f3ca-46ba-8d3b-9ba8566b6c9c.webp', caption: '', visible: true },
      { id: 12, src: '/gallery/64e2778c-ebe1-4bd0-b28e-4b1a0730f3cf.webp', caption: '', visible: true },
      { id: 13, src: '/gallery/97a730a3-a07b-4f6f-84b1-52cab21f63d9.webp', caption: '', visible: true },
      { id: 14, src: '/gallery/473b16dd-fe8d-499d-b674-f0a2d6c4b46f.webp', caption: '', visible: true },
      { id: 15, src: '/gallery/9021cee7-4054-48e5-b4ea-7e5de1650577.webp', caption: '', visible: true },
      { id: 16, src: '/gallery/90939c19-cb91-4e9b-b4a8-8eb360234077.webp', caption: '', visible: true },
      { id: 17, src: '/gallery/104658f0-6be0-4254-9339-354694bd1fd6.webp', caption: '', visible: true },
      { id: 18, src: '/gallery/602657f7-f0e3-4604-8ac2-5bcce5029bf4.webp', caption: '', visible: true },
      { id: 19, src: '/gallery/7758784d-76cd-4add-87e4-e7e217e7ac0b.webp', caption: '', visible: true },
      { id: 20, src: '/gallery/23064916-998e-4318-b1b5-27cfad3eb6fc.webp', caption: '', visible: true },
      { id: 21, src: '/gallery/bbd0ad22-c6e0-462a-9b6b-774ef1c228c2.webp', caption: '', visible: true },
      { id: 22, src: '/gallery/c47fc38d-5a40-489c-ad03-7833aed5767c.webp', caption: '', visible: true },
      { id: 23, src: '/gallery/f09fe24c-89a0-4f55-8149-9b760439f75e.webp', caption: '', visible: true },
      { id: 24, src: '/gallery/WhatsApp Image 2026-05-27 at 9.57.01 AM (1).webp', caption: '', visible: true }
    ]
  }
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('synergy_content_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all top-level objects exist
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          home: { 
            ...DEFAULT_CONTENT.home, 
            ...(parsed.home || {}),
            hero: { ...DEFAULT_CONTENT.home.hero, ...(parsed.home?.hero || {}), locations: DEFAULT_CONTENT.home.hero.locations }
          },
          mission: { ...DEFAULT_CONTENT.mission, ...(parsed.mission || {}) },
          about: { 
            ...DEFAULT_CONTENT.about, 
            ...(parsed.about || {}),
            // Team always from code
            team: DEFAULT_CONTENT.about.team
          },
          portfolio: { 
            ...DEFAULT_CONTENT.portfolio, 
            ...(parsed.portfolio || {}),
            // Portfolio items always from code
            items: DEFAULT_CONTENT.portfolio.items
          },
          services: { ...DEFAULT_CONTENT.services, ...(parsed.services || {}) },
          contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) },
          // Navigation always driven by code
          navigation: DEFAULT_CONTENT.navigation,
          style: { ...DEFAULT_CONTENT.style, ...(parsed.style || {}) },
          gallery: {
            ...DEFAULT_CONTENT.gallery,
            ...(parsed.gallery || {}),
            images: (parsed.gallery?.images || DEFAULT_CONTENT.gallery.images)
          }
        };
      } catch (e) {
        return DEFAULT_CONTENT;
      }
    }
    return DEFAULT_CONTENT;
  });

  const [authToken, setAuthToken] = useState(() => localStorage.getItem('synergy_admin_token') || '');

  useEffect(() => {
    const fetchFromServer = async () => {
      try {
        const response = await fetch('/api.php?t=' + new Date().getTime());
        if (response.ok) {
          const serverData = await response.json();
          if (serverData && Object.keys(serverData).length > 0) {
            setContent(prev => {
              const merged = { ...prev };
              Object.keys(serverData).forEach(key => {
                // These keys are always driven by code — skip server override
                if (key === 'navigation') return;
                if (key === 'about') {
                  merged.about = { ...prev.about, ...serverData.about, team: DEFAULT_CONTENT.about.team };
                  return;
                }
                if (key === 'portfolio') {
                  merged.portfolio = { ...prev.portfolio, ...serverData.portfolio, items: DEFAULT_CONTENT.portfolio.items };
                  return;
                }
                if (typeof serverData[key] === 'object' && serverData[key] !== null && !Array.isArray(serverData[key])) {
                  merged[key] = { ...(merged[key] || {}), ...serverData[key] };
                } else {
                  merged[key] = serverData[key];
                }
              });
              // Always enforce code-defined navigation, team and portfolio
              merged.navigation = DEFAULT_CONTENT.navigation;
              if (merged.home?.hero) {
                merged.home.hero.locations = DEFAULT_CONTENT.home.hero.locations;
                merged.home.hero.backgroundVideo = DEFAULT_CONTENT.home.hero.backgroundVideo;
              }
              return merged;
            });
          }
        }
      } catch (e) {
        console.warn("Using local content.");
      }
    };
    fetchFromServer();
  }, []);

  useEffect(() => {
    localStorage.setItem('synergy_content_v2', JSON.stringify(content));
    
    if (content.colors) {
      document.documentElement.style.setProperty('--color-primary', content.colors.primary);
      document.documentElement.style.setProperty('--color-secondary', content.colors.secondary);
      document.documentElement.style.setProperty('--color-bg', content.colors.background);
    }
    if (content.style?.logoSize) {
      document.documentElement.style.setProperty('--logo-size', `${content.style.logoSize}px`);
    }
  }, [content]);

  // Sync state across tabs/iframes (Live Preview)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'synergy_content' && e.newValue) {
        setContent(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (password) => {
    try {
      const res = await fetch('/api.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        localStorage.setItem('synergy_admin_token', data.token);
        setAuthToken(data.token);
        return { ok: true };
      }
      return { ok: false, message: data.message || 'No se pudo iniciar sesion' };
    } catch (e) {
      return { ok: false, message: 'Error de conexion con el servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('synergy_admin_token');
    setAuthToken('');
  };

  const saveToServer = async () => {
    if (!authToken) return false;
    try {
      const response = await fetch('/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(content)
      });
      if (response.status === 401) { logout(); return false; }
      return response.ok;
    } catch (e) {
      console.error("Failed to save to server:", e);
      return false;
    }
  };

  const uploadFile = async (file) => {
    if (!authToken) return { ok: false, message: 'Sesion expirada. Vuelve a iniciar sesion.' };
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api.php', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });
      if (response.status === 401) { logout(); return { ok: false, message: 'Sesion expirada. Vuelve a iniciar sesion.' }; }
      const data = await response.json().catch(() => ({}));
      if (data.status === 'success' && data.url) return { ok: true, url: data.url };
      return { ok: false, message: data.message || 'Error al subir el archivo' };
    } catch (e) {
      return { ok: false, message: 'Fallo la subida del archivo' };
    }
  };

  const updateContent = (page, section, data) => {
    setContent(prev => {
      const pageData = prev[page] || {};

      if (!section) {
        return { ...prev, [page]: { ...pageData, ...data } };
      }

      if (Array.isArray(data)) {
        return { ...prev, [page]: { ...pageData, [section]: data } };
      }

      return {
        ...prev,
        [page]: {
          ...pageData,
          [section]: {
            ...(pageData[section] || {}),
            ...data
          }
        }
      };
    });
  };

  const resetContent = () => {
    localStorage.removeItem('synergy_content');
    setContent(DEFAULT_CONTENT);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, saveToServer, authToken, isAuthed: !!authToken, login, logout, uploadFile }}>
      {children}
    </ContentContext.Provider>
  );
};
