/** True when the page runs inside the CMS live-preview frame. */
export const isPreviewFrame = () => {
  if (typeof window === 'undefined') return false;
  try {
    return new URLSearchParams(window.location.search).has('preview') && window.parent !== window;
  } catch {
    return false;
  }
};
