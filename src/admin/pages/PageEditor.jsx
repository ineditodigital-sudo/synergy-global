import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { PAGE_PATH } from '../lib/pages.js';
import { Card, PageHeader } from '../components/ui.jsx';
import { BackLink } from '../components/Collection.jsx';
import { TextField, ToggleField, SelectField, SliderField, ChipsField } from '../components/fields.jsx';
import ImageField from '../components/ImageField.jsx';
import LinkField from '../components/LinkField.jsx';
import IconField from '../components/IconField.jsx';
import ListEditor from '../components/ListEditor.jsx';
import SeoCard from '../components/SeoCard.jsx';
import { DEFAULT_CONTENT } from '../../content/defaults.js';

function GoTo({ to, label }) {
  return (
    <Link to={to} className="a-btn a-btn-sm">
      {label} <ArrowRight size={14} />
    </Link>
  );
}

/* ------------------------------------------------------------------ Home */
function HomeEditor() {
  const { t } = useAdmin();
  const P = (...p) => ['home', ...p];
  const align = ['left', 'center', 'right'].map((v) => ({ value: v, label: t(`align.${v}`) }));
  return (
    <>
      <Card title={t('home.hero')} help={t('home.heroHelp')}>
        <TextField path={P('hero', 'badge')} label={t('home.badge')} hint={t('home.badgeHint')} />
        <div className="a-grid-2">
          <TextField path={P('hero', 'title')} label={t('home.title')} />
          <TextField path={P('hero', 'subtitle')} label={t('home.subtitle')} />
        </div>
        <ImageField path={P('hero', 'backgroundVideo')} label={t('home.video')} accept="video" hint={t('home.videoHint')} />
        <ImageField path={P('hero', 'backgroundImage')} label={t('home.image')} hint={t('home.imageHint')} />
        <div className="a-grid-2">
          <TextField path={P('hero', 'primaryCta')} label={t('home.primaryCta')} />
          <LinkField path={P('hero', 'primaryLink')} label={t('field.goesTo')} />
          <TextField path={P('hero', 'secondaryCta')} label={t('home.secondaryCta')} />
          <LinkField path={P('hero', 'secondaryLink')} label={t('field.goesTo')} />
          <SelectField path={P('hero', 'desktopAlign')} label={t('home.alignDesktop')} options={align} />
          <SelectField path={P('hero', 'mobileAlign')} label={t('home.alignMobile')} options={align} />
        </div>
      </Card>

      <Card title={t('home.metrics')} help={t('home.metricsHelp')}>
        <ToggleField path={P('metrics', 'visible')} label={t('common.showSection')} />
        <ListEditor
          path={P('metrics', 'items')}
          template={{ id: '', prefix: '', value: '', suffix: '', label: '' }}
          itemTitle={(m) => [m.prefix + m.value + m.suffix, m.label].filter(Boolean).join(' · ')}
          addLabel={t('home.addMetric')}
          max={8}
          renderItem={(p) => (
            <>
              <div className="a-grid-3">
                <TextField path={[...p, 'prefix']} label={t('home.metricPrefix')} placeholder="$" />
                <TextField path={[...p, 'value']} label={t('home.metricValue')} placeholder="20" />
                <TextField path={[...p, 'suffix']} label={t('home.metricSuffix')} placeholder="+" />
              </div>
              <TextField path={[...p, 'label']} label={t('home.metricLabel')} />
            </>
          )}
        />
      </Card>

      <Card title={t('home.featured')} help={t('home.featuredHelp')} actions={<GoTo to="/admin/properties" label={t('nav.properties')} />}>
        <ToggleField path={P('featured', 'visible')} label={t('common.showSection')} />
        <TextField path={P('featured', 'buttonLabel')} label={t('home.featuredButton')} />
      </Card>

      <Card title={t('home.manifesto')} help={t('home.manifestoHelp')}>
        <ToggleField path={P('manifesto', 'visible')} label={t('common.showSection')} />
        <TextField path={P('manifesto', 'title')} label={t('field.title')} />
        <TextField path={P('manifesto', 'subtitle')} label={t('field.text')} multiline rows={5} />
        <SliderField path={['style', 'manifestoTextSize']} label={t('home.manifestoSize')} min={16} max={40} defaultValue={DEFAULT_CONTENT.style.manifestoTextSize} />
      </Card>

      <Card title={t('home.gallery')} actions={<GoTo to="/admin/gallery" label={t('nav.gallery')} />}>
        <ToggleField path={P('gallery', 'visible')} label={t('common.showSection')} />
        <TextField path={P('gallery', 'title')} label={t('field.title')} />
      </Card>

      <Card title={t('home.team')} help={t('home.teamHelp')} actions={<GoTo to="/admin/team" label={t('nav.team')} />}>
        <ToggleField path={P('team', 'visible')} label={t('common.showSection')} />
        <div className="a-grid-2">
          <TextField path={P('team', 'linkLabel')} label={t('home.teamLink')} />
          <LinkField path={P('team', 'linkPath')} label={t('field.goesTo')} />
        </div>
      </Card>

      <SeoCard path={P('seo')} urlPath="/" withImage />
    </>
  );
}

