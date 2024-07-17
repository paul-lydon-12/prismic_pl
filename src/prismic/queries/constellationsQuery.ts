import { constellationFragment } from 'prismic/fragments/constellationFragment';
import { metaFragment } from 'prismic/fragments/metaFragment';
import { linkableFragment } from 'prismic/fragments/linkableFragment';

export const constellationsQuery = /* GraphQL */ `
  query constellationsQuerys($after: String = "", $first: Int!, $lang: String!) {
    allConstellations(after: $after, first: $first, lang: $lang) {
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
          ...constellation
        }
      }
    }
  }
  ${metaFragment}
  ${constellationFragment}
  ${linkableFragment}
`;
