import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useAdmin } from '../context.js';
import { Modal, Spinner } from './ui.jsx';

export function Toasts() {
  const { toasts, dismissToast } = useAdmin();
  return (
    <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)]" aria-live="polite">
      {toasts.map((x) => (
        <div
          key={x.id}
          className={`flex items-start gap-3 rounded-lg shadow-lg px-4 py-3 text-sm border ${x.type === 'error' ? 'bg-[var(--a-danger-soft)] border-[#f0c2bd] text-[var(--a-danger)]' : 'bg-white border-[var(--a-border)] text-[var(--a-text)]'}`}
          role={x.type === 'error' ? 'alert' : 'status'}
        >
          {x.type === 'error' ? <XCircle size={18} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-[var(--a-success)]" />}
          <span className="flex-1">{x.message}</span>
          <button type="button" className="shrink-0 opacity-60 hover:opacity-100" onClick={() => dismissToast(x.id)} aria-label="Close">
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ConfirmDialog() {
  const { dialog, closeDialog, t } = useAdmin();
  if (!dialog) return null;
  return (
    <Modal
      title={dialog.title}
      onClose={() => closeDialog(false)}
      footer={
        <>
          <button type="button" className="a-btn" onClick={() => closeDialog(false)}>
            {dialog.cancelLabel || t('common.cancel')}
          </button>
          <button type="button" className={`a-btn ${dialog.danger ? 'a-btn-danger-solid' : 'a-btn-primary'}`} onClick={() => closeDialog(true)} autoFocus>
            {dialog.confirmLabel || t('common.confirm')}
          </button>
        </>
      }
    >
      <p className="m-0 whitespace-pre-line">{dialog.message}</p>
    </Modal>
  );
}

export function RecoveryBanner() {
  const { recovery, acceptRecovery, dismissRecovery, t, lang } = useAdmin();
  if (!recovery) return null;
  const when = recovery.savedAt ? new Date(recovery.savedAt).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  return (
    <div className="mb-5 rounded-xl border border-[#ecd9a8] bg-[var(--a-warning-soft)] p-4 flex flex-col md:flex-row md:items-center gap-3">
      <Info size={20} className="text-[var(--a-warning)] shrink-0" />
      <div className="flex-1 text-sm">
        <p className="m-0 font-semibold">{t('recovery.title', { when })}</p>
        <p className="m-0 text-[var(--a-muted)]">{recovery.outdated ? t('recovery.outdated') : t('recovery.text')}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" className="a-btn a-btn-sm" onClick={dismissRecovery}>
          {t('recovery.discard')}
        </button>
        <button type="button" className="a-btn a-btn-sm a-btn-primary" onClick={acceptRecovery}>
          {t('recovery.restore')}
        </button>
      </div>
    </div>
  );
}

/** Asks for the password again without losing any unpublished work. */
export function SessionExpiredDialog() {
  const { sessionExpired, login, t, logout } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (!sessionExpired) return null;
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await login(password);
    setBusy(false);
    if (res.ok) setPassword('');
    else setError(t(`error.${res.error}`, { minutes: Math.ceil((res.retryAfter || 60) / 60) }));
  };
  return (
    <Modal title={t('session.expiredTitle')}>
      <form onSubmit={submit}>
        <p className="mt-0 text-sm text-[var(--a-muted)]">{t('session.expiredText')}</p>
        <label className="a-field">
          <span className="a-label">{t('login.password')}</span>
          <input type="password" className="a-input" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus autoComplete="current-password" />
        </label>
        {error && <p className="text-sm text-[var(--a-danger)]">{error}</p>}
        <div className="flex justify-between gap-2 mt-4">
          <button type="button" className="a-btn a-btn-ghost" onClick={logout}>
            {t('nav.logout')}
          </button>
          <button type="submit" className="a-btn a-btn-primary" disabled={!password || busy}>
            {busy && <Spinner size={15} />} {t('login.submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** Review shown before publishing when something needs attention. */
export function PublishReview({ issues, onClose, onPublish, busy }) {
  const { t } = useAdmin();
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');
  const pageName = (p) => (p.page ? t(`page.${p.page}`) : '');
  return (
    <Modal
      title={t('publish.reviewTitle')}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="a-btn" onClick={onClose}>
            {t('publish.keepEditing')}
          </button>
          <button type="button" className="a-btn a-btn-primary" onClick={onPublish} disabled={errors.length > 0 || busy}>
            {busy && <Spinner size={15} />} {errors.length ? t('publish.fixFirst') : t('publish.anyway')}
          </button>
        </>
      }
    >
      {errors.length > 0 && (
        <>
          <p className="mt-0 font-semibold text-[var(--a-danger)]">{t('publish.errorsIntro')}</p>
          <ul className="list-none p-0 m-0 mb-4 space-y-2">
            {errors.map((i, n) => (
              <li key={n} className="flex gap-2 text-sm">
                <XCircle size={17} className="text-[var(--a-danger)] shrink-0 mt-0.5" />
                <Link to={i.route} onClick={onClose} className="text-[var(--a-text)] underline decoration-dotted">
                  {t(i.key, { ...i.params, page: pageName(i.params) })}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {warnings.length > 0 && (
        <>
          <p className="mt-0 font-semibold text-[var(--a-warning)]">{t('publish.warningsIntro')}</p>
          <ul className="list-none p-0 m-0 space-y-2 max-h-72 overflow-auto">
            {warnings.map((i, n) => (
              <li key={n} className="flex gap-2 text-sm">
                <AlertTriangle size={16} className="text-[var(--a-warning)] shrink-0 mt-0.5" />
                <Link to={i.route} onClick={onClose} className="text-[var(--a-text)] underline decoration-dotted">
                  {t(i.key, { ...i.params, page: pageName(i.params) })}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Modal>
  );
}
