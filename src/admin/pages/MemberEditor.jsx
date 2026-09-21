import { Navigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath, useItem, useDeleteItem } from '../hooks.js';
import { Card, PageHeader } from '../components/ui.jsx';
import { BackLink } from '../components/Collection.jsx';
import { TextField, ToggleField, ChipsField } from '../components/fields.jsx';
import ImageField from '../components/ImageField.jsx';
import SlugCard from '../components/SlugCard.jsx';
import { slugify } from '../../content/normalize.js';

const emailOk = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function MemberEditor() {
  const { id } = useParams();
  const { t, published } = useAdmin();
  const listPath = ['about', 'team'];
  const { index, item } = useItem(listPath, id);
  const remove = useDeleteItem(listPath, '/admin/team');
  const slug = item ? item.slug || slugify(item.name) : '';
  usePreviewPath(item ? `/team/${slug}` : '/about');
  if (!item) return <Navigate to="/admin/team" replace />;

  const P = (...p) => [...listPath, index, ...p];
  const isPublished = published?.about.team.some((m) => m.id === item.id && m.visible);

  return (
    <>
      <PageHeader
        title={item.name || t('team.newTitle')}
        back={<BackLink to="/admin/team" label={t('nav.team')} />}
        actions={
          <button type="button" className="a-btn a-btn-danger" onClick={() => remove(item.id, item.name)}>
            <Trash2 size={16} /> {t('team.delete')}
          </button>
        }
      />
      <Card title={t('team.profile')}>
        <ToggleField path={P('visible')} label={t('team.visible')} />
        <div className="a-grid-2">
          <TextField path={P('name')} label={t('field.name')} />
          <TextField path={P('role')} label={t('team.role')} placeholder="CEO" />
        </div>
        <ImageField path={P('image')} label={t('team.photo')} aspect="aspect-[3/4]" hint={t('team.photoHint')} />
        <TextField path={P('bio')} label={t('team.bio')} multiline rows={10} hint={t('field.paragraphsHint')} />
        <ChipsField path={P('specialties')} label={t('team.specialties')} />
        <ChipsField path={P('locations')} label={t('team.markets')} />
      </Card>
      <Card title={t('team.contact')}>
        <TextField path={P('email')} label={t('team.email')} type="email" validate={(v) => (emailOk(v) ? '' : t('check.emailInvalid'))} />
        <div className="a-grid-2">
          <TextField path={P('phone')} label={t('team.phone')} type="tel" placeholder="(415) 555-0123" />
          <div className="pt-7">
            <ToggleField path={P('showPhone')} label={t('team.showPhone')} />
          </div>
        </div>
        <TextField path={P('linkedin')} label="LinkedIn" placeholder="https://www.linkedin.com/in/…" validate={(v) => (v && !/^https?:\/\//i.test(v) ? t('link.invalid') : '')} />
      </Card>
      <SlugCard base="/team" path={P()} item={item} textKey="name" published={isPublished} />
    </>
  );
}
