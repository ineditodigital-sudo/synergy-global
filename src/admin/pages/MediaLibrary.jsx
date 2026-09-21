import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, FolderOpen } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { api } from '../lib/api.js';
import { findUsage } from '../lib/checks.js';
import { formatBytes } from '../lib/upload.js';
import { Card, PageHeader, Spinner, EmptyState, Modal } from '../components/ui.jsx';
import { MediaThumb, UploadZone } from '../components/MediaPicker.jsx';
import library from '../../content/media-library.js';

export default function MediaLibrary() {
  const { t, token, draft, published, confirm, toast, expire, lang } = useAdmin();
  usePreviewPath('/');
  const [items, setItems] = useState(null);
  const [inspect, setInspect] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const load = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    api('media', { token }).then((res) => {
      if (cancelled) return;
      if (res.ok) setItems(res.items || []);
      else {
        if (res.status === 401) expire();
        setItems([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token, expire, reloadKey]);

  const usageOf = (url) => {
    const seen = new Set();
    return [...findUsage(draft, url), ...(published ? findUsage(published, url) : [])].filter((u) => {
      const k = `${u.route}|${u.item}|${u.section}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  const remove = async (item) => {
    const usage = usageOf(item.url);
    if (usage.length) {
      setInspect(item);
      return;
    }
    const ok = await confirm({ title: t('media.deleteTitle'), message: t('media.deleteText'), confirmLabel: t('common.delete'), danger: true });
    if (!ok) return;
    const res = await api('delete-media', { method: 'POST', token, body: { url: item.url } });
    if (res.ok) {
      toast(t('media.deleted'));
      load();
    } else {
      if (res.status === 401) expire();
      toast(t(`error.${res.error}`), 'error');
    }
  };

  const date = (s) => new Date(s * 1000).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'medium' });
  const inspectUsage = inspect ? usageOf(inspect.url) : [];

  return (
    <>
      <PageHeader title={t('nav.media')} help={t('media.help')} />
      <Card title={t('media.upload')} help={t('media.uploadHelp')}>
        <UploadZone accept="any" onUploaded={() => load()} />
      </Card>

      <Card title={t('media.tabUploads')}>
        {items === null ? (
          <p className="flex items-center gap-2 text-[var(--a-muted)]">
            <Spinner /> {t('common.loading')}
          </p>
        ) : items.length === 0 ? (
          <EmptyState icon={FolderOpen} title={t('media.noUploads')} text={t('media.noUploadsHelp')} />
        ) : (
          <ul className="list-none p-0 m-0 a-media-grid">
            {items.map((item) => {
              const used = usageOf(item.url).length;
              return (
                <li key={item.url} className="border border-[var(--a-border)] rounded-lg overflow-hidden bg-white">
                  <button type="button" className="block w-full p-0 border-0 bg-transparent cursor-pointer" onClick={() => setInspect(item)}>
                    <MediaThumb url={item.url} className="aspect-[4/3] w-full" />
                  </button>
                  <div className="p-2 text-xs">
                    <p className="m-0 truncate font-semibold" title={item.name}>
                      {item.name}
                    </p>
                    <p className="m-0 text-[var(--a-muted)]">
                      {formatBytes(item.size)} · {date(item.date)}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      {used ? <span className="a-pill a-pill-ok">{t('media.inUse', { n: used })}</span> : <span className="a-pill a-pill-muted">{t('media.unused')}</span>}
                      <button type="button" className="a-icon-btn hover:!text-[var(--a-danger)]" onClick={() => remove(item)} aria-label={t('common.delete')} title={t('common.delete')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card title={t('media.tabSite')} help={t('media.siteHelp')}>
        <ul className="list-none p-0 m-0 a-media-grid">
          {library.map((i) => (
            <li key={i.id} className="border border-[var(--a-border)] rounded-lg overflow-hidden bg-white">
              <MediaThumb url={i.url} className="aspect-[4/3] w-full" contain={/brand|partners/.test(i.group)} />
              <p className="m-0 p-2 text-xs truncate" title={i.label}>
                {i.label}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      {inspect && (
        <Modal title={inspect.name} onClose={() => setInspect(null)}>
          <MediaThumb url={inspect.url} className="w-full aspect-video rounded-lg mb-4" />
          {inspectUsage.length ? (
            <>
              <p className="font-semibold mt-0">{t('media.usedIn')}</p>
              <ul className="text-sm space-y-1 pl-5">
                {inspectUsage.map((u, n) => (
                  <li key={n}>
                    <Link to={u.route} onClick={() => setInspect(null)}>
                      {t(`section.${u.section}`)}
                      {u.item ? ` › ${u.item}` : ''}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[var(--a-muted)] mb-0">{t('media.cantDelete')}</p>
            </>
          ) : (
            <p className="text-sm text-[var(--a-muted)] m-0">{t('media.notUsed')}</p>
          )}
        </Modal>
      )}
    </>
  );
}
