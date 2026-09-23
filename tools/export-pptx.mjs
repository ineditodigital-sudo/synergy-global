/**
 * Export the public website to an editable PowerPoint for client review.
 *
 * Every page becomes a run of 16:9 slides that look like the site on a laptop
 * (1440 × 810, one slide per screen, in scroll order). The design is a flat
 * picture in the slide background; every text on top of it is a real text box
 * and every photo, logo and icon is its own picture. The client can retype
 * copy, swap a photo (right-click › Change Picture), delete things, draw and
 * leave comments, then send the file back. Nothing reads the deck back into
 * the site: it is a reference for making the changes in the CMS.
 *
 *   npm run export:pptx
 *   npm run export:pptx -- --url http://127.0.0.1:8787 --lang en
 *
 * Options
 *   --url   site to capture (default: the live site)
 *   --out   output file (default: exports/<name> <date>.pptx)
 *   --lang  es | en, language of the guide slides (default: es)
 *   --only  /path,/path to capture just those pages (for testing)
 *   --debug folder to also save the reference screenshot of every slide
 *
 * Needs Chrome or Edge. Set CHROME_PATH if it is not in the usual place.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import PptxGenJS from 'pptxgenjs';
import { STATIC_PAGES, propertyPath, memberPath, servicePath } from '../src/content/site.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const W = 1440; // capture width in CSS px = slide width
const H = 810; // one slide = one 16:9 screen
const DPR = 2; // screenshot density
const PX = 1 / 96; // inches per CSS px, so 16px text becomes 12pt
const PT = 0.75; // points per CSS px
const BG_SCALE = 1.5; // resolution of slide backgrounds and photos
const PASTEBOARD = '#E4E1DC'; // fills the rest of a slide when a page ends mid-screen

// The site's web fonts are not installed on the client's computer, so the
// deck uses fonts that ship with Office. Sizes are adjusted per text box so
// the lines break where they break on the site.
const FONT_MAP = { alata: 'Century Gothic', montserrat: 'Century Gothic', 'myriad pro': 'Calibri' };
const FALLBACK_FONT = 'Arial';
const UI_FONT = 'Century Gothic';
const BRAND = { sage: '2C3E35', sand: 'C6B7A0', bone: 'FBF9F6', charcoal: '1A1A1A', beige: 'D9D2C5', ink: '3A3A3A' };

// With "exactly" line spacing PowerPoint puts the first baseline at 3/4 of
// the line height below the top of the box (measured; the same for every
// font). Text boxes are placed so that baseline lands on the site's baseline.
const BASELINE = 0.75;

const TEXT = {
  es: {
    pages: {
      home: 'Inicio',
      portfolio: 'Propiedades',
      mission: 'Misión y visión',
      about: 'Nosotros',
      services: 'Servicios',
      partnerships: 'Alianzas',
      legal: 'Servicios legales',
      contact: 'Contacto',
      property: 'Propiedad',
      member: 'Equipo',
      service: 'Servicio',
    },
    coverTitle: 'Revisión del sitio web',
    coverNote: 'Así se ve hoy el sitio. Corrige, anota y devuélvenos este archivo.',
    howTitle: 'Cómo marcar tus cambios',
    steps: [
      ['Cambia los textos', 'Haz clic en cualquier texto y escribe encima, como en cualquier presentación.'],
      ['Cambia las fotos', 'Clic derecho sobre la foto › Cambiar imagen. También puedes borrarla o pegar otra.'],
      ['Pide lo que quieras', 'Deja un comentario (Revisar › Nuevo comentario), dibuja flechas o círculos, o escribe en las notas debajo de cada diapositiva.'],
      ['Quita o agrega', 'Borra lo que no quieras y agrega diapositivas con ideas nuevas. Nosotros guardamos el original para comparar.'],
      ['Devuélvenos el archivo', 'Guarda la presentación y envíala. No importa si queda desordenada.'],
    ],
    howNote:
      'Cada página del sitio empieza con una portada con su nombre, y sus diapositivas siguen el orden en que se ve al bajar. El menú y el pie de página son iguales en todas las páginas: corrígelos una sola vez, en Inicio. Las tipografías son aproximadas; el sitio conserva las suyas.',
    pageOf: (i, n) => `PÁGINA ${i} DE ${n}`,
    slides: (n) => (n === 1 ? '1 diapositiva' : `${n} diapositivas`),
    screen: (i, n) => `Pantalla ${i} de ${n}`,
    notesPrompt: 'Tus comentarios sobre esta parte:',
    continues: 'La página continúa en la siguiente diapositiva',
    pageEnd: 'Fin de la página',
    endTitle: 'Comentarios generales',
    endHint: 'Escribe aquí cualquier comentario general, idea o página nueva que quieras agregar.',
    date: (d) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
    file: 'Revisión del sitio',
  },
  en: {
    pages: {
      home: 'Home',
      portfolio: 'Properties',
      mission: 'Mission & Vision',
      about: 'About Us',
      services: 'Services',
      partnerships: 'Partnerships',
      legal: 'Legal Services',
      contact: 'Contact',
      property: 'Property',
      member: 'Team',
      service: 'Service',
    },
    coverTitle: 'Website review',
    coverNote: 'This is the site as it looks today. Mark your changes and send this file back.',
    howTitle: 'How to mark your changes',
    steps: [
      ['Change the text', 'Click any text and type over it, like in any presentation.'],
      ['Change the photos', 'Right-click a photo › Change Picture. You can also delete it or paste another one.'],
      ['Ask for anything', 'Leave a comment (Review › New Comment), draw arrows or circles, or write in the notes below each slide.'],
      ['Remove or add', 'Delete what you don’t want and add slides with new ideas. We keep the original to compare.'],
      ['Send the file back', 'Save the presentation and send it. It’s fine if it ends up messy.'],
    ],
    howNote:
      'Each page of the site starts with a cover slide with its name, and its slides follow the order you see when scrolling down. The menu and the footer are the same on every page: correct them once, in Home. Fonts are approximate; the site keeps its own.',
    pageOf: (i, n) => `PAGE ${i} OF ${n}`,
    slides: (n) => (n === 1 ? '1 slide' : `${n} slides`),
    screen: (i, n) => `Screen ${i} of ${n}`,
    notesPrompt: 'Your comments on this part:',
    continues: 'The page continues on the next slide',
    pageEnd: 'End of page',
    endTitle: 'General comments',
    endHint: 'Write any general comment, idea or new page you would like to add.',
    date: (d) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    file: 'Website review',
  },
};

/* ------------------------------------------------------------ options */

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : fallback;
}

