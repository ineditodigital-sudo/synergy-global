import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdminContext } from './context.js';
import { api, fetchPublished, loadSession, saveSession } from './lib/api.js';
import { getIn, setIn, pathKey, deepEqual } from './lib/paths.js';
import { reviewContent } from './lib/checks.js';
import { normalizeContent, clone } from '../content/normalize.js';
import { DICT, detectLang, translate } from './i18n.js';

const DRAFT_KEY = 'synergy_admin_draft_v3';
const LANG_KEY = 'synergy_admin_lang';
const MAX_UNDO = 100;
const hosts = () => [window.location.host];

function readLocalDraft() {
  try {
    const raw = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (raw && raw.draft && typeof raw.draft === 'object') return raw;
  } catch {
    /* ignore */
  }
  return null;
}

function writeLocalDraft(value) {
  try {
    if (value) localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
    else localStorage.removeItem(DRAFT_KEY);
    return true;
  } catch {
    return false;
  }
}

export default function AdminProvider({ children }) {
  /* ---------------------------------------------------------- language */
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) || detectLang();
    } catch {
      return detectLang();
    }
  });
  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);
  const t = useCallback((key, params) => translate(DICT, lang, key, params), [lang]);

  /* ----------------------------------------------------------- session */
  const [session, setSession] = useState(loadSession);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [uploadLimit, setUploadLimit] = useState(0);
  const token = session?.token || '';

  const login = useCallback(async (password) => {
    const res = await api('login', { method: 'POST', body: { password } });
    if (res.ok) {
      const s = { token: res.token, expires: res.expires };
      saveSession(s);
      setSession(s);
      setSessionExpired(false);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  const expire = useCallback(() => {
    setSessionExpired(true);
  }, []);

  // Keep the session alive while the editor is open.
  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    const renew = async () => {
      const res = await api('session', { token });
      if (cancelled) return;
      if (res.ok) {
        const s = { token: res.token, expires: res.expires };
        saveSession(s);
        setSession((prev) => (prev?.token === s.token ? prev : s));
        if (res.uploadLimit) setUploadLimit(res.uploadLimit);
      } else if (res.status === 401) {
        setSessionExpired(true);
      }
    };
    renew();
    const id = setInterval(renew, 20 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // Renew on login and every 20 minutes, not on every token change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(token)]);

  /* ----------------------------------------------------------- content */
  const [loadState, setLoadState] = useState('loading');
  const [published, setPublished] = useState(null);
  const [draft, setDraftState] = useState(null);
  const [recovery, setRecovery] = useState(null);
  const draftRef = useRef(null);
  const publishedRef = useRef(null);

  const applyLoaded = useCallback((res) => {
    if (!res.ok) {
      setLoadState('error');
      return;
    }
    const content = normalizeContent(res.content, { hosts: hosts() });
    publishedRef.current = content;
    draftRef.current = content;
    setPublished(content);
    setDraftState(content);
    const local = readLocalDraft();
    if (local) {
      const localDraft = normalizeContent(local.draft, { hosts: hosts() });
      if (!deepEqual(localDraft, content)) setRecovery({ ...local, draft: localDraft, outdated: local.baseVersion !== content._meta.version });
      else writeLocalDraft(null);
    }
    setLoadState('ready');
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPublished().then((res) => {
      if (!cancelled) applyLoaded(res);
    });
    return () => {
      cancelled = true;
    };
  }, [applyLoaded]);

  const load = useCallback(() => {
    setLoadState('loading');
    fetchPublished().then(applyLoaded);
  }, [applyLoaded]);

  /* ---------------------------------------------------- undo / redo */
  const past = useRef([]);
  const future = useRef([]);
  const lastEdit = useRef({ key: '', at: 0 });
  const [undoState, setUndoState] = useState({ canUndo: false, canRedo: false });
  const syncUndo = () => setUndoState({ canUndo: past.current.length > 0, canRedo: future.current.length > 0 });

  const commit = useCallback((next, { record = true, coalesceKey = '' } = {}) => {
    const prev = draftRef.current;
    if (next === prev) return;
    if (record) {
      const now = Date.now();
      const same = coalesceKey && lastEdit.current.key === coalesceKey && now - lastEdit.current.at < 1200;
      if (!same) {
        past.current.push(prev);
        if (past.current.length > MAX_UNDO) past.current.shift();
      }
      future.current = [];
      lastEdit.current = { key: coalesceKey, at: now };
    }
    draftRef.current = next;
    setDraftState(next);
    syncUndo();
  }, []);

  const update = useCallback(
    (path, value, opts = {}) => {
      if (!draftRef.current) return;
      // `value` may be a function of the current value (safe for async updates).
      const next = typeof value === 'function' ? value(getIn(draftRef.current, path)) : value;
      commit(setIn(draftRef.current, path, next), { coalesceKey: opts.coalesce === false ? '' : pathKey(path) });
    },
    [commit],
  );

  const replaceDraft = useCallback((next, opts) => commit(next, opts), [commit]);

  const undo = useCallback(() => {
    if (!past.current.length) return;
    future.current.push(draftRef.current);
    const prev = past.current.pop();
    lastEdit.current = { key: '', at: 0 };
    draftRef.current = prev;
    setDraftState(prev);
    syncUndo();
  }, []);

  const redo = useCallback(() => {
    if (!future.current.length) return;
    past.current.push(draftRef.current);
    const next = future.current.pop();
    lastEdit.current = { key: '', at: 0 };
    draftRef.current = next;
    setDraftState(next);
    syncUndo();
  }, []);

  const dirty = useMemo(() => Boolean(draft && published && !deepEqual(draft, published)), [draft, published]);

  // Autosave the draft in this browser so nothing is lost if the tab closes.
  const [localSaveFailed, setLocalSaveFailed] = useState(false);
  useEffect(() => {
    if (!draft || !published || recovery) return undefined;
    const id = setTimeout(() => {
      const ok = dirty ? writeLocalDraft({ baseVersion: published._meta.version, savedAt: Date.now(), draft }) : writeLocalDraft(null);
      setLocalSaveFailed(!ok);
    }, 700);
    return () => clearTimeout(id);
  }, [draft, published, dirty, recovery]);

  // Warn before closing the tab with unpublished changes.
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const acceptRecovery = useCallback(() => {
    if (!recovery) return;
    commit(recovery.draft);
    setRecovery(null);
  }, [recovery, commit]);

  const dismissRecovery = useCallback(() => {
    writeLocalDraft(null);
    setRecovery(null);
  }, []);

  const discard = useCallback(() => {
    if (!publishedRef.current) return;
    commit(publishedRef.current);
  }, [commit]);

  /* --------------------------------------------------------- publish */
  const [publishing, setPublishing] = useState(false);

  const publish = useCallback(
    async ({ force = false } = {}) => {
      const current = draftRef.current;
      if (!current) return { ok: false, error: 'not-ready' };
      const content = normalizeContent(current, { hosts: hosts() });
      setPublishing(true);
      const res = await api('save', {
        method: 'POST',
        token,
        body: { content, baseVersion: publishedRef.current?._meta.version ?? 0, force },
      });
      setPublishing(false);
      if (!res.ok) {
        if (res.status === 401) expire();
        return res;
      }
      const saved = { ...content, _meta: { ...content._meta, version: res.version, updatedAt: res.updatedAt } };
      publishedRef.current = saved;
      setPublished(saved);
      if (deepEqual(draftRef.current, current)) {
        draftRef.current = saved;
        setDraftState(saved);
      } else {
        // Edits made while publishing stay as unpublished changes.
        const merged = { ...draftRef.current, _meta: saved._meta };
        draftRef.current = merged;
        setDraftState(merged);
      }
      writeLocalDraft(null);
      return { ok: true, version: res.version };
    },
    [token, expire],
  );

  /**
   * Restore a saved version: it is normalized (older formats are upgraded)
   * and published as a new version, so nothing is ever overwritten for good.
   */
  const restoreVersion = useCallback(
    async (id) => {
      const res = await api('version', { token, query: { id } });
      if (!res.ok) {
        if (res.status === 401) expire();
        return res;
      }
      const content = normalizeContent(res.content, { hosts: hosts() });
      const saved = await api('save', {
        method: 'POST',
        token,
        body: { content, baseVersion: publishedRef.current?._meta.version ?? 0, force: true, reason: 'before-restore' },
      });
      if (!saved.ok) {
        if (saved.status === 401) expire();
        return saved;
      }
      const next = { ...content, _meta: { ...content._meta, version: saved.version, updatedAt: saved.updatedAt } };
      publishedRef.current = next;
      setPublished(next);
      commit(next);
      writeLocalDraft(null);
      return { ok: true };
    },
    [token, expire, commit],
  );

  const issues = useMemo(() => (draft ? reviewContent(draft) : []), [draft]);

  /* ----------------------------------------------------- preview path */
  const [previewPath, setPreviewPath] = useState('/');

  /* ------------------------------------------------ toasts / confirm */
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), type === 'error' ? 7000 : 3500);
  }, []);
  const dismissToast = useCallback((id) => setToasts((list) => list.filter((x) => x.id !== id)), []);

  const [dialog, setDialog] = useState(null);
  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        setDialog({ ...options, resolve });
      }),
    [],
  );
  const closeDialog = useCallback(
    (result) => {
      dialog?.resolve(result);
      setDialog(null);
    },
    [dialog],
  );

  const value = {
    lang,
    setLang,
    t,
    session,
    token,
    login,
    logout,
    sessionExpired,
    expire,
    uploadLimit,
    loadState,
    reload: load,
    published,
    draft,
    update,
    replaceDraft,
    undo,
    redo,
    canUndo: undoState.canUndo,
    canRedo: undoState.canRedo,
    dirty,
    discard,
    publish,
    publishing,
    restoreVersion,
    issues,
    recovery,
    acceptRecovery,
    dismissRecovery,
    localSaveFailed,
    previewPath,
    setPreviewPath,
    toasts,
    toast,
    dismissToast,
    dialog,
    confirm,
    closeDialog,
    clone,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
