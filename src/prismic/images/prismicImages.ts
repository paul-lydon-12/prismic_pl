import { PrismicPictureData, Sizes } from 'prismic/types/image';

import { PrismicPictureProps } from 'components/picture/PrismicPicture';

import { logger } from 'utils/logger';

import { cropPrismicImage, isCroppable } from './imageCropping';
import { DEFAULT_MAX_HEIGHT, DEFAULT_MAX_WIDTH } from './imageDefaults';

function calculateBaseCandidateSizes(
  sizes: Partial<Sizes>,
  definedOnImage: Sizes,
  ratio?: number
): Sizes {
  let candidateWidth;
  let candidateHeight;
  const { width, height } = sizes;

  if (width && height) {
    // TODO does not preserve aspect ratio
    candidateWidth = width;
    candidateHeight = height;
  } else if (width) {
    candidateWidth = width;
    candidateHeight = ratio
      ? Math.round(width * ratio)
      : Math.round(width * (definedOnImage.height / definedOnImage.width));
  } else if (height) {
    candidateWidth = ratio
      ? // Switch ratio, e.g. 1/2 => 2/1
        Math.round(height / ratio)
      : Math.round(height * (definedOnImage.width / definedOnImage.height));
    candidateHeight = height;
  }

  // Make sure we've always got a candidate width and candidate height
  if (!candidateWidth || !candidateHeight) {
    // E.g. if image is 2000x2000 and ratio is 16:9, we'd get ratio as 0.5625
    // and return 2000x1125
    candidateWidth = definedOnImage.width;
    candidateHeight = ratio
      ? Math.round(definedOnImage.width * ratio)
      : definedOnImage.height;
  }

  return { width: candidateWidth, height: candidateHeight };
}

export function scale(
  sizes: Partial<Sizes>,
  definedOnImage?: Sizes,
  maxSizes?: Sizes
): Sizes {
  const { width: maxWidth = DEFAULT_MAX_WIDTH, height: maxHeight = DEFAULT_MAX_HEIGHT } =
    maxSizes ?? {};

  const { width: definedWidth = 1, height: definedHeight = 1 } = definedOnImage ?? {};

  const { width, height } = sizes;
  const ratio = width && height ? height / width : definedHeight / definedWidth;

  let { width: candidateWidth, height: candidateHeight } = calculateBaseCandidateSizes(
    sizes,
    { width: definedWidth, height: definedHeight },
    ratio
  );

  if (candidateWidth > definedWidth) {
    candidateWidth = definedWidth;
    candidateHeight = Math.round(definedWidth * ratio);
  }

  if (candidateHeight > definedHeight) {
    candidateHeight = definedHeight;
    candidateWidth = Math.round(definedHeight / ratio);
  }

  if (candidateWidth > maxWidth) {
    candidateWidth = maxWidth;
    candidateHeight = ratio
      ? Math.round(maxWidth * ratio)
      : Math.round(candidateWidth * (definedHeight / definedWidth));
  }

  if (candidateHeight > maxHeight) {
    candidateHeight = maxHeight;
    candidateWidth = ratio
      ? Math.round(maxHeight / ratio)
      : Math.round(candidateHeight * (definedWidth / definedHeight));
  }

  return {
    width: candidateWidth,
    height: candidateHeight,
  };
}

// returns prismic image URL from prismic image
export function prismicPictureUrl({
  image,
  width,
  height,
  format = true,
}: PrismicPictureProps): PrismicPictureData | null {
  if (!image?.url) {
    logger.debug('no image url found', { metadata: { image, width, height } });
    return null;
  }

  if (isCroppable(image)) {
    const cropped = cropPrismicImage(image, { width, height });
    if (cropped) {
      return cropped;
    }
  }

  let url;

  try {
    url = new URL(image.url);
  } catch (e) {
    logger.error('failed to parse image url', { exception: e as Error });
    return null;
  }

  const { width: scaledWidth, height: scaledHeight } = scale(
    { width, height },
    image.dimensions
  );

  const newParams = new URLSearchParams({
    auto: [format ? 'format' : null].filter(Boolean).join(','),
    crop: 'faces,edges',
    fit: 'crop',
    w: scaledWidth.toString(),
    h: scaledHeight.toString(),
  });
  const newUrl = new URL(url.pathname, url.origin);

  return {
    src: `${newUrl.href}?${newParams.toString()}`,
    alt: image.alt ?? undefined,
    width: scaledWidth,
    height: scaledHeight,
  };
}
