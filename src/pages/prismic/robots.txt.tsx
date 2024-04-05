import { GetServerSideProps } from 'next';

import { ALL_LOCALES, DEFAULT_LOCALE } from 'i18n/i18n';
import { logger } from 'utils/logger';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const allowIndexing = process.env.ALLOW_INDEXING !== 'false';

export default function Robots() {
  return null;
}

const robots = () => {
  const txt = `User-agent: *
${allowIndexing ? 'Allow' : 'Disallow'}: /

Sitemap: ${baseUrl}/sitemap.xml
${ALL_LOCALES.filter((l) => l !== DEFAULT_LOCALE)
  .map((l) => {
    return `Sitemap: ${baseUrl}/${l}/sitemap.xml`;
  })
  .join('\n')}`;

  return txt;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const robotsTxt = await robots();
    res.setHeader('Content-Type', 'text/plain');
    res.write(robotsTxt);
    res.end();

    return {
      props: {},
    };
  } catch (e) {
    logger.error('unable to generate robots', {
      exception: e as Error,
      category: 'robots',
    });
  }

  return {
    props: {},
  };
};
