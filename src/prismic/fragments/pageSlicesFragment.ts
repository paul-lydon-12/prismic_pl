import { imageSliceFragment } from 'prismic/slices/Image/imageSliceFragment';
import { textSliceFragment } from 'prismic/slices/Text/textSliceFragment';
import { videoSliceFragment } from 'prismic/slices/Video/videoSliceFragment';

const type = 'Page';

export const pageSlices = `
  fragment pageSlices on PageSlices {
    __typename
    ${textSliceFragment(type)}
    ${imageSliceFragment(type)}
    ${videoSliceFragment(type)}
  }
`;
