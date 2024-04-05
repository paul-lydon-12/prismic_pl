import { useRef } from 'react';
import { useIntl } from 'react-intl';

import { Link } from 'components/link/Link';

import { useUiState } from 'hooks/useUiState';

import s from './Header.module.scss';

type HeaderProps = { children?: React.ReactNode };

export const Header = ({ children }: HeaderProps) => {
  const { setUIState } = useUiState();
  const { formatMessage } = useIntl();

  const headerRef = useRef<HTMLElement>(null);

  return (
    <header className={s.header} ref={headerRef}>
      <div className={s.header__container}>
        <a tabIndex={0} className={s.header__skip} href="#main">
          {formatMessage({ id: 'skip_to_content', defaultMessage: 'Skip to content' })}
        </a>
        <Link tabIndex={0} to="/">
          {formatMessage({ id: 'frontpage', defaultMessage: 'Frontpage' })}
        </Link>
        <div className={s.header__nav}>{children}</div>
        <div className={s.header__controls}>
          <button onClick={() => setUIState({ isNavOpen: true })}>
            {formatMessage({ id: 'menu', defaultMessage: 'Menu' })}
          </button>
        </div>
      </div>
    </header>
  );
};
