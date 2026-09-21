import { useEffect, useRef } from 'react';
import { Loader2, X } from 'lucide-react';

export function Card({ title, help, actions, children, id }) {
  return (
    <section className="a-card" id={id}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="a-card-title">{title}</h2>}
            {help ? <p className="a-card-help">{help}</p> : <div className="h-4" />}
          </div>
          {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, help, actions, back }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div>
        {back}
        <h1 className="text-2xl md:text-[1.7rem] m-0 leading-tight">{title}</h1>
        {help && <p className="text-[var(--a-muted)] mt-1 mb-0 max-w-2xl text-[0.92rem]">{help}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Spinner({ size = 18, className = '' }) {
  return <Loader2 size={size} className={`a-spin ${className}`} aria-hidden="true" />;
}

export function EmptyState({ icon: IconCmp, title, text, action }) {
  return (
    <div className="text-center py-12 px-6 border-2 border-dashed border-[var(--a-border)] rounded-xl bg-[var(--a-sunken)]">
      {IconCmp && <IconCmp size={32} className="mx-auto mb-3 text-[var(--a-faint)]" aria-hidden="true" />}
      <p className="font-semibold m-0">{title}</p>
      {text && <p className="text-[var(--a-muted)] text-sm mt-1 mb-0">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, wide = false, labelledBy }) {
  const ref = useRef(null);
  useEffect(() => {
    const prevFocus = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="a-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={labelledBy || 'a-modal-title'} className={`a-modal ${wide ? 'a-modal-wide' : ''}`}>
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3 border-b border-[var(--a-border)] sticky top-0 bg-white z-10">
          <h2 id={labelledBy || 'a-modal-title'} className="text-lg m-0">
            {title}
          </h2>
          {onClose && (
            <button type="button" className="a-icon-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[var(--a-border)] flex flex-wrap justify-end gap-2 bg-[var(--a-sunken)] sticky bottom-0">{footer}</div>}
      </div>
    </div>
  );
}

export function Pill({ tone = 'muted', children }) {
  return <span className={`a-pill a-pill-${tone}`}>{children}</span>;
}
