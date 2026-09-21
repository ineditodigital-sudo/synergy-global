#!/usr/bin/env node
/**
 * One-shot asset optimizer for Synergy Global.
 *
 *   node tools/optimize-assets.mjs
 *
 * Reads the original images, video and fonts listed below (kept in
 * source-assets/, never deployed) and writes web-ready versions:
 *
 *   public/img/<group>/<name>-<hash>.w<width>.webp   responsive WebP variants
 *   public/img/hero/<name>-<hash>.w<width>.mp4        compressed hero video
 *   public/favicon-*.png, public/apple-touch-icon.png  favicons
 *   src/assets/fonts/*.woff2                          subset web fonts
 *
 * It also writes two JSON files used by the app:
 *   src/content/media-library.js  images the CMS offers in its library
 *   src/content/legacy-paths.js   old URL -> new URL, used to migrate content
 *
 * Needs ImageMagick (magick), ffmpeg and Python fontTools on the PATH.
 * Safe to re-run: existing outputs are skipped.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'source-assets');
const OUT_IMG = path.join(ROOT, 'public', 'img');
const WIDTHS = [640, 1280, 1920];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const sha = (file) => createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

function identify(file) {
  const out = run('magick', ['identify', '-format', '%w %h', `${file}[0]`]).trim();
  const [w, h] = out.split(/\s+/).map(Number);
  return { w, h };
}

/**
 * Each entry: [sourcePathRelativeToSourceAssets, group, name, options]
 * options.widths overrides the default responsive widths.
 * options.alpha keeps transparency (logos).
 * options.library=false hides it from the CMS media library.
 * options.legacy = list of old public URLs that pointed at this image.
 */
