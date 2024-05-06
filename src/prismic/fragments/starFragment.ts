export const starFragment = /* GraphQL */ `
  fragment project on Project {
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

    seo_title
    seo_description
    seo_image
  }
`;
