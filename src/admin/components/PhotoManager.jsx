import { useRef, useState } from 'react';
import { ImagePlus, Trash2, Star, ChevronLeft, ChevronRight, Eye, EyeOff, FolderOpen } from 'lucide-react';
import { useAdmin, useField } from '../context.js';
import { uploadMedia, formatBytes } from '../lib/upload.js';
import { uid } from '../../content/normalize.js';
import MediaPicker, { MediaThumb } from './MediaPicker.jsx';
import { Spinner } from './ui.jsx';

/**
 * Photo grid for a property or the gallery: upload many at once, reorder,
 * caption / describe, hide, delete. The first photo is the cover.
 *
 * mode "property": items { id, src, alt }
 * mode "gallery":  items { id, src, caption, visible }
 */
export default function PhotoManager({ path, mode = 'property' }) {
  const { t, token, uploadLimit, toast, confirm, expire } = useAdmin();
  const [value, set] = useField(path);
  const photos = Array.isArray(value) ? value : [];
  const [progress, setProgress] = useState(null);
  const [picker, setPicker] = useState(false);
  const [drag, setDrag] = useState(null);
  const input = useRef(null);

  const textKey = mode === 'gallery' ? 'caption' : 'alt';
  const makeItem = (src) => (mode === 'gallery' ? { id: uid('g'), src, caption: '', visible: true } : { id: uid('i'), src, alt: '' });

  const addFiles = async (files) => {
    const list = Array.from(files || []).filter(Boolean);
    if (!list.length) return;
    let added = [];
    for (let i = 0; i < list.length; i += 1) {
      setProgress({ current: i + 1, total: list.length, name: list[i].name });
      const res = await uploadMedia(list[i], { token, uploadLimit });
      if (res.ok) {
        const item = makeItem(res.url);
        added = [...added, item];
        set((cur) => [...(Array.isArray(cur) ? cur : []), item], { coalesce: false });
      } else {
        if (res.status === 401) {
          expire();
          break;
        }
        toast(`${list[i].name}: ${t(`error.${res.error}`, { limit: formatBytes(res.limit || uploadLimit) })}`, 'error');
      }
    }
    setProgress(null);
    if (added.length) toast(t('photos.added', { n: added.length }));
  };

  const move = (from, to) => {
    if (to < 0 || to >= photos.length || from === to) return;
    const next = photos.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    set(next, { coalesce: false });
  };

  const patch = (index, changes, coalesce = true) => set(photos.map((p, i) => (i === index ? { ...p, ...changes } : p)), coalesce ? undefined : { coalesce: false });

  const remove = async (index) => {
    const ok = await confirm({ title: t('photos.removeTitle'), message: t('photos.removeText'), confirmLabel: t('common.remove'), danger: true });
    if (ok) set(photos.filter((_, i) => i !== index), { coalesce: false });
  };

  return (
    <div>
      <div
        className="a-dropzone mb-4"
        onDragOver={(e) => {
          if (drag === null) e.preventDefault();
        }}
        onDrop={(e) => {
          if (drag !== null) return;
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
      >
        <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files).then(() => (e.target.value = ''))} />
        {progress ? (
          <p className="m-0 flex items-center justify-center gap-2 font-semibold text-[var(--a-text)]">
            <Spinner /> {t('photos.uploadingN', { current: progress.current, total: progress.total })}
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className="a-btn a-btn-primary" onClick={() => input.current?.click()}>
              <ImagePlus size={16} /> {t('photos.upload')}
            </button>
            <button type="button" className="a-btn" onClick={() => setPicker(true)}>
              <FolderOpen size={16} /> {t('photos.fromLibrary')}
            </button>
          </div>
        )}
        {!progress && <p className="m-0 mt-2 text-sm">{t('photos.dropHint')}</p>}
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-[var(--a-muted)]">{t('photos.none')}</p>
      ) : (
        <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {photos.map((p, index) => {
            const hidden = mode === 'gallery' && p.visible === false;
            return (
              <li
                key={p.id}
                onDragOver={(e) => {
                  if (drag !== null) e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (drag !== null) move(drag, index);
                  setDrag(null);
                }}
                className={`border border-[var(--a-border)] rounded-lg overflow-hidden bg-white ${drag === index ? 'opacity-40' : ''} ${hidden ? 'opacity-60' : ''}`}
              >
                <div
                  className="relative"
                  draggable
                  onDragStart={(e) => {
                    setDrag(index);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => setDrag(null)}
                  title={t('list.drag')}
                >
                  <MediaThumb url={p.src} className="aspect-[4/3] w-full cursor-grab" />
                  {index === 0 && mode === 'property' && (
                    <span className="absolute top-2 left-2 a-pill bg-[var(--a-primary)] text-white">
                      <Star size={12} /> {t('photos.cover')}
                    </span>
                  )}
                  {hidden && <span className="absolute top-2 left-2 a-pill a-pill-muted">{t('common.hidden')}</span>}
                  <span className="absolute top-2 right-2 a-pill bg-black/55 text-white">#{index + 1}</span>
                </div>
                <div className="p-2.5">
                  <input
                    className="a-input !py-1.5 !text-sm"
                    value={p[textKey] || ''}
                    placeholder={t(mode === 'gallery' ? 'photos.captionPlaceholder' : 'photos.altPlaceholder')}
                    onChange={(e) => patch(index, { [textKey]: e.target.value })}
                    aria-label={t(mode === 'gallery' ? 'photos.caption' : 'field.altText')}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex">
                      <button type="button" className="a-icon-btn" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label={t('photos.moveLeft')} title={t('photos.moveLeft')}>
                        <ChevronLeft size={17} />
                      </button>
                      <button type="button" className="a-icon-btn" onClick={() => move(index, index + 1)} disabled={index === photos.length - 1} aria-label={t('photos.moveRight')} title={t('photos.moveRight')}>
                        <ChevronRight size={17} />
                      </button>
                      {mode === 'property' && index > 0 && (
                        <button type="button" className="a-icon-btn" onClick={() => move(index, 0)} aria-label={t('photos.makeCover')} title={t('photos.makeCover')}>
                          <Star size={16} />
                        </button>
                      )}
                      {mode === 'gallery' && (
                        <button type="button" className="a-icon-btn" onClick={() => patch(index, { visible: p.visible === false }, false)} aria-label={hidden ? t('list.show') : t('list.hide')} title={hidden ? t('list.show') : t('list.hide')}>
                          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                    <button type="button" className="a-icon-btn hover:!text-[var(--a-danger)]" onClick={() => remove(index)} aria-label={t('common.remove')} title={t('common.remove')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {picker && (
        <MediaPicker
          accept="image"
          onClose={() => setPicker(false)}
          onSelect={(url) => {
            set([...photos, makeItem(url)], { coalesce: false });
            setPicker(false);
          }}
        />
      )}
    </div>
  );
}