const SITE = String(arg('url', 'https://synergy.inedito.digital')).replace(/\/+$/, '');
const LANG = TEXT[arg('lang', 'es')] ? arg('lang', 'es') : 'es';
const T = TEXT[LANG];
const ONLY = arg('only', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const DEBUG = arg('debug', '');
const TODAY = new Date();
const OUT = path.resolve(arg('out', path.join(ROOT, 'exports', `Synergy Global - ${T.file} ${TODAY.toISOString().slice(0, 10)}.pptx`)));

function findChrome() {
  const local = process.env.LOCALAPPDATA || '';
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    local && path.join(local, 'Google/Chrome/Application/chrome.exe'),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error('Chrome or Edge not found. Set CHROME_PATH to the browser executable.');
  return found;
}

/* ------------------------------------------------ in-page (site) helpers */

/**
 * Installed in every captured page. Everything here runs in the browser, so
 * it must not reference anything outside the function.
 */
function pageLib(fontMap, fallbackFont) {
  if (window.__x) return;
  const X = (window.__x = {});
  const one = document.createElement('canvas');
  one.width = one.height = 1;
  const cx = one.getContext('2d', { willReadFrequently: true });
  const mc = document.createElement('canvas').getContext('2d');

  /** Any CSS color (oklch, color-mix…) → { hex, a } in sRGB, or null if invisible. */
  X.color = (c) => {
    if (!c || c === 'transparent') return null;
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = '#000';
    cx.fillStyle = c;
    cx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data;
    if (!a) return null;
    return { hex: [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase(), a: a / 255 };
  };
  const family = (s) => s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const sub = (f) => fontMap[f.toLowerCase()] || fallbackFont;

  const css = `
    *, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }
    html.x-hidetext body *, html.x-hidetext body *::before, html.x-hidetext body *::after {
      color: transparent !important; -webkit-text-fill-color: transparent !important;
      text-shadow: none !important; text-decoration-color: transparent !important; }
    html.x-hidetext body ::placeholder { color: transparent !important; -webkit-text-fill-color: transparent !important; }
    html.x-hidetext body ::marker { color: transparent !important; }
    html.x-hideimg [data-x-img] { visibility: hidden !important; }
    html.x-hideimg [data-x-bg] { background-image: none !important; }
    html.x-hideiso [data-x-img="iso"] { visibility: hidden !important; }
    html.x-onlyiso, html.x-onlyiso body { background: transparent !important; }
    html.x-onlyiso body * { visibility: hidden !important; }
    html.x-onlyiso [data-x-img="iso"], html.x-onlyiso [data-x-img="iso"] * { visibility: visible !important; }
    html.x-solo, html.x-solo body { background: transparent !important; }
    html.x-solo body * { visibility: hidden !important; }
    html.x-solo [data-x-solo] { visibility: visible !important; }
  `;

  /** Load everything, then freeze the layout so it looks the same at any scroll position. */
  X.prepare = async () => {
    window.scrollTo(0, 0);
    document.querySelectorAll('img').forEach((i) => {
      i.loading = 'eager';
    });
    await Promise.all(
      [...document.images].map((i) =>
        i.complete
          ? null
          : new Promise((r) => {
              i.addEventListener('load', r, { once: true });
              i.addEventListener('error', r, { once: true });
              setTimeout(r, 20000);
            }),
      ),
    );
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    await Promise.race([Promise.all([...document.images].map((i) => (i.decode ? i.decode().catch(() => null) : null))), wait(10000)]);
    await document.fonts.ready;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    await new Promise((r) => setTimeout(r, 300));

    const all = [...document.body.querySelectorAll('*')];
    // Fixed and sticky elements (menu bar, stacked cards) would follow the
    // scroll; pin them where they sit at the top of the page.
    const moves = [];
    for (const el of all) {
      const s = getComputedStyle(el);
      if (s.position === 'fixed') moves.push([el, 'fixed', el.getBoundingClientRect()]);
      else if (s.position === 'sticky') moves.push([el, 'sticky']);
    }
    for (const [el, kind, r] of moves) {
      const set = (p, v) => el.style.setProperty(p, v, 'important');
      if (kind === 'sticky') {
        set('position', 'relative');
        set('top', 'auto');
        set('bottom', 'auto');
        continue;
      }
      let cb = el.parentElement;
      while (cb && cb !== document.body) {
        const s = getComputedStyle(cb);
        if (s.position !== 'static' || s.transform !== 'none' || s.filter !== 'none') break;
        cb = cb.parentElement;
      }
      const base = cb && cb !== document.body ? cb.getBoundingClientRect() : { left: 0, top: 0 };
      const bs = cb && cb !== document.body ? getComputedStyle(cb) : null;
      set('position', 'absolute');
      set('top', `${r.top - base.top - (bs ? parseFloat(bs.borderTopWidth) : 0)}px`);
      set('left', `${r.left - base.left - (bs ? parseFloat(bs.borderLeftWidth) : 0)}px`);
      set('right', 'auto');
      set('bottom', 'auto');
      set('width', `${r.width}px`);
      set('height', `${r.height}px`);
    }
    // Borders, icons and shapes often use the text color; freeze them so
    // hiding the text later leaves them alone.
    for (const el of all) {
      const s = getComputedStyle(el);
      const set = (p, v) => el.style.setProperty(p, v, 'important');
      for (const side of ['top', 'right', 'bottom', 'left']) {
        if (parseFloat(s.getPropertyValue(`border-${side}-width`)) > 0) set(`border-${side}-color`, s.getPropertyValue(`border-${side}-color`));
      }
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') set('background-color', s.backgroundColor);
      if (s.outlineStyle !== 'none') set('outline-color', s.outlineColor);
      if (s.boxShadow !== 'none') set('box-shadow', s.boxShadow);
      if (el instanceof SVGElement) {
        set('fill', s.fill);
        set('stroke', s.stroke);
        if (el.tagName.toLowerCase() === 'svg') set('color', s.color);
      }
      // A drop-down's arrow is drawn in its text color; only its text is hidden.
      if (el.tagName === 'SELECT') set('color', s.color);
    }
    window.scrollTo(0, 0);
    await wait(100);
  };

  X.mode = async (m) => {
    const c = document.documentElement.classList;
    c.remove('x-hidetext', 'x-hideimg', 'x-hideiso', 'x-onlyiso', 'x-solo');
    if (m === 'background') c.add('x-hidetext', 'x-hideimg');
    if (m === 'photos') c.add('x-hidetext', 'x-hideiso');
    if (m === 'icons') c.add('x-onlyiso');
    if (m === 'solo') c.add('x-solo');
    await new Promise((r) => setTimeout(r, 60));
  };

  /** Measure every text, picture and section on the page (page coordinates). */
  X.collect = ({ keepFooter, screenH }) => {
    window.scrollTo(0, 0);
    const vw = document.documentElement.clientWidth;
    const docH = Math.ceil(document.documentElement.scrollHeight);
    const foot = document.querySelector('footer');
    const end = !keepFooter && foot ? Math.round(foot.getBoundingClientRect().top) : docH;

    const opacity = (el) => {
      let o = 1;
      for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
      return o;
    };
    const clipOf = (el) => {
      const c = { l: 0, t: -1e9, r: vw, b: 1e9 };
      for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
        const s = getComputedStyle(e);
        const cp = s.clipPath !== 'none';
        const ox = s.overflowX !== 'visible' || cp;
        const oy = s.overflowY !== 'visible' || cp;
        if (!ox && !oy) continue;
        const b = e.getBoundingClientRect();
        if (ox) {
          c.l = Math.max(c.l, b.left);
          c.r = Math.min(c.r, b.right);
        }
        if (oy) {
          c.t = Math.max(c.t, b.top);
          c.b = Math.min(c.b, b.bottom);
        }
      }
      return c;
    };
    const inter = (r, c) => {
      const o = { l: Math.max(r.l ?? r.left, c.l), t: Math.max(r.t ?? r.top, c.t), r: Math.min(r.r ?? r.right, c.r), b: Math.min(r.b ?? r.bottom, c.b) };
      return o.r - o.l > 0.5 && o.b - o.t > 0.5 ? o : null;
    };
    const inPage = (t, b) => b > 0 && t < end;

    /* pictures */
    const alphaOf = (img) => {
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 24;
        const k = c.getContext('2d', { willReadFrequently: true });
        k.drawImage(img, 0, 0, 24, 24);
        const d = k.getImageData(0, 0, 24, 24).data;
        for (let i = 3; i < d.length; i += 4) if (d[i] < 245) return true;
      } catch {
        /* cross-origin picture: treat it as a photo */
      }
      return false;
    };
    const images = [];
    for (const el of document.body.querySelectorAll('*')) {
      const tag = el.tagName.toLowerCase();
      const media = ['img', 'svg', 'video', 'iframe', 'canvas', 'object', 'embed'].includes(tag) && !el.parentElement?.closest('svg');
      if (!media && el instanceof SVGElement) continue;
      const s = getComputedStyle(el);
      const bgUrl = !media && /url\(/.test(s.backgroundImage);
      if (!media && !bgUrl) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3 || s.visibility !== 'visible' || opacity(el) < 0.03) continue;
      const v = inter(r, clipOf(el));
      if (!v || v.r - v.l < 3 || v.b - v.t < 3 || !inPage(v.t, v.b)) continue;
      const kind = tag === 'svg' || (tag === 'img' && alphaOf(el)) ? 'iso' : 'photo';
      if (media) el.setAttribute('data-x-img', kind);
      else el.setAttribute('data-x-bg', '1');
      el.setAttribute('data-x-n', images.length);
      images.push({ n: images.length, kind, x: v.l, y: v.t, w: v.r - v.l, h: v.b - v.t, alt: el.getAttribute('alt') || el.getAttribute('aria-label') || '' });
    }

    /* texts: one text box per block that holds text */
    // Inline-block spans with no box of their own (animated words, for
    // example) belong to the surrounding paragraph.
    const inlineLike = (el) => {
      const s = getComputedStyle(el);
      if (s.display === 'inline' || s.display === 'contents') return true;
      if (s.display !== 'inline-block') return false;
      const flat = ['Top', 'Right', 'Bottom', 'Left'].every((k) => !parseFloat(s[`padding${k}`]) && !parseFloat(s[`border${k}Width`]));
      return (
        flat &&
        s.backgroundImage === 'none' &&
        !X.color(s.backgroundColor) &&
        [...el.children].every((c) => c.tagName === 'BR' || ['inline', 'contents'].includes(getComputedStyle(c).display))
      );
    };
    const ascent = (r) => {
      mc.font = `${r.italic ? 'italic ' : ''}${r.weight} ${r.px}px "${r.family}"`;
      const m = mc.measureText('H');
      return { up: m.fontBoundingBoxAscent, down: m.fontBoundingBoxDescent };
    };
    const blockOf = (el) => {
      while (el && el !== document.body && inlineLike(el)) el = el.parentElement;
      return el;
    };
    const SKIP = 'script, style, noscript, template, select, textarea, svg, img, video, iframe';
    const boxes = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode()); ) {
      if (!n.data.trim() || !n.parentElement || n.parentElement.closest(SKIP)) continue;
      boxes.add(blockOf(n.parentElement));
    }

    const underlined = (el, box) => {
      for (let e = el; e; e = e.parentElement) {
        if (/underline/.test(getComputedStyle(e).textDecorationLine)) return true;
        if (e === box) break;
      }
      return false;
    };
    const texts = [];
    const pushText = (t) => {
      // Size the fallback font so each line is as wide as on the site.
      let wo = 0;
      let ws = 0;
      for (const r of t.runs) {
        if (r.br) continue;
        const it = r.italic ? 'italic ' : '';
        mc.font = `${it}${r.weight} ${r.px}px "${r.family}"`;
        wo += mc.measureText(r.text).width;
        mc.font = `${it}${r.weight >= 600 ? 700 : 400} ${r.px}px "${sub(r.family)}"`;
        ws += mc.measureText(r.text).width;
      }
      const ratio = ws > 0 ? Math.min(1.25, Math.max(0.75, wo / ws)) : 1;
      t.runs = t.runs.map((r) =>
        r.br
          ? r
          : {
              text: r.text,
              font: sub(r.family),
              px: r.px * ratio,
              sizePx: r.px,
              bold: r.weight >= 600,
              italic: r.italic,
              underline: r.underline,
              spacing: r.spacing,
              color: r.color,
              alpha: r.alpha,
            },
      );
      texts.push(t);
    };

    for (const box of boxes) {
      const raw = [];
      let wordBoxes = false;
      const walk = (node) => {
        for (const ch of node.childNodes) {
          if (ch.nodeType === 3) {
            const p = ch.parentElement;
            const s = getComputedStyle(p);
            if (s.visibility !== 'visible') continue;
            const col = X.color(s.color);
            if (!col) continue;
            const alpha = opacity(p) * col.a;
            if (alpha < 0.03) continue;
            // A trailing no-break space only separates words (see inlineLike).
            let text = /^pre/.test(s.whiteSpace) ? ch.data : ch.data.replace(/[ \t\n\r\f]+/g, ' ').replace(/\u00a0+$/, ' ');
            const rg = document.createRange();
            rg.selectNodeContents(ch);
            const rs = [...rg.getClientRects()].filter((r) => r.width > 0.5 && r.height > 0.5);
            if (!rs.length || !text) continue;
            if (s.textTransform === 'uppercase') text = text.toUpperCase();
            else if (s.textTransform === 'lowercase') text = text.toLowerCase();
            else if (s.textTransform === 'capitalize') text = text.replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
            const run = {
              text,
              family: family(s),
              px: parseFloat(s.fontSize),
              weight: parseInt(s.fontWeight, 10) || 400,
              italic: /italic|oblique/.test(s.fontStyle),
              underline: underlined(p, box),
              spacing: s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing) || 0,
              color: col.hex,
              alpha,
              lh: parseFloat(s.lineHeight),
            };
            run.rects = text.trim() ? rs.map((q) => ({ left: q.left, top: q.top, right: q.right, bottom: q.bottom })) : [];
            raw.push(run);
          } else if (ch.nodeType === 1) {
            if (ch.tagName === 'BR') raw.push({ br: true });
            else if (!ch.matches(SKIP) && inlineLike(ch)) {
              if (getComputedStyle(ch).display === 'inline-block') wordBoxes = true;
              walk(ch);
            }
          }
        }
      };
      walk(box);
      if (!raw.some((r) => r.rects?.length)) continue;

      // Collapse spaces across runs and trim them at line edges.
      const runs = [];
      for (const r of raw) {
        const prev = runs[runs.length - 1];
        if (r.br) {
          if (prev && !prev.br) prev.text = prev.text.replace(/ +$/, '');
          if (runs.length) runs.push(r);
          continue;
        }
        let text = r.text;
        if (!prev || prev.br || / $/.test(prev.text)) text = text.replace(/^ +/, '');
        if (text) runs.push({ ...r, text });
      }
      while (runs.length && (runs[runs.length - 1].br || !runs[runs.length - 1].text.trim())) {
        const last = runs.pop();
        if (!last.br && runs.length && !runs[runs.length - 1].br) runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/ +$/, '');
      }
      if (!runs.length) continue;
      if (!runs[runs.length - 1].br) runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/ +$/, '');

      const bs = getComputedStyle(box);
      const br = box.getBoundingClientRect();
      const content = {
        l: br.left + parseFloat(bs.paddingLeft) + parseFloat(bs.borderLeftWidth),
        r: br.right - parseFloat(bs.paddingRight) - parseFloat(bs.borderRightWidth),
      };
      const ta = bs.textAlign;
      const align = /center/.test(ta) ? 'center' : /right|end/.test(ta) ? 'right' : /justify/.test(ta) ? 'justify' : 'left';
      // Words wrapped in inline-blocks keep their trailing space inside the
      // line on the site; PowerPoint lets it hang, so give it one space less.
      if (wordBoxes) content.r -= (runs.find((r) => !r.br)?.px || 16) * 0.3;
      const clip = clipOf(box.firstChild || box);

      // Lines after a line break that start somewhere else (an indented second
      // line of a title, say) get their own text box.
      const pieces = [[]];
      for (const r of runs) {
        if (r.br) pieces.push([]);
        pieces[pieces.length - 1].push(r);
      }
      const leftOf = (piece) => Math.min(...piece.flatMap((r) => (r.rects || []).map((q) => q.left)));
      const lefts = pieces.map(leftOf).filter(Number.isFinite);
      const split = align === 'left' && lefts.some((l) => Math.abs(l - lefts[0]) > 3);
      for (const piece of split ? pieces : [runs]) {
        const own = piece[0]?.br ? piece.slice(1) : piece;
        const rects = own.flatMap((r) => r.rects || []);
        if (!rects.length) continue;
        const bb = rects.reduce(
          (a, r) => ({ l: Math.min(a.l, r.left), t: Math.min(a.t, r.top), r: Math.max(a.r, r.right), b: Math.max(a.b, r.bottom) }),
          { l: 1e9, t: 1e9, r: -1e9, b: -1e9 },
        );
        const seen = inter(bb, clip);
        if (!seen || ((seen.r - seen.l) * (seen.b - seen.t)) / ((bb.r - bb.l) * (bb.b - bb.t)) < 0.6) continue;
        if (!inPage(bb.t, bb.b)) continue;

        const lines = [];
        for (const r of rects.slice().sort((a, b) => a.top - b.top)) {
          const cy = (r.top + r.bottom) / 2;
          const line = lines.find((l) => cy > l.t && cy < l.b);
          if (line) {
            line.t = Math.min(line.t, r.top);
            line.b = Math.max(line.b, r.bottom);
          } else lines.push({ t: r.top, b: r.bottom });
        }
        const first = own.find((r) => r.rects?.length);
        const lh = lines.length > 1 ? (lines[lines.length - 1].t - lines[0].t) / (lines.length - 1) : first.lh || lines[0].b - lines[0].t;
        const room = (bb.r - bb.l) * 1.06 + 6;
        let x;
        let w;
        if (align === 'left') {
          x = bb.l;
          w = Math.min(Math.max(content.r - bb.l, room), vw - x);
        } else if (align === 'right') {
          w = Math.min(Math.max(bb.r - content.l, room), bb.r);
          x = bb.r - w;
        } else if (align === 'center') {
          const c = (bb.l + bb.r) / 2;
          const half = Math.min(Math.max(Math.min(c - content.l, content.r - c), room / 2), c, vw - c);
          x = c - half;
          w = half * 2;
        } else {
          x = Math.min(content.l, bb.l);
          w = Math.max(content.r, bb.r) - x;
        }
        pushText({
          x,
          baseline: first.rects[0].top + ascent(first).up,
          w,
          h: lh * lines.length,
          top: bb.t,
          bottom: bb.b,
          align,
          lh,
          lines: lines.length,
          runs: own,
        });
      }
    }

    /* form fields: placeholder or chosen value */
    for (const el of document.body.querySelectorAll('input, textarea, select')) {
      const s = getComputedStyle(el);
      if (s.visibility !== 'visible' || opacity(el) < 0.03) continue;
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      if (el.tagName === 'INPUT' && ['hidden', 'checkbox', 'radio', 'file', 'range', 'color', 'image'].includes(type)) continue;
      let text;
      let color = s.color;
      if (el.tagName === 'SELECT') text = el.options[el.selectedIndex]?.text || '';
      else if (el.value) text = el.value;
      else {
        text = el.getAttribute('placeholder') || '';
        color = getComputedStyle(el, '::placeholder').color;
      }
      const col = X.color(color);
      if (!text.trim() || !col) continue;
      if (s.textTransform === 'uppercase') text = text.toUpperCase();
      const r = el.getBoundingClientRect();
      const box = {
        l: r.left + parseFloat(s.paddingLeft) + parseFloat(s.borderLeftWidth),
        r: r.right - parseFloat(s.paddingRight) - parseFloat(s.borderRightWidth),
        t: r.top + parseFloat(s.paddingTop) + parseFloat(s.borderTopWidth),
        b: r.bottom - parseFloat(s.paddingBottom) - parseFloat(s.borderBottomWidth),
      };
      const px = parseFloat(s.fontSize);
      const lh = parseFloat(s.lineHeight) || px * 1.25;
      const y = el.tagName === 'TEXTAREA' ? box.t : (box.t + box.b) / 2 - lh / 2;
      if (!inPage(y, y + lh)) continue;
      const m = ascent({ italic: /italic/.test(s.fontStyle), weight: parseInt(s.fontWeight, 10) || 400, px, family: family(s) });
      pushText({
        x: box.l,
        baseline: y + (lh - m.up - m.down) / 2 + m.up,
        w: Math.max(box.r - box.l, 20),
        h: lh,
        top: y,
        bottom: y + lh,
        align: /center/.test(s.textAlign) ? 'center' : /right|end/.test(s.textAlign) ? 'right' : 'left',
        lh,
        lines: 1,
        runs: [
          {
            text: text.trim(),
            family: family(s),
            px,
            weight: parseInt(s.fontWeight, 10) || 400,
            italic: /italic/.test(s.fontStyle),
            underline: false,
            spacing: s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing) || 0,
            color: col.hex,
            alpha: opacity(el) * col.a,
          },
        ],
      });
    }

    /* section edges: the best places to start a new slide */
    const bounds = new Set();
    for (const el of document.body.querySelectorAll('section, header, footer, article, main > *')) {
      const r = el.getBoundingClientRect();
      if (r.height < 40) continue;
      bounds.add(Math.round(r.top));
      bounds.add(Math.round(r.bottom));
    }

    /* cards and buttons: better not cut in two */
    const blocks = [];
    for (const el of document.body.querySelectorAll('*')) {
      if (el instanceof SVGElement) continue;
      const s = getComputedStyle(el);
      const edges = ['Top', 'Right', 'Bottom', 'Left'].filter((k) => parseFloat(s[`border${k}Width`]) > 0).length;
      if (!X.color(s.backgroundColor) && edges < 2 && s.boxShadow === 'none') continue;
      const r = inter(el.getBoundingClientRect(), clipOf(el));
      if (!r || r.b - r.t < 30 || r.b - r.t > screenH * 0.95 || r.r - r.l < 60 || r.r - r.l > vw * 0.8) continue;
      blocks.push({ top: r.t, bottom: r.b });
    }

    return { texts, images, bounds: [...bounds], blocks, height: docH, end, title: document.title };
  };
}

