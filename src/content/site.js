/**
 * Routing and SEO helpers shared by the public site and the CMS.
 * The PHP side (public/app/seo.php) mirrors resolveRoute() and pageSeo().
 */

export const STATIC_PAGES = [
  { path: '/', key: 'home', label: 'Home' },
  { path: '/portfolio', key: 'portfolio', label: 'Properties' },
  { path: '/mission', key: 'mission', label: 'Mission & Vision' },
  { path: '/about', key: 'about', label: 'About Us' },
  { path: '/team', key: 'about', label: 'Leadership' },
  { path: '/services', key: 'services', label: 'Services' },
  { path: '/partnerships', key: 'partnerships', label: 'Partnerships' },
  { path: '/legal', key: 'legal', label: 'Legal Services' },
  { path: '/contact', key: 'contact', label: 'Contact' },
];

export const propertyPath = (p) => `/portfolio/${p.slug}`;
export const memberPath = (m) => `/team/${m.slug}`;
export const servicePath = (s) => (s.hasPage ? `/services/${s.slug}` : s.link || '/contact');

export const isExternal = (path) => /^(https?:|mailto:|tel:)/i.test(String(path || ''));

/** Every place a button or menu item can point to, grouped for a dropdown. */
export function linkOptions(content) {
  const groups = [{ group: 'pages', items: STATIC_PAGES.map((p) => ({ path: p.path, label: p.label })) }];
  const props = content.portfolio.items.map((p) => ({ path: propertyPath(p), label: p.title, hidden: !p.visible }));
  if (props.length) groups.push({ group: 'properties', items: props });
  const services = content.services.items.filter((s) => s.hasPage).map((s) => ({ path: servicePath(s), label: s.title, hidden: !s.visible }));
  if (services.length) groups.push({ group: 'services', items: services });
  const team = content.about.team.map((m) => ({ path: memberPath(m), label: m.name, hidden: !m.visible }));
  if (team.length) groups.push({ group: 'team', items: team });
  return groups;
}

/**
 * Figure out what a URL path shows. Returns { type, item?, canonical }.
 * `includeHidden` lets the CMS preview show items that are not public yet.
 */
export function resolveRoute(content, pathname, { includeHidden = false } = {}) {
  const shown = (x) => includeHidden || x.visible;
  const path = (String(pathname || '/').replace(/\/+$/, '') || '/').toLowerCase();
  const simple = {
    '/': 'home',
    '/portfolio': 'portfolio',
    '/mission': 'mission',
    '/about': 'about',
    '/team': 'about',
    '/services': 'services',
    '/partnerships': 'partnerships',
    '/legal': 'legal',
    '/contact': 'contact',
  };
  if (simple[path]) return { type: simple[path], canonical: path === '/team' ? '/about' : path };

  let m = path.match(/^\/portfolio\/([^/]+)$/);
  if (m) {
    const item = content.portfolio.items.find((p) => shown(p) && (p.slug === m[1] || String(p.id) === m[1]));
    return item ? { type: 'property', item, canonical: propertyPath(item) } : { type: 'notfound' };
  }
  m = path.match(/^\/services\/([^/]+)$/);
  if (m) {
    const item = content.services.items.find((s) => shown(s) && s.hasPage && s.slug === m[1]);
    return item ? { type: 'service', item, canonical: servicePath(item) } : { type: 'notfound' };
  }
  m = path.match(/^\/team\/([^/]+)$/);
  if (m) {
    const item = content.about.team.find((t) => shown(t) && (t.slug === m[1] || String(t.id) === m[1]));
    return item ? { type: 'member', item, canonical: memberPath(item) } : { type: 'notfound' };
  }
  return { type: 'notfound' };
}

const STATUS_PHRASE = {
  'For Sale': 'for sale',
  'Coming Soon': 'coming soon',
  Pending: 'pending sale',
  Sold: 'sold',
  'Off-Market': 'available off-market',
  'For Lease': 'for lease',
};

export function clip(text, max = 160) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).replace(/[\s,;:.–—-]+$/, '')}…`;
}

export const propertyPlace = (p) => [p.neighborhood, p.city, p.state].filter(Boolean).join(', ');

export function propertySeo(p) {
  const place = propertyPlace(p);
  const title = p.seo.title || `${p.title}${place ? `, ${place}` : ''}`;
  const auto = [
    `${p.type || 'Property'} ${STATUS_PHRASE[p.status] || ''} in ${place || 'San Francisco, CA'}.`.replace(/\s+/g, ' '),
    p.summary,
    p.price,
  ]
    .filter(Boolean)
    .join(' ');
  return { title, description: clip(p.seo.description || auto) };
}

/** Title (without suffix), description and share image for a route. */
export function pageSeo(content, route) {
  const s = content.settings;
  const base = { image: s.shareImage, noindex: !s.allowIndexing };
  const page = (key) => ({ ...base, title: content[key].seo.title, description: content[key].seo.description });
  switch (route.type) {
    case 'home':
      return { ...page('home'), image: content.home.seo.image || s.shareImage };
    case 'portfolio':
    case 'mission':
    case 'about':
    case 'services':
    case 'partnerships':
    case 'legal':
    case 'contact':
      return page(route.type);
    case 'property': {
      const p = route.item;
      return { ...base, ...propertySeo(p), image: p.images[0]?.src || s.shareImage };
    }
    case 'service': {
      const sv = route.item;
      return {
        ...base,
        title: sv.detail.seo.title || sv.title,
        description: clip(sv.detail.seo.description || sv.summary || s.defaultDescription),
        image: sv.detail.heroImage || sv.image || s.shareImage,
      };
    }
    case 'member': {
      const m = route.item;
      return {
        ...base,
        title: `${m.name}${m.role ? `, ${m.role}` : ''}`,
        description: clip(m.bio || `${m.name}, ${m.role} at ${s.legalName}.`),
        image: m.image || s.shareImage,
      };
    }
    default:
      return { ...base, title: 'Page Not Found', description: s.defaultDescription, noindex: true };
  }
}

export function fullTitle(title, suffix) {
  const t = String(title || '').trim();
  const sfx = String(suffix || '').trim();
  if (!sfx) return t;
  if (!t) return sfx;
  return t.toLowerCase().includes(sfx.toLowerCase()) ? t : `${t} | ${sfx}`;
}
