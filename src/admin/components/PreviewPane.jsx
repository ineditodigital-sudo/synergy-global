import { useEffect, useRef, useState } from 'react';
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink, X } from 'lucide-react';
import { useAdmin } from '../context.js';

const DEVICES = [
  { key: 'desktop', icon: Monitor, width: '100%' },
  { key: 'tablet', icon: Tablet, width: '820px' },
  { key: 'mobile', icon: Smartphone, width: '390px' },
];

/**
 * Live preview of the public site showing the unpublished draft.
 * The page inside the frame receives the draft through postMessage.
 */
export default function PreviewPane({ onClose, overlay = false }) {
  const { draft, previewPath, t } = useAdmin();
  const frame = useRef(null);
  const ready = useRef(false);
  const latest = useRef(draft);
  const [device, setDevice] = useState('desktop');
  const [nonce, setNonce] = useState(0);
  const src = `${previewPath}${previewPath.includes('?') ? '&' : '?'}preview=1`;

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === 'synergy:preview-ready') {
        ready.current = true;
        frame.current.contentWindow.postMessage({ type: 'synergy:draft', content: latest.current }, window.location.origin);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    latest.current = draft;
    if (!ready.current) return undefined;
    const id = setTimeout(() => {
      frame.current?.contentWindow?.postMessage({ type: 'synergy:draft', content: draft }, window.location.origin);
    }, 120);
    return () => clearTimeout(id);
  }, [draft]);

  const width = DEVICES.find((d) => d.key === device)?.width;

  return (
    <div className={overlay ? 'fixed inset-0 z-[150] bg-[#2a3530] flex flex-col' : 'h-full flex flex-col bg-[#2a3530]'}>
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1f2a24] text-white/85">
        <span className="text-xs font-semibold uppercase tracking-wider mr-1">{t('preview.title')}</span>
        <div className="flex bg-white/10 rounded-md p-0.5">
          {DEVICES.map(({ key, icon: I }) => (
            <button
              key={key}
              type="button"
              onClick={() => setDevice(key)}
              className={`p-1.5 rounded ${device === key ? 'bg-white text-[#1f2a24]' : 'text-white/70 hover:text-white'}`}
              aria-label={t(`preview.${key}`)}
              title={t(`preview.${key}`)}
            >
              <I size={15} />
            </button>
          ))}
        </div>
        <span className="text-xs truncate flex-1 font-mono text-white/60">{previewPath}</span>
        <button
          type="button"
          className="p-1.5 rounded hover:bg-white/10"
          onClick={() => {
            ready.current = false;
            setNonce((n) => n + 1);
          }}
          aria-label={t('preview.reload')}
          title={t('preview.reload')}
        >
          <RotateCw size={15} />
        </button>
        <a href={previewPath} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-white/10" aria-label={t('preview.openLive')} title={t('preview.openLive')}>
          <ExternalLink size={15} />
        </a>
        {onClose && (
          <button type="button" className="p-1.5 rounded hover:bg-white/10" onClick={onClose} aria-label={t('common.close')}>
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto flex justify-center p-3">
        <iframe
          key={`${src}-${nonce}`}
          ref={frame}
          src={src}
          title={t('preview.title')}
          onLoad={() => {
            // The page announces itself; this is a fallback for slow loads.
            setTimeout(() => {
              ready.current = true;
              frame.current?.contentWindow?.postMessage({ type: 'synergy:draft', content: latest.current }, window.location.origin);
            }, 400);
          }}
          className="bg-white h-full rounded shadow-2xl transition-[width] duration-300"
          style={{ width, maxWidth: '100%', minHeight: '100%', border: 0 }}
        />
      </div>
      <p className="text-center text-[11px] text-white/50 py-1.5 m-0">{t('preview.note')}</p>
    </div>
  );
}
