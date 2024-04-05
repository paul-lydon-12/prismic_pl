import { Article, Frontpage, Layout, Page } from 'prismic-types';

import { prismicPictureUrl } from 'prismic/images/prismicImages';
import { linkResolver } from 'prismic/linkResolver';
import { PrismicImage, PrismicPictureData } from 'prismic/types/image';

import { asText } from 'components/rich-text/RichText';

import { Meta, OpenGraph, OpenGraphArticle, TwitterMeta } from './Meta';

type SupportedSeoTypes = Article | Page | Frontpage;

type SupportedSeoTypesWithImage = Exclude<SupportedSeoTypes, Frontpage>;

type Props = {
  data?: SupportedSeoTypes;
  layout: Layout | null;
  displayTitle?: string;
  url?: string;
  article?: OpenGraphArticle;
  twitter?: TwitterMeta;
  siteName?: string;
};

function defaultSeo(layout?: Layout | null) {
  let defaultSeoTitle = '';
  let defaultSeoImage: PrismicImage = null;
  let defaultSeoDescription = '';

  if (layout) {
    // This is if there's nothing to work with from the data
    defaultSeoTitle = asText(layout.default_seo_title);
    defaultSeoImage = (layout.default_seo_image ?? null) as PrismicImage;
    defaultSeoDescription = asText(layout.default_seo_description);
  }

  return {
    defaultSeoTitle,
    defaultSeoImage,
    defaultSeoDescription,
  };
}

function replaceTitle(title?: string | null, layout?: Layout | null): string | null {
  if (title && layout?.title_template) {
    return asText(layout.title_template).replace('TITLE', title);
  }

  return title ?? null;
}

function replaceSeoTitle(title?: string | null, layout?: Layout | null): string | null {
  if (title && layout?.seo_title_template) {
    return asText(layout.seo_title_template).replace('TITLE', title);
  }

  return title ?? null;
}

type OpenGraphProps = {
  title?: string;
  description?: string;
  image?: PrismicPictureData | null;
  layout?: Layout | null;
  url?: string;
  article?: OpenGraphArticle;
  twitter?: TwitterMeta;
  siteName?: string;
};

function openGraph({
  title,
  description,
  image,
  layout,
  url,
  article,
  twitter,
  siteName,
}: OpenGraphProps): OpenGraph {
  const openGraph: OpenGraph = {
    title,
    description,
    image: {
      url: image?.src ?? undefined,
      alt: image?.alt ?? undefined,
      width: image?.width ?? undefined,
      height: image?.height ?? undefined,
    },
    locale: layout?._meta.lang ?? undefined,
    alternateLocales: layout?._meta.alternateLanguages.map((i) => i.lang) ?? undefined,
    url,
    article,
    twitter,
    siteName,
  };

  return openGraph;
}

export function createArticleMeta(
  article?: Article | null
): OpenGraphArticle | undefined {
  if (!article) {
    return undefined;
  }

  const articleMeta = {
    publishedTime: asText(article.published),
    tags: article._meta.tags,
  };

  return articleMeta;
}

function createCanonicalUrl(data?: SupportedSeoTypes, url?: string) {
  const path = url ? url : data ? linkResolver(data) : '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return baseUrl && path.length > 0
    ? // Remove trailing slash from frontpage
      new URL(path, baseUrl).href.replace(/\/$/, '')
    : undefined;
}

export function PrismicMeta({
  data,
  layout,
  displayTitle,
  url,
  article,
  siteName,
  twitter,
}: Props) {
  const { defaultSeoTitle, defaultSeoImage, defaultSeoDescription } = defaultSeo(layout);

  // Explicit title first, then overwritten title passed in, last
  const title = replaceTitle(asText(displayTitle ?? data?.title ?? null), layout);
  const description = asText(data?.description);
  const contentImage = (data as SupportedSeoTypesWithImage | undefined)
    ?.image as PrismicImage;

  const foundSeoTitle = replaceSeoTitle(asText(data?.seo_title)); // Explicit title for seo meta stuff
  const foundSeoImage = data?.seo_image as PrismicImage;
  const foundSeoDescription = asText(data?.seo_description);

  // || not ?? since we do want to short-circuit falsy value of ""
  const seoTitle = foundSeoTitle || title || defaultSeoTitle;
  const seoImage = foundSeoImage || contentImage || defaultSeoImage;
  const seoDescription = foundSeoDescription || description || defaultSeoDescription;

  const croppedSeoImageData = prismicPictureUrl({
    image: seoImage,
    width: 1200,
    height: 630,
    format: false,
  });

  const canonical = createCanonicalUrl(data, url);

  const noindex = data && 'noindex' in data && data.noindex ? true : false;

  return (
    <Meta
      title={title ?? undefined}
      description={seoDescription}
      canonical={canonical}
      noindex={noindex}
      openGraph={openGraph({
        title: seoTitle,
        description: seoDescription,
        image: croppedSeoImageData,
        layout,
        url: canonical,
        article,
        siteName,
        twitter,
      })}
    />
  );
}
