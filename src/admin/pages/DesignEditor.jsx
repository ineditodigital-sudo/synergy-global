import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../context.js';
import { usePreviewPath } from '../hooks.js';
import { Card, PageHeader } from '../components/ui.jsx';
import { ColorField, SelectField, SliderField } from '../components/fields.jsx';
import ImageField from '../components/ImageField.jsx';
import { BRAND_COLORS, FONT_CHOICES } from '../../content/schema.js';
import { DEFAULT_CONTENT } from '../../content/defaults.js';
import { contrastRatio } from '../../lib/style.js';

export default function DesignEditor() {
  const { t, draft, update } = useAdmin();
  usePreviewPath('/');
  const S = (...p) => ['style', ...p];
  const c = draft.style.colors;
  const lowText = contrastRatio(c.primary, c.background) < 4.5;
  const lowDark = contrastRatio(c.accent, c.dark) < 3;
  const custom = Object.keys(BRAND_COLORS).some((k) => c[k].toLowerCase() !== BRAND_COLORS[k].toLowerCase());
  const fonts = FONT_CHOICES.map((f) => ({ value: f, label: f }));

  return (
    <>
      <PageHeader title={t('nav.design')} help={t('design.help')} />

      <Card
        title={t('design.colors')}
        help={t('design.colorsHelp')}
        actions={
          custom && (
            <button type="button" className="a-btn a-btn-sm" onClick={() => update(S('colors'), { ...BRAND_COLORS }, { coalesce: false })}>
              <RotateCcw size={14} /> {t('design.restoreBrand')}
            </button>
          )
        }
      >
        <div className="a-grid-2">
          <ColorField path={S('colors', 'primary')} label={t('design.primary')} hint={t('design.primaryHint')} defaultValue={BRAND_COLORS.primary} />
          <ColorField path={S('colors', 'accent')} label={t('design.accent')} hint={t('design.accentHint')} defaultValue={BRAND_COLORS.accent} />
          <ColorField path={S('colors', 'background')} label={t('design.background')} hint={t('design.backgroundHint')} defaultValue={BRAND_COLORS.background} />
          <ColorField path={S('colors', 'dark')} label={t('design.dark')} hint={t('design.darkHint')} defaultValue={BRAND_COLORS.dark} />
        </div>
        {(lowText || lowDark) && (
          <p className="flex gap-2 text-sm text-[var(--a-warning)] bg-[var(--a-warning-soft)] rounded-lg p-3 mb-0">
            <AlertTriangle size={17} className="shrink-0" /> {t('design.contrastWarning')}
          </p>
        )}
      </Card>

      <Card title={t('design.fonts')} help={t('design.fontsHelp')}>
        <div className="a-grid-2">
          <SelectField path={S('fonts', 'heading')} label={t('design.headingFont')} options={fonts} />
          <SelectField path={S('fonts', 'body')} label={t('design.bodyFont')} options={fonts} />
        </div>
        <SliderField path={S('navTextSize')} label={t('design.navSize')} min={8} max={14} step={0.5} defaultValue={DEFAULT_CONTENT.style.navTextSize} />
      </Card>

      <Card title={t('design.logos')} help={t('design.logosHelp')}>
        <ImageField path={S('logo')} label={t('design.logo')} contain aspect="aspect-[5/2]" removable={false} />
        <ImageField path={S('logoOnDark')} label={t('design.logoOnDark')} contain aspect="aspect-[5/2]" hint={t('design.logoOnDarkHint')} />
        <ImageField path={S('footerLogo')} label={t('design.footerLogo')} contain aspect="aspect-[5/2]" />
        <SliderField path={S('logoHeight')} label={t('design.logoHeight')} min={24} max={120} defaultValue={DEFAULT_CONTENT.style.logoHeight} />
      </Card>
    </>
  );
}
