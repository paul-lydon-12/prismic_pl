export const constellationFragment = /* GraphQL */ `
  fragment constellation on Constellation {
    __typename
    _meta {
      ...meta
    }
    title
    description
    constellationlink {
      ...linkable
    }
    image

    seo_title
    seo_description
    seo_image
  }
`;
