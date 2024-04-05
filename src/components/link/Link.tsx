import NextLink from 'next/link';

import { useUiState } from 'hooks/useUiState';
import { SiteLocale } from 'i18n/i18n';

export type LinkProps = {
  children: React.ReactNode;
  to: string;
  transition?: boolean;
  prefetch?: boolean;
  locale?: SiteLocale;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = ({
  children,
  to,
  transition = true,
  prefetch = false,
  locale,
  ...props
}: LinkProps) => {
  // prop: transiton = opt in or out of a page transition
  // (i.e tabs might not require a transition)
  // defaults to active page transitions
  const { uiState, setUIState } = useUiState();
  const { prefersReducedMotion } = uiState;

  const isExternal = to && /^((https?:)?\/\/|[0-9a-zA-Z]+:)/.test(to || '');

  if (isExternal) {
    return (
      <a target="_blank" rel="noopener noreferrer" href={to} {...props}>
        {children}
      </a>
    );
  }

  const handleClick = () => {
    setUIState({
      isNavOpen: false,
    });
  };

  return (
    <NextLink
      href={to}
      scroll={prefersReducedMotion ? true : transition}
      locale={locale}
      prefetch={prefetch}
      {...props}
      onClick={handleClick}
    >
      {children}
    </NextLink>
  );
};
