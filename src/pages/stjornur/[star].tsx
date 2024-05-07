import { useIntl } from 'react-intl';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Star, Layout } from 'prismic-types';

import { linkResolver } from 'prismic/linkResolver';
import { starQuery } from 'prismic/queries/starQuery';
import { layoutDataQuery } from 'prismic/queries/layoutQuery';
import { mapSlices } from 'prismic/slice-mapper';
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
import { Picture } from 'components/picture/Picture';

export type StarProps = {
  preview: boolean;
  star: Star | null;
  related: Array<Star>;
  layout: Layout | null;
};

export default function StarComponent(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { formatMessage } = useIntl();

  const star = data.star ?? null;
  const related = data.related;

  console.log('========' , star)

  if (!star) {
    return null;
  }

  return (
    <>
      <PrismicMeta
        data={star}
        layout={data.layout}
      />
      <article>
        <Section>
          <H1>{asText(star.title)}</H1>
          <p>Hér fyrir neðan eru gögn sett fram sem strengur</p>
          {asText(star.description)}
          <p>Hér fyrir neðan eru gögn sett fram sem richt text (styður bold, italic etc sem að er sett upp í prismic)</p>
          <RichText>{star.description}</RichText>
          <Link to={linkResolver(star.starlink)}>Hlekkur á mig</Link>

          { star.image && (
          <Picture
            className="picture"
            src={star.image?.url}
            width={480}
            height={270}
          /> 
          )}
        </Section>



        {related.length > 0 && (
          <Section>
            <H2>Fleiri stjörnur</H2>
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

export const getServerSideProps: GetServerSideProps<StarProps> = async ({
  preview = false,
  previewData,
  params,
  locale,
  resolvedUrl,
}) => {
  const lang = localeToPrismicLocale(locale);
  const uid = getStringFromQueryString(params?.star) ?? '';

  const variables = { uid, lang };
  const cacheKey = `${lang}-uid-${uid}`;

  const [layoutData, pageData] = await Promise.all([
    layoutDataQuery(lang),
    query(starQuery, {
      previewData,
      variables,
      cacheKey: `star-${cacheKey}`,
      breadcrumbs: [resolvedUrl],
    }),
  ]);

  const star = pageData?.star ?? null;
 
  
  if (!star) {
    return {
      notFound: true,
    };
  }
  
  const related: Array<Star> = (pageData?.allStars.edges ?? [])
  .map((i) => i?.node ?? null)
  .filter((i) => i?._meta.uid !== star._meta.uid)
  .filter(Boolean as unknown as ExcludesFalse)
  .slice(0, 3);
  
  const layout = layoutData?.layout ?? null;
  console.log(layout)

  return {
    props: {
      preview,
      star,
      related,
      layout,
    },
  };
};
