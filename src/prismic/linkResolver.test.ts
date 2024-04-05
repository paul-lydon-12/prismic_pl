import { describe, expect, it } from '@jest/globals';
import { LinkField } from '@prismicio/client';

import { linkResolver } from './linkResolver';

// const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'is';
const PRISMIC_LOCALE = process.env.PRISMIC_REPOSITORY_LOCALE || 'is';

describe('linkResolver', () => {
  it('should link inline richtext links to page', () => {
    const data: LinkField = {
      id: 'xyz',
      type: 'page',
      tags: [],
      slug: 'test-page',
      lang: PRISMIC_LOCALE,
      uid: 'test-page',
      link_type: 'Document',
      isBroken: false,
    };

    expect(linkResolver(data)).toBe(`/test-page`);
  });

  it('should link inline richtext link to media', () => {
    const data: LinkField = {
      link_type: 'Media',
      name: 'poster.jpg',
      kind: 'image',
      url: 'https://example.org/poster.jpg',
      size: '123',
      height: '100',
      width: '100',
    };

    expect(linkResolver(data)).toBe('https://example.org/poster.jpg');
  });
});
