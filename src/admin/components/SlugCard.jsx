import { ExternalLink, RefreshCw } from 'lucide-react';
import { useAdmin } from '../context.js';
import { Card } from './ui.jsx';
import { slugify } from '../../content/normalize.js';

/**
 * Shows the page's web address. It is created from the title once and then
 * kept stable, so links shared on social media or Google keep working.
 */
export default function SlugCard({ base, path, item, textKey, published }) {
  const { t, update, confirm } = useAdmin();
  const slug = item.slug || slugify(item[textKey]);
  const fromTitle = slugify(item[textKey]);
  return (
    <Card title={t('slug.title')} help={t('slug.help')}>
      <div className="flex flex-wrap items-center gap-2">
        <code className="bg-[var(--a-sunken)] border border-[var(--a-border)] rounded-md px-3 py-2 text-sm break-all">
          {base}/{slug}
        </code>
        {published && (
          <a href={`${base}/${slug}`} target="_blank" rel="noopener noreferrer" className="a-btn a-btn-sm">
            <ExternalLink size={14} /> {t('slug.open')}
          </a>
        )}
        {item.slug && fromTitle !== item.slug && (
          <button
            type="button"
            className="a-btn a-btn-sm"
            onClick={async () => {
              const ok = await confirm({ title: t('slug.updateTitle'), message: t('slug.updateText', { slug: fromTitle }), confirmLabel: t('slug.updateConfirm') });
              if (ok) update([...path, 'slug'], fromTitle, { coalesce: false });
            }}
          >
            <RefreshCw size={14} /> {t('slug.update')}
          </button>
        )}
      </div>
    </Card>
  );
}
