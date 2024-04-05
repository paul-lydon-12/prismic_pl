type ImageSliceContentTypes = 'Page' | 'Article';

export function imageSliceFragment(contentType: ImageSliceContentTypes) {
  return /* GraphQL */ `
  ...on ${contentType}SlicesImage {
      type
      label
      variation {
        __typename
        ...on ${contentType}SlicesImageDefault {
          primary {
            image
          }
        }
      }
    }
`;
}
