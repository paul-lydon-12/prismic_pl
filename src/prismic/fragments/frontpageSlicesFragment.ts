import { textSliceFragment } from 'prismic/slices/Text/textSliceFragment';

const type = 'Frontpage';

export const frontpageSlices = /* GraphQL */ `
  fragment frontpageSlices on FrontpageSlices {
    __typename
    ${textSliceFragment(type)}
  }
`;