const IMAGES = [
  // Brand
  ['public/brand/logo-condensed-jade.png', 'brand', 'logo-condensed-jade', { widths: [400, 800], alpha: true, label: 'Logo – condensed, jade', legacy: ['/brand/logo-condensed-jade.png'] }],
  ['public/brand/logo-condensed-white.png', 'brand', 'logo-condensed-white', { widths: [400, 800], alpha: true, label: 'Logo – condensed, white', legacy: ['/brand/logo-condensed-white.png'] }],
  ['src/brand/logo-horizontal-jade.png', 'brand', 'logo-horizontal-jade', { widths: [480, 960], alpha: true, label: 'Logo – horizontal, jade' }],
  ['src/brand/logo-horizontal-white.png', 'brand', 'logo-horizontal-white', { widths: [480, 960], alpha: true, label: 'Logo – horizontal, white' }],
  ['src/brand/logo-main-beige.png', 'brand', 'logo-main-beige', { widths: [480, 960], alpha: true, label: 'Logo – main, beige' }],
  ['src/brand/icon-globe-jade.png', 'brand', 'icon-globe-jade', { widths: [256, 512], alpha: true, label: 'Icon – globe, jade' }],
  ['src/brand/icon-bird-jade.png', 'brand', 'icon-bird-jade', { widths: [256, 512], alpha: true, label: 'Icon – bird, jade' }],

  // 176 Randall Street (the three "prop" photos are views of this building)
  ['public/portfolio/prop1.jpg', 'properties', '176-randall-street-1', { label: '176 Randall Street – street view', legacy: ['/portfolio/prop1.jpg'] }],
  ['public/portfolio/prop2.jpg', 'properties', '176-randall-street-2', { label: '176 Randall Street – rear terraces', legacy: ['/portfolio/prop2.jpg'] }],
  ['public/portfolio/prop3.jpg', 'properties', '176-randall-street-3', { label: '176 Randall Street – facade', legacy: ['/portfolio/prop3.jpg'] }],

  // Services & editorial imagery
  ['public/services/service1.png', 'services', 'global-network', { label: 'Global network', legacy: ['/services/service1.png'] }],
  ['public/services/service2.png', 'services', 'tower-blueprint', { label: 'Tower blueprint', legacy: ['/services/service2.png'] }],
  ['public/services/service3.png', 'services', 'executive-office', { label: 'Executive office', legacy: ['/services/service3.png'] }],
  ['public/services/service1_new.png', 'services', 'modern-residence', { label: 'Modern residence', legacy: ['/services/service1_new.png'] }],
  ['public/services/service2_new.png', 'services', 'port-at-dusk', { label: 'Port at dusk', legacy: ['/services/service2_new.png'] }],
  ['public/services/service3_new.png', 'services', 'boardroom', { label: 'Boardroom', legacy: ['/services/service3_new.png'] }],
  ['public/services/supply-chain.png', 'services', 'supply-chain-port', { label: 'Container port', legacy: ['/services/supply-chain.png'] }],
  ['public/services/legal.png', 'services', 'legal-meeting', { label: 'Legal meeting', legacy: ['/services/legal.png'] }],
  ['public/services/real-estate.png', 'services', 'office-campus', { label: 'Office campus', legacy: ['/services/real-estate.png'] }],
  ['public/advantage/advisory.png', 'services', 'advisory-office', { label: 'Advisory office', legacy: ['/advantage/advisory.png'] }],
  ['public/advantage/matchmaking.png', 'services', 'hillside-residence', { label: 'Hillside residence', legacy: ['/advantage/matchmaking.png'] }],

  // Leadership portraits
  ['public/members/victor.jpg', 'team', 'victor-marquez', { widths: [480, 960], label: 'Victor M. Marquez', legacy: ['/members/victor.jpg'] }],
  ['public/members/keith.jpg', 'team', 'keith-ismael', { widths: [480, 960], label: 'Keith Ismael', legacy: ['/members/keith.jpg'] }],
  ['public/members/ron.jpg', 'team', 'ron-torres', { widths: [480, 960], label: 'Ron Torres', legacy: ['/members/ron.jpg'] }],
  ['public/members/elena-eduardo.jpg', 'team', 'elena-and-eduardo', { widths: [480, 960], label: 'Elena & Eduardo', legacy: ['/members/elena-eduardo.jpg'] }],

  // Partner logos
  ['public/partners/intelink.png', 'partners', 'intelink-law-group', { widths: [300, 600], alpha: true, label: 'Intelink Law Group', legacy: ['/partners/intelink.png'] }],
  ['public/partners/INTERLINK LOGO.webp', 'partners', 'intelink-law-group-white', { widths: [300, 600], alpha: true, label: 'Intelink Law Group (white)', legacy: ['/partners/INTERLINK LOGO.webp'] }],
  ['public/partners/DOOTERS-LOGO.png', 'partners', 'doots-international', { widths: [300, 600], alpha: true, label: 'DOOTS International', legacy: ['/partners/DOOTERS-LOGO.png'] }],
  ['public/partners/california-hispanic-chambers-of-commerce.png', 'partners', 'california-hispanic-chambers', { widths: [300, 600], alpha: true, label: 'California Hispanic Chambers of Commerce', legacy: ['/partners/california-hispanic-chambers-of-commerce.png'] }],
  ['public/partners/CUSMEX.png', 'partners', 'cusmex', { widths: [300, 600], alpha: true, label: 'CUSMEX', legacy: ['/partners/CUSMEX.png'] }],
  ['public/partners/logo-obv.png', 'partners', 'our-billion-ventures', { widths: [300, 600], alpha: true, label: 'Our Billion Ventures', legacy: ['/partners/logo-obv.png'] }],
];

// Gallery, in the order the site shows them by default.
const GALLERY = [
  'WhatsApp Image 2026-05-27 at 9.57.01 AM.webp',
  '0b14c02e-31f0-453f-9c81-c686663e9a5a.webp',
  '1a38ee58-baeb-42e3-b348-294b1a2af7b6.webp',
  '2d8df6c9-f93d-4b12-b88c-140f08fa5361.webp',
  '3b92ff1e-9812-415c-8510-59ab5c187dc2.webp',
  '5c1ad6e4-1d12-401b-8396-d1945c048a74.webp',
  '5d1da102-8202-49df-8133-0845a5d12cad.webp',
  '8f5a6ac5-4a47-4ef5-976d-98403200f411.webp',
  '09f3554f-f15d-4d0f-9979-3d5dbd8c81de.webp',
  '22a4219e-9ac1-46b9-b5a6-aa6f7692e02b.webp',
  '42d3345b-f3ca-46ba-8d3b-9ba8566b6c9c.webp',
  '64e2778c-ebe1-4bd0-b28e-4b1a0730f3cf.webp',
  '97a730a3-a07b-4f6f-84b1-52cab21f63d9.webp',
  '473b16dd-fe8d-499d-b674-f0a2d6c4b46f.webp',
  '9021cee7-4054-48e5-b4ea-7e5de1650577.webp',
  '90939c19-cb91-4e9b-b4a8-8eb360234077.webp',
  '104658f0-6be0-4254-9339-354694bd1fd6.webp',
  '602657f7-f0e3-4604-8ac2-5bcce5029bf4.webp',
  '7758784d-76cd-4add-87e4-e7e217e7ac0b.webp',
  '23064916-998e-4318-b1b5-27cfad3eb6fc.webp',
  'bbd0ad22-c6e0-462a-9b6b-774ef1c228c2.webp',
  'c47fc38d-5a40-489c-ad03-7833aed5767c.webp',
  'f09fe24c-89a0-4f55-8149-9b760439f75e.webp',
  'WhatsApp Image 2026-05-27 at 9.57.01 AM (1).webp',
];
GALLERY.forEach((file, i) => {
  const n = String(i + 1).padStart(2, '0');
  IMAGES.push([`public/gallery/${file}`, 'gallery', `gallery-${n}`, { widths: [640, 1280, 1600], label: `Gallery photo ${n}`, legacy: [`/gallery/${file}`] }]);
});

