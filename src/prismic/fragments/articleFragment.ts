export const articleFragment = /* GraphQL */ `
  fragment article on Article {
    __typename
    _meta {
      ...meta
    }
    title
    description
    published
    image

    seo_title
    seo_description
    seo_image
  }
`;