/* ------------------------------------------------------------- Mission */
function MissionEditor() {
  const { t } = useAdmin();
  const P = (...p) => ['mission', ...p];
  const card = (key) => (
    <Card title={t(`mission.${key}`)}>
      <TextField path={P(key, 'badge')} label={t('field.label')} />
      <TextField path={P(key, 'text')} label={t('field.text')} multiline rows={5} />
      <ImageField path={P(key, 'image')} label={t('mission.bgImage')} hint={t('mission.bgImageHint')} />
    </Card>
  );
  return (
    <>
      <Card title={t('field.header')}>
        <TextField path={P('header', 'badge')} label={t('field.label')} />
        <TextField path={P('header', 'title')} label={t('field.mainTitle')} />
        <TextField path={P('header', 'highlight')} label={t('field.highlight')} hint={t('field.highlightHint')} />
      </Card>
      {card('missionCard')}
      {card('visionCard')}
      <Card title={t('mission.textSize')}>
        <SliderField path={['style', 'missionTextSize']} label={t('mission.textSizeLabel')} min={14} max={28} defaultValue={DEFAULT_CONTENT.style.missionTextSize} />
      </Card>
      <Card title={t('mission.pillars')} help={t('mission.pillarsHelp')}>
        <ListEditor
          path={P('pillars')}
          template={{ id: '', icon: 'globe', title: '', desc: '' }}
          itemTitle={(x) => x.title}
          addLabel={t('mission.addPillar')}
          max={6}
          renderItem={(p) => (
            <>
              <IconField path={[...p, 'icon']} />
              <TextField path={[...p, 'title']} label={t('field.title')} />
              <TextField path={[...p, 'desc']} label={t('field.description')} multiline rows={3} />
            </>
          )}
        />
      </Card>
      <SeoCard path={P('seo')} urlPath="/mission" />
    </>
  );
}

/* --------------------------------------------------------------- About */
function AboutEditor() {
  const { t } = useAdmin();
  const P = (...p) => ['about', ...p];
  return (
    <>
      <Card title={t('field.header')}>
        <TextField path={P('header', 'badge')} label={t('field.label')} />
        <TextField path={P('header', 'title')} label={t('field.mainTitle')} multiline rows={2} />
        <TextField path={P('header', 'highlight')} label={t('field.highlight')} hint={t('field.highlightHint')} />
        <TextField path={P('header', 'subtitle')} label={t('field.subtitle')} />
      </Card>
      <Card title={t('about.story')}>
        <TextField path={P('narrative', 'text1')} label={t('about.paragraph1')} multiline rows={4} />
        <TextField path={P('narrative', 'text2')} label={t('about.paragraph2')} multiline rows={4} />
      </Card>
      <Card title={t('about.teamSection')} help={t('about.teamSectionHelp')} actions={<GoTo to="/admin/team" label={t('nav.team')} />}>
        <ToggleField path={P('teamSection', 'visible')} label={t('common.showSection')} />
        <TextField path={P('teamSection', 'badge')} label={t('field.label')} />
        <TextField path={P('teamSection', 'title')} label={t('field.title')} />
      </Card>
      <Card title={t('about.gallery')} actions={<GoTo to="/admin/gallery" label={t('nav.gallery')} />}>
        <ToggleField path={P('gallery', 'visible')} label={t('common.showSection')} />
        <TextField path={P('gallery', 'title')} label={t('field.title')} />
      </Card>
      <Card title={t('about.quote')}>
        <TextField path={P('valueStatement', 'text')} label={t('about.quoteText')} multiline rows={2} />
      </Card>
      <SeoCard path={P('seo')} urlPath="/about" />
    </>
  );
}

