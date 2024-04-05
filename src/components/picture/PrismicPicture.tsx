import { prismicPictureUrl } from 'prismic/images/prismicImages';
import { PrismicImage } from 'prismic/types/image';

import { Picture, PictureDefaultProps } from './Picture';

export type PrismicPictureProps = {
  image: PrismicImage;
  format?: boolean;
} & Omit<PictureDefaultProps, 'src'>;

/**
 * Creates a `<Picture>` component from Prismic data. Handles:
 * 1. just prismic image (image url and dimensions).
 * 2. prismic image with `focus_point` cropping. => pass this also as imagePosition to <Picture>
 * 3. prismic image and `width`.
 * 4. prismic image with `width` and `height`.
 * 5. prismic image with `width`.
 * 6. prismic image with `height`.
 *
 * @returns `<Picture>` component or `null` if an error occurs.
 */
export function PrismicPicture({
  image,
  width,
  height,
  sizes,
  quality,
  blurUrl,
  alt,
  className,
  draggable,
  lazy,
  onLoaded,
  format = true,
}: PrismicPictureProps): React.ReactElement | null {
  if (!image?.url) {
    return null;
  }

  // Only generate one URL that is passed to next/image.
  const img = prismicPictureUrl({ image, width, height, format });

  if (!img) {
    return null;
  }

  return (
    <Picture
      src={img.src}
      width={img.width}
      height={img.height}
      alt={alt ?? image.alt ?? undefined}
      className={className}
      lazy={lazy}
      draggable={draggable}
      onLoaded={onLoaded}
      imagePosition={img.mediaPosition}
      sizes={sizes}
      blurUrl={blurUrl}
      quality={quality}
    />
  );
}
