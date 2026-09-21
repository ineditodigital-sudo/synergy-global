import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Copy, Eye, EyeOff, Pencil, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useAdmin, useField } from '../context.js';
import { clone, uid } from '../../content/normalize.js';
import { MediaThumb } from './MediaPicker.jsx';
import { EmptyState } from './ui.jsx';

/**
 * Card list for a collection (properties, services, team): reorder,
 * show/hide, duplicate, delete, and open the full editor.
 */
export default function Collection({ path, basePath, template, titleOf, subtitleOf, thumbOf, badgesOf, addLabel, emptyTitle, emptyText, icon, contain = false }) {
  const { t, confirm, toast } = useAdmin();
  const [value, set] = useField(path);
  const items = Array.isArray(value) ? value : [];
  const navigate = useNavigate();

  const move = (from, to) => {
    if (to < 0 || to >= items.length) return;
    const next = items.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    set(next, { coalesce: false });
  };

  const add = () => {
    const item = { ...clone(template), id: uid('n') };
    set([...items, item], { coalesce: false });
    navigate(`${basePath}/${item.id}`);
  };

  const duplicate = (index) => {
    const copy = { ...clone(items[index]), id: uid('n'), slug: '', visible: false };
    if (typeof copy.title === 'string') copy.title = `${copy.title} (${t('common.copy')})`;
    if (typeof copy.name === 'string') copy.name = `${copy.name} (${t('common.copy')})`;
    const next = items.slice();
    next.splice(index + 1, 0, copy);
    set(next, { coalesce: false });
    toast(t('list.duplicated'));
  };

  const remove = async (index) => {
    const ok = await confirm({
      title: t('list.deleteTitle'),
      message: t('list.deleteMessage', { name: titleOf(items[index]) || t('list.untitled') }),
      confirmLabel: t('common.delete'),
      danger: true,
    });
    if (ok) set(items.filter((_, i) => i !== index), { coalesce: false });
  };

  return (
    <div>
      {items.length === 0 ? (
        <EmptyState icon={icon} title={emptyTitle} text={emptyText} action={<button type="button" className="a-btn a-btn-primary" onClick={add}><Plus size={16} /> {addLabel}</button>} />
      ) : (
        <ul className="list-none p-0 m-0 space-y-3">
          {items.map((item, index) => (
            <li key={item.id} className={`a-card !p-3 flex items-center gap-4 ${item.visible === false ? 'opacity-70' : ''}`}>
              <Link to={`${basePath}/${item.id}`} className="shrink-0">
                <MediaThumb url={thumbOf(item)} className="w-20 h-16 sm:w-28 sm:h-20 rounded-md" contain={contain} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`${basePath}/${item.id}`} className="font-semibold text-[var(--a-text)] no-underline hover:underline block truncate">
                  {titleOf(item) || t('list.untitled')}
                </Link>
                {subtitleOf && <p className="text-sm text-[var(--a-muted)] m-0 truncate">{subtitleOf(item)}</p>}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {item.visible === false ? <span className="a-pill a-pill-muted">{t('common.hidden')}</span> : <span className="a-pill a-pill-ok">{t('common.visible')}</span>}
                  {badgesOf && badgesOf(item)}
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-0.5 shrink-0 max-w-[140px] sm:max-w-none">
                <button type="button" className="a-icon-btn" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label={t('list.moveUp')} title={t('list.moveUp')}>
                  <ChevronUp size={17} />
                </button>
                <button type="button" className="a-icon-btn" onClick={() => move(index, index + 1)} disabled={index === items.length - 1} aria-label={t('list.moveDown')} title={t('list.moveDown')}>
                  <ChevronDown size={17} />
                </button>
                <button
                  type="button"
                  className="a-icon-btn"
                  onClick={() => set(items.map((x, i) => (i === index ? { ...x, visible: !x.visible } : x)), { coalesce: false })}
                  aria-label={item.visible === false ? t('list.show') : t('list.hide')}
                  title={item.visible === false ? t('list.show') : t('list.hide')}
                >
                  {item.visible === false ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <button type="button" className="a-icon-btn" onClick={() => duplicate(index)} aria-label={t('list.duplicate')} title={t('list.duplicate')}>
                  <Copy size={16} />
                </button>
                <button type="button" className="a-icon-btn hover:!text-[var(--a-danger)]" onClick={() => remove(index)} aria-label={t('common.delete')} title={t('common.delete')}>
                  <Trash2 size={16} />
                </button>
                <Link to={`${basePath}/${item.id}`} className="a-btn a-btn-sm ml-1">
                  <Pencil size={14} /> {t('common.edit')}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <button type="button" className="a-btn a-btn-primary mt-4" onClick={add}>
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
}

export function BackLink({ to, label }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-sm text-[var(--a-muted)] no-underline hover:text-[var(--a-text)] mb-2">
      <ArrowLeft size={15} /> {label}
    </Link>
  );
}
