import React, { useEffect } from 'react';

export default function SEO({ title, description }) {
  useEffect(() => {
    document.title = `${title} | Synergy Global Development & Investments`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || "Luxury Real Estate & Strategic Global Advisory.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = description || "Luxury Real Estate & Strategic Global Advisory.";
      document.head.appendChild(meta);
    }
  }, [title, description]);

  return null;
}
