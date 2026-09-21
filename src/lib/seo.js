import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../content/context.js';
import { resolveRoute, pageSeo, fullTitle } from '../content/site.js';

function setTag(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create);
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

const absolute = (base, url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${String(base || window.location.origin).replace(/\/+$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Keeps <title>, description, canonical, robots and social tags in sync while
 * visitors navigate. The first page load already gets them from index.php.
 */
export function useSeoSync() {
  const content = useContent();
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    const route = resolveRoute(content, pathname);
    const seo = pageSeo(content, route);
    const s = content.settings;
    const base = s.siteUrl || window.location.origin;
    const title = fullTitle(seo.title, s.titleSuffix);
    const url = absolute(base, route.canonical || pathname);
    const image = absolute(base, seo.image);

    document.title = title;
    setTag('meta[name="description"]', 'meta', { name: 'description', content: seo.description || '' });
    setTag('meta[name="robots"]', 'meta', { name: 'robots', content: seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' });
    if (route.canonical) setTag('link[rel="canonical"]', 'link', { rel: 'canonical', href: url });
    setTag('meta[property="og:title"]', 'meta', { property: 'og:title', content: title });
    setTag('meta[property="og:description"]', 'meta', { property: 'og:description', content: seo.description || '' });
    setTag('meta[property="og:url"]', 'meta', { property: 'og:url', content: url });
    if (image) setTag('meta[property="og:image"]', 'meta', { property: 'og:image', content: image });
    setTag('meta[name="twitter:card"]', 'meta', { name: 'twitter:card', content: 'summary_large_image' });

    // Page-specific structured data from the server only describes the first URL.
    if (!first.current) document.getElementById('synergy-jsonld-page')?.remove();
    first.current = false;
  }, [content, pathname]);
}
