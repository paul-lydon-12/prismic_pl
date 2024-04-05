export const frontpageFragment = /* GraphQL */ `
  fragment frontpage on Frontpage {
    __typename
    _meta {
      ...meta
    }
    title
    description

    seo_title
    seo_description
    seo_image
  }
`;
