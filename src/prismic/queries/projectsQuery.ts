import { projectFragment } from 'prismic/fragments/projectFragment';
import { metaFragment } from 'prismic/fragments/metaFragment';
import { linkableFragment } from 'prismic/fragments/linkableFragment';

export const projectsQuery = /* GraphQL */ `
  query projects($after: String = "", $first: Int!, $lang: String!) {
    allProjects(after: $after, first: $first, lang: $lang) {
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
          ...project
        }
      }
    }
  }
  ${metaFragment}
  ${projectFragment}
  ${linkableFragment}
`;
