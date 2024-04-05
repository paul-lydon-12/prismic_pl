import { describe, expect, it } from '@jest/globals';

import { noCropWithFocus } from './imageCropping.test';
import { prismicPictureUrl, scale } from './prismicImages';

describe('prismicImages', () => {
  const legalUrl = 'https://images.prismic.io/repo/image.png?auto=compress,format';

  describe('scale', () => {
    it('should scale an image to explicit sizes', () => {
      const result = scale({ width: 100, height: 100 }, { width: 200, height: 200 });
      expect(result).toStrictEqual({ width: 100, height: 100 });
    });

    it('should scale an image w/width and keep aspect ratio', () => {
      const result = scale({ width: 100 }, { width: 200, height: 400 });
      expect(result).toStrictEqual({ width: 100, height: 200 });
    });
  });

  it('should scale according to height', () => {
    const image = { dimensions: { width: 200, height: 100 }, url: legalUrl };

    const result = prismicPictureUrl({ image, height: 20 });

    expect(result?.width).toBe(40);
    expect(result?.height).toBe(20);
  });

  it('should not upscale if height > defined height', () => {
    const image = { dimensions: { width: 2000, height: 974 }, url: legalUrl };

    const result = prismicPictureUrl({ image, width: 1800, height: 1200 });

    expect(result?.width).toBe(1461);
    expect(result?.height).toBe(974);
  });

  it('should not upscale if width > defined width', () => {
    const image = { dimensions: { width: 2000, height: 974 }, url: legalUrl };

    const result = prismicPictureUrl({ image, width: 3000, height: 1000 });

    expect(result?.width).toBe(2000);
    expect(result?.height).toBe(667);
  });

  it('should not break maxWidth (2000px)', () => {
    const image = { dimensions: { width: 1_000, height: 10_000 }, url: legalUrl };

    const result = prismicPictureUrl({ image, width: 6_000 });

    expect(result?.width).toBe(300);
    expect(result?.height).toBe(3000);
  });

  it('should not break maxHeight (3000px)', () => {
    const image = { dimensions: { width: 10_000, height: 10_000 }, url: legalUrl };

    const result = prismicPictureUrl({ image, height: 6_000 });

    expect(result?.width).toBe(2000);
    expect(result?.height).toBe(2000);
  });

  it('should not upscale if width > defined width and resulting height > defined height', () => {
    const image = { dimensions: { width: 1000, height: 100 }, url: legalUrl };

    const result = prismicPictureUrl({ image, width: 1100, height: 1000 });

    expect(result?.width).toBe(110);
    expect(result?.height).toBe(100);
  });

  it('should return null if image url is falsy', () => {
    const image = { url: '' };

    const result = prismicPictureUrl({ image });

    expect(result).toBeNull();
  });

  it('should return null if image url is invalid', () => {
    const image = { url: 'x' };

    const result = prismicPictureUrl({ image });

    expect(result).toBeNull();
  });

  it('should crop via prismicPictureUrl', () => {
    const image = noCropWithFocus;

    const result = prismicPictureUrl({ image, width: 100, height: 100 });

    expect(result?.width).toBe(100);
    expect(result?.height).toBe(100);
    expect(result?.src).toBe(
      'https://images.prismic.io/repo/image.png?auto=format&crop=focalpoint&fit=crop&fp-x=0.69&fp-y=0.50&w=100&h=100'
    );
  });
});
