/**
 * normalizeContent(raw) -> always returns complete, valid content (schema v3).
 *
 * This is what makes the site resistant to bad data:
 *  - every field missing from the saved content falls back to its default;
 *  - every value with the wrong type is replaced by its default;
 *  - numbers are clamped to safe ranges;
 *  - every list item gets a unique id, and pages get a unique slug;
 *  - absolute links to our own domain become relative (survives a domain move);
 *  - image paths from the previous site are mapped to the optimized files;
 *  - content saved by the previous version of the CMS (schema v2) is migrated.
 *
 * It never throws: in the worst case it returns the factory defaults.
 * Plain JS (also used by Node build scripts).
 */
import { DEFAULT_CONTENT, SCHEMA_VERSION } from './defaults.js';
import { TEMPLATES, RANGES } from './schema.js';
import LEGACY_PATHS from './legacy-paths.js';

const OWN_HOSTS = ['synergy.inedito.digital', 'www.synergyglobaldevelopment.com', 'synergyglobaldevelopment.com'];

// Files uploaded to the old CMS that are byte-identical to optimized brand files.
const EXTRA_LEGACY = {
  '/uploads/1778802062_-_MAIN CONDENSED - Jade.png': LEGACY_PATHS['/brand/logo-condensed-jade.png'],
  '/uploads/1778803244_-_MAIN CONDENSED - Jade.png': LEGACY_PATHS['/brand/logo-condensed-jade.png'],
};

export const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
export const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function slugify(text) {
  const s = String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
  return s || 'item';
}

