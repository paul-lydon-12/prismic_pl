import { useIntl } from 'react-intl';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Article, ArticleSlices, Layout } from 'prismic-types';

import { linkResolver } from 'prismic/linkResolver';
import { articleQuery } from 'prismic/queries/articleQuery';
import { layoutDataQuery } from 'prismic/queries/layoutQuery';
import { mapSlices } from 'prismic/slice-mapper';
import { articleSlicesMap } from 'prismic/slices/articleSlicesMap';
import { sliceRenderer } from 'prismic/slices/slices';

import { H1, H2, H3 } from 'components/heading/Heading';
import { Link } from 'components/link/Link';
import { asText, RichText } from 'components/rich-text/RichText';
import { Section } from 'components/section/Section';
import { PrismicMeta } from 'containers/meta/PrismicMeta';

import { query } from 'api/prismic';
import { localeToPrismicLocale } from 'i18n/i18n';
import { ExcludesFalse } from 'utils/excludesFalse';
import { getStringFromQueryString } from 'utils/queryString';

export type ArticleProps = {
  preview: boolean;
  article: Article | null;
  related: Array<Article>;
  layout: Layout | null;
};

export default function ArticleComponent(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { formatMessage } = useIntl();

  const article = data.article ?? null;
  const related = data.related;

  if (!article) {
    return null;
  }

  return (
    <>
      <PrismicMeta
        data={article}
        layout={data.layout}
        article={{ publishedTime: article.published }}
      />
      <article>
        <Section>
          <H1>{asText(article.title)}</H1>
          <RichText>{article.description}</RichText>
        </Section>

        {mapSlices<ArticleSlices>(
          articleSlicesMap<ArticleSlices>(),
          article.slices ?? [],
          sliceRenderer
        )}

        {related.length > 0 && (
          <Section>
            <H2>Fleiri fréttir</H2>
            <ul>
              {related.map((item, i) => (
                <li key={i}>
                  <H3>{asText(item.title)}</H3>
                  {item.description && <RichText>{item.description}</RichText>}
                  <Link to={linkResolver(item)}>
                    {formatMessage({ id: 'read_more', defaultMessage: 'Read more' })}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ArticleProps> = async ({
  preview = false,
  previewData,
  params,
  locale,
  resolvedUrl,
}) => {
  const lang = localeToPrismicLocale(locale);
  const uid = getStringFromQueryString(params?.article) ?? '';

  const variables = { uid, lang };
  const cacheKey = `${lang}-uid-${uid}`;

  const [layoutData, pageData] = await Promise.all([
    layoutDataQuery(lang),
    query(articleQuery, {
      previewData,
      variables,
      cacheKey: `article-${cacheKey}`,
      breadcrumbs: [resolvedUrl],
    }),
  ]);

  const article = pageData?.article ?? null;

  if (!article) {
    return {
      notFound: true,
    };
  }

  const related: Array<Article> = (pageData?.allArticles.edges ?? [])
    .map((i) => i?.node ?? null)
    .filter((i) => i?._meta.uid !== article._meta.uid)
    .filter(Boolean as unknown as ExcludesFalse)
    .slice(0, 3);

  const layout = layoutData?.layout ?? null;

  return {
    props: {
      preview,
      article,
      related,
      layout,
    },
  };
};
