export const frontpageFragment = /* GraphQL */ `
  fragment frontpage on Frontpage {
    __typename
    _meta {
      ...meta
    }
    title
    description
    description2

    seo_title
    seo_description
    seo_image
  }
`;
