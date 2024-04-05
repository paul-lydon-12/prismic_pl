export const linkableFragment = /* GraphQL */ `
  fragment linkable on _Linkable {
    _linkType
    ... on _ExternalLink {
      url
    }
    ... on _FileLink {
      url
    }
    ... on _Document {
      _meta {
        id
        uid
        type
        lang
      }
    }
    ... on _ImageLink {
      url
    }
  }
`;
