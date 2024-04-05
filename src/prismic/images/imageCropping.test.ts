import { describe, expect, it } from '@jest/globals';

import { CroppableImage, FocusRect, PrismicPictureData } from 'prismic/types/image';

import { calculateFocusPoint, cropPrismicImage, isCroppable } from './imageCropping';

export const noCropNoFocus = {
  dimensions: { width: 2000, height: 974 },
  url: 'https://images.prismic.io/repo/image.png?auto=compress,format',
  focus_point: {
    dimensions: { width: 50, height: 50 },
    url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=506,0,974,974&w=50&h=50',
  },
} as CroppableImage;

export const noCropWithFocus = {
  dimensions: { width: 2000, height: 974 },
  url: 'https://images.prismic.io/repo/image.png?auto=compress,format',
  focus_point: {
    dimensions: { width: 50, height: 50 },
    url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=1232,330,325,325&w=50&h=50',
  },
} as CroppableImage;

// TODO add test for the following
export const withCropNoFocus = {
  dimensions: { width: 500, height: 500 },
  url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=512,0,974,974&w=500&h=500',
  focus_point: {
    dimensions: { width: 50, height: 50 },
    url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=506,0,974,974&w=50&h=50',
  },
} as CroppableImage;

export const withCropFocusInsideCrop = {
  dimensions: { width: 1500, height: 1500 },
  url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=510,0,974,974&w=500&h=500',
  focus_point: {
    dimensions: { width: 50, height: 50 },
    url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=1188,170,459,459&w=50&h=50',
  },
} as CroppableImage;

// TODO add test for the following
export const withCropFocusOutsideCrop = {
  dimensions: { width: 500, height: 500 },
  url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=508,0,974,974&w=500&h=500',
  focus_point: {
    dimensions: { width: 50, height: 50 },
    url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=0,199,325,325&w=50&h=50',
  },
} as CroppableImage;

describe('imageCropping', () => {
  describe('isCroppable', () => {
    it('should mark image with focus_point and no dimensions as not croppable', () => {
      expect(isCroppable({ url: 'x', focus_point: {} })).toBe(false);
    });

    it('should mark image with undefined focus_point url as not croppable', () => {
      expect(
        isCroppable({
          url: 'x',
          focus_point: { url: undefined },
          dimensions: { width: 1, height: 1 },
        })
      ).toBe(false);
    });

    it('should mark image with correct data as croppable', () => {
      expect(
        isCroppable({
          url: 'x',
          focus_point: { url: 'x' },
          dimensions: { width: 1, height: 1 },
        })
      ).toBe(true);
    });

    it('should mark image with invalid width as not croppable', () => {
      expect(
        isCroppable({
          url: 'x',
          focus_point: { url: 'x' },
          dimensions: { width: 0, height: 1 },
        })
      ).toBe(false);
    });

    it('should mark image with invalid height as not croppable', () => {
      expect(
        isCroppable({
          url: 'x',
          focus_point: { url: 'x' },
          dimensions: { width: 1, height: 0 },
        })
      ).toBe(false);
    });
  });

  it('should calculate the focus point', () => {
    const result = calculateFocusPoint({ width: 1000, height: 1000 }, [
      100, 100, 100, 100,
    ] as FocusRect);

    expect(result).toStrictEqual({ x: 15, y: 15 });
  });

  it('should crop an image with focus_point based on original dimensions', () => {
    const image = withCropFocusInsideCrop;
    const result = cropPrismicImage(image, {
      width: 100,
      height: 100,
    }) as PrismicPictureData;

    expect(result.src).toBe(
      'https://images.prismic.io/repo/image.png?auto=format&crop=focalpoint&fit=crop&fp-x=1.45&fp-y=0.41&w=100&h=100'
    );
  });

  it('should crop an image with focus_point and scale', () => {
    const image = noCropWithFocus;
    const result = cropPrismicImage(image, {
      width: 100,
      height: 100,
    }) as PrismicPictureData;

    expect(result.width).toBe(100);
    expect(result.height).toBe(100);
    expect(result.src).toBe(
      'https://images.prismic.io/repo/image.png?auto=format&crop=focalpoint&fit=crop&fp-x=0.69&fp-y=0.50&w=100&h=100'
    );
  });

  it('should deal with missing focus_point url', () => {
    const image = {
      dimensions: { width: 2000, height: 974 },
      url: 'https://images.prismic.io/repo/image.png?auto=compress,format',
      focus_point: {
        dimensions: { width: 50, height: 50 },
        url: '',
      },
    } as CroppableImage;

    const result = cropPrismicImage(image, { width: 100, height: 100 });

    expect(result).toBeUndefined();
  });

  it('should deal with invalid image url', () => {
    const image = {
      dimensions: { width: 2000, height: 974 },
      url: 'x',
      focus_point: {
        dimensions: { width: 50, height: 50 },
        url: '',
      },
    } as CroppableImage;

    const result = cropPrismicImage(image, { width: 100, height: 100 });

    expect(result).toBeUndefined();
  });

  it('should deal with missing focus rect', () => {
    const image = {
      dimensions: { width: 2000, height: 974 },
      url: 'https://images.prismic.io/repo/image.png?auto=compress,format',
      focus_point: {
        dimensions: { width: 50, height: 50 },
        url: 'https://images.prismic.io/repo/image.png?auto=compress,format&w=50&h=50',
      },
    } as CroppableImage;

    const result = cropPrismicImage(image, { width: 100, height: 100 });

    expect(result).toBeUndefined();
  });

  it('should deal with partial focus rect', () => {
    const image = {
      dimensions: { width: 2000, height: 974 },
      url: 'https://images.prismic.io/repo/image.png?auto=compress,format',
      focus_point: {
        dimensions: { width: 50, height: 50 },
        url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=1&w=50&h=50',
      },
    } as CroppableImage;

    const result = cropPrismicImage(image, { width: 100, height: 100 });

    expect(result).toBeUndefined();
  });

  it('should deal with invalid focus rect', () => {
    const image = {
      dimensions: { width: 2000, height: 974 },
      url: 'https://images.prismic.io/repo/image.png?auto=compress,format',
      focus_point: {
        dimensions: { width: 50, height: 50 },
        url: 'https://images.prismic.io/repo/image.png?auto=compress,format&rect=a,a,a,a&w=50&h=50',
      },
    } as CroppableImage;

    const result = cropPrismicImage(image, { width: 100, height: 100 });

    expect(result).toBeUndefined();
  });

  it('should not crop if "default" focus point', () => {
    const image = noCropNoFocus;
    const result = cropPrismicImage(image, { width: 100, height: 100 });

    expect(result).toBeUndefined();
  });
});
