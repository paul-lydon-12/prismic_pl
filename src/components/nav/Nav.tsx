import { Children, cloneElement, useRef } from 'react';
import { useIntl } from 'react-intl';
import { CSSTransition } from 'react-transition-group';

import { useKeyDown } from 'hooks/useKeyDown';
import { useUiState } from 'hooks/useUiState';

import s from './Nav.module.scss';

type NavProps = {
  children: React.ReactNode;
};

export const Nav = ({ children }: NavProps) => {
  const { uiState, setUIState } = useUiState();
  const navRef = useRef<HTMLElement>(null);
  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (uiState.isNavOpen) {
      setUIState({ isNavOpen: false });
    }
  };

  useKeyDown('Escape', handleClose);

  return (
    <CSSTransition
      in={uiState.isNavOpen}
      nodeRef={navRef}
      addEndListener={(done) => {
        navRef.current?.addEventListener('transitionend', done, false);
      }}
      classNames={{ ...s }}
    >
      <nav
        className={s.nav}
        aria-label={formatMessage({ id: 'menu', defaultMessage: 'Menu' })}
        ref={navRef}
      >
        <div className={s.nav__inner}>
          <div className={s.nav__content}>
            <div className={s.nav__close}>
              <button onClick={handleClose}>
                {formatMessage({ id: 'close', defaultMessage: 'Close' })}
              </button>
            </div>
            <ul className={s.nav__list}>
              {Children.map(children, (child, i) => (
                <li className={s.nav__item} key={i}>
                  {cloneElement(child as React.ReactElement, { tabIndex: 0 })}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className={s.nav__backdrop}
          aria-label={formatMessage({ id: 'close_menu', defaultMessage: 'Close menu' })}
          onClick={handleClose}
          tabIndex={-1}
        />
      </nav>
    </CSSTransition>
  );
};
