type VideoSliceContentTypes = 'Page' | 'Article';

export function videoSliceFragment(contentType: VideoSliceContentTypes) {
  return /* GraphQL */ `
  ...on ${contentType}SlicesVideo {
      type
      label
      variation {
        __typename
        ...on ${contentType}SlicesVideoDefault {
          primary {
            video
            title
            caption
            poster
          }
        }
      }
    }
`;
}
