import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAdmin } from '../context.js';
import { Spinner } from './ui.jsx';

export default function LoginScreen() {
  const { login, t, lang, setLang } = useAdmin();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError('');
    const res = await login(password);
    setBusy(false);
    if (!res.ok) {
      setError(t(`error.${res.error}`, { minutes: Math.ceil((res.retryAfter || 60) / 60), remaining: res.remaining ?? '' }));
    }
  };

  return (
    <div className="sg-admin min-h-screen flex items-center justify-center p-5 bg-[#1f2a24]">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-['Alata'] tracking-[0.2em] uppercase text-lg m-0">Synergy Global</p>
            <p className="text-sm text-[var(--a-muted)] m-0">{t('login.subtitle')}</p>
          </div>
          <div className="flex gap-1">
            {['es', 'en'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2 py-1 rounded text-xs font-semibold ${lang === l ? 'bg-[var(--a-primary)] text-white' : 'text-[var(--a-muted)]'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <label className="a-field">
          <span className="a-label">{t('login.password')}</span>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              className="a-input pr-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
            />
            <button type="button" className="a-icon-btn absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShow((s) => !s)} aria-label={show ? t('login.hide') : t('login.show')}>
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>
        {error && (
          <p className="text-sm text-[var(--a-danger)] bg-[var(--a-danger-soft)] rounded-lg px-3 py-2" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="a-btn a-btn-primary w-full mt-2" disabled={!password || busy}>
          {busy ? <Spinner size={16} /> : <Lock size={16} />} {t('login.submit')}
        </button>
        <p className="text-xs text-[var(--a-faint)] mt-6 mb-0 text-center">{t('login.help')}</p>
      </form>
    </div>
  );
}
