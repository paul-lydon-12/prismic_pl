import { SliceData, SliceRenderer } from 'prismic/slice-mapper';

import { Section } from 'components/section/Section';

export const sliceRenderer: SliceRenderer = (sliceData: SliceData) => {
  const container = false;

  // here we can modify slices based on `sliceData.type` before rendering

  return (
    <Section key={sliceData.key} container={container}>
      {sliceData.element}
    </Section>
  );
};