/* ----------------------------------------------------------- Portfolio */
function PortfolioPageEditor() {
  const { t } = useAdmin();
  const P = (...p) => ['portfolio', ...p];
  return (
    <>
      <Card title={t('field.header')} actions={<GoTo to="/admin/properties" label={t('nav.properties')} />}>
        <TextField path={P('header', 'badge')} label={t('field.label')} />
        <TextField path={P('header', 'title')} label={t('field.mainTitle')} />
        <TextField path={P('header', 'subtitle')} label={t('field.subtitle')} multiline rows={2} />
      </Card>
      <Card title={t('portfolio.cta')} help={t('portfolio.ctaHelp')}>
        <TextField path={P('cta', 'title')} label={t('field.title')} />
        <TextField path={P('cta', 'highlight')} label={t('field.highlight')} hint={t('field.highlightHint')} />
        <TextField path={P('cta', 'text')} label={t('field.text')} multiline rows={3} />
        <div className="a-grid-2">
          <TextField path={P('cta', 'buttonLabel')} label={t('field.buttonLabel')} />
          <LinkField path={P('cta', 'buttonLink')} label={t('field.goesTo')} />
        </div>
      </Card>
      <Card title={t('portfolio.detail')} help={t('portfolio.detailHelp')}>
        <div className="a-grid-2">
          <TextField path={P('detail', 'inquireLabel')} label={t('portfolio.inquireLabel')} />
          <LinkField path={P('detail', 'inquireLink')} label={t('field.goesTo')} />
        </div>
        <TextField path={P('detail', 'boxTitle')} label={t('portfolio.boxTitle')} />
        <TextField path={P('detail', 'boxText')} label={t('portfolio.boxText')} multiline rows={3} />
        <div className="a-grid-2">
          <TextField path={P('detail', 'boxButtonLabel')} label={t('field.buttonLabel')} />
          <LinkField path={P('detail', 'boxButtonLink')} label={t('field.goesTo')} />
        </div>
      </Card>
      <SeoCard path={P('seo')} urlPath="/portfolio" />
    </>
  );
}

/* ------------------------------------------------------------ Services */
function ServicesPageEditor() {
  const { t } = useAdmin();
  const P = (...p) => ['services', ...p];
  return (
    <>
      <Card title={t('field.header')} actions={<GoTo to="/admin/services" label={t('nav.services')} />}>
        <TextField path={P('header', 'badge')} label={t('field.label')} />
        <TextField path={P('header', 'title')} label={t('field.mainTitle')} />
        <TextField path={P('header', 'subtitle')} label={t('field.subtitle')} multiline rows={2} />
        <TextField path={P('cardButtonLabel')} label={t('services.cardButton')} />
      </Card>
      <SeoCard path={P('seo')} urlPath="/services" />
    </>
  );
}

