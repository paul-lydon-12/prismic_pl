import {
  CroppableImage,
  FocusRect,
  PrismicImage,
  PrismicPictureData,
  Sizes,
} from 'prismic/types/image';

import { MediaPosition } from 'types/ui';
import { logger } from 'utils/logger';

import { scale } from './prismicImages';

/**
 * Figure out the ratio of the focus point to the image dimension.
 * `focusRect` should be an array of four numbers, in order:
 * `x`, `y`, `width`, `height`.
 * @see https://docs.imgix.com/apis/rendering/size/rect
 * @param imageDimensions Dimensions of the original image
 * @param focusRect Rectangle of the focus point
 * @returns Focus point inside the center of the focus rectangle
 */
export function calculateFocusPoint(
  imageDimensions: Sizes,
  focusRect: FocusRect
): MediaPosition {
  const xMidPoint = focusRect[2] / 2;
  const yMidPoint = focusRect[3] / 2;

  const x = (focusRect[0] + xMidPoint) / imageDimensions.width;
  const y = (focusRect[1] + yMidPoint) / imageDimensions.height;

  return {
    x: Math.floor(x * 100),
    y: Math.floor(y * 100),
  };
}

const DEFAULT_FOCUS_POINT_DELTA = 1;

function isDefaultCrop(
  image: CroppableImage,
  focusPoint: MediaPosition,
  focusRect: FocusRect
) {
  if (
    Math.abs(focusPoint.x - 50) <= DEFAULT_FOCUS_POINT_DELTA &&
    Math.abs(focusPoint.y - 50) <= DEFAULT_FOCUS_POINT_DELTA &&
    (image.dimensions.width === focusRect[2] || image.dimensions.height === focusRect[3])
  ) {
    return true;
  }
  return false;
}

function getFocusRect(url?: string): FocusRect | undefined {
  if (!url) {
    return undefined;
  }

  const focusUrl = new URL(url);

  const params = focusUrl.searchParams.get('rect') ?? '';

  if (!params) {
    return undefined;
  }

  const parsed = params
    .split(',')
    .map((i) => Number.parseInt(i))
    .filter((i) => !Number.isNaN(i));

  if (parsed.length < 4) {
    return undefined;
  }

  // Safe assert since we check the length above
  return parsed.slice(0, 4) as FocusRect;
}

/**
 * Crops an image by using `focus_point` property from Prismic along with imgix API.
 * @see https://docs.imgix.com/apis/rendering/focalpoint-crop
 *
 * @param image Image with `focus_point` from Prismic
 * @param size Target size of the image
 * @returns URL to cropped image
 */
export function cropPrismicImage(
  image: CroppableImage,
  size: Partial<Sizes>,
  compress = false
): PrismicPictureData | undefined {
  let url;

  // TODO what if the original image has been cropped?

  try {
    url = new URL(image.url);
  } catch (e) {
    logger.error('failed to parse image url', { exception: e as Error });
    return undefined;
  }

  const originalRect = getFocusRect(image.url);
  const focusRect = getFocusRect(image.focus_point.url);

  if (!focusRect) {
    return undefined;
  }

  let dimensions = image.dimensions;

  // Check if the original image has been cropped,
  // if so try to fetch the original image dimension from image source
  if (
    originalRect?.length &&
    (originalRect[2] !== dimensions.width || originalRect[3] !== dimensions.height)
  ) {
    dimensions = {
      width: originalRect[2],
      height: originalRect[3],
    };
  }

  const focusPoint = calculateFocusPoint(dimensions, focusRect);

  if (isDefaultCrop(image, focusPoint, focusRect)) {
    return undefined;
  }

  const { width, height } = scale(size, image.dimensions);

  const { x, y } = focusPoint;

  const newParams = new URLSearchParams({
    auto: [compress ? 'compress' : null, 'format'].filter(Boolean).join(','),
    crop: 'focalpoint',
    fit: 'crop',
    'fp-x': (x / 100).toFixed(2),
    'fp-y': (y / 100).toFixed(2),
    w: width.toString(),
    h: height.toString(),
  });
  const newUrl = new URL(url.pathname, url.origin);

  const mediaPosition: MediaPosition = { x, y };

  return {
    src: `${newUrl.href}?${newParams.toString()}`,
    width,
    height,
    mediaPosition,
  };
}

export function isCroppable(image: PrismicImage): image is CroppableImage {
  if (!image || !image.focus_point || !image.dimensions) {
    return false;
  }

  if (!image.url || !image.focus_point.url) {
    return false;
  }

  if (image.dimensions.width < 1 || image.dimensions.height < 1) {
    return false;
  }

  return true;
}