/* ---------------------------------------- in-page (helper tab) pictures */

/** Cut the three screenshots of one screen into the slide background and pictures. */
async function cutScreen({ b, a, i, solo, top, h, dpr, scale, pasteboard, photos, isos, cover, width, height }) {
  const bitmap = async (s) => (s ? createImageBitmap(await (await fetch(`data:image/png;base64,${s}`)).blob()) : null);
  const [B, A, I, S] = await Promise.all([bitmap(b), bitmap(a), bitmap(i), bitmap(solo)]);
  const canvas = (w, hh) => Object.assign(document.createElement('canvas'), { width: Math.max(1, Math.round(w)), height: Math.max(1, Math.round(hh)) });
  const data = (c, type, q) => c.toDataURL(type, q).split(',')[1];

  const bg = canvas(width * scale, height * scale);
  const g = bg.getContext('2d');
  g.fillStyle = pasteboard;
  g.fillRect(0, 0, bg.width, bg.height);
  g.imageSmoothingQuality = 'high';
  g.drawImage(B, 0, 0, B.width, B.height, 0, 0, bg.width, Math.round(h * scale));

  const cut = (src, r, outScale, type, q) => {
    const sx = r.x * dpr;
    const sy = (r.y - top) * dpr;
    const c = canvas(r.w * outScale, r.h * outScale);
    const k = c.getContext('2d', { willReadFrequently: type === 'image/png' });
    k.imageSmoothingQuality = 'high';
    k.drawImage(src, sx, sy, r.w * dpr, r.h * dpr, 0, 0, c.width, c.height);
    if (type === 'image/png') {
      const d = k.getImageData(0, 0, c.width, c.height).data;
      let seen = false;
      for (let j = 3; j < d.length; j += 4) {
        if (d[j] > 8) {
          seen = true;
          break;
        }
      }
      if (!seen) return null;
    }
    return data(c, type, q);
  };
  return {
    bg: data(bg, 'image/jpeg', 0.86),
    photos: photos.map((p) => ({ ...p, data: A ? cut(A, p, scale, 'image/jpeg', 0.86) : null })).filter((p) => p.data),
    isos: isos.map((p) => ({ ...p, data: I ? cut(I, p, dpr, 'image/png') : null })).filter((p) => p.data),
    cover: S && cover ? cut(S, cover, scale, 'image/jpeg', 0.86) : null,
  };
}

