/**
 * Responsive media helpers.
 *
 * Optimized files are named  <name>.w<width>.webp  (or .mp4). Static images
 * list their available widths in media-library.js. Images uploaded through
 * the CMS always get the standard set: 640, 1280 and the original width up
 * to 1920 (see src/admin/lib/upload.js), so their widths can be derived.
 */
import library from '../content/media-library.js';

export const UPLOAD_WIDTHS = [640, 1280, 1920];
const VARIANT_RE = /^(.*)\.w(\d+)\.(webp|mp4)$/i;
const BY_URL = new Map(library.map((item) => [item.url, item]));

export function libraryItem(url) {
  return BY_URL.get(url) || null;
}

/** [{ w, url }] for every size available of a variant file, or null. */
export function variantsOf(url) {
  const m = VARIANT_RE.exec(String(url || ''));
  if (!m) return null;
  const [, base, maxStr, ext] = m;
  const max = Number(maxStr);
  const known = BY_URL.get(url)?.widths;
  const widths = known || (ext.toLowerCase() === 'webp' ? [...UPLOAD_WIDTHS.filter((w) => w < max), max] : [max]);
  return widths.map((w) => ({ w, url: `${base}.w${w}.${ext}` }));
}

function unsplashVariants(url) {
  if (!/^https:\/\/images\.unsplash\.com\//i.test(url)) return null;
  const make = (w) => (/[?&]w=\d+/.test(url) ? url.replace(/([?&]w=)\d+/, `$1${w}`) : `${url}${url.includes('?') ? '&' : '?'}w=${w}`);
  return [640, 1280, 1920].map((w) => ({ w, url: make(w) }));
}

/** { src, srcSet } for an <img>; srcSet is undefined when not applicable. */
export function responsive(url, preferred = 1280) {
  const list = variantsOf(url) || unsplashVariants(url);
  if (!list || list.length < 2) return { src: url, srcSet: undefined };
  const fallback = list.filter((v) => v.w <= preferred).pop() || list[0];
  return { src: fallback.url, srcSet: list.map((v) => `${v.url} ${v.w}w`).join(', ') };
}

/** Smallest variant at least `minWidth` wide (thumbnails in the CMS, etc.). */
export function sized(url, minWidth) {
  const list = variantsOf(url) || unsplashVariants(url);
  if (!list) return url;
  return (list.find((v) => v.w >= minWidth) || list[list.length - 1]).url;
}

/** Pick the right hero video file for this screen. */
export function videoForScreen(url) {
  const list = variantsOf(url);
  if (!list || list.length < 2 || typeof window === 'undefined') return url;
  const needed = Math.min(window.innerWidth * (window.devicePixelRatio || 1), 2560);
  const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData;
  if (saveData) return list[0].url;
  return (list.find((v) => v.w >= needed * 0.8) || list[list.length - 1]).url;
}

export const isVideo = (url) => /\.(mp4|webm|mov)(\?|$)/i.test(String(url || ''));
export const isPdf = (url) => /\.pdf(\?|$)/i.test(String(url || ''));
