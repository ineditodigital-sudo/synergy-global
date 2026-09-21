import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Home,
  Briefcase,
  Users,
  Images,
  Menu as MenuIcon,
  Palette,
  Settings,
  FolderOpen,
  History,
  LogOut,
  Undo2,
  Redo2,
  Eye,
  ExternalLink,
  UploadCloud,
  X,
  CheckCircle2,
  CircleDot,
  RotateCcw,
} from 'lucide-react';
import { useAdmin } from '../context.js';
import { Spinner } from './ui.jsx';
import PreviewPane from './PreviewPane.jsx';
import { PublishReview } from './Overlays.jsx';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, key: 'nav.dashboard', end: true },
  { to: '/admin/pages', icon: FileText, key: 'nav.pages' },
  { to: '/admin/properties', icon: Home, key: 'nav.properties' },
  { to: '/admin/services', icon: Briefcase, key: 'nav.services' },
  { to: '/admin/team', icon: Users, key: 'nav.team' },
  { to: '/admin/gallery', icon: Images, key: 'nav.gallery' },
  { to: '/admin/menu', icon: MenuIcon, key: 'nav.menu' },
  { to: '/admin/design', icon: Palette, key: 'nav.design' },
  { to: '/admin/settings', icon: Settings, key: 'nav.settings' },
  { to: '/admin/media', icon: FolderOpen, key: 'nav.media' },
  { to: '/admin/history', icon: History, key: 'nav.history' },
];

