import { useIntl } from 'react-intl';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Star, Layout, PageInfo } from 'prismic-types';

import { linkResolver } from 'prismic/linkResolver';
import { isFirstCursor, pageNumberToCursor } from 'prismic/paging';
import { starsQuery } from 'prismic/queries/starsQuery';
import { layoutDataQuery } from 'prismic/queries/layoutQuery';

import { H1 } from 'components/heading/Heading';
import { Link } from 'components/link/Link';
import { asText, RichText } from 'components/rich-text/RichText';
import { Section } from 'components/section/Section';
import { PrismicMeta } from 'containers/meta/PrismicMeta';

import { query } from 'api/prismic';
import { localeToPrismicLocale } from 'i18n/i18n';
import { ExcludesFalse } from 'utils/excludesFalse';
import { getStringFromQueryString } from 'utils/queryString';

export type StarsProps = {
  preview: boolean;
  stars: Array<Star>;
  pageInfo: PageInfo | null;
  page: number;
  layout: Layout | null;
};

export const PER_PAGE = 9;

export default function StarsPage(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { stars, pageInfo, page = 1 } = data;
  const { formatMessage } = useIntl();

  const router = useRouter();

  if (stars.length === 0) {
    return <>empty ... ...</>;
  }

  const hasPreviousPage =
    pageInfo?.hasPreviousPage && !isFirstCursor(pageInfo.startCursor) && page > 1;
  const previousPage = `${router.pathname}/?page=${page - 1}`;

  const hasNextPage = pageInfo?.hasNextPage;
  const nextPage = `${router.pathname}/?page=${page + 1}`;

  return (
    <>
      <PrismicMeta layout={data.layout} />
      
      <div><p>Stjörnur og stars</p></div>
      <Section>
        <ul>
          {stars.map((item, i) => (
            <li key={i}>
              <H1>{asText(item.title)}</H1>
              {item.description && <RichText>{item.description}</RichText>}
              <Link to={linkResolver(item)}>Link</Link>
            </li>
          ))}
        </ul>
      </Section>

      {(hasPreviousPage || hasNextPage) && (
        <ul>
          {hasPreviousPage && (
            <li>
              <Link to={previousPage}>
                {formatMessage({ id: 'prev_page', defaultMessage: 'Previous page' })}
              </Link>
            </li>
          )}
          {hasNextPage && (
            <li>
              <Link to={nextPage}>
                {formatMessage({ id: 'next_page', defaultMessage: 'Next page' })}
              </Link>
            </li>
          )}
        </ul>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<StarsProps> = async ({
  preview = false,
  query: qs = {},
  locale,
}) => {
  const lang = localeToPrismicLocale(locale);
  const pageQs = getStringFromQueryString(qs.page);
  const page = pageQs ? parseInt(pageQs, 10) : 1;

  const variables = {
    lang,
    first: PER_PAGE,
    after: page > 1 ? pageNumberToCursor(page, PER_PAGE) : '',
  };

  const [layoutData, pageData] = await Promise.all([
    layoutDataQuery(lang),
    query(starsQuery, {
      variables,
      cacheKey: `stars-${lang}-page-${page}`,
    }),
  ]);

  const pageInfo = pageData?.allStars.pageInfo ?? null;

  const stars: Array<Star> = (pageData?.allStars.edges ?? [])
    .map((i) => i?.node ?? null)
    .filter(Boolean as unknown as ExcludesFalse);
  const layout = layoutData?.layout ?? null;

  console.log(layout, stars, ' sdf')

  return {
    props: {
      preview,
      stars,
      pageInfo,
      page,
      lang,
      layout,
    },
  };
};
