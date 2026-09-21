import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { Card, PageHeader } from '../components/ui.jsx';
import { TextField, ToggleField } from '../components/fields.jsx';
import LinkField from '../components/LinkField.jsx';
import ListEditor from '../components/ListEditor.jsx';

export default function MenuEditor() {
  const { t } = useAdmin();
  usePreviewPath('/');
  const N = (...p) => ['navigation', ...p];
  const F = (...p) => ['footer', ...p];
  const linkItem = (p) => (
    <div className="a-grid-2">
      <TextField path={[...p, 'label']} label={t('field.text')} />
      <LinkField path={[...p, 'path']} label={t('field.goesTo')} />
    </div>
  );

  return (
    <>
      <PageHeader title={t('nav.menu')} help={t('menu.help')} />

      <Card title={t('menu.main')} help={t('menu.mainHelp')}>
        <ListEditor
          path={N('mainMenu')}
          template={{ id: '', label: '', path: '/', visible: true }}
          itemTitle={(x) => x.label}
          addLabel={t('menu.addLink')}
          max={12}
          renderItem={linkItem}
        />
      </Card>

      <Card title={t('menu.button')} help={t('menu.buttonHelp')}>
        <ToggleField path={N('showCta')} label={t('menu.showButton')} />
        <div className="a-grid-2">
          <TextField path={N('ctaLabel')} label={t('field.buttonLabel')} />
          <LinkField path={N('ctaPath')} label={t('field.goesTo')} />
        </div>
      </Card>

      <Card title={t('menu.topBar')} help={t('menu.topBarHelp')}>
        <ToggleField path={N('topBar', 'visible')} label={t('common.showSection')} />
        <TextField path={N('topBar', 'text')} label={t('field.text')} />
        <div className="a-grid-2">
          <TextField path={N('topBar', 'linkLabel')} label={t('menu.linkText')} />
          <LinkField path={N('topBar', 'linkPath')} label={t('field.goesTo')} />
        </div>
      </Card>

      <Card title={t('menu.footer')} help={t('menu.footerHelp')}>
        <TextField path={F('tagline')} label={t('menu.tagline')} multiline rows={2} />
        <h3 className="text-base mt-6 mb-3">{t('menu.columns')}</h3>
        <ListEditor
          path={F('columns')}
          template={{ id: '', title: '', links: [] }}
          itemTitle={(x) => x.title}
          addLabel={t('menu.addColumn')}
          max={3}
          renderItem={(p) => (
            <>
              <TextField path={[...p, 'title']} label={t('menu.columnTitle')} />
              <ListEditor path={[...p, 'links']} template={{ id: '', label: '', path: '/' }} itemTitle={(x) => x.label} addLabel={t('menu.addLink')} max={10} renderItem={linkItem} />
            </>
          )}
        />
        <h3 className="text-base mt-6 mb-3">{t('menu.office')}</h3>
        <TextField path={F('officeTitle')} label={t('field.title')} />
        <div className="a-grid-2">
          <TextField path={F('officeLine1')} label={t('menu.officeLine1')} />
          <TextField path={F('officeLine2')} label={t('menu.officeLine2')} />
        </div>
        <TextField path={F('presenceText')} label={t('menu.presence')} />
        <h3 className="text-base mt-6 mb-3">{t('menu.bottom')}</h3>
        <TextField path={F('copyright')} label={t('menu.copyright')} hint={t('menu.copyrightHint')} />
        <ListEditor path={F('bottomLinks')} template={{ id: '', label: '', path: '/' }} itemTitle={(x) => x.label} addLabel={t('menu.addLink')} max={6} renderItem={linkItem} />
      </Card>
    </>
  );
}
