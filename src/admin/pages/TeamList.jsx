import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { PageHeader } from '../components/ui.jsx';
import Collection from '../components/Collection.jsx';
import { MEMBER_TEMPLATE } from '../../content/schema.js';

export default function TeamList() {
  const { t } = useAdmin();
  usePreviewPath('/about');
  return (
    <>
      <PageHeader title={t('nav.team')} help={t('team.help')} actions={<Link to="/admin/pages/about" className="a-btn">{t('team.pageTexts')}</Link>} />
      <Collection
        path={['about', 'team']}
        basePath="/admin/team"
        template={{ ...MEMBER_TEMPLATE, visible: false }}
        titleOf={(m) => m.name}
        subtitleOf={(m) => m.role}
        thumbOf={(m) => m.image}
        addLabel={t('team.add')}
        emptyTitle={t('team.emptyTitle')}
        icon={Users}
      />
    </>
  );
}
