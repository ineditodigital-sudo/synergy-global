import { useId, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useField, useT } from '../context.js';

function Label({ htmlFor, label, count, max }) {
  return (
    <label htmlFor={htmlFor} className="a-label">
      <span>{label}</span>
      {max ? <span className={`a-count ${count > max ? 'is-over' : ''}`}>{`${count} / ${max}`}</span> : null}
    </label>
  );
}

/** Single-line or multi-line text bound to a draft path. */
export function TextField({ path, label, hint, placeholder, multiline = false, rows = 4, max, type = 'text', inputMode, autoComplete = 'off', validate }) {
  const [value, set] = useField(path);
  const id = useId();
  const v = typeof value === 'string' ? value : value == null ? '' : String(value);
  const error = validate ? validate(v) : '';
  const common = {
    id,
    className: `${multiline ? 'a-textarea' : 'a-input'} ${error ? 'is-invalid' : ''}`,
    value: v,
    placeholder,
    onChange: (e) => set(e.target.value),
    'aria-invalid': error ? true : undefined,
    'aria-describedby': hint || error ? `${id}-hint` : undefined,
  };
  return (
    <div className="a-field">
      <Label htmlFor={id} label={label} count={v.length} max={max} />
      {multiline ? (
        <textarea rows={rows} {...common} />
      ) : (
        <input type={type} inputMode={inputMode} autoComplete={autoComplete} spellCheck={type === 'text'} {...common} />
      )}
      {(error || hint) && (
        <span id={`${id}-hint`} className="a-hint" style={error ? { color: 'var(--a-danger)' } : undefined}>
          {error || hint}
        </span>
      )}
    </div>
  );
}

export function ToggleField({ path, label, hint, invert = false }) {
  const [value, set] = useField(path);
  const checked = invert ? !value : Boolean(value);
  return (
    <div className="a-field">
      <label className="a-toggle">
        <input type="checkbox" checked={checked} onChange={(e) => set(invert ? !e.target.checked : e.target.checked, { coalesce: false })} />
        <span className="a-toggle-track" aria-hidden="true" />
        <span>
          <span className="font-semibold text-[0.9rem] block">{label}</span>
          {hint && <span className="a-hint mt-0.5">{hint}</span>}
        </span>
      </label>
    </div>
  );
}

export function SelectField({ path, label, hint, options }) {
  const [value, set] = useField(path);
  const id = useId();
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const known = opts.some((o) => o.value === value);
  return (
    <div className="a-field">
      <Label htmlFor={id} label={label} />
      <select id={id} className="a-select" value={value ?? ''} onChange={(e) => set(e.target.value, { coalesce: false })}>
        {!known && value !== '' && <option value={value}>{value}</option>}
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="a-hint">{hint}</span>}
    </div>
  );
}

export function SliderField({ path, label, hint, min, max, step = 1, unit = 'px', defaultValue }) {
  const [value, set] = useField(path);
  const t = useT();
  const id = useId();
  const n = Number(value);
  return (
    <div className="a-field">
      <Label htmlFor={id} label={label} />
      <div className="flex items-center gap-3">
        <input id={id} type="range" min={min} max={max} step={step} value={Number.isFinite(n) ? n : min} onChange={(e) => set(Number(e.target.value))} className="flex-1 accent-[var(--a-primary)]" />
        <span className="w-16 text-right tabular-nums text-sm font-semibold">
          {n}
          {unit}
        </span>
        {defaultValue !== undefined && n !== defaultValue && (
          <button type="button" className="a-icon-btn" onClick={() => set(defaultValue, { coalesce: false })} title={t('common.resetDefault')} aria-label={t('common.resetDefault')}>
            <RotateCcw size={15} />
          </button>
        )}
      </div>
      {hint && <span className="a-hint">{hint}</span>}
    </div>
  );
}

const HEX = /^#[0-9a-f]{6}$/i;

export function ColorField({ path, label, hint, defaultValue }) {
  const [value, set] = useField(path);
  const t = useT();
  const id = useId();
  const [text, setText] = useState(null);
  const shown = text ?? value;
  return (
    <div className="a-field">
      <Label htmlFor={id} label={label} />
      <div className="flex items-center gap-3">
        <input type="color" value={HEX.test(value) ? value : '#000000'} onChange={(e) => set(e.target.value)} className="w-12 h-10 rounded-md border border-[var(--a-border-strong)] cursor-pointer bg-white p-0.5" aria-label={label} />
        <input
          id={id}
          className={`a-input w-32 font-mono uppercase ${text !== null && !HEX.test(text) ? 'is-invalid' : ''}`}
          value={shown}
          maxLength={7}
          onChange={(e) => {
            const v = e.target.value.trim();
            setText(v);
            if (HEX.test(v)) set(v);
          }}
          onBlur={() => setText(null)}
        />
        {defaultValue && value?.toLowerCase() !== defaultValue.toLowerCase() && (
          <button type="button" className="a-btn a-btn-sm" onClick={() => set(defaultValue, { coalesce: false })}>
            <RotateCcw size={14} /> {t('common.brandColor')}
          </button>
        )}
      </div>
      {hint && <span className="a-hint">{hint}</span>}
    </div>
  );
}

/** List of short texts typed one by one (Enter adds), shown as chips. */
export function ChipsField({ path, label, hint, placeholder }) {
  const [value, set] = useField(path);
  const t = useT();
  const id = useId();
  const [text, setText] = useState('');
  const list = Array.isArray(value) ? value : [];
  const add = () => {
    const parts = text
      .split(/[\n;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !list.includes(s));
    if (parts.length) set([...list, ...parts], { coalesce: false });
    setText('');
  };
  return (
    <div className="a-field">
      <Label htmlFor={id} label={label} />
      <div className="a-chips">
        {list.map((item) => (
          <span key={item} className="a-chip">
            {item}
            <button type="button" onClick={() => set(list.filter((x) => x !== item), { coalesce: false })} aria-label={`${t('common.remove')} ${item}`}>
              <X size={13} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={text}
          placeholder={placeholder || t('common.typeAndEnter')}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            } else if (e.key === 'Backspace' && !text && list.length) {
              set(list.slice(0, -1), { coalesce: false });
            }
          }}
          onBlur={add}
        />
      </div>
      <span className="a-hint">{hint || t('common.chipsHint')}</span>
    </div>
  );
}
