import { projectFragment } from 'prismic/fragments/projectFragment';
import { metaFragment } from 'prismic/fragments/metaFragment';
import { linkableFragment } from 'prismic/fragments/linkableFragment';


export const projectQuery = /* GraphQL */ `
  query project($uid: String!, $lang: String!) {
    project(uid: $uid, lang: $lang) {
      ...project
    }
    allProjects(lang: $lang, first: 4) {
      edges {
        node {
          ...project
        }
      }
    }
  }
  ${projectFragment}
  ${metaFragment}
  ${linkableFragment}
`;
