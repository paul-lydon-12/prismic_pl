import { Fragment, useContext, useEffect, useRef } from 'react';
import { UIContext } from 'context/ui';
import { Router } from 'next/router';

type PageTransitionProps = {
  route: string;
  children: React.ReactNode;
};

type NextJsRouteError = Error & { cancelled?: boolean };

export const PageTransition = ({ route, children }: PageTransitionProps) => {
  const cleanRoute = route.split(/[#?]/g)[0];
  const prevPath = useRef(cleanRoute);
  const { setUIState } = useContext(UIContext);

  useEffect(() => {
    function handleRouteStart(url: string) {
      // Only activate loading state when actual route changes
      const pathname = url.split(/[#?]/g)[0];
      if (prevPath.current !== pathname) {
        setUIState({ isLoading: true });
      }

      prevPath.current = pathname;
    }

    function handleRouteComplete(err?: NextJsRouteError) {
      // hide loading screen
      setUIState({ isLoading: false });

      // do something for if action is cancelled?
      if (err && err.cancelled) {
        // console.info('cancelled');
      }
    }

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteComplete);
    Router.events.on('routeChangeError', (err: NextJsRouteError) =>
      handleRouteComplete(err)
    );

    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteComplete);
      Router.events.off('routeChangeError', handleRouteComplete);
    };
  }, [setUIState]);

  return <Fragment key={cleanRoute}>{children}</Fragment>;
};
