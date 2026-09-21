import { useState } from 'react';
import { responsive } from '../../lib/media.js';

/**
 * <img> that serves the right size (srcset), lazy-loads by default and never
 * shows a broken-image icon: if the file is missing it renders a soft
 * placeholder instead.
 */
export default function SmartImage({
  src,
  alt = '',
  sizes = '100vw',
  className = '',
  priority = false,
  preferred = 1280,
  placeholderClassName = 'bg-sand/15',
  ...rest
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  if (!src || failedSrc === src) {
    return <div className={`${className} ${placeholderClassName}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} />;
  }
  const { src: fallback, srcSet } = responsive(src, preferred);
  return (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  );
}
