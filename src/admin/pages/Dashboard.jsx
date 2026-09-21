import { Link } from 'react-router-dom';
import { Home, FileText, Images, ExternalLink, Search, AlertTriangle, CheckCircle2, UploadCloud, History, Plus } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { Card, PageHeader } from '../components/ui.jsx';

function Stat({ label, value, to }) {
  return (
    <Link to={to} className="a-card !p-4 no-underline text-[var(--a-text)] hover:border-[var(--a-gold)] block">
      <p className="text-3xl font-['Alata'] m-0">{value}</p>
      <p className="text-sm text-[var(--a-muted)] m-0">{label}</p>
    </Link>
  );
}

export default function Dashboard() {
  const { t, draft, dirty, issues, published, lang } = useAdmin();
  usePreviewPath('/');
  const props = draft.portfolio.items;
  const errors = issues.filter((i) => i.level === 'error').length;
  const warnings = issues.filter((i) => i.level === 'warning').length;
  const last = published?._meta.updatedAt ? new Date(published._meta.updatedAt).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'long', timeStyle: 'short' }) : '—';

  return (
    <>
      <PageHeader title={t('dash.title')} help={t('dash.help')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Stat label={t('dash.propertiesLive', { n: props.filter((p) => p.visible).length })} value={props.length} to="/admin/properties" />
        <Stat label={t('nav.services')} value={draft.services.items.filter((s) => s.visible).length} to="/admin/services" />
        <Stat label={t('nav.team')} value={draft.about.team.filter((m) => m.visible).length} to="/admin/team" />
        <Stat label={t('dash.photos')} value={draft.gallery.images.filter((g) => g.visible !== false).length} to="/admin/gallery" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title={t('dash.statusTitle')}>
          <ul className="list-none p-0 m-0 space-y-3 text-sm">
            <li className="flex gap-3">
              {dirty ? <UploadCloud size={18} className="text-[var(--a-warning)] shrink-0" /> : <CheckCircle2 size={18} className="text-[var(--a-success)] shrink-0" />}
              <span>
                <strong>{dirty ? t('dash.unpublished') : t('dash.allPublished')}</strong>
                <br />
                <span className="text-[var(--a-muted)]">{t('dash.lastPublished', { when: last })}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Search size={18} className={`${draft.settings.allowIndexing ? 'text-[var(--a-success)]' : 'text-[var(--a-warning)]'} shrink-0`} />
              <span>
                <strong>{draft.settings.allowIndexing ? t('dash.indexOn') : t('dash.indexOff')}</strong>
                <br />
                <span className="text-[var(--a-muted)]">{draft.settings.allowIndexing ? t('dash.indexOnHelp') : t('dash.indexOffHelp')}</span>{' '}
                <Link to="/admin/settings">{t('dash.changeSetting')}</Link>
              </span>
            </li>
            <li className="flex gap-3">
              <AlertTriangle size={18} className={`${errors ? 'text-[var(--a-danger)]' : warnings ? 'text-[var(--a-warning)]' : 'text-[var(--a-success)]'} shrink-0`} />
              <span>
                <strong>{errors || warnings ? t('dash.issues', { errors, warnings }) : t('dash.noIssues')}</strong>
                <br />
                <span className="text-[var(--a-muted)]">{t('dash.issuesHelp')}</span>
              </span>
            </li>
          </ul>
          {issues.length > 0 && (
            <ul className="list-none p-0 mt-4 mb-0 space-y-1.5 text-sm border-t border-[var(--a-border)] pt-3 max-h-56 overflow-auto">
              {issues.slice(0, 12).map((i, n) => (
                <li key={n}>
                  <Link to={i.route}>{t(i.key, { ...i.params, page: i.params.page ? t(`page.${i.params.page}`) : '' })}</Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={t('dash.quickTitle')}>
          <div className="grid sm:grid-cols-2 gap-2">
            <Link to="/admin/properties" className="a-btn justify-start">
              <Plus size={16} /> {t('dash.qProperty')}
            </Link>
            <Link to="/admin/pages/home" className="a-btn justify-start">
              <Home size={16} /> {t('dash.qHome')}
            </Link>
            <Link to="/admin/gallery" className="a-btn justify-start">
              <Images size={16} /> {t('dash.qGallery')}
            </Link>
            <Link to="/admin/pages" className="a-btn justify-start">
              <FileText size={16} /> {t('dash.qPages')}
            </Link>
            <Link to="/admin/history" className="a-btn justify-start">
              <History size={16} /> {t('dash.qHistory')}
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="a-btn justify-start">
              <ExternalLink size={16} /> {t('action.viewSite')}
            </a>
          </div>
        </Card>
      </div>

      <Card title={t('dash.howTitle')}>
        <ol className="m-0 pl-5 space-y-2 text-sm text-[var(--a-muted)]">
          <li>{t('dash.how1')}</li>
          <li>{t('dash.how2')}</li>
          <li>{t('dash.how3')}</li>
          <li>{t('dash.how4')}</li>
        </ol>
      </Card>
    </>
  );
}
