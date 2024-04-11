export const projectFragment = /* GraphQL */ `
  fragment project on Project {
    __typename
    _meta {
      ...meta
    }
    title
    description
    externallink

    seo_title
    seo_description
    seo_image
  }
`;
