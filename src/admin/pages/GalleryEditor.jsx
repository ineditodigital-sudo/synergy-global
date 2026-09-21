import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { Card, PageHeader } from '../components/ui.jsx';
import PhotoManager from '../components/PhotoManager.jsx';

export default function GalleryEditor() {
  const { t, draft } = useAdmin();
  usePreviewPath('/about');
  const total = draft.gallery.images.length;
  const shown = draft.gallery.images.filter((g) => g.visible !== false).length;
  return (
    <>
      <PageHeader title={t('nav.gallery')} help={t('gallery.help')} />
      <Card title={t('gallery.photos', { shown, total })} help={t('gallery.photosHelp')}>
        <PhotoManager path={['gallery', 'images']} mode="gallery" />
      </Card>
    </>
  );
}
