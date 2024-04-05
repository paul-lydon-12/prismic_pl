export const pageFragment = /* GraphQL */ `
  fragment page on Page {
    __typename
    _meta {
      ...meta
    }

    title
    description
    image

    seo_title
    seo_description
    seo_image
  }
`;
