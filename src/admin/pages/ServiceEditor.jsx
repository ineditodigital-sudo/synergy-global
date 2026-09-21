import { Navigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath, useItem, useDeleteItem } from '../hooks.js';
import { Card, PageHeader } from '../components/ui.jsx';
import { BackLink } from '../components/Collection.jsx';
import { TextField, ToggleField, ChipsField } from '../components/fields.jsx';
import ImageField from '../components/ImageField.jsx';
import IconField from '../components/IconField.jsx';
import LinkField from '../components/LinkField.jsx';
import ListEditor from '../components/ListEditor.jsx';
import SeoCard from '../components/SeoCard.jsx';
import SlugCard from '../components/SlugCard.jsx';
import { slugify } from '../../content/normalize.js';

export default function ServiceEditor() {
  const { id } = useParams();
  const { t, published } = useAdmin();
  const listPath = ['services', 'items'];
  const { index, item } = useItem(listPath, id);
  const remove = useDeleteItem(listPath, '/admin/services');
  const slug = item ? item.slug || slugify(item.title) : '';
  usePreviewPath(item?.hasPage ? `/services/${slug}` : '/services');
  if (!item) return <Navigate to="/admin/services" replace />;

  const P = (...p) => [...listPath, index, ...p];
  const D = (...p) => P('detail', ...p);
  const isPublished = published?.services.items.some((s) => s.id === item.id && s.visible && s.hasPage);

  return (
    <>
      <PageHeader
        title={item.title || t('services.newTitle')}
        back={<BackLink to="/admin/services" label={t('nav.services')} />}
        actions={
          <button type="button" className="a-btn a-btn-danger" onClick={() => remove(item.id, item.title)}>
            <Trash2 size={16} /> {t('services.delete')}
          </button>
        }
      />

      <Card title={t('services.card')} help={t('services.cardHelp')}>
        <ToggleField path={P('visible')} label={t('services.visible')} />
        <TextField path={P('title')} label={t('field.name')} />
        <TextField path={P('summary')} label={t('services.summary')} multiline rows={3} max={180} />
        <IconField path={P('icon')} />
        <ImageField path={P('image')} label={t('services.cardImage')} />
      </Card>

      <Card title={t('services.page')} help={t('services.pageHelp')}>
        <ToggleField path={P('hasPage')} label={t('services.hasPage')} hint={t('services.hasPageHint')} />
        {!item.hasPage && <LinkField path={P('link')} label={t('services.linkInstead')} />}
      </Card>

      {item.hasPage && (
        <>
          <Card title={t('services.hero')}>
            <TextField path={D('heroTag')} label={t('field.label')} />
            <div className="a-grid-2">
              <TextField path={D('heroTitle')} label={t('field.titleLine1')} />
              <TextField path={D('heroTitleAccent')} label={t('field.titleLine2')} />
            </div>
            <TextField path={D('heroQuote')} label={t('field.quote')} multiline rows={2} />
            <ImageField path={D('heroImage')} label={t('field.backgroundImage')} />
          </Card>

          <Card title={t('services.intro')}>
            <TextField path={D('introBadge')} label={t('field.label')} />
            <div className="a-grid-2">
              <TextField path={D('introTitle')} label={t('field.title')} />
              <TextField path={D('introHighlight')} label={t('field.highlight')} hint={t('field.highlightHint')} />
            </div>
            <TextField path={D('introText')} label={t('field.text')} multiline rows={5} hint={t('field.paragraphsHint')} />
            <ChipsField path={D('highlights')} label={t('services.highlights')} />
            <ImageField path={D('sideImage')} label={t('services.sideImage')} hint={t('services.sideImageHint')} />
          </Card>

          <Card title={t('services.capabilities')}>
            <TextField path={D('sectionBadge')} label={t('field.label')} />
            <div className="a-grid-2">
              <TextField path={D('sectionTitle')} label={t('field.title')} />
              <TextField path={D('sectionHighlight')} label={t('field.highlight')} />
            </div>
            <ListEditor
              path={D('capabilities')}
              template={{ id: '', icon: 'briefcase', title: '', desc: '' }}
              itemTitle={(x) => x.title}
              addLabel={t('services.addCapability')}
              max={8}
              renderItem={(p) => (
                <>
                  <IconField path={[...p, 'icon']} />
                  <TextField path={[...p, 'title']} label={t('field.title')} />
                  <TextField path={[...p, 'desc']} label={t('field.description')} multiline rows={3} />
                </>
              )}
            />
          </Card>

          <Card title={t('services.cta')}>
            <TextField path={D('ctaTitle')} label={t('field.title')} />
            <div className="a-grid-2">
              <TextField path={D('ctaLabel')} label={t('field.buttonLabel')} />
              <LinkField path={D('ctaLink')} label={t('field.goesTo')} />
            </div>
          </Card>

          <SlugCard base="/services" path={P()} item={item} textKey="title" published={isPublished} />
          <SeoCard path={D('seo')} urlPath={`/services/${slug}`} autoTitle={item.title} autoDescription={item.summary} />
        </>
      )}
    </>
  );
}
