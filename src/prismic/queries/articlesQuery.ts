import { articleFragment } from 'prismic/fragments/articleFragment';
import { metaFragment } from 'prismic/fragments/metaFragment';

export const articlesQuery = /* GraphQL */ `
  query news($after: String = "", $first: Int!, $lang: String!) {
    allArticles(after: $after, first: $first, lang: $lang, sortBy: published_DESC) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...article
        }
      }
    }
  }
  ${metaFragment}
  ${articleFragment}
`;
