import { useState } from 'react';
import { ImagePlus, Trash2, Replace } from 'lucide-react';
import { useField, useT } from '../context.js';
import MediaPicker, { MediaThumb } from './MediaPicker.jsx';

/**
 * Image (or video) chooser: preview, "Change" (library or upload), "Remove".
 * Optional alt text for accessibility and SEO.
 */
export default function ImageField({ path, altPath, label, hint, accept = 'image', contain = false, removable = true, aspect = 'aspect-[16/10]' }) {
  const [value, set] = useField(path);
  const t = useT();
  const [open, setOpen] = useState(false);
  const url = typeof value === 'string' ? value : '';

  return (
    <div className="a-field">
      <span className="a-label">{label}</span>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`w-full sm:w-56 ${aspect} rounded-lg border border-[var(--a-border)] overflow-hidden shrink-0 hover:border-[var(--a-gold)] transition-colors`}
          aria-label={url ? t('media.change') : t(accept === 'video' ? 'media.chooseVideo' : 'media.chooseImage')}
        >
          <MediaThumb url={url} className="w-full h-full" contain={contain} />
        </button>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="a-btn" onClick={() => setOpen(true)}>
              {url ? <Replace size={16} /> : <ImagePlus size={16} />} {url ? t('media.change') : t(accept === 'video' ? 'media.chooseVideo' : 'media.chooseImage')}
            </button>
            {removable && url && (
              <button type="button" className="a-btn a-btn-danger" onClick={() => set('', { coalesce: false })}>
                <Trash2 size={16} /> {t('common.remove')}
              </button>
            )}
          </div>
          {altPath && <AltText path={altPath} />}
          {hint && <span className="a-hint">{hint}</span>}
        </div>
      </div>
      {open && (
        <MediaPicker
          accept={accept}
          current={url}
          onClose={() => setOpen(false)}
          onSelect={(u) => {
            set(u, { coalesce: false });
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AltText({ path }) {
  const [value, set] = useField(path);
  const t = useT();
  return (
    <label className="block mt-3">
      <span className="text-xs font-semibold text-[var(--a-muted)]">{t('field.altText')}</span>
      <input className="a-input mt-1" value={value || ''} onChange={(e) => set(e.target.value)} placeholder={t('field.altPlaceholder')} />
    </label>
  );
}
