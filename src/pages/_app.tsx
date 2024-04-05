import { IntlProvider } from 'react-intl';
import { UIProvider } from 'context/ui';
import { AppProps as NextAppProps } from 'next/app';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { Layout as PrismicLayout } from 'prismic-types';

import { Devtools } from 'components/devtools/Devtools';
import { Layout } from 'components/layout/Layout';
import { Loading } from 'components/loading/Loading';
import { Meta } from 'containers/meta/Meta';

import { DEFAULT_LOCALE, loadMessagesForLocale, mapStringToSiteLocale } from 'i18n/i18n';
import { logger } from 'utils/logger';

import 'styles/global.scss';

type InheritedPageProps = {
  layout?: PrismicLayout | null;
  preview?: boolean;
};

type AppProps<P> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

const sans = localFont({
  src: [
    {
      path: '../assets/fonts/poppins-v9-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/poppins-v9-latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  // declarations: [{}],
  display: 'swap',
});

const serif = localFont({
  src: [
    {
      path: '../assets/fonts/gentium-basic-v11-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/gentium-basic-v11-latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps<InheritedPageProps>) {
  const isDev = process.env.NODE_ENV === 'development';
  const layout = pageProps.layout as PrismicLayout | null;
  const router = useRouter();
  const locale = mapStringToSiteLocale(router.locale);
  const messages = loadMessagesForLocale(locale);

  return (
    <>
      {/* local font family setup */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        :root {
          --font-family-sans: ${sans.style.fontFamily};
          --font-family-serif: ${serif.style.fontFamily};
          --font-family-heading: var(--font-family-serif);
          --font-family: var(--font-family-sans);
        }
      `}</style>
      <Meta />
      <IntlProvider
        locale={locale}
        messages={messages}
        defaultLocale={DEFAULT_LOCALE}
        onError={(err) => {
          // Chrome only ships with 'en' formatters for NumberFormat and DateTimeFormat.
          // Ignore these errors since we're not using these formatters.
          // Bundling polyfills for 'is' significantly increases bundle size and provides no gain.
          // See: https://app.asana.com/0/1202453499137756/1204509391926816
          if (err.code === 'MISSING_DATA') {
            return null;
          }

          logger.error('Error in IntlProvider', { exception: err });
        }}
      >
        <UIProvider>
          <Layout layout={layout} preview={pageProps.preview ?? false}>
            <Component {...pageProps} />
          </Layout>
          <Loading />
        </UIProvider>
      </IntlProvider>
      {isDev && <Devtools />}
    </>
  );
}
