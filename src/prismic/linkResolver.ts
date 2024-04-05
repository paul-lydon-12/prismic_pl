import { LinkField, LinkType } from '@prismicio/client';
import { Meta } from 'prismic-types';

import { PrismicLinkWithMeta } from 'prismic/types/link';

import { localeToLink } from '../i18n/i18n';

/** The types we can link resolve, add any project specific types here */
export type LinkResolvable =
  | (LinkField & { _linkType?: string })
  | PrismicLinkWithMeta
  | null;

/** Possible values for normalized Prismic links */
export type LinkType = keyof typeof LinkType;

/** Normalize different representation of links in Prismic into one type */
export type NormalizedLink = {
  /** Prismic returns this as either link_type or _linkType */
  linkType?: LinkType | string;
  uid?: string;
  /** This is the document type, e.g. "frontpage", "page", "article" */
  type?: string;
  url?: string;
  locale?: string;
};

/**
 * When adding links via the Prismi UI, it's possible to paste in relative links (e.g. `/my-page`).
 * In those cases the UI will append `https://` in front, so we end up with `https:///my-page`.
 *
 * @param url Possible url from the Prismic UI
 * @returns Url with protocol stripped
 */
function fixRelative(url?: string): string {
  if (!url) {
    return '/';
  }

  const lowered = url.toLocaleLowerCase();

  // Prismic UI will allow OR add https:// for relative links in their UI
  if (lowered.startsWith('https:///')) {
    return url.substring('https://'.length);
  }

  if (lowered.startsWith('http:///')) {
    return url.substring('http://'.length);
  }

  return url;
}

/**
 * Resolves a link to content based on its type.
 *
 * @param type Name of the content type in Prismic
 * @param uid UID of content
 * @param locale Locale of content
 * @returns Resolved link to the content based on input
 */
export function linkResolverByType(type?: string, uid?: string, locale?: string): string {
  const localeString = localeToLink(locale);

  switch (type) {
    case 'page':
      return `${localeString}${uid}`;
    case 'article':
      return `${localeString}frettir/${uid}`;
    default:
      return localeString;
  }
}

/**
 * Resolves a link to content based on its meta object.
 *
 * @param meta Meta object of content from Prismic
 * @returns Resolved link to the content based on its meta object
 */
export function linkResolverByMeta(meta?: Meta): string {
  const uid = meta?.uid ?? '';
  const type = (meta?.type ?? '').toLowerCase();

  return linkResolverByType(type, uid, meta?.lang);
}

/**
 * When linking between content there are two possible ways Prismic represents it:
 * - As link in RichText content
 * - As link in "Linked Content" UI element
 * This handles both types.
 *
 * @param link Normalized link to resolve
 * @returns Resolved link to the content based on its link object
 */
export function linkResolverByLink(link: NormalizedLink): string {
  if (!link.linkType) {
    return '/';
  }

  // Possible values for link_type
  if (['Media', 'Web', 'File', 'Image'].indexOf(link.linkType) >= 0) {
    return fixRelative(link.url);
  }

  // Possible values for _linkType
  if (['Link.media', 'Link.web', 'Link.file', 'Link.image'].indexOf(link.linkType) >= 0) {
    return fixRelative(link.url);
  }

  if (['Document', 'Link.document'].indexOf(link.linkType) >= 0) {
    return linkResolverByType(link.type, link.uid, link.locale);
  }

  return '/';
}

/**
 * Checks the shape of the document to link resolve to and creates a link to it.
 *
 * @param doc Prismic document to resolve a link to
 * @returns Link to document
 */
export function linkResolver(doc?: LinkResolvable): string {
  if (!doc) {
    return '/';
  }

  if ('_meta' in doc) {
    return linkResolverByMeta(doc._meta);
  }

  // Preview and content relationship links
  if ('link_type' in doc && 'uid' in doc) {
    return linkResolverByLink({
      linkType: doc._linkType || doc.link_type,
      uid: doc.uid,
      type: doc.type,
      url: doc.url,
      locale: doc.lang,
    });
  }

  // Document links
  if ('type' in doc) {
    return linkResolverByType(doc.type, doc.uid, doc.lang);
  }

  // Media and Web links
  if ('url' in doc) {
    return linkResolverByLink({
      linkType: doc._linkType || doc.link_type,
      url: doc.url,
    });
  }

  return '/';
}
