export const metaFragment = /* GraphQL */ `
  fragment meta on Meta {
    id
    uid
    type
    tags
    lang
    alternateLanguages {
      id
      uid
      type
      lang
    }
    firstPublicationDate
    lastPublicationDate
  }
`;
