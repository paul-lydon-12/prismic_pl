import { metaFragment } from 'prismic/fragments/metaFragment';
import { pageFragment } from 'prismic/fragments/pageFragment';
import { pageSlices } from 'prismic/fragments/pageSlicesFragment';

export const pageQuery = /* GraphQL */ `
  query page($uid: String!, $lang: String!) {
    page(uid: $uid, lang: $lang) {
      ...page
      slices {
        ...pageSlices
      }
    }
  }
  ${pageFragment}
  ${metaFragment}
  ${pageSlices}
`;
