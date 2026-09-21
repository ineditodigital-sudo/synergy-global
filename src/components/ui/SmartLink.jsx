import { Link } from 'react-router-dom';
import { isExternal } from '../../content/site.js';

/** Internal paths use the router; web, email and phone links open normally. */
export default function SmartLink({ to, children, ...rest }) {
  const target = String(to || '/').trim() || '/';
  if (isExternal(target)) {
    const web = /^https?:/i.test(target);
    return (
      <a href={target} {...(web ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={target.startsWith('/') ? target : `/${target}`} {...rest}>
      {children}
    </Link>
  );
}
