import { Home as HomeIcon } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { PageHeader } from '../components/ui.jsx';
import Collection from '../components/Collection.jsx';
import { PROPERTY_TEMPLATE } from '../../content/schema.js';
import { propertyPlace } from '../../content/site.js';

export default function PropertiesList() {
  const { t } = useAdmin();
  usePreviewPath('/portfolio');
  return (
    <>
      <PageHeader title={t('nav.properties')} help={t('props.help')} />
      <Collection
        path={['portfolio', 'items']}
        basePath="/admin/properties"
        template={{ ...PROPERTY_TEMPLATE, visible: false }}
        titleOf={(p) => p.title}
        subtitleOf={(p) => [propertyPlace(p), p.price].filter(Boolean).join(' · ')}
        thumbOf={(p) => p.images[0]?.src}
        badgesOf={(p) => (
          <>
            {p.status && <span className="a-pill a-pill-muted">{p.status}</span>}
            {p.featured && <span className="a-pill a-pill-warn">{t('props.featuredBadge')}</span>}
            {!p.images.length && <span className="a-pill a-pill-danger">{t('props.noPhotos')}</span>}
          </>
        )}
        addLabel={t('props.add')}
        emptyTitle={t('props.emptyTitle')}
        emptyText={t('props.emptyText')}
        icon={HomeIcon}
      />
    </>
  );
}
