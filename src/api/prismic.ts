import { createClient } from '@prismicio/client';
import crypto from 'crypto';
import { Query } from 'prismic-types';

import { PrismicPreviewData } from 'prismic/types/previewData';

import { PRISMIC_LOCALE } from 'i18n/i18n';
import { logger } from 'utils/logger';
import { stringToNumber } from 'utils/stringToNumber';

import { get, set } from './cache';

const {
  PRISMIC_REST_URL: prismicRestUrl,
  PRISMIC_GRAPHQL_URL: prismicGraphQlUrl,
  PRISMIC_API_TOKEN: apiToken,
  PRISMIC_REPOSITORY_LOCALE: locale,
  CACHE_PRISMIC_TTL,
} = process.env;

const prismicCacheTtl = stringToNumber(CACHE_PRISMIC_TTL ?? '') ?? 0;

if (!prismicRestUrl || !prismicGraphQlUrl) {
  logger.warn('missing required env vars for prismic connection.', {
    category: 'prismic',
  });
}

type Props = {
  query: string;
  variables: string;
  ref?: string;
};

type PrismicJsonResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export const prismicClient = prismicRestUrl
  ? createClient(prismicRestUrl, {
      accessToken: apiToken,
    })
  : null;

async function fetchApi({ query, variables, ref }: Props): Promise<Query | null> {
  if (!prismicRestUrl || !prismicGraphQlUrl || !prismicClient) {
    logger.error('missing required env vars', {
      category: 'prismic',
    });
    return null;
  }

  const prismicRef = ref ? ref : (await prismicClient.getMasterRef()).ref;

  const url = `${prismicGraphQlUrl}?query=${encodeURIComponent(
    query
  )}&variables=${variables}`;

  let res = null;

  try {
    res = await fetch(url, {
      headers: {
        'Prismic-Ref': prismicRef,
        'Content-Type': 'application/json',
        'Accept-Language': locale ?? PRISMIC_LOCALE,
        Authorization: `Token ${apiToken}`,
      },
    });
  } catch (e) {
    logger.error('error fetching data', {
      exception: e as Error,
      category: 'prismic',
    });
    throw e;
  }

  if (res.status !== 200) {
    const text = await res.text();
    if (res.status === 404 && text.includes('api_notfound_error')) {
      // When preview token is expired the api returns 404 status with "api_notfound_error".
      // Return null and let 404 page handle exiting preview
      return null;
    }
    logger.warn('non 200 status in response', {
      metadata: { status: res.status, text, query, variables },
      category: 'prismic',
    });
    throw new Error('Failed to fetch API, non 200 status');
  }

  const json = (await res.json()) as PrismicJsonResponse;
  if (json.errors) {
    logger.warn('errors in graphql response', {
      metadata: { errors: json.errors, query, variables },
      category: 'prismic',
    });
    if (!json.data) {
      throw new Error('Failed to fetch API, errors in json');
    }
  }

  return json.data;
}

export type QueryVariables = Record<string, string | number | Array<string> | boolean>;

type QueryProps = {
  previewData?: PrismicPreviewData;
  variables?: QueryVariables;
  cacheKey?: string | null;
  cacheTtl?: number;
  breadcrumbs?: Array<string>;
};

export async function query(
  graphqlQuery: string,
  {
    previewData,
    variables,
    cacheKey = null,
    cacheTtl = prismicCacheTtl,
    breadcrumbs = [],
  }: QueryProps = {}
): Promise<Query | null> {
  const previewRef = previewData?.ref ?? undefined;

  const serializedVariables = encodeURIComponent(JSON.stringify(variables));

  const query = graphqlQuery.replace(
    /(\n| )*( |{|})(\n| )*/gm,
    (_chars, _spaces, brackets) => brackets
  );

  let response: Query | null = null;

  const usedCacheKey = cacheKey
    ? cacheKey
    : crypto.createHash('md5').update(`${query}${serializedVariables}`).digest('hex');

  let cached = null;

  // Don't show cached data if we're in preview mode
  if (cacheTtl > 0 && !previewRef) {
    cached = await get<Query | null>(usedCacheKey);

    if (cached) {
      logger.info(`returning cached response`, {
        category: 'prismic',
        metadata: { usedCacheKey },
      });
      return cached;
    }
  }
  try {
    response = await fetchApi({
      query,
      variables: serializedVariables,
      ref: previewRef,
    });
  } catch (e) {
    logger.error('error fetching', {
      exception: e as Error,
      metadata: { breadcrumbs },
      category: 'prismic',
    });
    return null;
  }

  // Don't cache previewed data
  if (cacheTtl > 0 && !previewRef) {
    await set(usedCacheKey, response, cacheTtl);
  }

  return response;
}
