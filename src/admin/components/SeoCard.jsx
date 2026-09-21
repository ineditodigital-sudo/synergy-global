import { useAdmin, useField } from '../context.js';
import { fullTitle, clip } from '../../content/site.js';
import { Card } from './ui.jsx';
import { TextField } from './fields.jsx';
import ImageField from './ImageField.jsx';

/**
 * How the page appears on Google, with character guidance.
 * autoTitle/autoDescription are shown when the fields are left empty.
 */
export default function SeoCard({ path, urlPath = '/', withImage = false, autoTitle = '', autoDescription = '' }) {
  const { t, draft } = useAdmin();
  const [title] = useField([...path, 'title']);
  const [description] = useField([...path, 'description']);
  const suffix = draft.settings.titleSuffix;
  const shownTitle = fullTitle(title || autoTitle, suffix);
  const shownDesc = clip(description || autoDescription || draft.settings.defaultDescription);
  const host = draft.settings.siteUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');

  return (
    <Card title={t('seo.cardTitle')} help={t('seo.cardHelp')}>
      <div className="rounded-lg border border-[var(--a-border)] bg-white p-4 mb-5" aria-label={t('seo.googlePreview')}>
        <p className="text-xs text-[var(--a-muted)] m-0 mb-1">{t('seo.googlePreview')}</p>
        <p className="text-[13px] text-[#4d5156] m-0 truncate">
          {host}
          {urlPath === '/' ? '' : urlPath.replace(/\//g, ' › ')}
        </p>
        <p className="text-[19px] leading-snug text-[#1a0dab] m-0 truncate">{shownTitle}</p>
        <p className="text-[14px] leading-snug text-[#4d5156] m-0 mt-0.5 line-clamp-2">{shownDesc}</p>
        {!draft.settings.allowIndexing && <p className="text-xs text-[var(--a-warning)] mt-2 mb-0">{t('seo.hiddenNotice')}</p>}
      </div>
      <TextField path={[...path, 'title']} label={t('seo.title')} max={Math.max(20, 62 - (suffix ? suffix.length + 3 : 0))} placeholder={autoTitle} hint={t('seo.titleHint', { suffix })} />
      <TextField path={[...path, 'description']} label={t('seo.description')} multiline rows={3} max={160} placeholder={autoDescription} hint={t('seo.descriptionHint')} />
      {withImage && <ImageField path={[...path, 'image']} label={t('seo.shareImage')} hint={t('seo.shareImageHint')} />}
    </Card>
  );
}
