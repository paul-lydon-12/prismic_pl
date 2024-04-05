import {
  ArticleSlices,
  ArticleSlicesImage,
  ArticleSlicesText,
  ArticleSlicesVideo,
} from 'prismic-types';

import { SlicesRecord } from 'prismic/slice-mapper';
import { prismicSliceToImageSlice } from 'prismic/slices/Image';
import { prismicSliceToTextSlice } from 'prismic/slices/Text';
import { prismicSliceToVideoSlice } from 'prismic/slices/Video';

export function articleSlicesMap<T extends ArticleSlices>(): SlicesRecord<T> {
  return {
    text: (s: T) => prismicSliceToTextSlice(s as ArticleSlicesText),
    video: (s: T) => prismicSliceToVideoSlice(s as ArticleSlicesVideo),
    image: (s: T) => prismicSliceToImageSlice(s as ArticleSlicesImage),
  };
}
