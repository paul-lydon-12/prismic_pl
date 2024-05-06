import { starFragment } from 'prismic/fragments/starFragment';
import { metaFragment } from 'prismic/fragments/metaFragment';
import { linkableFragment } from 'prismic/fragments/linkableFragment';

export const starsQuery = /* GraphQL */ `
  query starsQuerys($after: String = "", $first: Int!, $lang: String!) {
    allStars(after: $after, first: $first, lang: $lang) {
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
          ...star
        }
      }
    }
  }
  ${metaFragment}
  ${starFragment}
  ${linkableFragment}
`;
