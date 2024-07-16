export const starFragment = /* GraphQL */ `
  fragment star on Star {
    __typename
    _meta {
      ...meta
    }
    title
    description
    starlink {
      ...linkable
    }
    image
    brightnesslevel

    seo_title
    seo_description
    seo_image
  }
`;
