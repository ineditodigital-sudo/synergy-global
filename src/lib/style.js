const FONT_STACKS = {
  Alata: "'Alata', 'Montserrat', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  'Myriad Pro': "'Myriad Pro', 'Montserrat', sans-serif",
};

const HEX = /^#[0-9a-f]{6}$/i;

/** Push the CMS design settings into the CSS variables Tailwind uses. */
export function applyStyle(style) {
  if (typeof document === 'undefined' || !style) return;
  const root = document.documentElement.style;
  const c = style.colors || {};
  const set = (name, value) => (value ? root.setProperty(name, value) : root.removeProperty(name));
  set('--color-sand', HEX.test(c.accent) ? c.accent : '');
  set('--color-sage', HEX.test(c.primary) ? c.primary : '');
  set('--color-bone', HEX.test(c.background) ? c.background : '');
  set('--color-charcoal', HEX.test(c.dark) ? c.dark : '');
  const heading = FONT_STACKS[style.fonts?.heading];
  const body = FONT_STACKS[style.fonts?.body];
  set('--font-heading', heading || '');
  set('--font-display', heading || '');
  set('--font-body', body || '');
}

/** WCAG contrast ratio between two #rrggbb colors (used by the CMS). */
export function contrastRatio(a, b) {
  const lum = (hex) => {
    const n = parseInt(String(hex).slice(1), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  if (!HEX.test(a) || !HEX.test(b)) return 21;
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
