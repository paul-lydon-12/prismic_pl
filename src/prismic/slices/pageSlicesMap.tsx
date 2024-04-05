import {
  PageSlices,
  PageSlicesImage,
  PageSlicesText,
  PageSlicesVideo,
} from 'prismic-types';

import { SlicesRecord } from 'prismic/slice-mapper';
import { prismicSliceToImageSlice } from 'prismic/slices/Image';
import { prismicSliceToTextSlice } from 'prismic/slices/Text';
import { prismicSliceToVideoSlice } from 'prismic/slices/Video';

export function pageSlicesMap<T extends PageSlices>(): SlicesRecord<T> {
  return {
    text: (s: T) => prismicSliceToTextSlice(s as PageSlicesText),
    video: (s: T) => prismicSliceToVideoSlice(s as PageSlicesVideo),
    image: (s: T) => prismicSliceToImageSlice(s as PageSlicesImage),
  };
}