async function shrink({ img, width, q }) {
  const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${img}`)).blob());
  const c = Object.assign(document.createElement('canvas'), { width, height: Math.round((bmp.height * width) / bmp.width) });
  const k = c.getContext('2d');
  k.imageSmoothingQuality = 'high';
  k.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', q).split(',')[1];
}

/* ------------------------------------------------------------- capture */

/** Split a page into screens no taller than one slide, never through a text. */
function planScreens({ end, texts, images, bounds, blocks }) {
  const screens = [];
  let top = 0;
  while (end - top > 2) {
    if (end - top <= H) {
      screens.push([top, end]);
      break;
    }
    // Prefer long slides that end where a section ends; avoid cutting a
    // picture, card or button in two; never cut through a line of text.
    let best = null;
    for (let y = top + H; y >= top + Math.round(H * 0.25); y--) {
      if (texts.some((t) => t.top < y - 1 && t.bottom > y + 1)) continue;
      let score = (y - top) / H;
      if (bounds.includes(y)) score += 0.35;
      if (images.some((i) => i.y < y - 0.25 && i.y + i.h > y + 0.25)) score -= 0.65;
      if (blocks.some((b) => b.top < y - 0.25 && b.bottom > y + 0.25)) score -= 0.3;
      if (!best || score > best.score) best = { y, score };
    }
    const y = best ? best.y : top + H;
    screens.push([top, y]);
    top = y;
  }
  return screens;
}

const clipTo = (r, top, bottom) => {
  const y = Math.max(r.y, top);
  const b = Math.min(r.y + r.h, bottom);
  return b - y > 1 ? { ...r, y, h: b - y } : null;
};

async function capturePage(page, helper, url, keepFooter) {
  await page.bringToFront();
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
  await page.evaluate(pageLib, FONT_MAP, FALLBACK_FONT);
  await page.evaluate(() => window.__x.prepare());
  const info = await page.evaluate((o) => window.__x.collect(o), { keepFooter, screenH: H });

  const firstH = Math.min(H, info.end);
  const preview = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: firstH }, encoding: 'base64', captureBeyondViewport: false });
  const thumb = { data: await helper.evaluate(shrink, { img: preview, width: 960, q: 0.82 }), ratio: firstH / W };

  const screens = [];
  const plan = planScreens(info);
  for (const [top, bottom] of plan) {
    const h = bottom - top;
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, Math.min(top, info.height - H)));
    const photos = info.images.filter((i) => i.kind === 'photo').map((i) => clipTo(i, top, bottom)).filter(Boolean);
    const isos = info.images.filter((i) => i.kind === 'iso').map((i) => clipTo(i, top, bottom)).filter(Boolean);
    const shot = async (mode, extra = {}) => {
      await page.evaluate((m) => window.__x.mode(m), mode);
      return page.screenshot({ type: 'png', clip: { x: 0, y: top, width: W, height: h }, encoding: 'base64', captureBeyondViewport: false, ...extra });
    };
    let reference = null;
    if (DEBUG) reference = await shot('normal');
    const b = await shot('background');
    const a = photos.length ? await shot('photos') : null;
    const i = isos.length ? await shot('icons', { omitBackground: true }) : null;
    // The home page's main photo, alone, for the cover slide.
    const cover = keepFooter && top === 0 ? photos.slice().sort((p, q) => q.w * q.h - p.w * p.h)[0] : null;
    let solo = null;
    if (cover && cover.w * cover.h > W * H * 0.4) {
      await page.evaluate((n) => document.querySelector(`[data-x-n="${n}"]`)?.setAttribute('data-x-solo', ''), cover.n);
      solo = await shot('solo');
    }
    await page.evaluate(() => window.__x.mode('normal'));
    const cut = await helper.evaluate(cutScreen, {
      b,
      a,
      i,
      solo,
      cover,
      top,
      h,
      dpr: DPR,
      scale: BG_SCALE,
      pasteboard: PASTEBOARD,
      photos,
      isos,
      width: W,
      height: H,
    });
    const mid = (t) => (t.top + t.bottom) / 2;
    screens.push({ top, h, ...cut, reference, texts: info.texts.filter((t) => mid(t) >= top && mid(t) < bottom) });
  }
  return { screens, thumb, title: info.title };
}

/* -------------------------------------------------------------- slides */

const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;

function addScreenSlide(pres, section, screen, notes, last) {
  const slide = pres.addSlide({ sectionTitle: section });
  slide.background = { data: `image/jpeg;base64,${screen.bg}`, path: 'background.jpg' };
  for (const p of screen.photos) {
    slide.addImage({ data: `image/jpeg;base64,${p.data}`, x: p.x * PX, y: (p.y - screen.top) * PX, w: p.w * PX, h: p.h * PX, altText: p.alt || undefined });
  }
  for (const p of screen.isos) {
    slide.addImage({ data: `image/png;base64,${p.data}`, x: p.x * PX, y: (p.y - screen.top) * PX, w: p.w * PX, h: p.h * PX, altText: p.alt || undefined });
  }
  for (const t of screen.texts) {
    const lineSpacing = r1(t.lh * PT);
    const runs = [];
    for (const r of t.runs) {
      const prev = runs[runs.length - 1];
      if (r.br) {
        if (prev && !prev.options.breakLine) prev.options.breakLine = true;
        else if (prev) runs.push({ text: ' ', options: { ...prev.options, breakLine: true } });
        continue;
      }
      runs.push({
        text: r.text,
        options: {
          fontFace: r.font,
          fontSize: r1(r.px * PT),
          bold: r.bold,
          italic: r.italic,
          underline: r.underline ? { style: 'sng' } : undefined,
          color: r.color,
          transparency: r.alpha < 0.99 ? Math.round((1 - r.alpha) * 100) : undefined,
          charSpacing: r.spacing ? r2(r.spacing * PT) : undefined,
          align: t.align,
          lineSpacing,
        },
      });
    }
    if (!runs.length) continue;
    slide.addText(runs, {
      x: t.x * PX,
      y: (t.baseline - BASELINE * t.lh - screen.top) * PX,
      w: Math.max(t.w, 4) * PX,
      h: Math.max(t.h, 4) * PX,
      margin: 0,
      valign: 'top',
      align: t.align,
      lineSpacing,
      paraSpaceBefore: 0,
      paraSpaceAfter: 0,
      fit: 'resize',
      isTextBox: true,
    });
  }
  // Say what the grey area under a short screen is.
  if (H - screen.h > 60) {
    slide.addText(last ? T.pageEnd : T.continues, {
      x: 0,
      y: (screen.h + (H - screen.h) / 2 - 12) * PX,
      w: W * PX,
      h: 24 * PX,
      fontFace: UI_FONT,
      fontSize: 11,
      color: '9A958C',
      align: 'center',
      valign: 'middle',
      margin: 0,
      isTextBox: true,
    });
  }
  slide.addNotes(notes);
  return slide;
}

function addCover(pres, photo, logo, host) {
  const slide = pres.addSlide({ sectionTitle: T.coverTitle });
  slide.background = { color: BRAND.sage };
  if (photo) {
    slide.addImage({ data: `image/jpeg;base64,${photo}`, x: 0, y: 0, w: W * PX, h: H * PX });
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W * PX, h: H * PX, fill: { color: BRAND.charcoal, transparency: 45 }, line: { type: 'none' } });
  }
  if (logo) slide.addImage({ data: `image/png;base64,${logo.data}`, x: 0.9, y: 0.8, w: (logo.w * PX * 1.4), h: (logo.h * PX * 1.4) });
  slide.addText(T.coverTitle, { x: 0.9, y: 4.6, w: 11, h: 1.1, fontFace: UI_FONT, fontSize: 48, color: BRAND.bone, margin: 0, valign: 'bottom', isTextBox: true });
  slide.addText(`SYNERGY GLOBAL  ·  ${host.toUpperCase()}`, { x: 0.9, y: 5.85, w: 11, h: 0.4, fontFace: UI_FONT, fontSize: 13, color: BRAND.sand, charSpacing: 3, margin: 0, isTextBox: true });
  slide.addText(`${T.coverNote}\n${T.date(TODAY)}`, { x: 0.9, y: 6.5, w: 11, h: 0.9, fontFace: UI_FONT, fontSize: 14, color: BRAND.bone, transparency: 15, margin: 0, valign: 'top', paraSpaceAfter: 4, isTextBox: true });
}

function addGuide(pres) {
  const slide = pres.addSlide({ sectionTitle: T.coverTitle });
  slide.background = { color: BRAND.bone };
  slide.addText(T.howTitle, { x: 0.9, y: 0.7, w: 13, h: 0.9, fontFace: UI_FONT, fontSize: 34, color: BRAND.sage, margin: 0, isTextBox: true });
  const top = 1.95;
  const rowH = 0.92;
  T.steps.forEach(([title, body], i) => {
    const y = top + i * rowH;
    slide.addShape(pres.ShapeType.ellipse, { x: 0.9, y, w: 0.56, h: 0.56, fill: { color: BRAND.sage }, line: { type: 'none' } });
    slide.addText(String(i + 1), { x: 0.9, y, w: 0.56, h: 0.56, fontFace: UI_FONT, fontSize: 16, bold: true, color: BRAND.sand, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    slide.addText(
      [
        { text: title, options: { bold: true, fontSize: 16, color: BRAND.sage, breakLine: true } },
        { text: body, options: { fontSize: 13, color: BRAND.ink } },
      ],
      { x: 1.75, y: y - 0.04, w: 7.6, h: 0.8, fontFace: UI_FONT, margin: 0, valign: 'top', paraSpaceAfter: 2, isTextBox: true },
    );
  });
  slide.addShape(pres.ShapeType.roundRect, { x: 10.0, y: 1.95, w: 4.1, h: 4.2, fill: { color: BRAND.sage }, line: { type: 'none' }, rectRadius: 0.12 });
  slide.addText(T.howNote, { x: 10.35, y: 2.25, w: 3.4, h: 3.6, fontFace: UI_FONT, fontSize: 14, color: BRAND.bone, margin: 0, valign: 'top', lineSpacingMultiple: 1.2, isTextBox: true });
}

function addDivider(pres, section, { index, total, name, sub, url, count, thumb }) {
  const slide = pres.addSlide({ sectionTitle: section });
  slide.background = { color: BRAND.sage };
  slide.addText(T.pageOf(index, total), { x: 0.9, y: 2.3, w: 6, h: 0.4, fontFace: UI_FONT, fontSize: 12, color: BRAND.sand, charSpacing: 4, margin: 0, isTextBox: true });
  slide.addText(name, { x: 0.9, y: 2.85, w: 6.2, h: 1.7, fontFace: UI_FONT, fontSize: 40, color: BRAND.bone, margin: 0, valign: 'top', fit: 'shrink', isTextBox: true });
  const lines = [];
  if (sub) lines.push({ text: sub, options: { fontSize: 16, color: BRAND.sand, breakLine: true } });
  lines.push({ text: url, options: { fontSize: 12, color: BRAND.bone, transparency: 30, breakLine: true } });
  lines.push({ text: T.slides(count), options: { fontSize: 12, color: BRAND.bone, transparency: 30 } });
  slide.addText(lines, { x: 0.9, y: 4.75, w: 6.2, h: 1.4, fontFace: UI_FONT, margin: 0, valign: 'top', paraSpaceAfter: 6, isTextBox: true });
  if (thumb) {
    const w = 6.4;
    const h = w * thumb.ratio;
    slide.addImage({ data: `image/jpeg;base64,${thumb.data}`, x: 7.7, y: (H * PX - h) / 2, w, h, shadow: { type: 'outer', blur: 12, offset: 4, angle: 90, color: '000000', opacity: 0.35 } });
  }
}

function addClosing(pres) {
  const slide = pres.addSlide({ sectionTitle: T.endTitle });
  slide.background = { color: BRAND.bone };
  slide.addText(T.endTitle, { x: 0.9, y: 0.7, w: 13, h: 0.9, fontFace: UI_FONT, fontSize: 34, color: BRAND.sage, margin: 0, isTextBox: true });
  slide.addShape(pres.ShapeType.roundRect, { x: 0.9, y: 1.9, w: 13.2, h: 5.6, fill: { color: 'FFFFFF' }, line: { color: BRAND.beige, width: 1.25 }, rectRadius: 0.1 });
  slide.addText(T.endHint, { x: 1.3, y: 2.25, w: 12.4, h: 4.9, fontFace: UI_FONT, fontSize: 16, color: '8A8A8A', margin: 0, valign: 'top', isTextBox: true });
}

/* ---------------------------------------------------------------- main */

function pageGroups(content) {
  const shown = (x) => x && x.visible !== false;
  const order = [];
  const add = (p) => !order.includes(p) && order.push(p);
  add('/');
  for (const m of (content.navigation?.mainMenu || []).filter(shown)) if (STATIC_PAGES.some((s) => s.path === m.path)) add(m.path);
  for (const s of STATIC_PAGES) add(s.path);

  const groups = [];
  for (const p of order) {
    if (p === '/team') continue; // same page as /about
    const key = STATIC_PAGES.find((s) => s.path === p).key;
    const pages = [{ path: p, kind: key, sub: STATIC_PAGES.find((s) => s.path === p).label }];
    if (key === 'portfolio') for (const it of content.portfolio.items.filter(shown)) pages.push({ path: propertyPath(it), kind: 'property', sub: it.title });
    if (key === 'about') for (const m of content.about.team.filter(shown)) pages.push({ path: memberPath(m), kind: 'member', sub: m.name });
    if (key === 'services') for (const s of content.services.items.filter((s) => shown(s) && s.hasPage)) pages.push({ path: servicePath(s), kind: 'service', sub: s.title });
    groups.push({ key, pages });
  }
  return groups;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const helper = await browser.newPage();
    await helper.goto('about:blank');

    await page.goto(`${SITE}/`, { waitUntil: 'networkidle0', timeout: 90000 });
    const content = await page.evaluate(() => {
      const el = document.getElementById('synergy-content');
      return el ? JSON.parse(el.textContent) : null;
    });
    if (!content) throw new Error(`No site content found at ${SITE}/`);

    let groups = pageGroups(content);
    if (ONLY.length) groups = groups.map((g) => ({ ...g, pages: g.pages.filter((p) => ONLY.includes(p.path)) })).filter((g) => g.pages.length);
    const total = groups.reduce((n, g) => n + g.pages.length, 0);

    const captured = [];
    let n = 0;
    for (const g of groups) {
      for (const p of g.pages) {
        n += 1;
        process.stdout.write(`[${n}/${total}] ${p.path} … `);
        const shot = await capturePage(page, helper, `${SITE}${p.path}`, p.path === '/');
        console.log(`${shot.screens.length} slides`);
        captured.push({ group: g, page: p, ...shot });
      }
    }

    const pres = new PptxGenJS();
    pres.defineLayout({ name: 'WEB', width: W * PX, height: H * PX });
    pres.layout = 'WEB';
    pres.author = 'Synergy Global';
    pres.company = 'Synergy Global';
    pres.title = `Synergy Global — ${T.coverTitle}`;
    pres.theme = { headFontFace: UI_FONT, bodyFontFace: UI_FONT };

    const home = captured.find((c) => c.page.path === '/') || captured[0];
    const heroShot = home?.screens[0];
    const hero = heroShot?.cover;
    const logo = heroShot?.isos.filter((i) => i.y < 140 && i.w > 60).sort((a, b) => b.w - a.w)[0];

    pres.addSection({ title: T.coverTitle });
    addCover(pres, hero, logo, new URL(SITE).host);
    addGuide(pres);

    let index = 0;
    let currentGroup = null;
    for (const c of captured) {
      const section = T.pages[c.group.key];
      if (c.group !== currentGroup) {
        pres.addSection({ title: section });
        currentGroup = c.group;
      }
      index += 1;
      const name = c.page.kind === c.group.key ? T.pages[c.page.kind] : `${T.pages[c.page.kind]}: ${c.page.sub}`;
      const url = `${new URL(SITE).host}${c.page.path === '/' ? '' : c.page.path}`;
      addDivider(pres, section, { index, total, name, sub: c.page.kind === c.group.key ? c.page.sub : '', url, count: c.screens.length, thumb: c.thumb });
      c.screens.forEach((s, i) => {
        const notes = `${name} — ${SITE}${c.page.path}\n${T.screen(i + 1, c.screens.length)}\n\n${T.notesPrompt}\n`;
        addScreenSlide(pres, section, s, notes, i === c.screens.length - 1);
      });
    }

    pres.addSection({ title: T.endTitle });
    addClosing(pres);

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    await pres.writeFile({ fileName: OUT });
    const mb = (fs.statSync(OUT).size / 1048576).toFixed(1);
    console.log(`\nSaved ${OUT} (${mb} MB)`);

    if (DEBUG) {
      fs.mkdirSync(DEBUG, { recursive: true });
      let k = 2;
      for (const c of captured) {
        k += 1;
        for (const s of c.screens) {
          k += 1;
          if (s.reference) fs.writeFileSync(path.join(DEBUG, `slide-${String(k).padStart(3, '0')}.png`), Buffer.from(s.reference, 'base64'));
        }
      }
      console.log(`Reference screenshots in ${DEBUG}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
