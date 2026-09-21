import { Navigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath, useItem, useDeleteItem } from '../hooks.js';
import { Card, PageHeader } from '../components/ui.jsx';
import { BackLink } from '../components/Collection.jsx';
import { TextField, ToggleField, SelectField, ChipsField } from '../components/fields.jsx';
import PhotoManager from '../components/PhotoManager.jsx';
import SeoCard from '../components/SeoCard.jsx';
import SlugCard from '../components/SlugCard.jsx';
import { PROPERTY_STATUSES, PROPERTY_TYPES } from '../../content/schema.js';
import { propertySeo } from '../../content/site.js';
import { slugify } from '../../content/normalize.js';

export default function PropertyEditor() {
  const { id } = useParams();
  const { t, published } = useAdmin();
  const listPath = ['portfolio', 'items'];
  const { index, item } = useItem(listPath, id);
  const remove = useDeleteItem(listPath, '/admin/properties');
  const slug = item ? item.slug || slugify(item.title) : '';
  usePreviewPath(item ? `/portfolio/${slug}` : '/portfolio');
  if (!item) return <Navigate to="/admin/properties" replace />;

  const P = (...p) => [...listPath, index, ...p];
  const isPublished = published?.portfolio.items.some((p) => p.id === item.id && p.visible);
  const auto = propertySeo({ ...item, slug });

  return (
    <>
      <PageHeader
        title={item.title || t('props.newTitle')}
        back={<BackLink to="/admin/properties" label={t('nav.properties')} />}
        actions={
          <button type="button" className="a-btn a-btn-danger" onClick={() => remove(item.id, item.title)}>
            <Trash2 size={16} /> {t('props.delete')}
          </button>
        }
      />

      <Card title={t('props.visibility')}>
        <ToggleField path={P('visible')} label={t('props.visible')} hint={t('props.visibleHint')} />
        <ToggleField path={P('featured')} label={t('props.featured')} hint={t('props.featuredHint')} />
        <div className="a-grid-2">
          <SelectField path={P('status')} label={t('props.status')} options={PROPERTY_STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) }))} />
          <SelectField path={P('type')} label={t('props.type')} options={PROPERTY_TYPES.map((s) => ({ value: s, label: t(`ptype.${s}`) }))} />
        </div>
      </Card>

      <Card title={t('props.photos')} help={t('props.photosHelp')}>
        <PhotoManager path={P('images')} mode="property" />
      </Card>

      <Card title={t('props.basics')}>
        <TextField path={P('title')} label={t('props.titleLabel')} hint={t('props.titleHint')} />
        <div className="a-grid-2">
          <TextField path={P('neighborhood')} label={t('props.neighborhood')} placeholder="Noe Valley" />
          <TextField path={P('city')} label={t('props.city')} />
          <TextField path={P('state')} label={t('props.state')} placeholder="CA" />
          <TextField path={P('postalCode')} label={t('props.zip')} placeholder="94131" inputMode="numeric" />
        </div>
        <TextField path={P('price')} label={t('props.price')} hint={t('props.priceHint')} placeholder="$2,450,000" />
      </Card>

      <Card title={t('props.facts')} help={t('props.factsHelp')}>
        <div className="a-grid-3">
          <TextField path={P('beds')} label={t('props.beds')} inputMode="decimal" />
          <TextField path={P('baths')} label={t('props.baths')} inputMode="decimal" />
          <TextField path={P('sqft')} label={t('props.sqft')} placeholder="2,150" />
          <TextField path={P('lotSize')} label={t('props.lot')} placeholder="2,500 sq. ft." />
          <TextField path={P('yearBuilt')} label={t('props.year')} inputMode="numeric" />
          <TextField path={P('parking')} label={t('props.parking')} placeholder="2-car garage" />
        </div>
      </Card>

      <Card title={t('props.description')}>
        <TextField path={P('summary')} label={t('props.summary')} hint={t('props.summaryHint')} max={110} />
        <TextField path={P('description')} label={t('props.descriptionLabel')} multiline rows={7} hint={t('field.paragraphsHint')} />
        <ChipsField path={P('features')} label={t('props.features')} placeholder={t('props.featuresPlaceholder')} />
      </Card>

      <SlugCard base="/portfolio" path={P()} item={item} textKey="title" published={isPublished} />
      <SeoCard path={P('seo')} urlPath={`/portfolio/${slug}`} autoTitle={auto.title} autoDescription={auto.description} />
    </>
  );
}
