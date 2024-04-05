import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Layout, Page, PageSlices } from 'prismic-types';

import { linkResolver } from 'prismic/linkResolver';
import { layoutDataQuery } from 'prismic/queries/layoutQuery';
import { pageQuery } from 'prismic/queries/pageQuery';
import { mapSlices } from 'prismic/slice-mapper';
import { pageSlicesMap } from 'prismic/slices/pageSlicesMap';
import { sliceRenderer } from 'prismic/slices/slices';

import { H1 } from 'components/heading/Heading';
import { asText } from 'components/rich-text/RichText';
import { PrismicMeta } from 'containers/meta/PrismicMeta';

import { query } from 'api/prismic';
import { DEFAULT_LOCALE, localeToPrismicLocale } from 'i18n/i18n';
import { getStringFromQueryString } from 'utils/queryString';

export type PageProps = {
  preview: boolean;
  page: Page | null;
  layout: Layout | null;
};

export default function PageComponent(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const page = data.page ?? null;

  if (!page) {
    return null;
  }

  return (
    <>
      <PrismicMeta data={page} layout={data.layout} />

      <H1>{asText(page.title)}</H1>

      {mapSlices<PageSlices>(
        pageSlicesMap<PageSlices>(),
        page.slices ?? [],
        sliceRenderer
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  preview = false,
  previewData,
  params,
  resolvedUrl,
  locale,
}) => {
  const lang = localeToPrismicLocale(locale);
  const uid = getStringFromQueryString(params?.uid) ?? '';
  const variables = { uid, lang };
  const cacheKey = `${lang}-uid-${uid}`;

  const [layoutData, pageData] = await Promise.all([
    layoutDataQuery(lang),
    query(pageQuery, {
      previewData,
      variables,
      cacheKey: `page-${cacheKey}`,
      breadcrumbs: [resolvedUrl],
    }),
  ]);

  const layout = layoutData?.layout ?? null;
  const page = pageData?.page ?? null;

  if (!page) {
    return {
      notFound: true,
    };
  }

  const pageUrl = linkResolver(page);
  const resolvedUrlWithLocale = decodeURI(
    (locale && locale !== DEFAULT_LOCALE ? `/${locale}` : '') + resolvedUrl
  );
  const redirect = resolvedUrlWithLocale.indexOf(pageUrl) !== 0 ? pageUrl : null;

  if (redirect) {
    return {
      redirect: {
        destination: pageUrl,
        statusCode: 301,
      },
    };
  }

  return {
    props: {
      preview,
      page,
      layout,
    },
  };
};
