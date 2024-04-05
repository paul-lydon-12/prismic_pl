// https://github.com/vercel/next.js/issues/23637#issuecomment-885631610
// added sharp https://www.npmjs.com/package/sharp to the project to stop slow image rendering

import Image, { StaticImageData } from 'next/image';

import { MediaPosition } from 'types/ui';

// used in PrismicImage
export type PictureDefaultProps = {
  blurUrl?: string;
  width?: number;
  height?: number;
  sizes?: string | null;
  quality?: number;
  alt?: string;
  lazy?: boolean;
  className?: string;
  draggable?: boolean;
  imagePosition?: MediaPosition;
  onLoaded?: () => void;
};

export type PictureProps = {
  src: string | StaticImageData;
} & PictureDefaultProps;

export const Picture = ({
  src,
  blurUrl,
  width,
  height,
  quality = 80,
  sizes = '100vw',
  alt,
  lazy = true,
  draggable,
  className,
  imagePosition,
  onLoaded,
}: PictureProps) => {
  let imageStyle = {} as React.CSSProperties;

  if (imagePosition) {
    Object.entries(imagePosition).forEach(([k, v]) => {
      const entry = { [`--object-${k}`]: v };
      imageStyle = { ...imageStyle, ...entry };
    });
  }

  return (
    <Image
      placeholder={blurUrl ? 'blur' : undefined}
      // https://blurred.dev/?
      blurDataURL={blurUrl ?? undefined}
      className={className}
      src={src}
      width={width}
      height={height}
      alt={alt ?? ''}
      priority={!lazy}
      draggable={draggable}
      style={imageStyle}
      quality={quality}
      onLoad={onLoaded}
      sizes={sizes ?? undefined}
    />
  );
};
