export const layoutFragment = /* GraphQL */ `
  fragment layout on Layout {
    _meta {
      id
      uid
      type
      lang
      alternateLanguages {
        id
        uid
        type
        lang
      }
    }
    title_template
    seo_title_template
    default_seo_title
    default_seo_description
    default_seo_image
  }
`;
