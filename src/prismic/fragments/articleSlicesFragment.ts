import { imageSliceFragment } from 'prismic/slices/Image/imageSliceFragment';
import { textSliceFragment } from 'prismic/slices/Text/textSliceFragment';
import { videoSliceFragment } from 'prismic/slices/Video/videoSliceFragment';

const type = 'Article';

export const articleSlices = `
  fragment articleSlices on ArticleSlices {
    __typename
    ${textSliceFragment(type)}
    ${imageSliceFragment(type)}
    ${videoSliceFragment(type)}
  }
`;
