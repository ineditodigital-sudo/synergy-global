import { useEffect, useState } from 'react';
import { History, RotateCcw } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { api } from '../lib/api.js';
import { Card, PageHeader, Spinner, EmptyState } from '../components/ui.jsx';

export default function HistoryPage() {
  const { t, token, confirm, toast, restoreVersion, dirty, expire, lang } = useAdmin();
  usePreviewPath('/');
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const load = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    api('history', { token }).then((res) => {
      if (cancelled) return;
      if (res.ok) setData(res);
      else {
        if (res.status === 401) expire();
        setData({ items: [], current: null, error: res.error });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token, expire, reloadKey]);

  const fmt = (iso) => new Date(iso).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const restore = async (item) => {
    const ok = await confirm({
      title: t('history.restoreTitle'),
      message: `${t('history.restoreText', { when: fmt(item.date) })}${dirty ? `\n\n${t('history.restoreDirty')}` : ''}`,
      confirmLabel: t('history.restore'),
      danger: dirty,
    });
    if (!ok) return;
    setBusy(item.id);
    const res = await restoreVersion(item.id);
    setBusy('');
    if (res.ok) {
      toast(t('history.restored'));
      load();
    } else if (res.status !== 401) {
      toast(t(`error.${res.error}`), 'error');
    }
  };

  const reasonLabel = (r) => t(`history.reason.${r || 'publish'}`);

  return (
    <>
      <PageHeader title={t('nav.history')} help={t('history.help')} />
      <Card>
        {data === null ? (
          <p className="flex items-center gap-2 text-[var(--a-muted)] m-0">
            <Spinner /> {t('common.loading')}
          </p>
        ) : (
          <>
            {data.current?.updatedAt && (
              <p className="text-sm m-0 mb-4">
                <span className="a-pill a-pill-ok mr-2">{t('history.live')}</span>
                {t('history.currentVersion', { v: data.current.version, when: fmt(data.current.updatedAt) })}
              </p>
            )}
            {data.items.length === 0 ? (
              <EmptyState icon={History} title={t('history.empty')} text={t('history.emptyText')} />
            ) : (
              <ul className="list-none p-0 m-0 divide-y divide-[var(--a-border)]">
                {data.items.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="flex-1 min-w-[200px]">
                      <p className="m-0 font-semibold text-sm">{t('history.savedCopy', { when: fmt(item.date) })}</p>
                      <p className="m-0 text-xs text-[var(--a-muted)]">
                        {item.version != null ? t('history.version', { v: item.version }) : ''} · {reasonLabel(item.reason)}
                      </p>
                    </div>
                    <button type="button" className="a-btn a-btn-sm" onClick={() => restore(item)} disabled={Boolean(busy)}>
                      {busy === item.id ? <Spinner size={14} /> : <RotateCcw size={14} />} {t('history.restore')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Card>
    </>
  );
}
