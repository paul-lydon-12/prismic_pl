import { useIntl } from 'react-intl';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Project, Layout } from 'prismic-types';

import { linkResolver } from 'prismic/linkResolver';
import { projectQuery } from 'prismic/queries/projectQuery';
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

export type ProjectProps = {
  preview: boolean;
  project: Project | null;
  related: Array<Project>;
  layout: Layout | null;
};

export default function ProjectComponent(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { formatMessage } = useIntl();

  const project = data.project ?? null;
  const related = data.related;

  console.log('========' , project)

  if (!project) {
    return null;
  }

  return (
    <>
      <PrismicMeta
        data={project}
        layout={data.layout}
      />
      <article>
        <Section>
          <H1>{asText(project.title)}</H1>
          <p>Hér fyrir neðan eru gögn sett fram sem strengur</p>
          {asText(project.description)}
          <p>Hér fyrir neðan eru gögn sett fram sem richt text (styður bold, italic etc sem að er sett upp í prismic)</p>
          <RichText>{project.description}</RichText>
          <Link to={linkResolver(project.externalplanetlink)}>Hlekkur á mig</Link>

          { project.image && (
          <Picture
            className="picture"
            src={project.image?.url}
            width={480}
            height={270}
          /> 
          )}
        </Section>



        {related.length > 0 && (
          <Section>
            <H2>Fleiri verkefni</H2>
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

export const getServerSideProps: GetServerSideProps<ProjectProps> = async ({
  preview = false,
  previewData,
  params,
  locale,
  resolvedUrl,
}) => {
  const lang = localeToPrismicLocale(locale);
  const uid = getStringFromQueryString(params?.project) ?? '';

  const variables = { uid, lang };
  const cacheKey = `${lang}-uid-${uid}`;

  const [layoutData, pageData] = await Promise.all([
    layoutDataQuery(lang),
    query(projectQuery, {
      previewData,
      variables,
      cacheKey: `project-${cacheKey}`,
      breadcrumbs: [resolvedUrl],
    }),
  ]);

  const project = pageData?.project ?? null;
 
  
  if (!project) {
    return {
      notFound: true,
    };
  }
  
  const related: Array<Project> = (pageData?.allProjects.edges ?? [])
  .map((i) => i?.node ?? null)
  .filter((i) => i?._meta.uid !== project._meta.uid)
  .filter(Boolean as unknown as ExcludesFalse)
  .slice(0, 3);
  
  const layout = layoutData?.layout ?? null;
  console.log(layout)

  return {
    props: {
      preview,
      project,
      related,
      layout,
    },
  };
};
