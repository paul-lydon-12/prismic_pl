import { linkResolver } from 'prismic/linkResolver';
import { pageNumberToCursor } from 'prismic/paging';
import { PrismicDocument } from 'prismic/types/document';

import { PrismicLocale } from 'i18n/i18n';
import { ExcludesFalse } from 'utils/excludesFalse';
import { logger } from 'utils/logger';
import { stringToNumber } from 'utils/stringToNumber';

import { get, set } from './cache';
import { query } from './prismic';

const {
  SITEMAP_PAGESIZE: pageSize = '100',
  SITEMAP_MAX_PAGES_TO_FETCH: maxPagesToFetch = '10',
  NEXT_PUBLIC_BASE_URL: baseUrl,
  SITEMAP_CACHE_TIMEOUT: cacheTtl = '3600',
  SITEMAP_SKIP_TYPES: skipTypes = 'Layout',
} = process.env;

type _Doc = PrismicDocument & {
  noindex?: boolean;
};

const cacheTtlAsNumber = stringToNumber(cacheTtl) ?? 0;

type SitemapUrl = {
  loc: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
};

function sitemapTemplate(pages: Array<SitemapUrl>) {
  const pagesAsXml = pages.map((page) => {
    return `<url>
      <loc>${page.loc}</loc>
      ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
      ${page.priority ? `<priority>${page.priority}</priority>` : ''}
      ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pagesAsXml.join('\n')}
    </urlset>`;
}

type Result = {
  page: number;
  totalCount: number;
  hasNextPage: boolean;
  results: Array<SitemapUrl>;
};

function generateLoc(item: _Doc): string | undefined {
  const link = linkResolver(item);
  const url = new URL(link, baseUrl);

  return url.href;
}

function calculateChangeFrequency(item: _Doc): string | undefined {
  if (item.__typename === 'Frontpage') {
    return 'hourly';
  }

  return 'weekly';
}

function calculatePriority(item: _Doc): string | undefined {
  if (item.__typename === 'Frontpage') {
    return '1.0';
  }

  if (item.__typename === 'Article') {
    return '0.5';
  }

  return '0.7';
}

function generateLastModified(item: _Doc): string | undefined {
  if (item._meta.lastPublicationDate) {
    return new Date(item._meta.lastPublicationDate).toISOString();
  }

  return undefined;
}

const sitemapQuery = /* GraphQL */ `
  query search($first: Int!, $after: String = "", $lang: String!) {
    _allDocuments(lang: $lang, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          __typename
          _meta {
            ...meta
          }

          ... on Page {
            noindex
          }
        }
      }
    }
  }
  fragment meta on Meta {
    uid
    type
    lang
    lastPublicationDate
  }
`;

async function fetchPage(page: number, lang: PrismicLocale): Promise<Result | null> {
  const skipTypesArray = skipTypes ? skipTypes.split(',') : [];

  try {
    const pages = await query(sitemapQuery, {
      variables: {
        lang,
        first: Number(pageSize),
        after: page > 1 ? pageNumberToCursor(page, Number(pageSize)) : '',
      },
      cacheKey: `search-${lang}-page-${page}-${pageSize}`,
    });

    const mappedResults: Array<SitemapUrl> = (pages?._allDocuments.edges || [])
      .map((result) => {
        const node = result?.node as _Doc | undefined;

        if (
          !node?.__typename ||
          skipTypesArray.includes(node.__typename) ||
          node.noindex
        ) {
          return null;
        }
        const loc = generateLoc(node);

        if (!loc) {
          return null;
        }

        return {
          loc,
          changefreq: calculateChangeFrequency(node),
          priority: calculatePriority(node),
          lastmod: generateLastModified(node),
        };
      })
      .filter(Boolean as unknown as ExcludesFalse);

    return {
      page: page,
      hasNextPage: pages?._allDocuments.pageInfo.hasNextPage ?? false,
      totalCount: pages?._allDocuments.totalCount ?? 0,
      results: mappedResults,
    };
  } catch (e) {
    logger.error('unable to get page for sitemap', {
      exception: e as Error,
      metadata: { page },
      category: 'sitemap',
    });
    return null;
  }
}

async function fetchLang(lang: PrismicLocale) {
  const allPages: Array<SitemapUrl> = [];
  let counter = 1;
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    // eslint-disable-next-line no-await-in-loop
    const result = await fetchPage(page, lang);
    hasNextPage = result?.hasNextPage ?? false;
    allPages.push(...(result?.results ?? []));

    page++;
    counter++;

    if (counter > Number(maxPagesToFetch)) {
      logger.error('sitemap fetch over max pages, breaking', {
        metadata: { counter, max: maxPagesToFetch, lang },
        category: 'sitemap',
      });
      break;
    }
  }

  return allPages;
}

export async function sitemap(locale: PrismicLocale): Promise<string | null> {
  let cached = null;
  const cacheKey = `sitemap-${locale}`;

  if (!baseUrl) {
    logger.error('BASE_URL is not set', { category: 'sitemap' });
    return null;
  }

  if (cacheTtlAsNumber > 0) {
    cached = await get<string | null>(cacheKey);

    if (cached) {
      logger.info('returning cached', { category: 'sitemap' });
      return cached;
    }
  }

  const langPages: Array<SitemapUrl> = await fetchLang(locale);
  const sitemapXml = sitemapTemplate(langPages);

  if (cacheTtlAsNumber > 0 && langPages.length > 0) {
    await set(cacheKey, sitemapXml, cacheTtlAsNumber);
  }

  return sitemapXml;
}