const library = [];
const legacy = {};
let savedBytes = 0;
let inputBytes = 0;

function variantName(name, hash, w, ext = 'webp') {
  return `${name}-${hash}.w${w}.${ext}`;
}

function optimizeImage([srcRel, group, name, opts = {}]) {
  const src = path.join(SRC, srcRel);
  if (!fs.existsSync(src)) throw new Error(`Missing source: ${rel(src)}`);
  const { w: srcW, h: srcH } = identify(src);
  const hash = sha(src);
  const wanted = (opts.widths || WIDTHS).filter((w) => w < srcW);
  const maxW = Math.min(srcW, Math.max(...(opts.widths || WIDTHS)));
  if (!wanted.includes(maxW)) wanted.push(maxW);
  const widths = [...new Set(wanted)].sort((a, b) => a - b);
  const outDir = path.join(OUT_IMG, group);
  fs.mkdirSync(outDir, { recursive: true });

  let outBytes = 0;
  for (const w of widths) {
    const out = path.join(outDir, variantName(name, hash, w));
    if (!fs.existsSync(out)) {
      const args = [src, '-auto-orient', '-strip', '-resize', `${w}x`];
      if (opts.alpha) args.push('-quality', '90', '-define', 'webp:alpha-quality=100');
      else args.push('-quality', '78', '-define', 'webp:method=6');
      args.push(out);
      run('magick', args);
      // An already-optimized WebP re-encoded at its own width can grow.
      // Keep whichever file is smaller.
      if (w === srcW && src.endsWith('.webp') && fs.statSync(out).size > fs.statSync(src).size) {
        fs.copyFileSync(src, out);
      }
    }
    outBytes += fs.statSync(out).size;
  }
  const largest = `/img/${group}/${variantName(name, hash, maxW)}`;
  const height = Math.round((srcH * maxW) / srcW);
  library.push({ id: `${group}/${name}`, group, label: opts.label || name, url: largest, width: maxW, height, widths, kind: 'image' });
  for (const old of opts.legacy || []) legacy[old] = largest;

  const inSize = fs.statSync(src).size;
  inputBytes += inSize;
  const biggestOut = fs.statSync(path.join(outDir, variantName(name, hash, maxW))).size;
  savedBytes += inSize - biggestOut;
  console.log(`  ${group}/${name}: ${(inSize / 1024).toFixed(0)} KB -> ${(biggestOut / 1024).toFixed(0)} KB (largest of ${widths.length}; all ${(outBytes / 1024).toFixed(0)} KB)`);
}

