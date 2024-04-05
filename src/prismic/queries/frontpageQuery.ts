import { frontpageFragment } from 'prismic/fragments/frontpageFragment';
import { frontpageSlices } from 'prismic/fragments/frontpageSlicesFragment';
import { linkableFragment } from 'prismic/fragments/linkableFragment';
import { metaFragment } from 'prismic/fragments/metaFragment';

export const frontpageQuery = /* GraphQL */ `
  query ($lang: String!) {
    frontpage(uid: "frontpage", lang: $lang) {
      ...frontpage
    }
  }
  ${metaFragment}
  ${frontpageFragment}
`;
