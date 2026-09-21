import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useAdmin, useField } from '../context.js';
import { clone, uid } from '../../content/normalize.js';

/**
 * Editable list: add, reorder (drag or arrows), show/hide, duplicate, delete.
 * `renderItem(itemPath, item, index)` renders the fields of one item.
 */
export default function ListEditor({
  path,
  template,
  itemTitle,
  itemThumb,
  renderItem,
  addLabel,
  emptyText,
  max = 200,
  allowDuplicate = false,
  startOpen = false,
  confirmDelete = true,
}) {
  const { t, confirm } = useAdmin();
  const [value, set] = useField(path);
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(() => new Set(startOpen ? items.map((i) => i.id) : []));
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);

  const toggle = (id) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const move = (from, to) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = items.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    set(next, { coalesce: false });
  };

  const add = () => {
    const item = { ...clone(template), id: uid('n') };
    set([...items, item], { coalesce: false });
    setOpen((s) => new Set(s).add(item.id));
  };

  const duplicate = (index) => {
    const copy = { ...clone(items[index]), id: uid('n') };
    if ('slug' in copy) copy.slug = '';
    if ('title' in copy && copy.title) copy.title = `${copy.title} (${t('common.copy')})`;
    const next = items.slice();
    next.splice(index + 1, 0, copy);
    set(next, { coalesce: false });
  };

  const remove = async (index) => {
    const title = itemTitle(items[index], index);
    if (confirmDelete) {
      const ok = await confirm({ title: t('list.deleteTitle'), message: t('list.deleteMessage', { name: title }), confirmLabel: t('common.delete'), danger: true });
      if (!ok) return;
    }
    set(items.filter((_, i) => i !== index), { coalesce: false });
  };

  return (
    <div>
      {items.length === 0 && emptyText && <p className="text-[var(--a-muted)] text-sm mb-3">{emptyText}</p>}
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        const hasVisible = typeof item.visible === 'boolean';
        const title = itemTitle(item, index) || t('list.untitled');
        return (
          <div
            key={item.id}
            className={`a-list-item ${drag === index ? 'is-dragging' : ''} ${over === index && drag !== index ? 'is-over' : ''}`}
            onDragOver={(e) => {
              if (drag === null) return;
              e.preventDefault();
              setOver(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (drag !== null) move(drag, index);
              setDrag(null);
              setOver(null);
            }}
          >
            <div className="a-list-head">
              <span
                className="a-drag p-1"
                draggable
                onDragStart={(e) => {
                  setDrag(index);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', String(index));
                }}
                onDragEnd={() => {
                  setDrag(null);
                  setOver(null);
                }}
                title={t('list.drag')}
                aria-hidden="true"
              >
                <GripVertical size={18} />
              </span>
              <button type="button" className="flex-1 min-w-0 flex items-center gap-3 text-left bg-transparent border-0 p-1 cursor-pointer" onClick={() => toggle(item.id)} aria-expanded={isOpen}>
                {itemThumb && itemThumb(item)}
                <span className={`truncate font-semibold text-[0.92rem] ${hasVisible && !item.visible ? 'text-[var(--a-faint)] line-through decoration-1' : ''}`}>{title}</span>
                {hasVisible && !item.visible && <span className="a-pill a-pill-muted shrink-0">{t('common.hidden')}</span>}
                <ChevronRight size={16} className={`ml-auto shrink-0 text-[var(--a-faint)] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              <div className="flex items-center shrink-0">
                <button type="button" className="a-icon-btn" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label={t('list.moveUp')} title={t('list.moveUp')}>
                  <ChevronUp size={17} />
                </button>
                <button type="button" className="a-icon-btn" onClick={() => move(index, index + 1)} disabled={index === items.length - 1} aria-label={t('list.moveDown')} title={t('list.moveDown')}>
                  <ChevronDown size={17} />
                </button>
                {hasVisible && (
                  <button
                    type="button"
                    className="a-icon-btn"
                    onClick={() => set(items.map((x, i) => (i === index ? { ...x, visible: !x.visible } : x)), { coalesce: false })}
                    aria-label={item.visible ? t('list.hide') : t('list.show')}
                    title={item.visible ? t('list.hide') : t('list.show')}
                  >
                    {item.visible ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                )}
                {allowDuplicate && items.length < max && (
                  <button type="button" className="a-icon-btn" onClick={() => duplicate(index)} aria-label={t('list.duplicate')} title={t('list.duplicate')}>
                    <Copy size={16} />
                  </button>
                )}
                <button type="button" className="a-icon-btn hover:!text-[var(--a-danger)]" onClick={() => remove(index)} aria-label={t('common.delete')} title={t('common.delete')}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {isOpen && <div className="a-list-body pt-4">{renderItem([...path, index], item, index)}</div>}
          </div>
        );
      })}
      {items.length < max && (
        <button type="button" className="a-btn mt-3" onClick={add}>
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
}
