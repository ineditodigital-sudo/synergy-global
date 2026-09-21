import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { PageHeader } from '../components/ui.jsx';
import Collection from '../components/Collection.jsx';
import { SERVICE_TEMPLATE } from '../../content/schema.js';

export default function ServicesList() {
  const { t } = useAdmin();
  usePreviewPath('/services');
  return (
    <>
      <PageHeader title={t('nav.services')} help={t('services.help')} actions={<Link to="/admin/pages/services" className="a-btn">{t('services.pageTexts')}</Link>} />
      <Collection
        path={['services', 'items']}
        basePath="/admin/services"
        template={{ ...SERVICE_TEMPLATE, visible: false }}
        titleOf={(s) => s.title}
        subtitleOf={(s) => s.summary}
        thumbOf={(s) => s.image}
        badgesOf={(s) => (!s.hasPage ? <span className="a-pill a-pill-muted">{t('services.noPage')}</span> : null)}
        addLabel={t('services.add')}
        emptyTitle={t('services.emptyTitle')}
        icon={Briefcase}
      />
    </>
  );
}
