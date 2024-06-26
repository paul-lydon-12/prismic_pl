import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Frontpage, Layout } from 'prismic-types';

import { frontpageQuery } from 'prismic/queries/frontpageQuery';
import { layoutDataQuery } from 'prismic/queries/layoutQuery';

import { H1 } from 'components/heading/Heading';
import { RichText, asText } from 'components/rich-text/RichText';
import { PrismicMeta } from 'containers/meta/PrismicMeta';

import { query } from 'api/prismic';
import { localeToPrismicLocale } from 'i18n/i18n';
import { Button } from 'components/button/Button';
import Tel24 from 'assets/svg/tel24.svg';

export type FrontpageProps = {
  preview?: boolean;
  frontpage: Frontpage;
  layout: Layout | null;
};

export default function FrontpageComponent(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const frontpage = data.frontpage;

  return (
    <>
      <PrismicMeta data={frontpage} layout={data.layout} />
      <Button showHeading={true}>Helló</Button>
      <div>
        <H1>{asText(frontpage.title)}</H1>
        <div>
            <RichText>{frontpage.description}</RichText>
            <RichText>{frontpage.description2}</RichText>
            <Tel24 title="Tel24" />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<FrontpageProps> = async ({
  preview = false,
  previewData,
  locale,
}) => {
  const lang = localeToPrismicLocale(locale);

  console.log({lang});


  const [layoutData, pageData] = await Promise.all([
    layoutDataQuery(lang),
    query(frontpageQuery, {
      previewData,
      variables: { lang },
      cacheKey: `frontpage-${lang}`,
    }),
  ]);

  const layout = layoutData?.layout ?? null;
  const frontpage = pageData?.frontpage ?? null;

  if (!frontpage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      preview,
      layout,
      frontpage,
    },
  };
};