/* -------------------------------------------------------- Partnerships */
function PartnershipsEditor() {
  const { t } = useAdmin();
  const P = (...p) => ['partnerships', ...p];
  return (
    <>
      <Card title={t('field.header')}>
        <TextField path={P('header', 'title')} label={t('field.mainTitle')} />
        <TextField path={P('header', 'intro')} label={t('partners.intro')} multiline rows={5} />
        <TextField path={P('header', 'callout')} label={t('partners.callout')} multiline rows={3} />
        <TextField path={P('header', 'listIntro')} label={t('partners.listIntro')} />
      </Card>
      <Card title={t('partners.list')} help={t('partners.listHelp')}>
        <TextField path={P('cardLabel')} label={t('partners.cardLabel')} hint={t('partners.cardLabelHint')} />
        <ListEditor
          path={P('items')}
          template={{ id: '', name: '', logo: '', url: '', visible: true }}
          itemTitle={(x) => x.name}
          addLabel={t('partners.add')}
          renderItem={(p) => (
            <>
              <TextField path={[...p, 'name']} label={t('field.name')} />
              <ImageField path={[...p, 'logo']} label={t('partners.logo')} contain aspect="aspect-[16/9]" hint={t('partners.logoHint')} />
              <TextField path={[...p, 'url']} label={t('partners.website')} placeholder="https://" inputMode="url" validate={(v) => (v && !/^https?:\/\//i.test(v) ? t('link.invalid') : '')} />
            </>
          )}
        />
      </Card>
      <SeoCard path={P('seo')} urlPath="/partnerships" />
    </>
  );
}

/* --------------------------------------------------------------- Legal */
function LegalEditor() {
  const { t } = useAdmin();
  const P = (...p) => ['legal', ...p];
  return (
    <>
      <Card title={t('legal.hero')}>
        <TextField path={P('hero', 'tag')} label={t('field.label')} />
        <div className="a-grid-2">
          <TextField path={P('hero', 'title')} label={t('field.titleLine1')} />
          <TextField path={P('hero', 'titleAccent')} label={t('field.titleLine2')} />
        </div>
        <TextField path={P('hero', 'quote')} label={t('field.quote')} multiline rows={2} />
        <ImageField path={P('hero', 'image')} label={t('field.backgroundImage')} />
      </Card>
      <Card title={t('legal.areas')}>
        <TextField path={P('areasBadge')} label={t('field.label')} />
        <div className="a-grid-2">
          <TextField path={P('areasTitle')} label={t('field.title')} />
          <TextField path={P('areasHighlight')} label={t('field.highlight')} />
        </div>
        <ListEditor
          path={P('areas')}
          template={{ id: '', icon: 'scale', title: '', desc: '' }}
          itemTitle={(x) => x.title}
          addLabel={t('legal.addArea')}
          renderItem={(p) => (
            <>
              <IconField path={[...p, 'icon']} />
              <TextField path={[...p, 'title']} label={t('field.title')} />
              <TextField path={[...p, 'desc']} label={t('field.description')} multiline rows={3} />
            </>
          )}
        />
      </Card>
      <Card title={t('legal.policies')} help={t('legal.policiesHelp')}>
        <TextField path={P('policiesTitle')} label={t('field.title')} />
        <ListEditor
          path={P('policies')}
          template={{ id: '', title: '', text: '' }}
          itemTitle={(x) => x.title}
          addLabel={t('legal.addPolicy')}
          renderItem={(p) => (
            <>
              <TextField path={[...p, 'title']} label={t('field.title')} />
              <TextField path={[...p, 'text']} label={t('field.text')} multiline rows={8} hint={t('field.paragraphsHint')} />
            </>
          )}
        />
      </Card>
      <SeoCard path={P('seo')} urlPath="/legal" />
    </>
  );
}

/* ------------------------------------------------------------- Contact */
function ContactEditor() {
  const { t } = useAdmin();
  const P = (...p) => ['contact', ...p];
  return (
    <>
      <Card title={t('field.header')}>
        <TextField path={P('header', 'badge')} label={t('field.label')} />
        <TextField path={P('header', 'title')} label={t('field.mainTitle')} />
        <TextField path={P('header', 'subtitle')} label={t('field.subtitle')} multiline rows={2} />
      </Card>
      <Card title={t('contact.info')}>
        <TextField path={P('info', 'emailsTitle')} label={t('contact.emailsTitle')} />
        <ChipsField path={P('info', 'emails')} label={t('contact.emails')} placeholder="name@company.com" />
        <TextField path={P('info', 'phone')} label={t('contact.phone')} placeholder="(415) 555-0123" type="tel" />
        <TextField path={P('info', 'officeTitle')} label={t('contact.officeTitle')} />
        <div className="a-grid-2">
          <TextField path={P('info', 'office')} label={t('contact.office')} />
          <TextField path={P('info', 'officeRegion')} label={t('contact.officeRegion')} />
        </div>
        <TextField path={P('info', 'officeText')} label={t('field.description')} multiline rows={2} />
        <ToggleField path={P('info', 'showMap')} label={t('contact.showMap')} />
        <TextField path={P('info', 'mapQuery')} label={t('contact.mapQuery')} hint={t('contact.mapQueryHint')} />
      </Card>
      <Card title={t('contact.form')} help={t('contact.formHelp')}>
        <TextField path={P('form', 'title')} label={t('field.title')} />
        <ChipsField path={P('form', 'inquiryTypes')} label={t('contact.inquiryTypes')} />
        <TextField path={P('form', 'submitLabel')} label={t('field.buttonLabel')} />
        <TextField path={P('form', 'successTitle')} label={t('contact.successTitle')} />
        <TextField path={P('form', 'successText')} label={t('contact.successText')} multiline rows={2} />
      </Card>
      <SeoCard path={P('seo')} urlPath="/contact" />
    </>
  );
}

const EDITORS = {
  home: HomeEditor,
  mission: MissionEditor,
  about: AboutEditor,
  portfolio: PortfolioPageEditor,
  services: ServicesPageEditor,
  partnerships: PartnershipsEditor,
  legal: LegalEditor,
  contact: ContactEditor,
};

export default function PageEditor() {
  const { pageKey } = useParams();
  const { t } = useAdmin();
  const Editor = EDITORS[pageKey];
  usePreviewPath(PAGE_PATH[pageKey] || '/');
  if (!Editor) return <Navigate to="/admin/pages" replace />;
  return (
    <>
      <PageHeader title={t(`page.${pageKey}`)} help={t(`pages.desc.${pageKey}`)} back={<BackLink to="/admin/pages" label={t('nav.pages')} />} />
      <Editor />
    </>
  );
}
