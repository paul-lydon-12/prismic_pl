import { useRouter } from 'next/router';

import { Link, LinkProps } from 'components/link/Link';

export const NavLink = ({ to, children, ...props }: LinkProps) => {
  const router = useRouter();

  return (
    <Link
      to={to}
      aria-current={decodeURI(router.asPath).startsWith(to) ? 'page' : undefined}
      tabIndex={0}
      {...props}
    >
      {children}
    </Link>
  );
};
