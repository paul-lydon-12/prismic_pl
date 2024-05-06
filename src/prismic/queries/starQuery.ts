import { starFragment } from 'prismic/fragments/starFragment';
import { metaFragment } from 'prismic/fragments/metaFragment';
import { linkableFragment } from 'prismic/fragments/linkableFragment';


export const starQuery = /* GraphQL */ `
  query star($uid: String!, $lang: String!) {
    star(uid: $uid, lang: $lang) {
      ...star
    }
    allStars(lang: $lang, first: 4) {
      edges {
        node {
          ...star
        }
      }
    }
  }
  ${starFragment}
  ${metaFragment}
  ${linkableFragment}
`;
