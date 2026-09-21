/** Immutable read/write of nested values by path (array of keys/indexes). */

export function getIn(obj, path) {
  let cur = obj;
  for (const key of path) {
    if (cur == null) return undefined;
    cur = cur[key];
  }
  return cur;
}

export function setIn(obj, path, value) {
  if (!path.length) return value;
  const [key, ...rest] = path;
  const base = obj ?? (typeof key === 'number' ? [] : {});
  const current = base[key];
  const next = setIn(current, rest, value);
  if (next === current) return base;
  if (Array.isArray(base)) {
    const copy = base.slice();
    copy[key] = next;
    return copy;
  }
  return { ...base, [key]: next };
}

export const pathKey = (path) => path.join('.');

export function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
