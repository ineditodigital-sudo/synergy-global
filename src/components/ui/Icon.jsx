import { ICONS } from '../../lib/icons.js';

export default function Icon({ name, size = 24, strokeWidth = 1.5, className = '', fallback = 'briefcase' }) {
  const Cmp = ICONS[name] || ICONS[fallback];
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
