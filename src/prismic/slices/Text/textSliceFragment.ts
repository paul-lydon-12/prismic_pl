type TextSliceContentTypes = 'Page' | 'Article' | 'Frontpage';

export function textSliceFragment(contentType: TextSliceContentTypes) {
  return /* GraphQL */ `
  ...on ${contentType}SlicesText {
      type
      label
      variation {
        __typename
        ...on ${contentType}SlicesTextDefault {
          primary {
            title
            text
          }
        }
      }
    }
`;
}
