/* UI CONTEXT
 * ___
 * some common UI values that can be passed into the app to children via <UIProvider />
 * states include overflow state; navOpen (mobile only by default); page transition opt in / out;
 */
import { createContext, useCallback, useEffect, useState } from 'react';

type UiStateProps = {
  isLoading: boolean;
  isNavOpen: boolean;
  canScroll: boolean;
  readonly prefersReducedMotion: boolean;
};

type UiStateContext = {
  uiState: UiStateProps;
  setUIState: (args: Partial<UiStateProps>) => void;
};

const uiStateDefaults = {
  isLoading: false,
  isNavOpen: false,
  canScroll: true,
  prefersReducedMotion: false,
};

// export UIContext
export const UIContext = createContext<UiStateContext>({
  uiState: uiStateDefaults,

  setUIState: () => null,
});

// exported UIProvider Component
// wraps _app for child components to optionally consume with useContext() hook
export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [uiState, updateUiState] = useState<UiStateProps>(uiStateDefaults);

  // alias to update uiState
  const setUIState = useCallback((state: Partial<UiStateProps>) => {
    updateUiState((prevState) => ({
      ...prevState,
      ...state,
    }));
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setUIState({ prefersReducedMotion: reducedMotion.matches });
  }, [setUIState]);

  // function for setting overflow on html element (ie navigation open, modal open etc)
  const preventScroll = useCallback((prevent: boolean, isNavOpen?: boolean) => {
    // nav open distinction is so overflow is only in "mobile"
    const htmlClassName = isNavOpen ? 'nav-open' : 'scroll-disabled';
    document.documentElement.classList[prevent ? 'add' : 'remove'](htmlClassName);
  }, []);

  // on "canScroll" change, toggle preventScroll()
  useEffect(() => {
    preventScroll(!uiState.canScroll);
  }, [uiState.canScroll, preventScroll]);

  // toggle nav states
  useEffect(() => {
    preventScroll(uiState.isNavOpen);
  }, [uiState.isNavOpen, preventScroll]);

  return (
    <UIContext.Provider
      value={{
        uiState,
        setUIState,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
