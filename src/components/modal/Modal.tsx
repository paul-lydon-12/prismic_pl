import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames/bind';
import { UIContext } from 'context/ui';

import { Portal } from 'components/portal/Portal';

import { useKeyDown } from 'hooks/useKeyDown';

import s from './Modal.module.scss';

const c = classNames.bind(s);

type ModalDefaults = {
  children: React.ReactElement;
  className?: string;
  dismissed?: boolean; // additional flag showing modal, ie. local storage value
};

type ManualModal = {
  active: boolean;
  onClose: () => void;
  timeout?: never;
} & ModalDefaults;

type TimeoutModal = {
  timeout: number;
  active?: never;
  onClose?: () => void;
} & ModalDefaults;

export type ModalProps = ManualModal | TimeoutModal;

export const Modal = ({
  children,
  active,
  dismissed,
  onClose,
  timeout,
  className,
}: ModalProps) => {
  const { formatMessage } = useIntl();
  const { setUIState } = useContext(UIContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInnerRef = useRef<HTMLDivElement>(null);

  const [localStateActive, setLocalStateActive] = useState(false);

  // copy over active state to local
  useEffect(() => {
    if (active !== undefined) {
      setLocalStateActive(active);
    }
  }, [active]);

  useEffect(() => {
    if (dismissed) {
      setLocalStateActive(false);
    }
  }, [dismissed]);

  useEffect(() => {
    setUIState({ canScroll: !localStateActive });
  }, [localStateActive, setUIState]);

  // focus content on active
  useEffect(() => {
    if (localStateActive) {
      modalInnerRef.current?.focus();
    }
  }, [localStateActive]);

  // generic close
  const handleClose = useCallback(() => {
    onClose?.();
    setLocalStateActive(false);
  }, [onClose]);

  // escape to close
  useKeyDown('Escape', handleClose);

  // if timeout prop is set, set timeout to open modal
  useEffect(() => {
    if (!timeout || dismissed) {
      return;
    }

    const timer = setTimeout(() => setLocalStateActive(true), timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout, dismissed]);

  return (
    <Portal>
      <CSSTransition
        nodeRef={modalRef}
        in={localStateActive}
        classNames={{ ...s }}
        addEndListener={(done) => {
          modalRef.current?.addEventListener('transitionend', done, false);
        }}
        unmountOnExit
      >
        <div
          className={c(s.modal, className)}
          role="dialog"
          aria-modal="true"
          aria-hidden={!active}
          ref={modalRef}
        >
          <button className={s.modal__backdrop} onClick={handleClose} tabIndex={-1} />
          <div className={s.modal__inner} tabIndex={0} ref={modalInnerRef}>
            <div className={s.modal__header}>
              <button
                onClick={handleClose}
                tabIndex={0}
                aria-label={formatMessage({ id: 'close', defaultMessage: 'Close' })}
              >
                &times;
              </button>
            </div>
            {children}
          </div>
        </div>
      </CSSTransition>
    </Portal>
  );
};
