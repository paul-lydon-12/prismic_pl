import { useIntl } from 'react-intl';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Constellation, Layout } from 'prismic-types';

import { linkResolver } from 'prismic/linkResolver';
import { constellationQuery } from 'prismic/queries/constellationQuery';
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

export type ConstellationProps = {
  preview: boolean;
  constellation: Constellation | null;
  related: Array<Constellation>;
  layout: Layout | null;
};

export default function ConstellationComponent(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { formatMessage } = useIntl();

  const constellation = data.constellation ?? null;
  const related = data.related;

  console.log('========' , constellation)

  if (!constellation) {
    return null;
  }

  return (
    <>
      <PrismicMeta
        data={constellation}
        layout={data.layout}
      />
      <article>
        <Section>
          <H1>{asText(constellation.title)}</H1>
          <p>Hér fyrir neðan eru gögn sett fram sem strengur</p>
          {asText(constellation.description)}
          <p>Hér fyrir neðan eru gögn sett fram sem rich text (styður bold, italic etc sem að er sett upp í prismic)</p>
          <RichText>{constellation.description}</RichText>
          <Link to={linkResolver(constellation.constellationlink)}>Hlekkur á mig</Link>

          { constellation.image && (
          <Picture
            className="picture"
            src={constellation.image?.url}
            width={480}
            height={270}
          /> 
          )}
        </Section>



        {related.length > 0 && (
          <Section>
            <H2>Fleiri vinahopar stjarnanna</H2>
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

export const getServerSideProps: GetServerSideProps<ConstellationProps> = async ({
  preview = false,
  previewData,
  params,
  locale,
  resolvedUrl,
}) => {
  const lang = localeToPrismicLocale(locale);
  const uid = getStringFromQueryString(params?.constellation) ?? '';

  const variables = { uid, lang };
  const cacheKey = `${lang}-uid-${uid}`;

  const [layoutData, pageData] = await Promise.all([
    layoutDataQuery(lang),
    query(constellationQuery, {
      previewData,
      variables,
      cacheKey: `constellation-${cacheKey}`,
      breadcrumbs: [resolvedUrl],
    }),
  ]);

  const constellation = pageData?.constellation ?? null;
 
  
  if (!constellation) {
    return {
      notFound: true,
    };
  }
  
  const related: Array<Constellation> = (pageData?.allConstellations.edges ?? [])
  .map((i) => i?.node ?? null)
  .filter((i) => i?._meta.uid !== constellation._meta.uid)
  .filter(Boolean as unknown as ExcludesFalse)
  .slice(0, 3);
  
  const layout = layoutData?.layout ?? null;
  console.log(layout)

  return {
    props: {
      preview,
      constellation,
      related,
      layout,
    },
  };
};
