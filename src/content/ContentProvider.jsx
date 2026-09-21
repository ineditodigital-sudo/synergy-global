import { useEffect, useState } from 'react';
import { ContentContext } from './context.js';
import { normalizeContent, DEFAULT_CONTENT } from './normalize.js';
import { applyStyle } from '../lib/style.js';
import { isPreviewFrame } from '../lib/preview.js';

const CACHE_KEY = 'synergy_site_cache_v3';
const hostOpts = () => ({ hosts: typeof window !== 'undefined' ? [window.location.host] : [] });

/** Content embedded in the page by index.php (no extra request, no flash). */
function readEmbedded() {
  try {
    const el = document.getElementById('synergy-content');
    if (!el) return null;
    const data = JSON.parse(el.textContent || 'null');
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(content) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    /* storage full or blocked: not important */
  }
}

export default function ContentProvider({ children }) {
  const [embedded] = useState(readEmbedded);
  const [content, setContent] = useState(() => normalizeContent(embedded || readCache() || DEFAULT_CONTENT, hostOpts()));

  // Inside the CMS preview, show the unpublished draft sent by the editor.
  useEffect(() => {
    if (!isPreviewFrame()) return undefined;
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'synergy:draft' && event.data.content) {
        setContent(normalizeContent(event.data.content, hostOpts()));
      }
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'synergy:preview-ready' }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Without embedded content (local development), fetch it from the API.
  useEffect(() => {
    if (embedded || isPreviewFrame()) return undefined;
    let cancelled = false;
    fetch(`/api.php?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || typeof data !== 'object' || !Object.keys(data).length) return;
        const next = normalizeContent(data, hostOpts());
        setContent(next);
        writeCache(next);
      })
      .catch(() => {
        /* offline or API down: keep cached/default content */
      });
    return () => {
      cancelled = true;
    };
  }, [embedded]);

  useEffect(() => {
    applyStyle(content.style);
  }, [content.style]);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
