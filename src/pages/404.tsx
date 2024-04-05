import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { layoutDataQuery } from 'prismic/queries/layoutQuery';

import { H1 } from 'components/heading/Heading';
import { Section } from 'components/section/Section';
import { Meta } from 'containers/meta/Meta';

import { localeToPrismicLocale } from 'i18n/i18n';

type PageProps = {
  preview?: boolean;
};

const Custom404 = ({ preview }: PageProps) => {
  const { asPath } = useRouter();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (preview) {
      document.location = `/api/exit-preview?redirect=${asPath}`;
    }
  });

  return (
    <>
      <Meta
        title={`404 - ${formatMessage({
          id: 'page_not_found',
          defaultMessage: 'Page not found',
        })}`}
      />
      <Section>
        <H1>{`404 - ${formatMessage({
          id: 'page_not_found',
          defaultMessage: 'Page not found',
        })}`}</H1>
      </Section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ preview = false, locale }) => {
  const lang = localeToPrismicLocale(locale);

  const layoutData = await layoutDataQuery(lang);
  const layout = layoutData?.layout ?? null;

  return {
    props: {
      preview,
      layout,
    },
    revalidate: 1,
  };
};

export default Custom404;
