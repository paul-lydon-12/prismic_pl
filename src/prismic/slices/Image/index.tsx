import { ArticleSlicesImage, PageSlicesImage } from 'prismic-types';

import { PrismicImage } from 'prismic/types/image';

import { PrismicPicture } from 'components/picture/PrismicPicture';

type Props = {
  image: PrismicImage;
};

export default function ImageSlice({ image }: Props) {
  if (!image) {
    return null;
  }

  return <PrismicPicture image={image} />;
}

export function prismicSliceToImageSlice(s: PageSlicesImage | ArticleSlicesImage) {
  return <ImageSlice image={(s.variation?.primary?.image ?? null) as PrismicImage} />;
}
