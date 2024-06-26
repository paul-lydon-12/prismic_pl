import english from './strings/en-compiled.json';
import icelandic from './strings/is-compiled.json';

export type SiteLocale = 'is' | 'en';
export type PrismicLocale = 'is' | 'en-gb';

export const ALL_LOCALES: Array<SiteLocale> = ['is', 'en'];

export const DEFAULT_LOCALE = (process.env.DEFAULT_LOCALE || 'en') as SiteLocale;

export const PRISMIC_LOCALE: PrismicLocale =
  (process.env.PRISMIC_REPOSITORY_LOCALE as PrismicLocale | undefined) || 'is';

export function mapStringToSiteLocale(input?: string | null): SiteLocale {
  const l = (input ?? '').toLowerCase();

  if (l === 'en' || l === 'en-us' || l === 'en-gb') {
    return 'en';
  }

  return 'is';
}

export const localeToPrismicLocale = (l?: string): PrismicLocale => {
  if (l === 'en' || l === 'en-us' || l === 'en-gb') {
    return 'en-gb';
  }

  return 'is';
};

export function localeToLink(localeAsString?: string) {
  const locale = mapStringToSiteLocale(localeAsString);

  if (locale !== DEFAULT_LOCALE && ALL_LOCALES.indexOf(locale) >= 0) {
    return `/${locale}/`;
  }

  return '/';
}

export function loadMessagesForLocale(locale: SiteLocale): Record<string, string> {
  let messages = {};

  switch (locale) {
    case 'en':
      messages = english;
      break;
    case 'is':
      messages = icelandic;
      break;
  }

  return messages;
}
