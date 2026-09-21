/**
 * Small wrapper around api.php. Always resolves to
 * { ok: true, ...data } or { ok: false, error: '<code>', status, ...extra }
 * so callers never have to deal with thrown network errors.
 */
const TOKEN_KEY = 'synergy_admin_token_v3';

export function loadSession() {
  try {
    const raw = JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null');
    if (raw && raw.token && raw.expires * 1000 > Date.now() + 60_000) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveSession(session) {
  try {
    if (session) localStorage.setItem(TOKEN_KEY, JSON.stringify({ token: session.token, expires: session.expires }));
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export async function api(action, { method = 'GET', body, token, form, query = {}, timeout = 60_000 } = {}) {
  const params = new URLSearchParams({ ...(action ? { action } : {}), ...query, t: String(Date.now()) });
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null;
  try {
    const res = await fetch(`/api.php?${params}`, { method, headers, body: payload, cache: 'no-store', signal: controller?.signal });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const error = data?.error || (res.status === 413 ? 'file-too-large' : res.status === 401 ? 'session-expired' : 'server-error');
      return { ...(data || {}), ok: false, error, status: res.status };
    }
    return { ...(data && typeof data === 'object' ? data : {}), ok: true, status: res.status, data };
  } catch (err) {
    return { ok: false, error: err?.name === 'AbortError' ? 'timeout' : 'network', status: 0 };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Public, published content (no login needed). */
export async function fetchPublished() {
  const res = await api('', {});
  if (!res.ok) return res;
  return { ok: true, content: res.data };
}
