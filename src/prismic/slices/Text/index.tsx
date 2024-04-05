import { ArticleSlicesText, PageSlicesText } from 'prismic-types';

import { PrismicRichText } from 'prismic/types/richtext';

import { H2 } from 'components/heading/Heading';
import { asText, RichText } from 'components/rich-text/RichText';

type Props = {
  title?: PrismicRichText;
  text: PrismicRichText;
};

export default function TextSlice({ title, text }: Props) {
  if (!text) {
    return null;
  }

  return (
    <>
      {title && <H2>{asText(title)}</H2>}
      <RichText>{text}</RichText>
    </>
  );
}

export function prismicSliceToTextSlice(s: PageSlicesText | ArticleSlicesText) {
  return (
    <TextSlice
      title={(s.variation?.primary?.title ?? null) as PrismicRichText}
      text={(s.variation?.primary?.text ?? null) as PrismicRichText}
    />
  );
}
