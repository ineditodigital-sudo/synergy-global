/**
 * Uploads with automatic optimization, so editors can drop a 12 MB phone
 * photo and the site still loads fast:
 *  - photos are resized and converted to WebP in 640, 1280 and up to 1920 px;
 *  - videos and PDFs are uploaded as they are (size is checked first).
 */
import { api } from './api.js';
import { UPLOAD_WIDTHS } from '../../lib/media.js';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/avif'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

function loadBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => loadViaImg(file));
  }
  return loadViaImg(file);
}

function loadViaImg(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('decode'));
    };
    img.src = url;
  });
}

function toWebp(source, width, height, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob && blob.type === 'image/webp' ? resolve(blob) : reject(new Error('webp'))), 'image/webp', quality);
  });
}

/** Returns [{ blob, width }] ready to upload, largest last. */
export async function optimizeImage(file, { quality = 0.8, keepAlpha = false } = {}) {
  const bmp = await loadBitmap(file);
  const srcW = bmp.width;
  const srcH = bmp.height;
  const max = Math.min(srcW, UPLOAD_WIDTHS[UPLOAD_WIDTHS.length - 1]);
  const widths = [...UPLOAD_WIDTHS.filter((w) => w < max), max];
  const out = [];
  for (const w of widths) {
    const h = Math.max(1, Math.round((srcH * w) / srcW));
    out.push({ blob: await toWebp(bmp, w, h, keepAlpha ? 0.9 : quality), width: w });
  }
  bmp.close?.();
  return out;
}

/**
 * Upload one file chosen by the editor.
 * Resolves to { ok, url } or { ok: false, error }.
 */
export async function uploadMedia(file, { token, uploadLimit, onStage } = {}) {
  if (!file) return { ok: false, error: 'no-file' };
  const isImage = IMAGE_TYPES.includes(file.type) || /\.(jpe?g|png|webp|gif|heic|heif|avif)$/i.test(file.name);
  const isVideo = VIDEO_TYPES.includes(file.type) || /\.(mp4|webm|mov)$/i.test(file.name);
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!isImage && !isVideo && !isPdf) return { ok: false, error: 'file-type-not-allowed' };

  const form = new FormData();
  form.append('name', file.name);

  if (isImage && !/\.gif$/i.test(file.name)) {
    onStage?.('optimizing');
    let variants;
    try {
      variants = await optimizeImage(file, { keepAlpha: /png|webp/i.test(file.type) });
    } catch {
      return { ok: false, error: /heic|heif/i.test(file.type + file.name) ? 'heic-not-supported' : 'image-unreadable' };
    }
    const total = variants.reduce((n, v) => n + v.blob.size, 0);
    if (uploadLimit && total > uploadLimit) return { ok: false, error: 'file-too-large', limit: uploadLimit };
    const base = file.name.replace(/\.[^.]+$/, '');
    variants.forEach((v) => {
      form.append('files[]', v.blob, `${base}.webp`);
      form.append('widths[]', String(v.width));
    });
  } else {
    if (uploadLimit && file.size > uploadLimit) return { ok: false, error: 'file-too-large', limit: uploadLimit };
    form.append('files[]', file, file.name);
  }

  onStage?.('uploading');
  const res = await api('upload', { method: 'POST', token, form, timeout: 180_000 });
  if (!res.ok) return res;
  return { ok: true, url: res.url, files: res.files };
}

export const formatBytes = (n) => {
  if (!n && n !== 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};
