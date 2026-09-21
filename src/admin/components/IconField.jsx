import { useState } from 'react';
import { ICONS, ICON_NAMES } from '../../lib/icons.js';
import { useField, useT } from '../context.js';

export default function IconField({ path, label }) {
  const [value, set] = useField(path);
  const t = useT();
  const [open, setOpen] = useState(false);
  const Current = ICONS[value] || ICONS.briefcase;
  return (
    <div className="a-field">
      <span className="a-label">{label || t('field.icon')}</span>
      <button type="button" className="a-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Current size={18} /> {open ? t('common.close') : t('icon.change')}
      </button>
      {open && (
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 mt-3 p-2 border border-[var(--a-border)] rounded-lg bg-[var(--a-sunken)]" role="listbox" aria-label={t('field.icon')}>
          {ICON_NAMES.map((name) => {
            const I = ICONS[name];
            return (
              <button
                key={name}
                type="button"
                role="option"
                aria-selected={name === value}
                title={name}
                onClick={() => {
                  set(name, { coalesce: false });
                  setOpen(false);
                }}
                className={`aspect-square rounded-md flex items-center justify-center border ${name === value ? 'bg-[var(--a-primary)] text-white border-[var(--a-primary)]' : 'bg-white border-[var(--a-border)] hover:border-[var(--a-gold)]'}`}
              >
                <I size={18} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
