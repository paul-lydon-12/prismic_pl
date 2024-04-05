// global components
import { H1 } from 'components/heading/Heading';
import { Link } from 'components/link/Link';
import { Picture } from 'components/picture/Picture';
import { RichTextImage } from 'components/rich-text/RichTextImage';
import { RichTextStatic } from 'components/rich-text/RichTextStatic';
import { Section } from 'components/section/Section';
import { Meta } from 'containers/meta/Meta';

export default function ElementsPage() {
  return (
    <>
      <Meta title="Next-js starter: elements page" />

      <Section container>
        <H1> Tunglið</H1>
        <RichTextStatic>
          <p>Förum til tunglsins, skoða okkur um.</p>
        </RichTextStatic>
      </Section>
    </>
  );
}
