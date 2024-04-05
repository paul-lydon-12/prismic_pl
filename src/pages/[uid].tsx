import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Layout, Page } from 'prismic-types';

import { linkResolver } from 'prismic/linkResolver';
import { layoutDataQuery } from 'prismic/queries/layoutQuery';
import { pageQuery } from 'prismic/queries/pageQuery';

import { H1 } from 'components/heading/Heading';
import { asText } from 'components/rich-text/RichText';
import { Section } from 'components/section/Section';
import { PrismicMeta } from 'containers/meta/PrismicMeta';

import { query } from 'api/prismic';
import { localeToPrismicLocale, PrismicLocale } from 'i18n/i18n';

export type PageProps = {
  preview: boolean;
  page: Page | null;
  layout: Layout | null;
  redirect: string | null;
  lang: PrismicLocale;
};

export default function PageComponent(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const page = data.page ?? null;

  if (data.redirect) {
    typeof window !== 'undefined' && router.replace(data.redirect);
    return null;
  }

  if (!page) {
    return null;
  }

  return (
    <>
      <PrismicMeta data={page} layout={data.layout} />

      <Section>
        <H1>{asText(page.title)}</H1>
      </Section>
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
  const uid = params?.uid as string;

  const variables = { uid, lang };
  const cacheKey = `${lang}-uid-${uid}`;

  const [layoutData, pageData] = await Promise.all([
    layoutDataQuery(lang),
    query(pageQuery, {
      previewData,
      variables,
      cacheKey: `page-${cacheKey}`,
    }),
  ]);

  const layout: Layout | null = layoutData?.layout ?? null;

  const page = pageData?.page ?? null;

  if (!page) {
    return {
      notFound: true,
      props: {},
    };
  }

  const pageUrl = linkResolver(page);
  const redirect = decodeURI(resolvedUrl).indexOf(pageUrl) !== 0 ? pageUrl : null;

  return {
    props: {
      preview,
      page,
      layout,
      redirect,
      lang,
    },
  };
};