function optimizeVideo() {
  const src = path.join(SRC, 'public/hero/video-v2.mp4');
  const hash = sha(src);
  const outDir = path.join(OUT_IMG, 'hero');
  fs.mkdirSync(outDir, { recursive: true });
  const specs = [
    { w: 1920, crf: 31 },
    { w: 1280, crf: 29 },
  ];
  for (const { w, crf } of specs) {
    const out = path.join(outDir, variantName('hero-video', hash, w, 'mp4'));
    if (!fs.existsSync(out)) {
      run('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-an', '-vf', `scale=${w}:-2`, '-c:v', 'libx264', '-preset', 'slow',
        '-crf', String(crf), '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
    }
    console.log(`  hero video ${w}w: ${(fs.statSync(src).size / 1024).toFixed(0)} KB -> ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
  }
  const largest = `/img/hero/${variantName('hero-video', hash, 1920, 'mp4')}`;
  legacy['/hero/video-v2.mp4'] = largest;
  library.push({ id: 'hero/hero-video', group: 'hero', label: 'Home video – San Francisco', url: largest, width: 1920, height: 1080, widths: specs.map((x) => x.w).sort((a, b) => a - b), kind: 'video' });

  // Poster frame, used while the video loads and on data-saver connections.
  const posterSrc = path.join(ROOT, 'source-assets', 'hero-poster.png');
  if (!fs.existsSync(posterSrc)) {
    run('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '0.5', '-i', src, '-frames:v', '1', posterSrc]);
  }
  IMAGES_LATE.push(['hero-poster.png', 'hero', 'hero-poster', { label: 'Home video – poster frame' }]);
}

const IMAGES_LATE = [];

function makeFavicons() {
  const src = path.join(SRC, 'public/favicon.png');
  const pub = path.join(ROOT, 'public');
  const targets = [
    ['favicon-32.png', 32],
    ['favicon-192.png', 192],
    ['favicon-512.png', 512],
    ['apple-touch-icon.png', 180],
  ];
  for (const [file, size] of targets) {
    const out = path.join(pub, file);
    if (!fs.existsSync(out)) run('magick', [src, '-resize', `${size}x${size}`, '-strip', '-define', 'png:compression-level=9', out]);
  }
  const ico = path.join(pub, 'favicon.ico');
  if (!fs.existsSync(ico)) run('magick', [src, '-define', 'icon:auto-resize=48,32,16', ico]);
  console.log('  favicons: 16/32/48 ico, 32, 180, 192, 512 png');
}

function makeFonts() {
  const fontsSrc = path.join(SRC, 'fonts');
  const outDir = path.join(ROOT, 'src', 'assets', 'fonts');
  fs.mkdirSync(outDir, { recursive: true });
  // Latin, Latin-1, Latin Extended-A (names like Márquez), punctuation, currency.
  const unicodes = 'U+0000-00FF,U+0100-017F,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD';
  const fonts = [
    ['Montserrat-VariableFont_wght.ttf', 'montserrat-var.woff2'],
    ['Montserrat-Italic-VariableFont_wght.ttf', 'montserrat-italic-var.woff2'],
    ['Alata-Regular.ttf', 'alata.woff2'],
    ['MyriadPro-Regular.otf', 'myriad-pro.woff2'],
  ];
  for (const [inFile, outFile] of fonts) {
    const input = path.join(fontsSrc, inFile);
    const out = path.join(outDir, outFile);
    if (!fs.existsSync(out)) {
      run('python', ['-m', 'fontTools.subset', input, `--output-file=${out}`, '--flavor=woff2', `--unicodes=${unicodes}`,
        '--layout-features=kern,liga,calt,lnum,tnum,case', '--no-hinting', '--desubroutinize']);
    }
    console.log(`  ${outFile}: ${(fs.statSync(input).size / 1024).toFixed(0)} KB -> ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
  }
}

console.log('Images');
IMAGES.forEach(optimizeImage);
console.log('Video');
optimizeVideo();
IMAGES_LATE.forEach(([srcRel, group, name, opts]) => {
  // hero-poster lives at source-assets/hero-poster.png
  optimizeImage([srcRel, group, name, opts]);
});
console.log('Favicons');
makeFavicons();
console.log('Fonts');
makeFonts();

library.sort((a, b) => a.id.localeCompare(b.id));
fs.mkdirSync(path.join(ROOT, 'src', 'content'), { recursive: true });
// Written as plain JS modules so both Vite and Node scripts can import them.
const banner = '// Generated by tools/optimize-assets.mjs. Do not edit by hand.\n';
fs.writeFileSync(path.join(ROOT, 'src', 'content', 'media-library.js'), `${banner}export default ${JSON.stringify(library, null, 2)};\n`);
fs.writeFileSync(path.join(ROOT, 'src', 'content', 'legacy-paths.js'), `${banner}export default ${JSON.stringify(legacy, null, 2)};\n`);
console.log(`\nLibrary: ${library.length} items. Legacy paths mapped: ${Object.keys(legacy).length}.`);
console.log(`Images: ${(inputBytes / 1048576).toFixed(1)} MB of originals -> saved ${(savedBytes / 1048576).toFixed(1)} MB on the largest variants.`);
