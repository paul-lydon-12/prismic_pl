import { useRef } from 'react';
import { Transition } from 'react-transition-group';
import classNames from 'classnames/bind';

import { useUiState } from 'hooks/useUiState';

import { LoadingIndicator } from './LoadingIndicator';

import s from './Loading.module.scss';

const c = classNames.bind(s);

export const Loading = () => {
  const { uiState } = useUiState();
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Transition
      in={uiState.isLoading}
      timeout={uiState.prefersReducedMotion ? 0 : 300}
      unmountOnExit
      nodeRef={nodeRef}
    >
      {(state) => {
        return (
          <div
            className={c(s.loading, state)}
            role="alertdialog"
            aria-busy="true"
            aria-live="assertive"
            ref={nodeRef}
          >
            <LoadingIndicator />
          </div>
        );
      }}
    </Transition>
  );
};
