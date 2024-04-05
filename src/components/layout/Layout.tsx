import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout as PrismicLayout } from 'prismic-types';

import { ExitPreview } from 'components/exit-preview/ExitPreview';
import { Footer } from 'components/footer/Footer';
import { Header } from 'components/header/Header';
import { PageTransition } from 'components/page-transition/PageTransition';
import { NavContainer as Nav } from 'containers/nav/Nav';

import { useScrollbarWidth } from 'hooks/useScrollbarWidth';
import { useUiState } from 'hooks/useUiState';

import s from './Layout.module.scss';

type LayoutProps = {
  children: React.ReactNode;
  layout: PrismicLayout | null;
  preview?: boolean;
};

export const Layout = ({ children, preview }: LayoutProps) => {
  const { setUIState } = useUiState();
  const router = useRouter();

  useEffect(() => {
    setUIState({ isNavOpen: false });
  }, [router, setUIState]);

  const scrollbarWidth = useScrollbarWidth();

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      `${scrollbarWidth}px`
    );
  }, [scrollbarWidth]);

  return (
    <div className={s.layout}>
      <Header>
        <Nav />
      </Header>
      <PageTransition route={router.asPath}>
        <main id="main">{children}</main>
      </PageTransition>
      <div id="portal-container" />
      <Footer />
      {preview && <ExitPreview />}
    </div>
  );
};
