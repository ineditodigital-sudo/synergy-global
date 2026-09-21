import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Film, FileText, ImageOff } from 'lucide-react';
import { useAdmin } from '../context.js';
import { api } from '../lib/api.js';
import { uploadMedia, formatBytes } from '../lib/upload.js';
import library from '../../content/media-library.js';
import { sized, isVideo, isPdf } from '../../lib/media.js';
import { Modal, Spinner, EmptyState } from './ui.jsx';

export function MediaThumb({ url, className = '', contain = false }) {
  const [broken, setBroken] = useState(false);
  if (!url) return <div className={`${className} bg-[var(--a-sunken)] flex items-center justify-center text-[var(--a-faint)]`}><ImageOff size={20} /></div>;
  if (isVideo(url)) {
    return (
      <div className={`${className} bg-[#1f2a24] text-white flex flex-col items-center justify-center gap-1 text-xs`}>
        <Film size={22} />
        <span className="px-2 truncate max-w-full">{url.split('/').pop()}</span>
      </div>
    );
  }
  if (isPdf(url)) {
    return (
      <div className={`${className} bg-[var(--a-sunken)] flex flex-col items-center justify-center gap-1 text-xs text-[var(--a-muted)]`}>
        <FileText size={22} />
        PDF
      </div>
    );
  }
  if (broken) return <div className={`${className} bg-[var(--a-danger-soft)] flex items-center justify-center text-[var(--a-danger)]`}><ImageOff size={20} /></div>;
  return (
    <div className={`${className} ${contain ? 'a-checker' : 'bg-[var(--a-sunken)]'} overflow-hidden`}>
      <img src={sized(url, 480)} alt="" loading="lazy" onError={() => setBroken(true)} className={`w-full h-full ${contain ? 'object-contain' : 'object-cover'}`} />
    </div>
  );
}

/** Upload button + drag-and-drop area. Calls onUploaded(url). */
export function UploadZone({ accept = 'image', onUploaded, compact = false }) {
  const { token, uploadLimit, t, toast, expire } = useAdmin();
  const [stage, setStage] = useState('');
  const [active, setActive] = useState(false);
  const input = useRef(null);
  const acceptAttr = accept === 'video' ? 'video/mp4,video/webm,video/quicktime' : accept === 'any' ? 'image/*,video/mp4,video/webm,application/pdf' : 'image/*';

  const handle = useCallback(
    async (file) => {
      if (!file) return;
      const res = await uploadMedia(file, { token, uploadLimit, onStage: setStage });
      setStage('');
      if (res.ok) {
        toast(t('media.uploaded'));
        onUploaded(res.url);
      } else {
        if (res.status === 401) expire();
        toast(t(`error.${res.error}`, { limit: formatBytes(res.limit || uploadLimit) }), 'error');
      }
    },
    [token, uploadLimit, onUploaded, t, toast, expire],
  );

  return (
    <div
      className={`a-dropzone ${active ? 'is-active' : ''} ${compact ? '!p-3' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setActive(false);
        handle(e.dataTransfer.files?.[0]);
      }}
    >
      <input ref={input} type="file" accept={acceptAttr} className="hidden" onChange={(e) => handle(e.target.files?.[0]).then(() => (e.target.value = ''))} />
      {stage ? (
        <p className="m-0 flex items-center justify-center gap-2 font-semibold text-[var(--a-text)]">
          <Spinner /> {t(stage === 'optimizing' ? 'media.optimizing' : 'media.uploading')}
        </p>
      ) : (
        <>
          <button type="button" className="a-btn a-btn-primary" onClick={() => input.current?.click()}>
            <Upload size={16} /> {t(accept === 'video' ? 'media.uploadVideo' : 'media.uploadImage')}
          </button>
          {!compact && <p className="m-0 mt-2 text-sm">{t(accept === 'video' ? 'media.dropVideo' : 'media.dropImage', { limit: formatBytes(uploadLimit || 8 * 1024 * 1024) })}</p>}
        </>
      )}
    </div>
  );
}

/** Choose an existing file or upload a new one. */
export default function MediaPicker({ accept = 'image', onSelect, onClose, current }) {
  const { token, t, expire } = useAdmin();
  const [tab, setTab] = useState('uploads');
  const [uploads, setUploads] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api('media', { token }).then((res) => {
      if (cancelled) return;
      if (res.ok) setUploads(res.items || []);
      else {
        if (res.status === 401) expire();
        setError(res.error);
        setUploads([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token, expire]);

  const fits = (url) => (accept === 'video' ? isVideo(url) : accept === 'any' ? true : !isVideo(url) && !isPdf(url));
  const siteItems = library.filter((i) => fits(i.url));
  const uploadItems = (uploads || []).filter((i) => fits(i.url));
  const groups = [...new Set(siteItems.map((i) => i.group))];

  const tile = (url, label, key) => (
    <button key={key} type="button" className={`a-media-tile ${url === current ? 'is-selected' : ''}`} onClick={() => onSelect(url)} title={label}>
      <MediaThumb url={url} className="aspect-[4/3] w-full" contain={/brand|partners/.test(url)} />
      <span className="block px-2 py-1.5 text-xs truncate text-[var(--a-muted)]">{label}</span>
    </button>
  );

  return (
    <Modal title={t(accept === 'video' ? 'media.chooseVideo' : 'media.chooseImage')} onClose={onClose} wide>
      <UploadZone accept={accept} onUploaded={(url) => onSelect(url)} />
      <div className="flex gap-2 mt-5 mb-4 border-b border-[var(--a-border)]" role="tablist">
        {['uploads', 'site'].map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`px-3 py-2 -mb-px border-b-2 font-semibold text-sm ${tab === k ? 'border-[var(--a-primary)] text-[var(--a-text)]' : 'border-transparent text-[var(--a-muted)]'}`}
          >
            {t(k === 'uploads' ? 'media.tabUploads' : 'media.tabSite')}
          </button>
        ))}
      </div>
      {tab === 'uploads' &&
        (uploads === null ? (
          <p className="flex items-center gap-2 text-[var(--a-muted)]">
            <Spinner /> {t('common.loading')}
          </p>
        ) : uploadItems.length ? (
          <div className="a-media-grid">{uploadItems.map((i) => tile(i.url, `${i.name} · ${formatBytes(i.size)}`, i.url))}</div>
        ) : (
          <EmptyState title={t(error ? `error.${error}` : 'media.noUploads')} text={t('media.noUploadsHelp')} />
        ))}
      {tab === 'site' &&
        groups.map((g) => (
          <div key={g} className="mb-6">
            <h3 className="text-sm uppercase tracking-wider text-[var(--a-muted)] mb-2">{t(`media.group.${g}`)}</h3>
            <div className="a-media-grid">{siteItems.filter((i) => i.group === g).map((i) => tile(i.url, i.label, i.id))}</div>
          </div>
        ))}
    </Modal>
  );
}
