import { createContext, useContext, useCallback } from 'react';
import { getIn } from './lib/paths.js';

export const AdminContext = createContext(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}

export function useT() {
  return useAdmin().t;
}

/** [value, setValue] for one field of the draft. */
export function useField(path) {
  const { draft, update } = useAdmin();
  const key = path.join('');
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` identifies the path
  const set = useCallback((value, opts) => update(path, value, opts), [update, key]);
  return [getIn(draft, path), set];
}
