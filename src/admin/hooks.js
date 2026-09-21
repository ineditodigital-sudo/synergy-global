import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin, useField } from './context.js';

/** Point the live preview at the page being edited. */
export function usePreviewPath(path) {
  const { setPreviewPath } = useAdmin();
  useEffect(() => {
    if (path) setPreviewPath(path);
  }, [path, setPreviewPath]);
}

/** Finds an item by id; returns { index, item } (index -1 if missing). */
export function useItem(path, id) {
  const [value] = useField(path);
  const items = Array.isArray(value) ? value : [];
  const index = items.findIndex((x) => String(x.id) === String(id));
  return { index, item: index >= 0 ? items[index] : null, items };
}

/** Delete + back, used in the item editors. */
export function useDeleteItem(path, backTo) {
  const { t, confirm } = useAdmin();
  const [value, set] = useField(path);
  const navigate = useNavigate();
  return async (id, name) => {
    const ok = await confirm({ title: t('list.deleteTitle'), message: t('list.deleteMessage', { name: name || t('list.untitled') }), confirmLabel: t('common.delete'), danger: true });
    if (!ok) return;
    navigate(backTo);
    set((Array.isArray(value) ? value : []).filter((x) => x.id !== id), { coalesce: false });
  };
}
