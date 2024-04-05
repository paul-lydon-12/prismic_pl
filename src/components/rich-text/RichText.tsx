import {
  asText as PrismicAsText,
  RichTextField,
  RichTextNodeType,
  RTAnyNode,
  RTImageNode,
  RTLinkNode,
  RTNode,
} from '@prismicio/client';
import { JSXFunctionSerializer, PrismicRichText } from '@prismicio/react';

import { linkResolver } from 'prismic/linkResolver';

import { Link } from 'components/link/Link';
import { PrismicPicture } from 'components/picture/PrismicPicture';

import { ExcludesFalse } from 'utils/excludesFalse';

import { RichTextImage } from './RichTextImage';
import { RichTextDefaultProps, RichTextStatic } from './RichTextStatic';

type PrismicRichTextProps = {
  children: RichTextField | null | undefined;
} & RichTextDefaultProps;

export function asText(value?: RichTextField | null | string): string {
  if (!value || typeof value === 'string') {
    return value ?? '';
  }

  return PrismicAsText(value).replace(/&shy;/g, String.fromCharCode(173)).trim();
}

const textBlocks = ['paragraph', 'heading2', 'heading3', 'heading4', 'list-item'];

const htmlSerializer: Partial<JSXFunctionSerializer> = (
  type: (typeof RichTextNodeType)[keyof typeof RichTextNodeType],
  node: RTAnyNode,
  text: string | undefined,
  children: Array<React.JSX.Element>,
  key: string
) => {
  let n;

  switch (type) {
    // Add a class to paragraph elements
    case RichTextNodeType.hyperlink:
      n = node as RTLinkNode;
      return (
        <Link key={key} to={linkResolver(n.data)}>
          {children}
        </Link>
      );

    case RichTextNodeType.image:
      n = node as RTImageNode;
      return (
        <RichTextImage
          width={n.dimensions.width}
          height={n.dimensions.height}
          key={n.url}
          caption={n.alt ?? undefined}
        >
          <PrismicPicture image={n} width={1200} />
        </RichTextImage>
      );

    // Return null to stick with the default behavior for all other elements
    default:
      return null;
  }
};

export const RichText = ({
  children,
  className,
  addStyles = true,
}: PrismicRichTextProps) => {
  if (!children || !Array.isArray(children)) {
    return null;
  }

  // dont render single empty tags
  if (children.length === 1) {
    const child = children[0];
    if ('text' in child && child.text.length === 0) {
      return null;
    }
  }

  const mappedChildren = children
    .map((child) => {
      const c = child;
      if ('text' in c) {
        c.text = c.text
          .replace(/&shy;/g, String.fromCharCode(173))
          .replace(/\u00A0/g, ' ');

        if (textBlocks.includes(c.type) && (c.text === '' || !c.text)) {
          return null;
        }
      }

      return c;
    })
    .filter(Boolean as unknown as ExcludesFalse) as [RTNode, ...Array<RTNode>];

  return (
    <RichTextStatic addStyles={addStyles} className={className}>
      <PrismicRichText field={mappedChildren} components={htmlSerializer} />
    </RichTextStatic>
  );
};
