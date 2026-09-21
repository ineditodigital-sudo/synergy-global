import { useId, useMemo, useState } from 'react';
import { useAdmin, useField } from '../context.js';
import { linkOptions } from '../../content/site.js';

const CUSTOM = '__custom__';
const valid = (v) => /^(https?:\/\/[^\s]+|mailto:[^\s@]+@[^\s@]+|tel:\+?[\d\s().-]{6,})$/i.test(v);

/**
 * "Where does this button go?" — a dropdown of every page of the site, plus
 * an option to type a web address, email or phone. Editors never type paths.
 */
export default function LinkField({ path, label, hint, allowNone = false }) {
  const { draft, t } = useAdmin();
  const [value, set] = useField(path);
  const id = useId();
  const groups = useMemo(() => linkOptions(draft), [draft]);
  const internal = groups.flatMap((g) => g.items.map((i) => i.path));
  const current = String(value || '');
  const base = current.split('#')[0];
  const isInternal = internal.includes(current) || internal.includes(base);
  const [custom, setCustom] = useState(() => Boolean(current) && !isInternal);
  const selectValue = !current && allowNone ? '' : custom || !isInternal ? CUSTOM : internal.includes(current) ? current : base;

  return (
    <div className="a-field">
      <label htmlFor={id} className="a-label">
        {label}
      </label>
      <select
        id={id}
        className="a-select"
        value={selectValue}
        onChange={(e) => {
          if (e.target.value === CUSTOM) {
            setCustom(true);
            if (isInternal) set('https://', { coalesce: false });
          } else {
            setCustom(false);
            set(e.target.value, { coalesce: false });
          }
        }}
      >
        {allowNone && <option value="">{t('link.none')}</option>}
        {groups.map((g) => (
          <optgroup key={g.group} label={t(`link.group.${g.group}`)}>
            {g.items.map((i) => (
              <option key={i.path} value={i.path}>
                {i.label || i.path}
                {i.hidden ? ` (${t('common.hidden')})` : ''}
              </option>
            ))}
          </optgroup>
        ))}
        <option value={CUSTOM}>{t('link.custom')}</option>
      </select>
      {selectValue === CUSTOM && (
        <>
          <input
            className={`a-input mt-2 ${current && !valid(current) ? 'is-invalid' : ''}`}
            value={current}
            placeholder="https://… · mailto:name@email.com · tel:+14155550123"
            onChange={(e) => set(e.target.value.trim())}
            inputMode="url"
          />
          {current && !valid(current) && (
            <span className="a-hint" style={{ color: 'var(--a-danger)' }}>
              {t('link.invalid')}
            </span>
          )}
        </>
      )}
      {hint && <span className="a-hint">{hint}</span>}
    </div>
  );
}
