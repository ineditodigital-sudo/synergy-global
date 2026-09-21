import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { PageHeader } from '../components/ui.jsx';
import { PAGE_KEYS } from '../lib/pages.js';

export default function PagesIndex() {
  const { t, issues } = useAdmin();
  usePreviewPath('/');
  return (
    <>
      <PageHeader title={t('nav.pages')} help={t('pages.help')} />
      <ul className="list-none p-0 m-0 grid sm:grid-cols-2 gap-3">
        {PAGE_KEYS.map(([key, path]) => {
          const count = issues.filter((i) => i.route === `/admin/pages/${key}`).length;
          return (
            <li key={key}>
              <Link to={`/admin/pages/${key}`} className="a-card !p-4 flex items-center gap-4 no-underline text-[var(--a-text)] hover:border-[var(--a-gold)]">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold m-0">{t(`page.${key}`)}</p>
                  <p className="text-sm text-[var(--a-muted)] m-0">{t(`pages.desc.${key}`)}</p>
                  <p className="text-xs text-[var(--a-faint)] m-0 mt-1 font-mono">{path}</p>
                </div>
                {count > 0 && <span className="a-pill a-pill-warn">{t('pages.suggestions', { n: count })}</span>}
                <ChevronRight size={18} className="text-[var(--a-faint)]" />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
