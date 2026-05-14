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
      primaryCta: 'Search Properties',
      secondaryCta: 'Meet the Team',
      locations: 'Paradise Valley • Scottsdale • Phoenix • Global Markets'
    },
    manifesto: {
      title: 'Our Purpose',
      subtitle: 'To Engineer Legacies that transcend borders and generations.'
    },
    metrics: {
      items: [
        { label: "Total Transactions", value: "820", suffix: "+" },
        { label: "Total Sales Volume", value: "$909M", suffix: "+" },
        { label: "Active Team", value: "29", suffix: " Agents" },
        { label: "Avg Sale Price", value: "$1.9M", suffix: "" }
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
      text: 'To engineer sustainable value through absolute precision in real estate and infrastructure development.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    visionCard: {
      badge: 'Our Vision',
      text: 'To be the preeminent bridge for global investment, transforming industrial landscapes into human progress.',
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
      { id: 1, name: 'Bernardo Coppel', role: 'Principal / Strategic Advisory', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', bio: 'Strategic visionary with deep roots in cross-border real estate.' },
      { id: 2, name: 'Strategic Partner', role: 'Institutional Investment', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', bio: 'Expert in global capital markets and industrial optimization.' }
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
      { id: 1, title: "The Glass House", location: "Paradise Valley, AZ", price: "$12,500,000", type: "Residential", specs: "6 Beds | 8 Baths", image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
      { id: 2, title: "San Miguel Estate", location: "Paradise Valley, AZ", price: "$8,900,000", type: "Residential", specs: "5 Beds | 6 Baths", image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
      { id: 3, title: "Global Logistics Hub", location: "Mexico City, MX", price: "Inquiry Only", type: "Commercial", specs: "Industrial | 150k Sq Ft", image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  services: {
    header: {
      badge: 'Expertise',
      title: 'Global Solutions for Transformative Growth.',
      subtitle: 'Specialized knowledge across borders.'
    },
    items: [
      { id: 1, title: 'Real Estate Strategy', desc: 'Institutional-grade advisory for luxury and commercial properties.' },
      { id: 2, title: 'Supply Chain Optimization', desc: 'Efficiency and resilience for global manufacturing and trade.' },
      { id: 3, title: 'Strategic Partnerships', desc: 'Connecting vetted capital with high-impact ventures.' }
    ]
  },
  contact: {
    header: {
      badge: 'Get in Touch',
      title: 'Begin your transformation.',
      subtitle: 'Connect with our global advisors today.'
    },
    info: {
      email: 'info@SynergyGlobalDevelopment.com',
      office: 'San Francisco, CA',
      country: 'USA'
    }
  },
  colors: {
    primary: '#C6B7A0',
    secondary: '#1D1D1F',
    background: '#F5F5F7'
  }
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('synergy_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all top-level objects exist
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          home: { ...DEFAULT_CONTENT.home, ...(parsed.home || {}) },
          mission: { ...DEFAULT_CONTENT.mission, ...(parsed.mission || {}) },
          about: { ...DEFAULT_CONTENT.about, ...(parsed.about || {}) },
          portfolio: { ...DEFAULT_CONTENT.portfolio, ...(parsed.portfolio || {}) },
          services: { ...DEFAULT_CONTENT.services, ...(parsed.services || {}) },
          contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) }
        };
      } catch (e) {
        return DEFAULT_CONTENT;
      }
    }
    return DEFAULT_CONTENT;
  });

  useEffect(() => {
    const fetchFromServer = async () => {
      try {
        const response = await fetch('/api.php');
        if (response.ok) {
          const serverData = await response.json();
          if (serverData && Object.keys(serverData).length > 0) {
            setContent(prev => {
              // Deep merge server data with defaults/prev
              const merged = { ...prev };
              Object.keys(serverData).forEach(key => {
                if (typeof serverData[key] === 'object' && serverData[key] !== null && !Array.isArray(serverData[key])) {
                  merged[key] = { ...(merged[key] || {}), ...serverData[key] };
                } else {
                  merged[key] = serverData[key];
                }
              });
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
    localStorage.setItem('synergy_content', JSON.stringify(content));
    
    if (content.colors) {
      document.documentElement.style.setProperty('--color-primary', content.colors.primary);
      document.documentElement.style.setProperty('--color-secondary', content.colors.secondary);
      document.documentElement.style.setProperty('--color-bg', content.colors.background);
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

  const saveToServer = async () => {
    try {
      const response = await fetch('/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      return response.ok;
    } catch (e) {
      console.error("Failed to save to server:", e);
      return false;
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
    <ContentContext.Provider value={{ content, updateContent, resetContent, saveToServer }}>
      {children}
    </ContentContext.Provider>
  );
};
