/**
 * Content checks used by the CMS:
 *  - findUsage(): where a file is used (so it can't be deleted by mistake);
 *  - reviewContent(): problems to show before publishing. Errors block
 *    publishing; warnings only inform.
 */
import { contrastRatio } from '../../lib/style.js';

const SECTION_ROUTES = {
  settings: '/admin/settings',
  style: '/admin/design',
  navigation: '/admin/menu',
  footer: '/admin/menu',
  home: '/admin/pages/home',
  mission: '/admin/pages/mission',
  about: '/admin/pages/about',
  services: '/admin/services',
  portfolio: '/admin/properties',
  partnerships: '/admin/pages/partnerships',
  legal: '/admin/pages/legal',
  contact: '/admin/pages/contact',
  gallery: '/admin/gallery',
};

const itemName = (item) => item?.title || item?.name || item?.label || item?.caption || '';

/** [{ section, item, route }] for every place `url` (or one of its sizes) is used. */
export function findUsage(content, url) {
  const base = String(url).replace(/\.w\d+\.(webp|mp4)$/i, '');
  const hits = [];
  const walk = (node, path) => {
    if (typeof node === 'string') {
      if (node === url || (base !== url && node.replace(/\.w\d+\.(webp|mp4)$/i, '') === base)) hits.push(path);
      return;
    }
    if (Array.isArray(node)) node.forEach((n, i) => walk(n, [...path, i]));
    else if (node && typeof node === 'object') Object.entries(node).forEach(([k, v]) => walk(v, [...path, k]));
  };
  walk(content, []);
  return hits.map((path) => {
    const section = path[0];
    let item = '';
    for (let i = 1; i < path.length; i += 1) {
      if (typeof path[i] === 'number') {
        const parent = path.slice(0, i).reduce((o, k) => o?.[k], content);
        item = itemName(parent?.[path[i]]) || item;
        break;
      }
    }
    let route = SECTION_ROUTES[section] || '/admin';
    const id = path.length > 2 && typeof path[2] === 'number' ? path.slice(0, 3).reduce((o, k) => o?.[k], content)?.id : null;
    if (id && ['portfolio', 'services'].includes(section)) route = `${route}/${id}`;
    if (id && section === 'about' && path[1] === 'team') route = `/admin/team/${id}`;
    return { section, item, route };
  });
}

// Google shows roughly 60–65 characters of a title, including the site-name suffix.
const SEO_TITLE_MAX = 65;
const SEO_DESC_MAX = 160;

export function reviewContent(content) {
  const issues = [];
  const add = (level, key, params = {}, route = '/admin') => issues.push({ level, key, params, route });

  const menu = content.navigation.mainMenu.filter((m) => m.visible && m.label.trim());
  if (!menu.length) add('error', 'check.menuEmpty', {}, '/admin/menu');

  for (const p of content.portfolio.items) {
    const route = `/admin/properties/${p.id}`;
    if (!p.visible) continue;
    if (!p.title.trim()) add('error', 'check.propertyNoTitle', {}, route);
    else {
      if (!p.images.some((i) => i.src)) add('warning', 'check.propertyNoPhotos', { name: p.title }, route);
      if (p.images.some((i) => i.src && !i.alt.trim())) add('warning', 'check.photoNoAlt', { name: p.title }, route);
      if (!p.description.trim() && !p.summary.trim()) add('warning', 'check.propertyNoDescription', { name: p.title }, route);
    }
  }
  for (const s of content.services.items) {
    if (s.visible && !s.title.trim()) add('error', 'check.serviceNoTitle', {}, `/admin/services/${s.id}`);
  }
  for (const m of content.about.team) {
    if (m.visible && !m.name.trim()) add('error', 'check.memberNoName', {}, `/admin/team/${m.id}`);
  }

  const pages = ['home', 'portfolio', 'services', 'about', 'mission', 'partnerships', 'legal', 'contact'];
  for (const key of pages) {
    const seo = content[key].seo;
    const route = `/admin/pages/${key}`;
    if (!seo.title.trim()) add('warning', 'check.seoTitleMissing', { page: key }, route);
    else {
      const full = seo.title.length + (content.settings.titleSuffix ? content.settings.titleSuffix.length + 3 : 0);
      if (full > SEO_TITLE_MAX) add('warning', 'check.seoTitleLong', { page: key, n: full }, route);
    }
    if (!seo.description.trim()) add('warning', 'check.seoDescMissing', { page: key }, route);
    else if (seo.description.length > SEO_DESC_MAX) add('warning', 'check.seoDescLong', { page: key, n: seo.description.length }, route);
  }

  if (!/^https?:\/\/[^/\s]+$/i.test(content.settings.siteUrl.replace(/\/+$/, ''))) add('error', 'check.siteUrlInvalid', {}, '/admin/settings');
  if (content.settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.settings.email)) add('warning', 'check.emailInvalid', {}, '/admin/settings');

  const c = content.style.colors;
  if (contrastRatio(c.primary, c.background) < 4.5) add('warning', 'check.lowContrast', {}, '/admin/design');

  return issues;
}