function Sidebar({ open, onClose }) {
  const { t, logout, draft, lang, setLang } = useAdmin();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-[90] lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-[95] h-screen w-64 shrink-0 bg-[#1f2a24] text-white flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label={t('nav.label')}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="min-w-0">
            {draft?.style.logoOnDark ? (
              <img src={draft.style.logoOnDark} alt="Synergy Global" className="h-9 w-auto object-contain" />
            ) : (
              <span className="font-['Alata'] tracking-widest uppercase">Synergy Global</span>
            )}
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mt-2 mb-0">{t('nav.cms')}</p>
          </div>
          <button type="button" className="lg:hidden p-2 text-white/70" onClick={onClose} aria-label={t('common.close')}>
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 a-scroll-thin">
          {NAV.map(({ to, icon: I, key, end }) => (
            <NavLink key={to} to={to} end={end} className="a-nav-link" onClick={onClose}>
              <I /> {t(key)}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-1 px-2" role="group" aria-label={t('nav.language')}>
            {['es', 'en'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${lang === l ? 'bg-white text-[#1f2a24]' : 'text-white/60 hover:text-white'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
            <span className="text-[11px] text-white/40 ml-2">{t('nav.language')}</span>
          </div>
          <button type="button" className="a-nav-link w-full bg-transparent border-0 cursor-pointer" onClick={logout}>
            <LogOut /> {t('nav.logout')}
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenu, previewOpen, onTogglePreview }) {
  const { t, dirty, undo, redo, canUndo, canRedo, publish, publishing, discard, confirm, toast, issues, localSaveFailed, published, lang } = useAdmin();
  const [review, setReview] = useState(false);

  const doPublish = async (force = false) => {
    const res = await publish({ force });
    if (res.ok) {
      setReview(false);
      toast(t('publish.done'));
      return;
    }
    if (res.error === 'version-conflict') {
      const ok = await confirm({ title: t('publish.conflictTitle'), message: t('publish.conflictText'), confirmLabel: t('publish.overwrite'), danger: true });
      if (ok) doPublish(true);
      return;
    }
    if (res.status !== 401) toast(t(`error.${res.error}`), 'error');
  };

  const startPublish = () => {
    if (issues.length) setReview(true);
    else doPublish();
  };

  // Ctrl/Cmd+S publishes; Ctrl/Cmd+Z undo outside text fields.
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === 's') {
        e.preventDefault();
        if (dirty && !publishing) startPublish();
        return;
      }
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (k === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (k === 'y' || (k === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const last = published?._meta.updatedAt ? new Date(published._meta.updatedAt).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '';

  return (
    <header className="sticky top-0 z-[80] bg-white/95 backdrop-blur border-b border-[var(--a-border)]">
      <div className="flex items-center gap-2 px-4 lg:px-6 h-16">
        <button type="button" className="a-icon-btn lg:hidden" onClick={onMenu} aria-label={t('nav.open')}>
          <MenuIcon size={20} />
        </button>
        <div className="min-w-0 flex-1 flex items-center gap-3">
          {dirty ? (
            <span className="a-pill a-pill-warn">
              <CircleDot size={13} /> {t('status.unpublished')}
            </span>
          ) : (
            <span className="a-pill a-pill-ok" title={last ? t('status.lastPublished', { when: last }) : undefined}>
              <CheckCircle2 size={13} /> {t('status.published')}
            </span>
          )}
          {localSaveFailed && <span className="a-pill a-pill-danger hidden md:inline-flex">{t('status.localSaveFailed')}</span>}
          {last && !dirty && <span className="text-xs text-[var(--a-faint)] hidden xl:inline truncate">{t('status.lastPublished', { when: last })}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="a-icon-btn" onClick={undo} disabled={!canUndo} aria-label={t('action.undo')} title={`${t('action.undo')} (Ctrl+Z)`}>
            <Undo2 size={18} />
          </button>
          <button type="button" className="a-icon-btn" onClick={redo} disabled={!canRedo} aria-label={t('action.redo')} title={`${t('action.redo')} (Ctrl+Y)`}>
            <Redo2 size={18} />
          </button>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="a-btn a-btn-ghost hidden md:inline-flex">
          <ExternalLink size={16} /> {t('action.viewSite')}
        </a>
        <button type="button" className={`a-btn ${previewOpen ? 'a-btn-primary' : ''}`} onClick={onTogglePreview} aria-pressed={previewOpen}>
          <Eye size={16} /> <span className="hidden sm:inline">{t('action.preview')}</span>
        </button>
        {dirty && (
          <button
            type="button"
            className="a-btn a-btn-ghost hidden md:inline-flex"
            onClick={async () => {
              const ok = await confirm({ title: t('discard.title'), message: t('discard.text'), confirmLabel: t('discard.confirm'), danger: true });
              if (ok) {
                discard();
                toast(t('discard.done'));
              }
            }}
          >
            <RotateCcw size={16} /> {t('action.discard')}
          </button>
        )}
        <button type="button" className="a-btn a-btn-primary" onClick={startPublish} disabled={!dirty || publishing}>
          {publishing ? <Spinner size={16} /> : <UploadCloud size={16} />} {t('action.publish')}
        </button>
      </div>
      {review && <PublishReview issues={issues} busy={publishing} onClose={() => setReview(false)} onPublish={() => doPublish()} />}
    </header>
  );
}

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1280px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const onChange = () => setWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenu={() => setMenuOpen(true)} previewOpen={previewOpen} onTogglePreview={() => setPreviewOpen((v) => !v)} />
        <div className="flex-1 flex min-h-0">
          <main className={`flex-1 min-w-0 px-4 lg:px-8 py-6 lg:py-8 ${previewOpen && wide ? 'max-w-[760px]' : ''}`}>
            <div className={previewOpen && wide ? '' : 'max-w-5xl mx-auto'}>{children}</div>
          </main>
          {previewOpen && wide && (
            <div className="flex-1 min-w-[420px] sticky top-16 h-[calc(100vh-4rem)] border-l border-[var(--a-border)]">
              <PreviewPane onClose={() => setPreviewOpen(false)} />
            </div>
          )}
          {previewOpen && !wide && <PreviewPane overlay onClose={() => setPreviewOpen(false)} />}
        </div>
      </div>
    </div>
  );
}
