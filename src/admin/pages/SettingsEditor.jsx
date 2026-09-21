import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { Card, PageHeader } from '../components/ui.jsx';
import { TextField, ToggleField } from '../components/fields.jsx';
import ImageField from '../components/ImageField.jsx';
import { SOCIAL_NETWORKS } from '../../lib/icons.js';

const urlOk = (v) => !v || /^https?:\/\/[^\s]+$/i.test(v);

export default function SettingsEditor() {
  const { t, draft } = useAdmin();
  usePreviewPath('/');
  const S = (...p) => ['settings', ...p];
  const s = draft.settings;
  const onStaging = /inedito\.digital/i.test(s.siteUrl);

  return (
    <>
      <PageHeader title={t('nav.settings')} help={t('settings.help')} />

      <Card title={t('settings.search')} help={t('settings.searchHelp')}>
        <div
          className={`flex gap-3 rounded-lg p-3 mb-5 text-sm ${s.allowIndexing ? 'bg-[var(--a-success-soft)] text-[var(--a-success)]' : 'bg-[var(--a-warning-soft)] text-[var(--a-warning)]'}`}
        >
          {s.allowIndexing ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertTriangle size={18} className="shrink-0" />}
          <span>{s.allowIndexing ? t('settings.indexOnText') : t('settings.indexOffText')}</span>
        </div>
        <ToggleField path={S('allowIndexing')} label={t('settings.allowIndexing')} hint={t('settings.allowIndexingHint')} />
        {s.allowIndexing && onStaging && <p className="text-sm text-[var(--a-danger)] -mt-2 mb-4">{t('settings.stagingWarning')}</p>}
        <TextField
          path={S('siteUrl')}
          label={t('settings.siteUrl')}
          hint={t('settings.siteUrlHint')}
          inputMode="url"
          validate={(v) => (/^https?:\/\/[^/\s]+\/?$/i.test(v) ? '' : t('check.siteUrlInvalid'))}
        />
        <TextField path={S('titleSuffix')} label={t('settings.titleSuffix')} hint={t('settings.titleSuffixHint')} />
        <TextField path={S('defaultDescription')} label={t('settings.defaultDescription')} multiline rows={3} max={160} />
        <ImageField path={S('shareImage')} label={t('settings.shareImage')} hint={t('settings.shareImageHint')} />
      </Card>

      <Card title={t('settings.business')} help={t('settings.businessHelp')}>
        <div className="a-grid-2">
          <TextField path={S('legalName')} label={t('settings.legalName')} />
          <TextField path={S('siteName')} label={t('settings.siteName')} />
          <TextField path={S('email')} label={t('settings.email')} type="email" validate={(v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : t('check.emailInvalid'))} />
          <TextField path={S('phone')} label={t('settings.phone')} type="tel" placeholder="(415) 555-0123" />
        </div>
        <TextField path={S('streetAddress')} label={t('settings.street')} hint={t('settings.streetHint')} />
        <div className="a-grid-3">
          <TextField path={S('city')} label={t('props.city')} />
          <TextField path={S('state')} label={t('props.state')} />
          <TextField path={S('postalCode')} label={t('props.zip')} />
        </div>
        <div className="a-grid-2">
          <TextField path={S('country')} label={t('settings.country')} />
          <TextField path={S('areaServed')} label={t('settings.areaServed')} />
        </div>
        <TextField path={S('licenseNumber')} label={t('settings.license')} hint={t('settings.licenseHint')} placeholder="CA DRE #01234567" />
        <ToggleField path={S('showEqualHousing')} label={t('settings.equalHousing')} hint={t('settings.equalHousingHint')} />
      </Card>

      <Card title={t('settings.social')} help={t('settings.socialHelp')}>
        <div className="a-grid-2">
          {SOCIAL_NETWORKS.map(([key, label]) => (
            <TextField key={key} path={S('social', key)} label={label} placeholder="https://" inputMode="url" validate={(v) => (urlOk(v) ? '' : t('link.invalid'))} />
          ))}
        </div>
      </Card>

      <Card title={t('settings.analytics')} help={t('settings.analyticsHelp')}>
        <TextField path={S('analyticsId')} label={t('settings.analyticsId')} placeholder="G-XXXXXXXXXX" validate={(v) => (!v || /^G-[A-Z0-9]{4,}$/i.test(v) ? '' : t('settings.analyticsInvalid'))} />
      </Card>

      <Card title={t('settings.password')}>
        <p className="text-sm text-[var(--a-muted)] m-0">{t('settings.passwordText')}</p>
      </Card>
    </>
  );
}