let uidCounter = 0;
export function uid(prefix = 'x') {
  uidCounter += 1;
  return `${prefix}${Date.now().toString(36)}${uidCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/* ----------------------------------------------------------- URL cleanup */

function hostsFrom(extraHosts) {
  const set = new Set(OWN_HOSTS);
  for (const h of extraHosts || []) if (h) set.add(String(h).toLowerCase());
  return set;
}

function cleanUrl(value, hosts) {
  if (typeof value !== 'string' || value.length > 2048) return value;
  let v = value.trim();
  if (!v) return value;
  // https://our-domain//uploads/x.png -> /uploads/x.png
  const m = v.match(/^https?:\/\/([^/?#]+)(\/.*)?$/i);
  if (m && hosts.has(m[1].toLowerCase())) {
    v = (m[2] || '/').replace(/^\/{2,}/, '/');
  }
  if (v.startsWith('/')) {
    let decoded = v;
    try {
      decoded = decodeURI(v);
    } catch {
      /* keep as-is */
    }
    if (LEGACY_PATHS[decoded]) return LEGACY_PATHS[decoded];
    if (EXTRA_LEGACY[decoded]) return EXTRA_LEGACY[decoded];
    return m ? v : value;
  }
  return value;
}

// Fields that must keep an absolute URL even when it points at our own domain.
const KEEP_ABSOLUTE = new Set(['siteUrl']);

function walkStrings(node, fn) {
  if (typeof node === 'string') return fn(node);
  if (Array.isArray(node)) return node.map((n) => walkStrings(n, fn));
  if (isPlainObject(node)) {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = KEEP_ABSOLUTE.has(k) ? v : walkStrings(v, fn);
    return out;
  }
  return node;
}

/* ------------------------------------------------------ v2 -> v3 migration */

const V2_SERVICE_SLUGS = [
  ['supply chain', 'supply-chain'],
  ['trade', 'trade-investment'],
  ['investor', 'investor-representation'],
  ['corporate', 'corporate-formation'],
  ['advocacy', 'business-advocacy'],
  ['legal', 'legal-services'],
];

function migrateV2(raw) {
  const out = clone(raw);
  const st = isPlainObject(raw.style) ? raw.style : {};
  const typo = isPlainObject(st.typography) ? st.typography : {};

  // v2 colors never reached the page, so keep the brand palette.
  out.style = {
    fonts: { heading: typo.heading, body: typo.body },
    logo: st.logoUrl,
    logoHeight: st.logoSize,
    navTextSize: typo.navSize,
    missionTextSize: typo.missionBodySize,
    manifestoTextSize: typo.manifestoBodySize,
    adminLogo: st.adminLogoUrl,
  };
  delete out.colors;

  // v2 always showed these from code, never from the saved content.
  delete out.navigation;
  if (isPlainObject(out.about)) delete out.about.team;
  if (isPlainObject(out.portfolio)) delete out.portfolio.items;

  if (isPlainObject(out.home?.hero)) {
    const hero = out.home.hero;
    hero.primaryLink = '/portfolio';
    hero.secondaryLink = '/about';
    delete hero.backgroundVideo;
    delete hero.locations;
  }
  if (Array.isArray(out.home?.metrics?.items)) {
    out.home.metrics.items = out.home.metrics.items.map((m) => {
      const value = String(m?.value ?? '');
      const prefix = value.startsWith('$') ? '$' : '';
      return { ...m, prefix, value: value.replace(/^\$/, '') };
    });
  }
  if (isPlainObject(out.mission?.header) && /legacies/i.test(out.mission.header.title || '')) {
    out.mission.header.highlight = 'Legacies';
  }
  if (isPlainObject(out.about?.header)) out.about.header.highlight = 'experience';

  if (Array.isArray(out.services?.items)) {
    const defaults = DEFAULT_CONTENT.services.items;
    out.services.items = out.services.items.filter(isPlainObject).map((item) => {
      const title = String(item.title || '').toLowerCase();
      const hit = V2_SERVICE_SLUGS.find(([kw]) => title.includes(kw));
      const base = clone(defaults.find((d) => hit && d.slug === hit[1]) || {});
      return {
        ...base,
        id: String(item.id ?? ''),
        title: item.title ?? base.title,
        summary: item.desc ?? base.summary,
        image: item.image || base.image,
      };
    });
  }

  if (isPlainObject(out.contact?.info) && typeof out.contact.info.email === 'string') {
    out.contact.info.emails = out.contact.info.email.split(',').map((e) => e.trim()).filter(Boolean);
    delete out.contact.info.email;
  }
  return out;
}

/* ------------------------------------------------------------- conform */

function conform(def, val, path) {
  if (Array.isArray(def)) {
    const tpl = TEMPLATES[path] !== undefined ? TEMPLATES[path] : def.length ? def[0] : undefined;
    if (!Array.isArray(val)) return clone(def);
    if (tpl === undefined) return [];
    if (typeof tpl === 'string') {
      return val.filter((v) => typeof v === 'string' || typeof v === 'number').map((v) => String(v).trim()).filter(Boolean);
    }
    if (isPlainObject(tpl)) return val.filter(isPlainObject).map((item) => conform(tpl, item, path));
    return [];
  }
  if (isPlainObject(def)) {
    const src = isPlainObject(val) ? val : {};
    const out = {};
    for (const key of Object.keys(def)) out[key] = conform(def[key], src[key], path ? `${path}.${key}` : key);
    return out;
  }
  if (typeof def === 'string') {
    if (typeof val === 'string') return val;
    if (typeof val === 'number' && Number.isFinite(val)) return String(val);
    return def;
  }
  if (typeof def === 'number') {
    const n = typeof val === 'number' ? val : typeof val === 'string' && val.trim() !== '' ? Number(val) : NaN;
    if (!Number.isFinite(n)) return def;
    const range = RANGES[path];
    return range ? Math.min(range[1], Math.max(range[0], n)) : n;
  }
  if (typeof def === 'boolean') {
    if (typeof val === 'boolean') return val;
    if (val === 'true' || val === 1) return true;
    if (val === 'false' || val === 0) return false;
    return def;
  }
  return clone(def);
}

/** Give every object inside a list a unique, non-empty string id. */
function ensureIds(node, prefix = 'n') {
  if (Array.isArray(node)) {
    const seen = new Set();
    node.forEach((item) => {
      if (isPlainObject(item) && 'id' in item) {
        let id = item.id === undefined || item.id === null ? '' : String(item.id);
        if (!id || seen.has(id)) id = uid(prefix);
        item.id = id;
        seen.add(id);
      }
      ensureIds(item, prefix);
    });
  } else if (isPlainObject(node)) {
    Object.values(node).forEach((v) => ensureIds(v, prefix));
  }
  return node;
}

/** Unique slugs per collection; derived from the title/name when empty. */
function ensureSlugs(list, textKey, reserved = []) {
  const seen = new Set(reserved);
  for (const item of list) {
    let slug = slugify(item.slug || item[textKey]);
    if (seen.has(slug)) {
      let n = 2;
      while (seen.has(`${slug}-${n}`)) n += 1;
      slug = `${slug}-${n}`;
    }
    item.slug = slug;
    seen.add(slug);
  }
}

/* --------------------------------------------------------------- public */

export function normalizeContent(raw, options = {}) {
  try {
    let input = isPlainObject(raw) ? raw : {};
    const hosts = hostsFrom(options.hosts);
    const schema = Number(input?._meta?.schema) || (Object.keys(input).length ? 2 : SCHEMA_VERSION);
    if (schema < 3 && Object.keys(input).length) input = migrateV2(input);

    input = walkStrings(input, (s) => cleanUrl(s, hosts));
    const out = conform(DEFAULT_CONTENT, input, '');

    ensureIds(out);
    ensureSlugs(out.portfolio.items, 'title');
    ensureSlugs(out.services.items, 'title');
    ensureSlugs(out.about.team, 'name');

    // Services without their own page must point somewhere real.
    for (const s of out.services.items) {
      if (!s.hasPage && !s.link) s.link = '/contact';
    }
    out._meta = {
      schema: SCHEMA_VERSION,
      version: Number.isFinite(Number(input?._meta?.version)) ? Number(input._meta.version) : 0,
      updatedAt: typeof input?._meta?.updatedAt === 'string' ? input._meta.updatedAt : '',
    };
    return out;
  } catch (err) {
    if (typeof console !== 'undefined') console.error('[content] normalize failed, using defaults', err);
    return clone(DEFAULT_CONTENT);
  }
}

export { DEFAULT_CONTENT, SCHEMA_VERSION };
