import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/gsap.js';

/** Brand cursor for mouse users only (hidden on touch and reduced motion). */
export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia?.('(pointer: fine)').matches;
    if (!fine || reducedMotion() || !dot.current || !ring.current) return undefined;
    dot.current.style.display = 'block';
    ring.current.style.display = 'block';
    let shown = false;

    const move = (e) => {
      // Stay invisible until the mouse actually moves (no ring stuck at 0,0).
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY, opacity: 1 });
      }
      gsap.to(dot.current, { x: e.clientX, y: e.clientY, duration: 0.1, overwrite: true });
      gsap.to(ring.current, { x: e.clientX, y: e.clientY, duration: 0.3, overwrite: 'auto' });
    };
    // Event delegation: works for links rendered after this effect runs.
    const over = (e) => {
      if (e.target.closest?.('a, button, [role="button"]')) {
        gsap.to(ring.current, { scale: 1.5, backgroundColor: 'rgba(198, 183, 160, 0.1)', duration: 0.3 });
      }
    };
    const out = (e) => {
      if (e.target.closest?.('a, button, [role="button"]')) {
        gsap.to(ring.current, { scale: 1, backgroundColor: 'rgba(0,0,0,0)', duration: 0.3 });
      }
    };
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="custom-cursor" style={{ display: 'none', opacity: 0 }} aria-hidden="true" />
      <div ref={ring} className="custom-cursor-follower" style={{ display: 'none', opacity: 0 }} aria-hidden="true" />
    </>
  );
}
