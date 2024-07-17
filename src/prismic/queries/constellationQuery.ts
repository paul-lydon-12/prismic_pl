import { constellationFragment } from 'prismic/fragments/constellationFragment';
import { metaFragment } from 'prismic/fragments/metaFragment';
import { linkableFragment } from 'prismic/fragments/linkableFragment';


export const constellationQuery = /* GraphQL */ `
  query constellation($uid: String!, $lang: String!) {
    constellation(uid: $uid, lang: $lang) {
      ...constellation
    }
    allConstellations(lang: $lang, first: 4) {
      edges {
        node {
          ...constellation
        }
      }
    }
  }
  ${constellationFragment}
  ${metaFragment}
  ${linkableFragment}
`;
